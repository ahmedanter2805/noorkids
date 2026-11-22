import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { demoType } = await req.json();

    let targetEmail = "admin@noorkids.com";
    if (demoType === "ADMIN") {
      targetEmail = "admin@noorkids.com";
    } else if (demoType === "PARENT") {
      targetEmail = "parent@noorkids.com";
    } else if (demoType === "CHILD_OMAR") {
      targetEmail = "omar@noorkids.com";
    } else if (demoType === "CHILD_SARA") {
      targetEmail = "sara@noorkids.com";
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        childProfile: true,
        parentProfile: {
          include: {
            children: {
              include: {
                user: { select: { id: true, fullName: true, email: true } },
              },
            },
          },
        },
        adminProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Demo user not found in database. Please run seed." },
        { status: 404 }
      );
    }

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
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Failed to perform demo login." }, { status: 500 });
  }
}
