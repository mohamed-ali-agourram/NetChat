import prisma from "@/app/libs/prisma";
import getCurrentUser_B from "./getCurrentUser_B";

export async function getUnreadMessages() {
    try {
        const currentUser = await getCurrentUser_B()
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