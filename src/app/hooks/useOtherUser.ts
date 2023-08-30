import type { Conversation, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

const useOtherUser = (chat: Conversation & { users: User[] }) => {
    const session = useSession()

    const otherUser = useMemo(() => {
        if (!session || !session.data?.user?.email) {
            return null; // Handle case where session is not available
        }

        const otherUsers = chat.users.filter(user => user.email !== session.data.user?.email)
        return otherUsers[0]

    }, [session, chat.users])

    return otherUser
}

export default useOtherUser
