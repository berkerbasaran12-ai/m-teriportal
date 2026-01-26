export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams?.get?.("categoryId");
    const search = searchParams?.get?.("search") ?? "";
    const isAdmin = (session.user as any)?.role === "ADMIN";

    const contents = await prisma.knowledgeBaseContent.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        } : {}),
        ...(!isAdmin ? { status: "PUBLISHED" } : {})
      },
      include: {
        category: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Error fetching contents:", error);
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
    const { title, description, type, url, fileUrl, isPublic, status, categoryId } = body ?? {};

    if (!title || !description || !type || !categoryId) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const content = await prisma.knowledgeBaseContent.create({
      data: {
        title,
        description,
        type,
        url,
        fileUrl,
        isPublic: isPublic ?? false,
        status: status ?? "DRAFT",
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
