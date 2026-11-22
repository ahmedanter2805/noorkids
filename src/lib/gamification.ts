import prisma from "./prisma";

export interface GamificationResult {
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  unlockedBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  streakUpdated: boolean;
  currentStreak: number;
}

/**
 * Calculates child level based on standard formula:
 * Level = Math.floor(xp / 100) + 1
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.max(0, xp) / 100) + 1;
}

/**
 * Returns progress percentage within the current level (0% to 100%)
 * and how many XP needed to reach next level.
 */
export function calculateLevelProgress(xp: number): {
  currentLevelXP: number;
  nextLevelXP: number;
  percent: number;
  xpNeeded: number;
} {
  const currentLevel = calculateLevel(xp);
  const baseXPForCurrentLevel = (currentLevel - 1) * 100;
  const nextLevelThreshold = currentLevel * 100;
  const xpIntoLevel = xp - baseXPForCurrentLevel;
  const percent = Math.min(100, Math.max(0, Math.round((xpIntoLevel / 100) * 100)));
  const xpNeeded = nextLevelThreshold - xp;

  return {
    currentLevelXP: xpIntoLevel,
    nextLevelXP: 100,
    percent,
    xpNeeded,
  };
}

/**
 * Evaluates streaks and badge unlocks, updating the child record.
 */
export async function awardChildXP(
  childId: string,
  xpToAdd: number,
  category?: string
): Promise<GamificationResult> {
  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      badges: {
        include: { badge: true },
      },
    },
  });

  if (!child) {
    throw new Error("Child not found");
  }

  const oldLevel = child.level;
  const newXP = child.xpPoints + xpToAdd;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  // Streak logic
  const todayStr = new Date().toISOString().split("T")[0];
  let currentStreak = child.currentStreak;
  let streakUpdated = false;

  if (child.lastActiveDay !== todayStr) {
    if (child.lastActiveDay) {
      const lastDate = new Date(child.lastActiveDay);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
        streakUpdated = true;
      } else if (diffDays > 1) {
        currentStreak = 1;
        streakUpdated = true;
      }
    } else {
      currentStreak = 1;
      streakUpdated = true;
    }
  }

  // Update child profile
  await prisma.child.update({
    where: { id: childId },
    data: {
      xpPoints: newXP,
      level: newLevel,
      currentStreak,
      lastActiveDay: todayStr,
    },
  });

  // Evaluate badge unlocks
  const existingBadgeIds = new Set(child.badges.map((cb) => cb.badgeId));
  const allBadges = await prisma.badge.findMany();
  const unlockedBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }> = [];

  for (const badge of allBadges) {
    if (existingBadgeIds.has(badge.id)) continue;

    let qualifies = false;

    // Check general XP requirement
    if (!badge.categoryCondition && newXP >= badge.requiredXP) {
      qualifies = true;
    }

    // Check category condition if specified
    if (badge.categoryCondition) {
      if (category && badge.categoryCondition === category && newXP >= badge.requiredXP) {
        qualifies = true;
      } else if (newXP >= badge.requiredXP) {
        // Also award if child has sufficient XP in that path
        qualifies = true;
      }
    }

    if (qualifies) {
      await prisma.childBadge.create({
        data: {
          childId,
          badgeId: badge.id,
        },
      });
      unlockedBadges.push({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
      });
    }
  }

  return {
    newXP,
    newLevel,
    leveledUp,
    unlockedBadges,
    streakUpdated,
    currentStreak,
  };
}
