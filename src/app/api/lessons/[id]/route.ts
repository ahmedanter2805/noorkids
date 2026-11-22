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

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            colorTheme: true,
          },
        },
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
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse JSON content safely
    let parsedContent = [];
    try {
      parsedContent = JSON.parse(lesson.content);
    } catch {
      parsedContent = [{ step: 1, title: lesson.title, englishText: lesson.content, arabicText: "" }];
    }

    return NextResponse.json({
      lesson: {
        ...lesson,
        contentSteps: parsedContent,
        isCompleted: childId && lesson.progress && lesson.progress.length > 0 ? lesson.progress[0].isCompleted : false,
      },
    });
  } catch (error) {
    console.error("Lesson API error:", error);
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
  }
}
