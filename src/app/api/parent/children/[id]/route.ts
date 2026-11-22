import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const childId = params.id;

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        user: { select: { fullName: true, email: true } },
        badges: {
          include: { badge: true },
          orderBy: { unlockedAt: "desc" },
        },
        progress: {
          include: {
            lesson: {
              include: { course: true },
            },
          },
        },
        quizResults: {
          orderBy: { submittedAt: "desc" },
          include: {
            quiz: {
              include: {
                lesson: {
                  include: { course: true },
                },
              },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Courses completion breakdown
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            progress: {
              where: { childId },
              select: { isCompleted: true },
            },
          },
        },
      },
    });

    const coursesBreakdown = courses.map((course) => {
      const totalLessons = course.lessons.length;
      const completedCount = course.lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].isCompleted
      ).length;
      const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        category: course.category,
        colorTheme: course.colorTheme,
        icon: course.icon,
        totalLessons,
        completedCount,
        percent,
      };
    });

    // Quiz history
    const quizHistory = child.quizResults.map((qr) => ({
      id: qr.id,
      quizTitle: qr.quiz.title,
      lessonTitle: qr.quiz.lesson.title,
      category: qr.quiz.lesson.course.category,
      score: qr.score,
      totalQuestions: qr.totalQuestions,
      earnedXP: qr.earnedXP,
      passed: qr.score >= qr.quiz.passingScore,
      submittedAt: qr.submittedAt,
    }));

    // Weak areas identification (lessons where latest score was < 70)
    const weakAreas = quizHistory.filter((q) => !q.passed);

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
        badges: child.badges.map((b) => ({
          id: b.badge.id,
          name: b.badge.name,
          description: b.badge.description,
          icon: b.badge.icon,
          unlockedAt: b.unlockedAt,
        })),
      },
      coursesBreakdown,
      quizHistory,
      weakAreas,
    });
  } catch (error) {
    console.error("Child analytics error:", error);
    return NextResponse.json(
      { error: "Failed to load child analytics" },
      { status: 500 }
    );
  }
}
