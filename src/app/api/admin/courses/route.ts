import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" },
          include: {
            quizzes: {
              include: {
                _count: { select: { questions: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Admin courses GET error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CREATE_COURSE") {
      const { title, category, description, icon, colorTheme } = body;
      const count = await prisma.course.count();
      const course = await prisma.course.create({
        data: {
          title,
          category,
          description,
          icon: icon || "BookOpen",
          colorTheme: colorTheme || "sky",
          orderIndex: count + 1,
        },
      });
      return NextResponse.json({ success: true, course });
    }

    if (action === "CREATE_LESSON") {
      const { courseId, title, arabicHighlight, contentSteps, challengePrompt, xpReward } = body;
      const lessonCount = await prisma.lesson.count({ where: { courseId } });
      const lesson = await prisma.lesson.create({
        data: {
          courseId,
          title,
          arabicHighlight: arabicHighlight || "",
          content: JSON.stringify(contentSteps || []),
          challengePrompt: challengePrompt || "",
          xpReward: xpReward || 30,
          orderIndex: lessonCount + 1,
        },
      });
      return NextResponse.json({ success: true, lesson });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin courses POST error:", error);
    return NextResponse.json({ error: "Failed to process course request" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, type } = await req.json();
    if (type === "LESSON") {
      await prisma.lesson.delete({ where: { id } });
    } else {
      await prisma.course.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin course delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
