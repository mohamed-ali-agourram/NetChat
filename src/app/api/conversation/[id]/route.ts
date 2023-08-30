import getCurrentUser_B from "@/app/helpers/getCurrentUser_B"
import prisma from "@/app/libs/prisma"
import { pusherServer } from "@/app/libs/pusher"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser_B()
        if (!user?.id || !user?.email) return NextResponse.json("Unauthorized", { status: 501 })

        const { id } = params
        const req_body = await request.json()
        const { isGroup } = req_body

        //check if convo exists
        const convo = await prisma.conversation.findUnique({
            where: {
                id
            }
        })

        if (!convo) return NextResponse.json("Invalid Id")

        if (isGroup) {
            //if admin (delete convo)
            if (convo.adminId === user.id) {
                const deletedConvo = await prisma.conversation.delete({
                    where: {
                        id: convo.id
                    },
                    include: {
                        users: true
                    }
                })

                deletedConvo.users.forEach((user) => {
                    if (user.email) {
                        pusherServer.trigger(user.email, "conversation:delete", deletedConvo)
                    }
                })

                return NextResponse.json(deletedConvo)
            }

            //leave convo
            const updatedConvo = await prisma.conversation.update({
                where: {
                    id: convo.id
                },
                data: {
                    users: {
                        disconnect: {
                            id: user.id
                        }
                    }
                }
            })

            pusherServer.trigger(user.email, "conversation:delete", updatedConvo)
            return NextResponse.json(updatedConvo)
        }

        const deletedConvo = await prisma.conversation.delete({
            where: {
                id: convo.id
            },
            include: {
                users: true
            }
        })

        deletedConvo.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:delete", deletedConvo)
            }
        })
        return NextResponse.json(deletedConvo)
    } catch (error: any) {
        return NextResponse.json(error)
    }
}