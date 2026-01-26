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
    const days = parseInt(searchParams?.get?.("days") ?? "30");
    const userId = searchParams?.get?.("userId") ?? (session.user as any)?.id;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const metrics = await prisma.salesMetric.findMany({
      where: {
        userId: userId,
        date: { gte: dateFrom }
      },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request?.json?.();
    const { date, totalSales, orderCount, newCustomers, repeatCustomers, netProfit } = body ?? {};

    const avgBasketValue = orderCount > 0 ? totalSales / orderCount : 0;

    const metric = await prisma.salesMetric.create({
      data: {
        date: new Date(date),
        totalSales,
        orderCount,
        newCustomers,
        repeatCustomers,
        netProfit,
        avgBasketValue,
        userId: (session.user as any)?.id
      }
    });

    return NextResponse.json({ metric });
  } catch (error: any) {
    console.error("Error creating metric:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Bu tarih için zaten veri mevcut" }, { status: 400 });
    }
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
