import bcrypt from "bcrypt";
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prisma";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json()
        const {
            name,
            email,
            password
        } = body

        if (!email || !name || !password) return new NextResponse("Credentials Missing", { status: 400 })

        if(name.length < 3 || name.length > 25) return new NextResponse("Name must be between 3 and 25 characters", { status: 400 })

        const emailExist = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(emailExist) return new NextResponse("Email already exists", { status: 400 })
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) return new NextResponse("Invalid Email", { status: 400 })

        if(password.length < 8) return new NextResponse("Password must contains atleast 8 cracters", { status: 400 })

        const hashedPassword = await bcrypt.hash(password, 15)

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })

        return NextResponse.json(user);
    } catch (error: any) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}