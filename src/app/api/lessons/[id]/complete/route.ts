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
    let childId = session?.childId;

    if (!childId) {
      // If parent or testing, allow passing childId
      const body = await req.json().catch(() => ({}));
      childId = body.childId;
    }

    if (!childId) {
      return NextResponse.json(
        { error: "A child profile is required to complete lessons and earn XP." },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check existing progress
    const existingProgress = await prisma.progress.findUnique({
      where: {
        childId_lessonId: {
          childId,
          lessonId: lesson.id,
        },
      },
    });

    const isFirstTime = !existingProgress || !existingProgress.isCompleted;

    // Update or create progress
    await prisma.progress.upsert({
      where: {
        childId_lessonId: {
          childId,
          lessonId: lesson.id,
        },
      },
      update: {
        isCompleted: true,
        completionPercentage: 100,
        lastAccessed: new Date(),
      },
      create: {
        childId,
        lessonId: lesson.id,
        isCompleted: true,
        completionPercentage: 100,
      },
    });

    let gamification = null;
    let earnedXP = 0;

    if (isFirstTime) {
      earnedXP = lesson.xpReward || 30;
      gamification = await awardChildXP(childId, earnedXP, lesson.course.category);
    } else {
      // Small review reward for repeating a lesson!
      earnedXP = 5;
      gamification = await awardChildXP(childId, earnedXP, lesson.course.category);
    }

    return NextResponse.json({
      success: true,
      earnedXP,
      isFirstTime,
      gamification,
    });
  } catch (error) {
    console.error("Lesson complete API error:", error);
    return NextResponse.json(
      { error: "Failed to mark lesson complete" },
      { status: 500 }
    );
  }
}
