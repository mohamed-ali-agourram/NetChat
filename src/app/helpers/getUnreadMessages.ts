import prisma from "@/app/libs/prisma";
import getCurrentUser from "./getCurrentUser";

export async function getUnreadMessages() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser?.id || !currentUser?.email) return []
        const messages = await prisma.message.findMany({
            where: {
                conversation: {
                    users: {
                        some: {
                            id: currentUser.id
                        }
                    }
                }
            }
        });

        return messages.filter((message) => !message.seenIds.includes(currentUser.id))
    } catch (error: any) {
        return []
    }
}