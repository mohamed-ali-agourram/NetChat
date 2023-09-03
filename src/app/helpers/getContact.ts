import prisma from "@/app/libs/prisma";
import getCurrentUser from "./getCurrentUser";

export async function getContact() {
    const user = await getCurrentUser();
    if (!user?.id) return [];

    try {
        const currentUserConversations = await prisma.user.findUnique({
            where: {
                email: user.email!
            },
            include: {
                conversations: {
                    select: {
                        users: {
                            where: {
                                id: { not: user.id }
                            }
                        }
                    }
                }
            }
        });

        //get users ids
        if (currentUserConversations) {
            const usersIds: string[] = [];

            currentUserConversations.conversations.forEach(conversation => {
                conversation.users.forEach(user => {
                    usersIds.push(user.id);
                });
            });

            const users = await prisma.user.findMany({
                where: {
                    id: {
                        in: usersIds
                    },
                },
            });

            return users;
        } else {
            return [];
        }
    } catch (error: any) {
        return []
    }
}