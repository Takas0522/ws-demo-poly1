import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; serviceId: string; featureId: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, serviceId, featureId } = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    const data = await apiClient.updateTenantServiceFeature(
      id,
      serviceId,
      featureId,
      body,
      token,
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Update tenant service feature error:", error);
    const err = error as {
      response?: { data?: { detail?: string }; status?: number };
    };
    return NextResponse.json(
      {
        error:
          err.response?.data?.detail ||
          "Failed to update tenant service feature",
      },
      { status: err.response?.status || 500 },
    );
  }
}
