import prisma from "@/app/libs/prisma"
import { NextResponse } from "next/server"
import getCurrentUser_B from "@/app/helpers/getCurrentUser_B"
import { pusherServer } from "@/app/libs/pusher"
import { deflate } from "pako"

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser_B()
        if (!currentUser?.email || !currentUser.id) return NextResponse.json("Unauthorized", { status: 401 })

        const body = await request.json()
        const { convoId } = body

        if (!convoId) return NextResponse.json("Missing infos!!")

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: convoId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })


        if (conversation && currentUser) {

            const unreadMessages = await prisma.message.findMany({
                where: {
                    AND: [
                        { conversationId: conversation.id },
                        { NOT: { seenIds: { has: currentUser.id } } }
                    ]
                },
                include: {
                    seen: true,
                    sender: true
                }
            })

            let updatedMessages: FullMessageType[] = [];
            await Promise.all(
                unreadMessages.map(async (message) => {
                    const updatedMessage = await prisma.message.update({
                        where: {
                            id: message.id,
                        },
                        data: {
                            seenIds: {
                                push: currentUser.id,
                            },
                        },
                        include: {
                            seen: true,
                            sender: true,
                        },
                    });

                    await pusherServer.trigger(convoId, "message:update", updatedMessage)

                    await pusherServer.trigger(currentUser.email!, "conversation:update", {
                        id: conversation.id,
                        messages: [updatedMessage]
                    })

                    updatedMessages.push(updatedMessage);
                })
            );

            return NextResponse.json(updatedMessages)
        }
        return NextResponse.json("Conversation Not Found", { status: 404 })

    } catch (error: any) {
        return NextResponse.json(error)
    }
}