import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, role, age, avatar, phoneNumber } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === "PARENT" ? "PARENT" : "CHILD";

    const user = await prisma.user.create({
      data: {
        fullName,
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        ...(assignedRole === "PARENT"
          ? {
              parentProfile: {
                create: {
                  phoneNumber: phoneNumber || null,
                },
              },
            }
          : {
              childProfile: {
                create: {
                  age: age ? parseInt(age) : 7,
                  avatar: avatar || "star-kid",
                  xpPoints: 0,
                  level: 1,
                  currentStreak: 1,
                },
              },
            }),
      },
      include: {
        childProfile: true,
        parentProfile: {
          include: {
            children: true,
          },
        },
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as "CHILD" | "PARENT" | "ADMIN",
      childId: user.childProfile?.id,
      parentId: user.parentProfile?.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        childProfile: user.childProfile,
        parentProfile: user.parentProfile,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to register account." }, { status: 500 });
  }
}
