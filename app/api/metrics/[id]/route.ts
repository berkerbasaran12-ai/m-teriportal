export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request?.json?.();
    const { date, totalSales, orderCount, newCustomers, repeatCustomers, netProfit } = body ?? {};

    const avgBasketValue = orderCount > 0 ? totalSales / orderCount : 0;

    const metric = await prisma.salesMetric.update({
      where: { id: params?.id },
      data: {
        date: new Date(date),
        totalSales,
        orderCount,
        newCustomers,
        repeatCustomers,
        netProfit,
        avgBasketValue
      }
    });

    return NextResponse.json({ metric });
  } catch (error) {
    console.error("Error updating metric:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await prisma.salesMetric.delete({
      where: { id: params?.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting metric:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
