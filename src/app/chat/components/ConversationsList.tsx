"use client"
import { useEffect, useMemo, useState } from "react"
import ConversationBox from "./ConversationBox"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/app/libs/pusher"
import { User } from "@prisma/client"

interface ConversationsListProps {
  initialConversations: FullConvoType[]
  currentUser: User
}

const ConversationsList = ({ initialConversations, currentUser }: ConversationsListProps) => {
  const [conversations, setConversations] = useState(initialConversations)
  const session = useSession()

  const pusherChannel = useMemo(() => {
    return session?.data?.user?.email
  }, [session])

  useEffect(() => {
    if (!pusherChannel) return

    const newConvoHandler = (newConvo: FullConvoType) => {
      setConversations((prevState) => [...prevState, newConvo]);
    };

    const updateConvoHandler = (conversation: FullConvoType) => {
      setConversations((current) => {
        const updatedConversations = current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              lastMessageAt: new Date(),
              messages: conversation.messages
            };
          }
          return currentConversation;
        });
        
        updatedConversations.sort((a, b) => {
          const dateA = new Date(a.lastMessageAt).getTime();
          const dateB = new Date(b.lastMessageAt).getTime();
          return dateB - dateA;
        });
    
        return updatedConversations;
      });
    };
    

    const deleteConvoHandler = (deltedConvo: FullConvoType) => {
      setConversations((prevState) => prevState.filter((convo) => convo.id !== deltedConvo.id));
    };

    pusherClient.subscribe(pusherChannel)
    pusherClient.bind("conversation:new", newConvoHandler)
    pusherClient.bind("conversation:delete", deleteConvoHandler)
    pusherClient.bind("conversation:update", updateConvoHandler)

    return () => {
      pusherClient.unsubscribe(pusherChannel)
      pusherClient.unbind("conversation:new", newConvoHandler)
      pusherClient.unbind("conversation:delete", deleteConvoHandler)
      pusherClient.unbind("conversation:update", updateConvoHandler)
    }
  }, [pusherChannel, conversations])

  return (
    <ul className="flex flex-col gap-1 sm:gap-3 h-full transition duration-500">
      {
        conversations
          .map((conversation) => (
            <ConversationBox
              currentUser={currentUser}
              key={conversation.id}
              conversation={conversation}
            />
          ))
      }
    </ul>
  )
}

export default ConversationsList