import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  const data = await apiClient.triggerDebugError500(token);
  return NextResponse.json(data);
}
