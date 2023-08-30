import prisma from "@/app/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get("email") as string
        if (!email) return NextResponse.json("Missing infos!")

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!user) return NextResponse.json("No User Found!")
        
        return NextResponse.json(user)
    } catch (error: any) {
        return NextResponse.json(error)
    }

}
