import getCurrentUser_B from "@/app/helpers/getCurrentUser_B"
import prisma from "@/app/libs/prisma"
import { Conversation, User } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser_B()
        if (!currentUser?.id || !currentUser?.email) return NextResponse.json("Unauthorized", { status: 401 })

        const req_body = await request.json()
        const { query, mode } = req_body

        if (!query || query === '.') return NextResponse.json([])

        if (mode === "chat") {
            const conversations = await prisma.conversation.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        {
                            users: {
                                some: {
                                    AND: [
                                        { name: { contains: query, mode: "insensitive" } },
                                        { id: { not: currentUser.id } }
                                    ]
                                }
                            }
                        }
                    ],
                    users: {
                        some: {
                            id: currentUser.id
                        }
                    }
                },
                include: {
                    users: true
                }
            });

            let result: (Conversation | User)[] = [];

            await Promise.all(conversations.map(async conversation => {
                if (conversation.name !== null) {
                    result.push(conversation);
                } else {
                    const allUserIds = conversation.users.map(user => user.id);
                    const otherUserIds = allUserIds.filter(userId => userId !== currentUser.id);
                    const otherUsers = await prisma.user.findMany({
                        where: {
                            id: {
                                in: otherUserIds
                            }
                        }
                    });
                    result.push(...otherUsers);
                }
            }));

            return NextResponse.json(result);

        } else {
            let result = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { startsWith: query, mode: "insensitive" } }
                    ]
                }
            })
            result = result.filter(user => user.id !== currentUser.id)
            
            const regex = /^[^@]+/;
            const filteredUsers = result.filter(user => regex.test(user.email!));

            return NextResponse.json(filteredUsers)
        }

    } catch (error: any) {
        console.error(error);
        return NextResponse.json([])
    }
}