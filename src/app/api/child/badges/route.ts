import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const childId = session?.childId || req.nextUrl.searchParams.get("childId");

    if (!childId) {
      return NextResponse.json({ error: "Child ID required" }, { status: 400 });
    }

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        badges: true,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const unlockedMap = new Map(child.badges.map((b) => [b.badgeId, b.unlockedAt]));
    const allBadges = await prisma.badge.findMany({
      orderBy: { requiredXP: "asc" },
    });

    const badges = allBadges.map((badge) => {
      const isUnlocked = unlockedMap.has(badge.id);
      const unlockedAt = unlockedMap.get(badge.id) || null;
      const progressPercent = isUnlocked
        ? 100
        : Math.min(100, Math.round((child.xpPoints / Math.max(1, badge.requiredXP)) * 100));

      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        requiredXP: badge.requiredXP,
        categoryCondition: badge.categoryCondition,
        isUnlocked,
        unlockedAt,
        progressPercent,
      };
    });

    return NextResponse.json({ badges, childXP: child.xpPoints, childLevel: child.level });
  } catch (error) {
    console.error("Badges API error:", error);
    return NextResponse.json({ error: "Failed to load badges" }, { status: 500 });
  }
}
