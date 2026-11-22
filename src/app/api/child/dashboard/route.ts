import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { calculateLevelProgress } from "@/lib/gamification";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const childId = session?.childId || req.nextUrl.searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { error: "Child ID is required." },
        { status: 400 }
      );
    }

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        user: { select: { fullName: true, email: true } },
        badges: {
          include: { badge: true },
          orderBy: { unlockedAt: "desc" },
        },
        progress: {
          where: { isCompleted: true },
          include: {
            lesson: {
              include: { course: true },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const levelProgress = calculateLevelProgress(child.xpPoints);

    // Fetch courses with completion counts
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          select: {
            id: true,
            progress: {
              where: { childId },
              select: { isCompleted: true },
            },
          },
        },
      },
    });

    const coursesWithStats = courses.map((course) => {
      const totalLessons = course.lessons.length;
      const completedLessons = course.lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].isCompleted
      ).length;
      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        category: course.category,
        description: course.description,
        icon: course.icon,
        colorTheme: course.colorTheme,
        totalLessons,
        completedLessons,
        percent,
      };
    });

    const totalLessonsOverall = coursesWithStats.reduce((acc, c) => acc + c.totalLessons, 0);
    const totalCompletedOverall = coursesWithStats.reduce((acc, c) => acc + c.completedLessons, 0);
    const overallProgressPercent = totalLessonsOverall > 0 ? Math.round((totalCompletedOverall / totalLessonsOverall) * 100) : 0;

    return NextResponse.json({
      child: {
        id: child.id,
        name: child.user.fullName,
        email: child.user.email,
        age: child.age,
        avatar: child.avatar,
        xpPoints: child.xpPoints,
        level: child.level,
        currentStreak: child.currentStreak,
        levelProgress,
        badges: child.badges.map((b) => ({
          id: b.badge.id,
          name: b.badge.name,
          description: b.badge.description,
          icon: b.badge.icon,
          unlockedAt: b.unlockedAt,
        })),
      },
      stats: {
        totalLessonsOverall,
        totalCompletedOverall,
        overallProgressPercent,
      },
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error("Child dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
