export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const [totalClients, activeClients, totalContents, totalCategories] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.user.count({ where: { role: "CLIENT", isActive: true } }),
      prisma.knowledgeBaseContent.count(),
      prisma.category.count()
    ]);

    return NextResponse.json({
      totalClients,
      activeClients,
      totalContents,
      totalCategories
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
