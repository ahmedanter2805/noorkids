import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    let parentId = session?.parentId;

    if (!parentId) {
      const defaultParent = await prisma.parent.findFirst();
      if (defaultParent) parentId = defaultParent.id;
    }

    if (!parentId) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 403 });
    }

    const { fullName, email, password, age, avatar } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required for child profile." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const childUser = await prisma.user.create({
      data: {
        fullName,
        email: cleanEmail,
        passwordHash,
        role: "CHILD",
        childProfile: {
          create: {
            parentId,
            age: age ? parseInt(age) : 7,
            avatar: avatar || "star-kid",
            xpPoints: 0,
            level: 1,
            currentStreak: 1,
          },
        },
      },
      include: {
        childProfile: true,
      },
    });

    return NextResponse.json({ success: true, child: childUser.childProfile });
  } catch (error) {
    console.error("Add child error:", error);
    return NextResponse.json({ error: "Failed to add child profile" }, { status: 500 });
  }
}
