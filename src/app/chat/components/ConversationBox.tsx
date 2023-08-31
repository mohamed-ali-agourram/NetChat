"use client"
import useOtherUser from "@/app/hooks/useOtherUser"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Message, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { format, isToday, isYesterday } from 'date-fns';
import ImageComponent from "@/app/compnents/ImageComponent"

interface Props {
  conversation: FullConvoType
  currentUser: User
}

const ConversationBox = ({ conversation, currentUser }: Props) => {
  const [isSeen, setIsSeen] = useState(false)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const isGroup = useMemo(() => {
    return conversation.isGroup
  }, [conversation.isGroup])
  const user = useOtherUser(conversation)
  const router = useRouter()
  const pathname = usePathname()

  const lastMessage: Message | undefined = useMemo(() => {
    if (conversation.messages) {
      return conversation.messages[conversation.messages.length - 1]
    }
  }, [conversation.messages])

  const lastMessageSender = useMemo(() => {
    if (lastMessage) {
      return conversation.users.filter(user => user.id === lastMessage.senderId)
    }
    return []
  }, [lastMessage, conversation])

  const admin = useMemo(() => {
    if (!isAdmin) {
      return conversation.users.filter(user => user.id === conversation.adminId)
    }
    return []
  }, [isAdmin, conversation])

  useEffect(() => {
    if (lastMessage?.senderId === currentUser.id) {
      setIsCurrentUser(true)
    } else {
      setIsCurrentUser(false)
    }
    if (conversation.adminId === currentUser.id) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [currentUser, conversation, lastMessage])

  const formattedDate = useMemo(() => {
    if (lastMessage?.createdAt) {
      const formatDate = (dateString: Date | undefined) => {
        if (dateString !== undefined) {
          if (isToday(dateString)) {
            return format(dateString, 'HH:mm');
          } else if (isYesterday(dateString)) {
            return 'Yesterday';
          } else {
            return format(dateString, 'dd/MM/yyyy');
          }
        }
      };
      return formatDate(new Date(lastMessage?.createdAt));
    }
  }, [lastMessage?.createdAt]);

  useEffect(() => {
    if (currentUser) {
      if (lastMessage) {
        if (lastMessage.senderId === currentUser.id || lastMessage?.seenIds.includes(currentUser.id)) {
          setIsSeen(true)
        } else {
          setIsSeen(false)
        }
      } else {
        setIsSeen(true)
      }
    }
  }, [currentUser, lastMessage, lastMessage?.seenIds, lastMessage?.senderId]);

  const isSelected = useMemo(() => {
    return pathname?.split("/")[2] === conversation.id
  }, [conversation, pathname])

  const toChat = () => {
    setIsSeen(true)
    router.push("/chat/" + conversation.id)
  }

  return (
    <li
      onClick={toChat}
      className={clsx(`flex
        gap-2
        items-start
        p-3
        sm:p-1
        relative
        h-fit
        cursor-pointer
        rounded-md
        hover:bg-[#0000003d] transition delay-[5ms]
        `,
        isSelected && "bg-[#0000009f] hover:bg-[#0000009f]")}>
      {isSeen === false ? <span className="absolute right-3 top-2 rounded-full w-[2vh] h-[2vh] bg-blue-400"></span> : null}
      {
        isGroup
          ? <>
            <ImageComponent
              src={conversation?.groupImage!}
              alt={conversation?.name!}
              isGroup={true}
            />
            <div className="flex flex-col items-start w-full">
              <p>{conversation?.name}</p>
              <div className="w-full flex justify-between">
                <p className={clsx(`text-gray-600
                    font-bold
                    text-sm
                    sm:text-[13px]
                    w-full
                    overflow-hidden
                    whitespace-nowrap
                    text-start
                    overflow-ellipsis
                    `,
                  isSeen === false && "text-white"
                )}>
                  {
                    lastMessage
                      ? (isCurrentUser ? "You: " : `${lastMessageSender[0]?.name}: `)! + (lastMessage.image ? "Sent an image" : lastMessage.body)
                      : (isAdmin ? "You created this group chat" : `${admin[0].name} Created this group chat`)
                  }
                </p>
                {
                  lastMessage
                    ? <p className="text-gray-600 text-[11px] xsm:text-[11px] font-bold">{formattedDate}</p>
                    : null
                }
              </div>

            </div></>
          : <>
            <ImageComponent
              src={user?.image!}
              alt={user?.name!}
              isGroup={false}
              user={user!}
            />
            <div className="flex flex-col items-start w-full">
              <p>{user?.name ?? "Deleted Account"}</p>
              <div className="w-full flex justify-between">
                <p className={clsx(`text-gray-600
            font-bold
            text-sm
            w-full
            sm:text-[13px]
            overflow-hidden
            whitespace-nowrap
            text-start
            overflow-ellipsis`,
                  isSeen === false && "text-white"
                  ,
                )}>
                  {
                    lastMessage
                      ? (isCurrentUser ? "You: " : '')! + (lastMessage.image ? "Sent an image" : lastMessage.body)
                      : (isAdmin ? "You started this conversation" : `${admin[0].name} Invited you to this conversation`)
                  }
                </p>
                {
                  lastMessage
                    ? <p className="text-gray-600 text-[11px] xsm:text-[11px] font-bold">{formattedDate}</p>
                    : null
                }
              </div>

            </div>
          </>}
    </li>
  )
}

export default ConversationBox