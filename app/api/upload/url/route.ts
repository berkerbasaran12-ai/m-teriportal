export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFileUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request?.json?.();
    const { cloud_storage_path, isPublic } = body ?? {};

    if (!cloud_storage_path) {
      return NextResponse.json({ error: "Dosya yolu zorunludur" }, { status: 400 });
    }

    const url = await getFileUrl(cloud_storage_path, isPublic ?? false);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error getting file URL:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
