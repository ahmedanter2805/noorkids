import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const childId = session?.childId || req.nextUrl.searchParams.get("childId");

    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            title: true,
            xpReward: true,
            orderIndex: true,
            ...(childId
              ? {
                  progress: {
                    where: { childId },
                    select: { isCompleted: true, completionPercentage: true },
                  },
                }
              : {}),
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => {
      const totalLessons = course.lessons.length;
      let completedLessons = 0;
      if (childId) {
        completedLessons = course.lessons.filter(
          (l) => l.progress && l.progress.length > 0 && l.progress[0].isCompleted
        ).length;
      }
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...course,
        totalLessons,
        completedLessons,
        progressPercent,
      };
    });

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error("Courses API error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
