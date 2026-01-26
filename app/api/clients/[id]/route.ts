export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const client = await prisma.user.findUnique({
      where: { id: params?.id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        companyName: true,
        isActive: true,
        createdAt: true,
        salesMetrics: {
          orderBy: { date: "desc" },
          take: 30
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request?.json?.();
    const { firstName, lastName, companyName, isActive, password } = body ?? {};

    const updateData: any = {
      firstName,
      lastName,
      companyName,
      isActive
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const client = await prisma.user.update({
      where: { id: params?.id },
      data: updateData,
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
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: params?.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
