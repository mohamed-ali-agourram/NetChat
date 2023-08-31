import prisma from "@/app/libs/prisma"
import getCurrentUser from "./getCurrentUser"

export async function getConversation(id: string) {
    try {

        const user = await getCurrentUser()
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