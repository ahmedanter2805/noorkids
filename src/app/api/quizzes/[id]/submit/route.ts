import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { awardChildXP } from "@/lib/gamification";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    const body = await req.json();
    const childId = session?.childId || body.childId;
    const { answers } = body; // Map of questionId -> selectedOption string

    if (!childId) {
      return NextResponse.json(
        { error: "A child profile is required to take quizzes and earn XP." },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers object is required." },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        lesson: {
          include: { course: true },
        },
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    const reviewDetails = [];

    for (const q of quiz.questions) {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount += 1;

      reviewDetails.push({
        questionId: q.id,
        questionText: q.questionText,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= quiz.passingScore;

    // XP calculation: 10 XP per correct question + quiz bonusXP if passed!
    let earnedXP = correctCount * 10;
    if (passed) {
      earnedXP += quiz.bonusXP;
    }

    // Save QuizResult
    const quizResult = await prisma.quizResult.create({
      data: {
        childId,
        quizId: quiz.id,
        score: scorePercentage,
        totalQuestions,
        earnedXP,
      },
    });

    // Award XP and check gamification milestones
    const gamification = await awardChildXP(
      childId,
      earnedXP,
      quiz.lesson.course.category
    );

    // Also ensure lesson is marked complete if passed
    if (passed) {
      await prisma.progress.upsert({
        where: {
          childId_lessonId: {
            childId,
            lessonId: quiz.lessonId,
          },
        },
        update: {
          isCompleted: true,
          completionPercentage: 100,
          lastAccessed: new Date(),
        },
        create: {
          childId,
          lessonId: quiz.lessonId,
          isCompleted: true,
          completionPercentage: 100,
        },
      });
    }

    return NextResponse.json({
      success: true,
      quizResultId: quizResult.id,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      passed,
      earnedXP,
      gamification,
      reviewDetails,
    });
  } catch (error) {
    console.error("Submit quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz." },
      { status: 500 }
    );
  }
}
