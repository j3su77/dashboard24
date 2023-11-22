import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";



export async function PATCH(req: Request, { params }: { params: { collaboratorId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const { collaboratorId } = params;
        const values = await req.json()

        if (!session) return new NextResponse("Unauthorized", { status: 401 })

        const collaborator = await db.collaborator.update({
            where: {
                id: collaboratorId,
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(collaborator)

    } catch (error) {
        console.log("[COURSES_ID]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}