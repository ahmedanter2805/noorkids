import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    let parentId = session?.parentId;

    if (!parentId) {
      // Find default parent if demo
      const defaultParent = await prisma.parent.findFirst({
        include: { user: true },
      });
      if (defaultParent) {
        parentId = defaultParent.id;
      }
    }

    if (!parentId) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        user: { select: { fullName: true, email: true } },
        children: {
          include: {
            user: { select: { fullName: true, email: true } },
            badges: { include: { badge: true } },
            progress: { where: { isCompleted: true } },
            quizResults: {
              orderBy: { submittedAt: "desc" },
              include: {
                quiz: {
                  include: { lesson: true },
                },
              },
            },
          },
        },
      },
    });

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    const coursesCount = await prisma.course.count({ where: { isPublished: true } });
    const lessonsCount = await prisma.lesson.count();

    const formattedChildren = parent.children.map((child) => {
      const totalQuizzes = child.quizResults.length;
      const avgQuizScore =
        totalQuizzes > 0
          ? Math.round(
              child.quizResults.reduce((acc, q) => acc + q.score, 0) / totalQuizzes
            )
          : 0;

      const completedLessonsCount = child.progress.length;
      const progressPercent = lessonsCount > 0 ? Math.round((completedLessonsCount / lessonsCount) * 100) : 0;

      return {
        id: child.id,
        name: child.user.fullName,
        email: child.user.email,
        age: child.age,
        avatar: child.avatar,
        xpPoints: child.xpPoints,
        level: child.level,
        currentStreak: child.currentStreak,
        badgesCount: child.badges.length,
        completedLessonsCount,
        progressPercent,
        avgQuizScore,
        recentQuizzes: child.quizResults.slice(0, 5).map((q) => ({
          id: q.id,
          lessonTitle: q.quiz.lesson.title,
          score: q.score,
          earnedXP: q.earnedXP,
          submittedAt: q.submittedAt,
        })),
      };
    });

    return NextResponse.json({
      parent: {
        id: parent.id,
        name: parent.user.fullName,
        email: parent.user.email,
        phoneNumber: parent.phoneNumber,
      },
      stats: {
        totalChildren: formattedChildren.length,
        totalFamilyXP: formattedChildren.reduce((acc, c) => acc + c.xpPoints, 0),
        totalLessonsCompleted: formattedChildren.reduce((acc, c) => acc + c.completedLessonsCount, 0),
        totalBadgesEarned: formattedChildren.reduce((acc, c) => acc + c.badgesCount, 0),
      },
      children: formattedChildren,
    });
  } catch (error) {
    console.error("Parent overview API error:", error);
    return NextResponse.json({ error: "Failed to load parent overview" }, { status: 500 });
  }
}
