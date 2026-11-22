import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    const childId = session?.childId || req.nextUrl.searchParams.get("childId");

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" },
          include: {
            quizzes: {
              select: {
                id: true,
                title: true,
                passingScore: true,
                bonusXP: true,
                ...(childId
                  ? {
                      quizResults: {
                        where: { childId },
                        orderBy: { submittedAt: "desc" },
                        take: 1,
                      },
                    }
                  : {}),
              },
            },
            ...(childId
              ? {
                  progress: {
                    where: { childId },
                  },
                }
              : {}),
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Course detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
  }
}
