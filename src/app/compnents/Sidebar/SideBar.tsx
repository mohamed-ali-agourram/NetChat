"use client"
import { usePathname } from "next/navigation"
import { BsSearch } from "react-icons/bs"
import clsx from "clsx"
import axios from "axios"
import { useEffect, useState } from "react"
import { BiSolidMessageDetail } from "react-icons/bi"
import { MdPeopleAlt } from "react-icons/md"
import { IoPeopleCircleSharp } from "react-icons/io5"
import ModalWrraper from "../Modals/PopUpModal"
import GroupModal from "../Modals/GroupModal"
import { Conversation, User } from "@prisma/client"
import UserBox from "@/app/contact/components/UserBox"
import Skeleton from "../Skeleton"
import GroupBox from "../GroupBox"
import { LuDelete } from "react-icons/lu"

interface SideBarProps {
    content: React.ReactNode
    data: any,
    contact?: User[]
}

const SideBar = ({ content, data, contact }: SideBarProps) => {

    const [search, SetSearch] = useState("")
    const [searchResult, setSearchResult] = useState<(User | Conversation & { users: User[] })[] | []>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGroupModal, setIsGroupModal] = useState(false)
    const pathname = usePathname()?.substring(1)

    useEffect(() => {
        if (search !== "") {
            setIsLoading(true);
            const timeoutId = setTimeout(() => {
                axios.post("/api/search", { query: search, mode: pathname?.split("/")[0] })
                    .then((callback) => {
                        if (callback.data) {
                            setSearchResult(callback.data);
                        }
                    })
                    .finally(() => setIsLoading(false));
            }, 1000);

            return () => clearTimeout(timeoutId);
        } else {
            setSearchResult([]);
        }
    }, [search, pathname])

    return (
        <div className={clsx(`
            w-[30vw]
            xl:w-[35vw]
            md:w-screen
            md:h-[90vh]
            bg-second-bg
            flex flex-col
            text-center
            relative
            transition duration-75
            `,
            pathname === "profile" && "!hidden"
        )}>
            <div className="flex flex-col gap-2 w-full bg-second-bg p-2 sticky top-0 z-10">
                <ModalWrraper
                    onClose={() => setIsGroupModal(false)}
                    isOpen={isGroupModal}
                    isCloseButton={true}
                >
                    <GroupModal data={contact} hideModal={() => setIsGroupModal(false)} />
                </ModalWrraper>
                <h1 className="text-3xl text-white text-start px-2">
                    {
                        pathname?.includes("chat")
                            ? <p className="flex gap-2 items-center text-white">
                                <BiSolidMessageDetail className="mb-[-1%]" />
                                <span>Messages</span>
                                {
                                    data.length > 0
                                        ? <span className="text-blue-400 text-[25px]">({data.length})</span>
                                        : null
                                }

                            </p>
                            : <p className="flex gap-2 items-center text-white">
                                <MdPeopleAlt />
                                <span>Contact</span>
                                {
                                    data.length > 0
                                        ? <span className="text-blue-400 text-[25px]">({data.length})</span>
                                        : null
                                }

                            </p>
                    }
                </h1>
                {
                    pathname?.includes("chat")
                        ? <button
                            onClick={() => setIsGroupModal(true)}
                            title="Add a new group"
                            className="absolute right-4 top-3 text-[30px] cursor-pointer delay-75 hover:scale-105">
                            <IoPeopleCircleSharp />
                        </button>
                        : null
                }
                <div className="relative">
                    <input
                        type="text"
                        className="bg-main-bg focus:bg-main-bg px-3 py-4 rounded-xl w-full"
                        placeholder={`Search ${pathname?.includes("chat") ? "your contacts" : "for new friends"}`}
                        onChange={(e) => SetSearch(e.target.value)}
                        value={search}
                    />
                    <button
                        onClick={
                            () => {
                                search
                                    ? SetSearch("")
                                    : null
                            }
                        }
                        className={clsx(`absolute
                        right-0
                        p-3
                        h-full
                        cursor-default
                        text-gray-500`,
                            search && "text-[20px] cursor-pointer"
                        )}>
                        {search ? <LuDelete /> : <BsSearch />}
                    </button>
                </div>
            </div>


            <div className="p-2 sm:p-1 overflow-y-scroll">
                {
                    searchResult.length > 0
                        ? <>
                            {
                                !isLoading
                                    ?
                                    searchResult.map((result) => {
                                        if ('users' in result) {
                                            // This is a conversation with users
                                            if (result.name !== null) {
                                                return <GroupBox key={result.id} conversation={result} query={search} />
                                            }
                                            return result.users.map((user) => (
                                                <UserBox key={user.id} isSearch={true} user={user} />
                                            ));
                                        } else {
                                            return <UserBox key={result.id} isSearch={true} user={result} />;
                                        }
                                    })

                                    : <Skeleton />
                            }
                        </>
                        : <> {content} </>
                }

            </div>
        </div>
    )
}

export default SideBar