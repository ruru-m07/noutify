/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "auth"

export const GET = auth((req: any) => {
  if (req.auth) {
    return Response.json({ data: "Protected data" })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
