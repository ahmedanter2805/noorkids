import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                colorTheme: true,
              },
            },
          },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            questionText: true,
            options: true,
            orderIndex: true,
            // We include explanation and correctAnswer for client review after answering
            correctAnswer: true,
            explanation: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const formattedQuestions = quiz.questions.map((q) => {
      let optionsArray: string[] = [];
      try {
        optionsArray = JSON.parse(q.options);
      } catch {
        optionsArray = [q.options];
      }
      return {
        ...q,
        options: optionsArray,
      };
    });

    return NextResponse.json({
      quiz: {
        ...quiz,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
