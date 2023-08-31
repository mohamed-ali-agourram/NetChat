"use client"
import Header from "./components/Header"
import Body from "./components/Body"
import Form from "./components/Form"
import { useState, useRef, UIEvent } from 'react'
import type { Conversation, User, Message } from "@prisma/client"
import { BsFillArrowDownCircleFill } from "react-icons/bs"
import clsx from "clsx"

interface Props {
    contact: User[]
    chat: Conversation & { users: User[] }
    initialMembers: User[]
    initialMessages: (Message & { sender: User, seen: User[], conversation: { isGroup: boolean | null } })[]
    admin: User
    currentUser: User
}

const Main = ({
    admin,
    chat,
    contact,
    initialMembers,
    initialMessages,
    currentUser
}: Props) => {
    const [isSideBar, setIsSideBar] = useState(false)
    const [isScrolling, setIsScrolling] = useState(false);
    const [messages, setMessages] = useState(initialMessages)
    const lastMessageRef = useRef<HTMLParagraphElement | null>(null);
    const toggleSideBar = () => {
        setIsSideBar(!isSideBar)
    }
    const scrollDown = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const div = e.currentTarget;
        const scrolledPixels = div.scrollTop;
        const scrolledPercentage = (scrolledPixels / (div.scrollHeight - div.clientHeight)) * 100;

        if (scrolledPercentage <= 70) {
            setIsScrolling(true)
        } else {
            setIsScrolling(false)
        }
    };


    return <main className="rleative bg-main-bg h-screen md:w-screen flex flex-col">
        <div
            title="scroll down"
            onClick={scrollDown}
            className={clsx(`
            absolute
            bottom-[12vh]
            md:bottom-[10vh]
            cursor-pointer
            left-[68%]
            md:left-[50%]
            transform
            -translate-x-1/2
            transition duration-[300ms]
            z-10
            text-4xl
            md:text-3xl
            hover:scale-110
            `,
            isScrolling ? "opacity-1" : "opacity-0"
            )}>
            <BsFillArrowDownCircleFill />
        </div>
        <Header currentUser={currentUser} toggleSideBar={toggleSideBar} isSideBar={isSideBar} contact={contact} chat={chat!} initialMembers={initialMembers!} />
        {/* @ts-ignore */}
        <Body setMessages={setMessages} handleScroll={handleScroll} lastMessageRef={lastMessageRef} toggleSideBar={toggleSideBar} messages={messages} chat={chat!} admin={admin!} />
        <Form id={chat?.id!} />
    </main>
}

export default Main