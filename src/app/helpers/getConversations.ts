import prisma from "@/app/libs/prisma";
import getCurrentUser from "@/app/helpers/getCurrentUser";

export async function getConversations() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser?.id || !currentUser?.id) {
            return []
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                usersId: {
                    has: currentUser?.id
                }
            },
            orderBy:{
                lastMessageAt: "desc"
            },
            include: {
                users: true,
                messages: {
                    include:{
                        seen: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                }
            }
        })

        return conversations

    } catch (error: any) {
        return []
    }
}