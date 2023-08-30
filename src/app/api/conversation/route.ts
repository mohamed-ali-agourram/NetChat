import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";
import getCurrentUser_B from "@/app/helpers/getCurrentUser_B";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser_B()

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json()
        const {
            otherUserId,
            members,
            isGroup,
            name
        } = body

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    admin: {
                        connect: { id: currentUser.id }
                    },
                    users: {
                        connect: [
                            ...members.map((email: string) => ({
                                email
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true,
                    admin: true
                }
            });

            //update sidebar
            newConversation.users.forEach((user) => {
                pusherServer.trigger(user.email!, "conversation:new", newConversation)
            })

            return NextResponse.json(newConversation);
        }

        //check if conversation alrdy exist
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        usersId: {
                            equals: [currentUser.id, otherUserId]
                        }
                    },
                    {
                        usersId: {
                            equals: [otherUserId, currentUser.id]
                        }
                    }
                ]
            }
        })

        //if exist retun it
        const chat = conversations[0]
        if (chat) return NextResponse.json(chat)

        //else create one and return it
        const newConversation = await prisma.conversation.create({
            data: {
                admin: {
                    connect: { id: currentUser.id }
                },
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: otherUserId
                        }
                    ]
                }
            },
            include: {
                users: true,
                admin: true
            }
        });

        newConversation.users.forEach((user) => {
            pusherServer.trigger(user.email!, "conversation:new", newConversation)
        })

        return NextResponse.json(newConversation)
    } catch (error: any) {
        return NextResponse.json(error)
    }
}