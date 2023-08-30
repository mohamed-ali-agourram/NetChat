import prisma from "@/app/libs/prisma";
import getCurrentUser_B from "./getCurrentUser_B";

export async function getContact() {
    const user = await getCurrentUser_B();
    if (!user?.id) return [];

    //get all convos from ci=urrent user with other users
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

        //get users using usersIds
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
}
