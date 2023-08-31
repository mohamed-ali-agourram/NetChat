import { User, Conversation } from "@prisma/client";
import clsx from "clsx";
import { AiOutlineBars } from "react-icons/ai";
import axios from "axios";
import { FaTrash } from "react-icons/fa"
import { BsPencilSquare } from "react-icons/bs"
import Image from "next/image";
import MembersList from "./MembersList";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import PopUpModal from "@/app/compnents/Modals/PopUpModal";
import ConfirmModal from "./ConfirmModal";
import { BsCalendar2Date } from "react-icons/bs"
import ImageComponent from "@/app/compnents/ImageComponent";

interface SideBarProps {
    isOpen: boolean
    toggle: () => void
    isGroup: boolean
    user?: User
    chat?: Conversation & { users: User[] }
    members: User[]
    contact: User[]
    currentUser: User
    updateMembers: (mode: string, id?: string, newMembers?: string[]) => void
}

const SideBar = ({ isOpen, toggle, isGroup, user, chat, members, updateMembers, contact, currentUser }: SideBarProps) => {
    const [isConfirm, setIsConfirm] = useState(false)
    const [modalMode, setModalMode] = useState("")
    const [isImageOpen, setIsImageOpen] = useState(false)

    const handleUplaodImage = (result: any) => {
        axios.put("/api/settings", { isGroup: true, image: result?.info?.secure_url, convoId: chat?.id })
            .finally(() => {
                toggle()
            })
    }

    const createdAt = useMemo(() => {
        if (chat?.createdAt) {
            return format(new Date(chat?.createdAt), 'PP')
        }
        return ""
    }, [chat?.createdAt])

    const showModal = (mode: string) => {
        setIsConfirm(true)
        setModalMode(mode)
    }

    const hideModal = () => {
        setIsConfirm(false)
    }

    return <div className={clsx(`absolute
    right-0
    top-0
    h-screen
    w-[30vw]
    md:w-[60vw]
    sm:w-screen
    bg-[#18171d]
    z-20
    flex
    flex-col
    items-center
    gap-2
    pt-5
    justify-between
    transition duration-500
    `,
        isOpen === false ? "translate-x-[100%]" : "translate-x-[0%]"
    )}>
        <PopUpModal
            onClose={() => setIsConfirm(false)}
            isOpen={isConfirm}
        >
            <ConfirmModal
                id={chat?.id!}
                hideModal={hideModal}
                isGroup={chat?.isGroup ? true : false}
                mode={modalMode}
                chat={chat}
                handleUplaodImage={handleUplaodImage}
                updateMembers={updateMembers}
                members={members!}
                contact={contact}
                currentUser={currentUser!}
            />
        </PopUpModal>
        <button
            className="absolute left-3 top-4 text-[30px] cursor-pointer delay-75 hover:scale-105"
            title={isOpen === false ? "Close SideBar" : "Open SideBar"}
            onClick={toggle}
        >
            <AiOutlineBars />
        </button>
        <div className="p-2 flex flex-col gap-2 items-center w-full">
            {
                isGroup
                    ? <>
                        <div className="self-center">
                            <Image
                                src={chat?.groupImage ? chat?.groupImage : "/images/default-group.png"}
                                alt="user_profile"
                                height={100}
                                width={100}
                                onClick={() => setIsImageOpen(true)}
                                className="rounded-full cursor-pointer hover:scale-105"
                            />
                        </div>
                        <PopUpModal
                            onClose={() => setIsImageOpen(false)}
                            isOpen={isImageOpen}
                            isCloseButton={false}
                        >
                            <div className="w-[40vh] sm:w-[50vh] overflow-hidden rounded-full">
                                <Image
                                    src={chat?.groupImage ? chat?.groupImage : "/images/default-group.png"}
                                    alt="user_profile"
                                    height={100}
                                    width={100}
                                    className="rounded-full cursor-pointer object-cover w-[100%] h-[100%]"
                                />
                            </div>
                        </PopUpModal>
                        {chat?.name}
                        <h1 className="flex gap-1 items-center justify-start w-full px-5">
                            <BsCalendar2Date className="text-[21x] text-gray-600" />
                            <span className="text-gray-400 tex-[12px] text-start">Created At <span className="text-blue-400 text-[12px]">{createdAt}</span> </span>
                        </h1>
                        <MembersList currentUser={currentUser} updateMembers={updateMembers} members={members!} adminId={chat?.adminId!} />
                    </>
                    : <>
                        <div className="w-full flex justify-center items-center">
                            <div onClick={() => setIsImageOpen(true)}>
                                <ImageComponent
                                    src={user?.image ? user?.image : "/images/default-profile.jpg"}
                                    alt="user_profile"
                                    isGroup={false}
                                    divClass="h-[15vh] w-[15vh]"
                                />
                            </div>

                        </div>
                        <PopUpModal
                            onClose={() => setIsImageOpen(false)}
                            isOpen={isImageOpen}
                            isCloseButton={false}
                        >
                            <ImageComponent
                                src={user?.image ? user?.image : "/images/default-profile.jpg"}
                                alt="user_profile"
                                isGroup={false}
                                divClass="w-[40vh] sm:w-[50vh] h-[40vh] sm:h-[50vh]"
                            />
                        </PopUpModal>
                        <p>{user?.name ?? "Deleted Account"}</p>
                        <p className="text-gray-500 text-[15px]">Offline</p>
                        {
                            user?.email
                                ? <div className="self-start p-1 px-5">
                                    <span className="text-gray-500 text-[15px]">Email</span>
                                    <p>{user?.email}</p>
                                </div>
                                : <></>
                        }
                        {
                            user?.bio
                                ? <div className="self-start p-1 px-5">
                                    <span className="text-gray-500 text-[15px]">Bio</span>
                                    <p>{user?.bio}</p>
                                </div>
                                : null
                        }
                    </>


            }



        </div>

        <div className="flex flex-col gap-1 w-full">
            {
                chat?.isGroup
                    ? <>
                        <button
                            onClick={() => showModal("edit")}
                            className="transition duration-300 bg-[#0000001c] hover:bg-[#0000009c] w-full flex justify-center gap-2 p-4 items-center">
                            <BsPencilSquare />
                            <span>Edit Group</span>
                        </button>
                    </>
                    : null
            }
            <button
                onClick={() => showModal("delete")}
                className="transition duration-300 bg-[#0000001c] hover:bg-[#0000009c] w-full flex justify-center gap-2 p-4 items-center text-red-600">
                <FaTrash />
                <span>
                    {
                        chat?.isGroup
                            ? chat.adminId === currentUser?.id ? "Delete Group" : "Leave and Delete this conversation"
                            : "Delete This Conversation"
                    }
                </span>
            </button>
        </div>

    </div>
}

export default SideBar