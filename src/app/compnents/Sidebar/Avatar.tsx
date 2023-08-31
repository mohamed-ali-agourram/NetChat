"use client"
import Image from "next/image"
import type { User } from "@prisma/client"
import { useEffect, useState } from "react"

interface AvatarProps{
    showProfile: ()=>void
    currentUser: User
}

const Avatar = ({ showProfile, currentUser }: AvatarProps) => {
    return (
        <div onClick={showProfile} title={currentUser?.name!} className="text-white my-2 mx-1 cursor-pointer rounded-fulL w-[8.5vh] h-[8.5vh] relative md:order-first md:hidden">
            <Image
                src={currentUser?.image ? currentUser?.image : "/images/default-profile.jpg"}
                alt={currentUser?.name ? currentUser?.name : "user_image"}
                width={100}
                height={100}
                className="rounded-full w-full h-full"
            />
            <div className="absolute w-3 h-3 p-[1px] bg-white rounded-full right-0 bottom-1">
                <div className="bg-green-700 w-full h-full rounded-full"></div>
            </div>
        </div>
    )
}

export default Avatar