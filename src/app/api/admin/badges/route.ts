import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      include: {
        _count: { select: { children: true } },
      },
      orderBy: { requiredXP: "asc" },
    });

    return NextResponse.json({ badges });
  } catch (error) {
    console.error("Admin badges error:", error);
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, icon, requiredXP, categoryCondition } = await req.json();
    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        icon: icon || "Award",
        requiredXP: requiredXP ? parseInt(requiredXP) : 50,
        categoryCondition: categoryCondition || null,
      },
    });
    return NextResponse.json({ success: true, badge });
  } catch (error) {
    console.error("Create badge error:", error);
    return NextResponse.json({ error: "Failed to create badge" }, { status: 500 });
  }
}
