import prisma from "@/app/libs/prisma"
import getCurrentUser_B from "./getCurrentUser_B"

export async function getConversation(id: string) {
    try {

        const user = await getCurrentUser_B()
        if (!user?.email) return null

        const chat = await prisma.conversation.findUnique({
            where: {
                id
            },
            include: {
                users: true
            }
        })

        if (!chat) return null

        return chat

    } catch (error: any) {
        return null
    }
}