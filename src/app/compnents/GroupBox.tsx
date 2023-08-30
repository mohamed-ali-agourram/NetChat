"use client"
import { useRouter } from "next/navigation"
import { Conversation, User } from "@prisma/client"
import Image from "next/image"
import clsx from "clsx"
import { useMemo } from "react"
import ImageComponent from "./ImageComponent"

interface GroupBoxProps {
    conversation: Conversation & { users: User[] }
    query: string
}

const GroupBox = ({ conversation, query }: GroupBoxProps) => {

    const router = useRouter()
    const toChat = () => {
        router.push("/chat/" + conversation.id)
    }

    const rearrangedNames = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        const namesWithQuery = conversation.users.filter(user => user.name?.toLowerCase().includes(lowerQuery));
        const namesWithoutQuery = conversation.users.filter(user => !user.name?.toLowerCase().includes(lowerQuery));
        return [...namesWithQuery, ...namesWithoutQuery];
    }, [conversation, query]);

    return (
        <div
            onClick={toChat}
            className="flex gap-2 items-start p-2 rounded-xl cursor-pointer hover:bg-[#0000003d] transition delay-[5ms]">
            <ImageComponent
                src={conversation?.groupImage!}
                alt={conversation?.name!}
                isGroup={true}
            />
            <div className="flex flex-col items-start w-full">
                <p>{conversation?.name}</p>
                <div className={clsx(`
                    font-bold
                    text-sm
                    sm:text-[13px]
                    w-[90%]
                    md:w-[20vw]
                    sm:w-[35vw]
                    xsm:w-[55vw]
                    overflow-hidden
                    whitespace-nowrap
                    text-start
                    overflow-ellipsis
                    text-gray-600
                    `
                )}>
                    {
                        rearrangedNames.map((user, index) => {
                            return <span
                                key={user.id}
                                className={clsx(`
                                    text-gray-600
                                    w-full
                                `,
                                    user.name?.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && "text-white"
                                )}
                            >
                                <span>{user.name}</span>
                                <span>{index + 1 !== conversation.users.length ? "," : ''}</span>
                            </span>
                        })
                    }
                </div>

            </div>

        </div>
    )
}

export default GroupBox