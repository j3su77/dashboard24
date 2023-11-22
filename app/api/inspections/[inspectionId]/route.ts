import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";



export async function PATCH(req: Request, { params }: { params: { inspectionId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { inspectionId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const inspection = await db.inspection.update({
            where: {
                id: inspectionId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(inspection)

    } catch (error) {
        console.log("[INSPECTIONS_ID]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}