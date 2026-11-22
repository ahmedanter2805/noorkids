import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: {
          select: { title: true, course: { select: { title: true, category: true } } },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    const formatted = quizzes.map((q) => ({
      ...q,
      questions: q.questions.map((question) => {
        let opts = [];
        try {
          opts = JSON.parse(question.options);
        } catch {
          opts = [question.options];
        }
        return { ...question, options: opts };
      }),
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (error) {
    console.error("Admin quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "ADD_QUESTION") {
      const { quizId, questionText, options, correctAnswer, explanation } = body;
      const count = await prisma.question.count({ where: { quizId } });
      const question = await prisma.question.create({
        data: {
          quizId,
          questionText,
          options: JSON.stringify(options || []),
          correctAnswer,
          explanation: explanation || "",
          orderIndex: count + 1,
        },
      });
      return NextResponse.json({ success: true, question });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin quiz POST error:", error);
    return NextResponse.json({ error: "Failed to process quiz request" }, { status: 500 });
  }
}
