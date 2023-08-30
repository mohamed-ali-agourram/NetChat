import type { Conversation, User, Message } from "@prisma/client";

export { }

declare global {
    type FullConvoType = Conversation & {
        users: User[]
        messages: Message[]
    }

    type FullMessageType = Message & {
        sender: User,
        seen: User[]
    }
}