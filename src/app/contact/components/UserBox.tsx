"use client"
import { useState } from "react"
import Image from "next/image"
import type { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import axios from "axios"
import Spinner from "@/app/compnents/Spinner"
import ImageComponent from "@/app/compnents/ImageComponent"
import useActiveList from "@/app/hooks/useActiveList"

const UserBox = ({ user, isSearch }: { user: User, isSearch?: boolean }) => {
  const { members } = useActiveList()
  const isActive = members.includes(user?.email!)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const toChat = () => {
    setIsLoading(true)
    axios.post("/api/conversation", { otherUserId: user.id })
      .then((callback) => {
        router.push("/chat/" + callback.data.id)
      }).finally(() => setIsLoading(false))
  }

  return (
    <>
      {
        isLoading
        && <Spinner />
      }
      <div
        onClick={toChat}
        className="flex gap-2 items-start p-3 rounded-xl cursor-pointer hover:bg-[#0000003d] transition delay-[5ms]">
        <ImageComponent
          src={user?.image!}
          alt={user?.name!}
          isGroup={false}
        />
        <div className="flex flex-col items-start w-full">
          <p>{user?.name}</p>
          {
            isSearch
              ? <p className="text-gray-600 font-bold text-sm">{user.email}</p>
              : <p className="text-gray-600 font-bold text-sm">{isActive ? "Online" : "Oflline"}</p>
          }

        </div>

      </div>
    </>

  )
}

export default UserBox