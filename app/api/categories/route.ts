export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { contents: true } }
      },
      orderBy: { order: "asc" }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
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
    const { name, icon } = body ?? {};

    if (!name || !icon) {
      return NextResponse.json({ error: "Ad ve ikon zorunludur" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const maxOrder = await prisma.category.aggregate({
      _max: { order: true }
    });

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        slug,
        order: (maxOrder?._max?.order ?? 0) + 1
      }
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Bu kategori zaten mevcut" }, { status: 400 });
    }
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
