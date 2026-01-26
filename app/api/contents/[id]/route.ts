export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const content = await prisma.knowledgeBaseContent.findUnique({
      where: { id: params?.id },
      include: { category: true }
    });

    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching content:", error);
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
    const { title, description, type, url, fileUrl, isPublic, status, categoryId } = body ?? {};

    const content = await prisma.knowledgeBaseContent.update({
      where: { id: params?.id },
      data: {
        title,
        description,
        type,
        url,
        fileUrl,
        isPublic,
        status,
        categoryId
      },
      include: { category: true }
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error updating content:", error);
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

    await prisma.knowledgeBaseContent.delete({
      where: { id: params?.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
