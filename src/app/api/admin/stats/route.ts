import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalChildren,
      totalParents,
      totalCourses,
      totalLessons,
      totalQuizzes,
      totalQuizResults,
      totalBadges,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.child.count(),
      prisma.parent.count(),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.quiz.count(),
      prisma.quizResult.count(),
      prisma.badge.count(),
    ]);

    const quizResults = await prisma.quizResult.findMany({
      select: { score: true },
    });

    const averageQuizScore =
      quizResults.length > 0
        ? Math.round(quizResults.reduce((a, b) => a + b.score, 0) / quizResults.length)
        : 85;

    const children = await prisma.child.findMany({
      select: { currentStreak: true, xpPoints: true },
    });

    const totalXPInPlatform = children.reduce((a, b) => a + b.xpPoints, 0);
    const avgStreak = children.length > 0 ? Math.round(children.reduce((a, b) => a + b.currentStreak, 0) / children.length) : 1;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalChildren,
        totalParents,
        totalCourses,
        totalLessons,
        totalQuizzes,
        totalQuizResults,
        totalBadges,
        averageQuizScore,
        totalXPInPlatform,
        avgStreak,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
