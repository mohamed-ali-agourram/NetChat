"use client"
import type { Conversation, User } from "@prisma/client"
import Image from "next/image"
import useOtherUser from "@/app/hooks/useOtherUser"
import { BsLayoutSidebarInset } from "react-icons/bs"
import { AiOutlineBars } from "react-icons/ai";
import Link from "next/link"
import SideBar from "./SideBar";
import { useState } from "react"
import clsx from "clsx"
import axios from "axios"
import ImageComponent from "@/app/compnents/ImageComponent"
import useActiveList from "@/app/hooks/useActiveList"

interface HeaderProps {
    chat: Conversation & { users: User[] }
    initialMembers: User[]
    contact: User[]
    toggleSideBar: () => void
    isSideBar: boolean
}

const Header = ({ chat, initialMembers, contact, isSideBar, toggleSideBar }: HeaderProps) => {
    const [members, setMembers] = useState(initialMembers)
    const { members: activeMmembers } = useActiveList()
    const otherUser = useOtherUser(chat)
    const isActive = activeMmembers.includes(otherUser?.email!)

    const updateMembers = (mode: string, id?: string, newMembers?: string[]) => {
        if (mode === "remove") {
            const updatedMembers = members?.filter(member => member.id !== id)
            setMembers(updatedMembers)
            axios.put("/api/settings", { removedUserId: id, isGroup: true, convoId: chat.id })
        } else {
            const updatedMembers = [...members];
            newMembers?.forEach(email => {
                const newUser = contact.find(user => user.email === email);
                if (newUser) {
                    updatedMembers.push(newUser);
                }
            });
            setMembers(updatedMembers)
        }

    }
    return (
        <>
            <div className={clsx(`absolute
            w-screen
            h-screen
            z-10
            left-0
            top-0
            transition duration-500
            bg-[#00000067]`,
                isSideBar === false && "hidden"
            )}
                onClick={toggleSideBar}
            ></div>
            <SideBar
                isOpen={isSideBar}
                toggle={toggleSideBar}
                user={otherUser!}
                isGroup={chat.isGroup!}
                chat={chat}
                contact={contact}
                members={members}
                updateMembers={updateMembers}
            />
            <div className="flex p-3 sm:p-1 w-[100%] h-[10vh] md:h-[12vh] sm:h-[9vh] bg-[#0000002a] justify-between" onClick={() => {
                if (window.innerWidth <= 425) {
                    toggleSideBar()
                }
            }}>
                <div className="flex gap-3 items-center">
                    <Link href="/chat" className="md:block hidden">
                        <BsLayoutSidebarInset className="text-2xl sm:text-xl" />
                    </Link>
                    {
                        chat.isGroup
                            ?
                            <ul className="flex">
                                {
                                    members.slice(0, 3).map((user, index) => {
                                        return <li key={index}><Image
                                            src={user?.image ? user?.image : '/images/default-profile.jpg'}
                                            alt={user?.name ? user?.name : "user_profile"}
                                            width={40}
                                            height={40}
                                            className="rounded-full cursor-pointer self-center w-[4vh] h-[4vh]"
                                        /></li>
                                    })
                                }
                            </ul>
                            : <ImageComponent
                                src={otherUser?.image ? otherUser.image : "/images/default-profile.jpg"}
                                alt="user_profile"
                                isGroup={false}
                                divClass="w-[8vh] h-[8vh] sm:w-[9vw] sm:h-[9vw]"
                                user={otherUser!}
                            />
                    }

                    <div className="flex flex-col">
                        <p className="sm:text-[12px]">{chat.isGroup ? chat.name : (otherUser?.name ?? "Deleted Account")}</p>
                        <p className="text-gray-600 font-bold text-xs sm:!text-[12px]">{chat.isGroup ? members.length + " Members" : (isActive ? "Online" : "Offline")}</p>
                    </div>
                </div>

                <button
                    className="text-[30px] cursor-pointer delay-75 hover:scale-105 sm:hidden"
                    title={isSideBar ? "Close SideBar" : "Open SideBar"}
                    onClick={toggleSideBar}
                >
                    <AiOutlineBars />
                </button>
            </div>
        </>

    )
}

export default Header