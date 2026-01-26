export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams?.get?.("search") ?? "";

    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        OR: search ? [
          { username: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } }
        ] : undefined
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        companyName: true,
        isActive: true,
        createdAt: true,
        _count: { select: { salesMetrics: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request?.json?.();
    const { username, password, firstName, lastName, companyName } = body ?? {};

    if (!username || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanılıyor" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        companyName,
        role: "CLIENT"
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        companyName: true,
        isActive: true,
        createdAt: true
      }
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
