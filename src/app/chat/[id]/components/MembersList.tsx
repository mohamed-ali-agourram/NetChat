import { User } from "@prisma/client"
import Image from "next/image"
import { BsFillPeopleFill, BsPersonFillAdd } from "react-icons/bs"
import axios from "axios"
import { useRouter } from "next/navigation"
import useCurrentUser from "@/app/hooks/useCurrentUser"
import { useSession } from "next-auth/react"
import { TiUserDelete } from "react-icons/ti"
import clsx from "clsx"
import { useMemo } from "react"
import ImageComponent from "@/app/compnents/ImageComponent"

interface MembersListProps {
    members: User[]
    adminId: string
    mode?: string
    updateMembers: (mode: string, id?: string, newMembers?: string[]) => void
}

const MembersList = ({ members, adminId, mode, updateMembers }: MembersListProps) => {
    const router = useRouter()
    const session = useSession()
    const user_email = session.data?.user?.email
    const currentUser = useCurrentUser(user_email)

    const toChat = (id: string) => {
        if (currentUser?.id !== id) {
            axios.post("/api/conversation", { otherUserId: id })
                .then((callback) => {
                    router.push("/chat/" + callback.data.id)
                })
        }

    }

    const sortedMembers = useMemo(() => {
        const membersWithoutAdmin = members.filter(member => member.id !== adminId)
        const admin = members.filter(member => member.id === adminId)
        return [...admin, ...membersWithoutAdmin]
    }, [members, adminId])

    return (
        <ul className={`w-full flex flex-col justify-start gap-2 px-1 ${mode ? "h-[40vh] md:h-[50%] overflow-y-scroll" : "px-5"}`}>
            {
                !mode
                    ? <div className="p-[.5px] bg-gray-600"></div>
                    : null
            }
            <h1 className={`flex gap-1 ${mode && "p-[1vh]"} items-center mb-2 sticky top-0 bg-main-bg z-10`}>
                <BsFillPeopleFill className="text-[21px] text-gray-600" />
                <span className="text-gray-400 tex-[12px]">Memebers <span className="text-blue-400 text-[12px]">({members?.length})</span> </span>
            </h1>
            {
                sortedMembers.map(user => {
                    return <li
                        key={user.id}
                        onClick={() => {
                            if (mode) {
                                return null;
                            } else {
                                toChat(user.id);
                            }
                        }}
                        className={clsx(`flex
                            gap-2
                            p-1`,
                            !mode && "hover:scale-105 cursor-pointer"
                        )}>
                        <ImageComponent
                            src={user?.image ? user?.image : "/images/default-profile.jpg"}
                            alt="user_profile"
                            isGroup={false}
                            addedClass="w-[9vh] h-[9vh]"
                        />
                        <div className="flex flex-col w-full">
                            <div className="relative flex w-full gap-3 items-center">
                                <p>{user.email === user_email ? "(You)" : user.name}</p>
                                {
                                    user.id === adminId
                                        ? <p className="bg-blue-400 p-1 rounded-2xl text-[11px]">admin</p>
                                        : mode === "edit"
                                            ? <button
                                                onClick={() => updateMembers("remove", user.id)}
                                                title="remove user"
                                                className="absolute right-1 top-1 bg-red-600 cursor-pointer h-[3vh] w-[3vh] rounded-full flex justify-center items-center"> <TiUserDelete /> </button>
                                            : null
                                }
                            </div>
                            <span className="text-gray-500 text-[12px] text-start">{user.email}</span>
                        </div>
                    </li>
                })
            }
        </ul>
    )
}

export default MembersList