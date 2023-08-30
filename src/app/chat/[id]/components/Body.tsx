"use client"
import type { User, Message, Conversation } from "@prisma/client";
import { useEffect, useMemo, MutableRefObject, UIEvent, useCallback } from "react";
import format from "date-fns/format";
import axios from "axios";
import MessageBox from "./Message";
import { useSession } from "next-auth/react";
import Spinner from "@/app/compnents/Spinner";
import useCoversation from "@/app/hooks/useCoversation";
import Image from "next/image";
import useOtherUser from "@/app/hooks/useOtherUser";
import { pusherClient } from "@/app/libs/pusher";

interface BodyProps {
    messages: (Message & { sender: User, seen: User[], conversation: { isGroup: boolean | null } })[]
    chat: Conversation & { users: User[] }
    admin?: User
    toggleSideBar: () => void
    lastMessageRef: MutableRefObject<HTMLParagraphElement | null>
    handleScroll: (e: UIEvent<HTMLDivElement>) => void
    setMessages: (newMessages: any) => void
}

const Body = ({ messages, setMessages, chat, admin, toggleSideBar, lastMessageRef, handleScroll }: BodyProps) => {
    const otherUser = useOtherUser(chat)
    const lastMessage = messages.slice(-1)[0]
    const session = useSession()
    const userEmail = session?.data?.user?.email
    const convoId = useCoversation()

    const messageHandler = useCallback((message: FullMessageType) => {
        axios.post("/api/seen", { convoId });
        setMessages((currentMessages: Message[]) => {

            const existingMessage = currentMessages.find((msg: Message) => msg.id === message.id);
            if (existingMessage) {
                return currentMessages;
            }

            return [...currentMessages, message];
        });

        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lastMessageRef, setMessages, convoId]);

    const updateMessageHandler = useCallback((updatedMessage: FullMessageType) => {
        setMessages((messages: FullConvoType[]) => messages.map((currentMessage) => {
            if (currentMessage.id === updatedMessage.id) {
                return updatedMessage
            }
            return currentMessage
        }));
    }, [setMessages]);


    const createdAt = useMemo(() => {
        if (chat?.createdAt) {
            return format(new Date(chat?.createdAt), 'PP')
        }
        return ""
    }, [chat?.createdAt])

    useEffect(() => {
        pusherClient.subscribe(convoId!)
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })

        pusherClient.bind("messages:new", messageHandler)
        pusherClient.bind("message:update", updateMessageHandler)

        return () => {
            pusherClient.unsubscribe(convoId!)
            pusherClient.unbind("messages:new", messageHandler)
            pusherClient.unbind("message:update", updateMessageHandler)
        }
    }, [convoId, lastMessageRef, messageHandler, updateMessageHandler])

    useEffect(() => {
        if (convoId) {
            axios.post("/api/seen", { convoId })
        }
    }, [convoId])

    return <div
        onScroll={(e) => handleScroll(e)}
        className='chat-body h-[82vh] bg-main-bg p-3 flex flex-col justify-between gap-3 relative overflow-y-scroll'>
        {
            !chat.isGroup
                ? <div className="w-full flex flex-col items-center justify-center gap-[1px] py-3">
                    <Image
                        src={otherUser?.image ? otherUser.image : "/images/default-profile.jpg"}
                        alt="profile-image"
                        height={100}
                        width={100}
                        onClick={toggleSideBar}
                        className="h-[10vh] w-[10vh] cursor-pointe rounded-full hover:scale-105"
                    />
                    <p onClick={toggleSideBar} className="text-[15px] cursor-pointer text-gray-500 font-bold">{otherUser?.name ?? "Deleted Account"}</p>
                    <p className="text-[13px] text-gray-500">{otherUser?.bio ? otherUser?.bio : ""}</p>
                    <p className="text-[11px] text-center text-gray-500">{admin?.name ? admin?.name : null} Started This Conversation on {createdAt}</p>
                </div>
                : <div className="w-full flex flex-col items-center justify-center gap-1 py-3">
                    <Image
                        onClick={toggleSideBar}
                        src={chat.groupImage ? chat.groupImage : "/images/default-group.png"}
                        alt="group-image"
                        height={100}
                        width={100}
                        className="h-[10vh] w-[10vh] cursor-pointer rounded-full hover:scale-105"
                    />
                    <p onClick={toggleSideBar} className="text-[15px] text-gray-500 font-bold cursor-pointer">{chat.name}</p>
                    <p className="text-[11px] text-center text-gray-500">{admin?.name ? (admin?.email === userEmail ? "You created this group chat" : `Created  by ${admin?.name}`) : null} on {createdAt}</p>
                </div>
        }
        <ul className="flex flex-col justify-end gap-2">
            {
                messages
                    ? messages.map((message) => {
                        const isCurrentUser = userEmail === message?.sender?.email
                        const isGroup = message.conversation?.isGroup ?? false

                        return <MessageBox
                            key={message.id}
                            author={(!isCurrentUser && message.sender.name) as string}
                            isCurrentUser={isCurrentUser}
                            message={message}
                            isLast={lastMessage.id === message.id}
                            isGroup={isGroup}
                            lastMessageRef={lastMessageRef}
                        />
                    })
                    : <Spinner />
            }
        </ul>


    </div>
};

export default Body;
