import prisma from "@/app/libs/prisma"
import { NextResponse } from "next/server"
import getCurrentUser from "@/app/helpers/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user?.email || !user?.id) return new NextResponse('Unauthorized', { status: 401 });

        const req_body = await request.json()
        const {
            body,
            image,
            convoId
        } = req_body


        //create a new message
        const newMessage = await prisma.message.create({
            data: {
                body,
                image,
                conversation: {
                    connect: { id: convoId }
                },
                sender: {
                    connect: { id: user.id }
                },
                seen: {
                    connect: { id: user.id }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        })

        //update conversation with new id
        const updatedConv = await prisma.conversation.update({
            where: {
                id: convoId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: { id: newMessage.id }
                }
            }, include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })

        //new messages inside the conversation
        await pusherServer.trigger(convoId, "messages:new", newMessage)

        //new messages in the sideBar
        const lastMessage = updatedConv.messages[updatedConv.messages.length - 1] 
        updatedConv.users.map((user)=>{
            pusherServer.trigger(user.email!, "conversation:update", {
                id: convoId,
                messages: [lastMessage]
            })
        })

        return NextResponse.json(newMessage)
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error, { status: 500 });
    }
}