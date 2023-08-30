import prisma from "@/app/libs/prisma"

export async function getMessages(convoId: string){
    try{
        const messages = await prisma.message.findMany({
            where:{
                conversationId: convoId
            },
            include:{
                conversation:{
                    select: {
                        isGroup: true
                    }
                },
                sender: true,
                seen: true
            }
        }) 
        return messages
    }catch(error){
        return []
    }
}