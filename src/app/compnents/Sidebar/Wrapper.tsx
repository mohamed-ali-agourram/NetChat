"use client"
import NavigationBar from "./NavigationBar"
import SideBar from "./SideBar"
import { useEffect, useState } from "react";
import Profile from "../Profile";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import PopUpModal from "../Modals/PopUpModal";

interface WrapperProps {
  children: React.ReactNode
  content?: React.ReactNode
  data?: any
  dataLength: number
  contact?: User[]
}

const Wrapper = ({ children, content, data, dataLength, contact }: WrapperProps) => {
  const [isProfile, setIsProfile] = useState(false)
  const session = useSession()
  const pathname = usePathname()

  const isOpen = useMemo(() => {
    return !!pathname.match(/^\/chat\/[^/]+$/);
  }, [pathname])


  const user = useMemo(() => session?.data?.user, [session])

  const showProfile = () => {
    setIsProfile(true)
  }

  const hideProfile = () => {
    setIsProfile(false)
  }

  return (
    <main className="flex h-screen w-screen relative overflow-hidden z-0 md:flex-col">

      <div className={clsx(`
      flex
      md:flex-col-reverse`,
        isOpen ? "md:hidden" : "md:flex"
      )}>
        <NavigationBar dataLength={dataLength} user={user as User} showProfile={showProfile} />
        <SideBar contact={contact} data={data} content={content} />
      </div>

      <PopUpModal
        isOpen={isProfile}
        onClose={() => setIsProfile(false)}
        isCloseButton={true}
      >
        <Profile
          email={user?.email as string}
          isProfile={isProfile}
          hideProfile={hideProfile}
        />
      </PopUpModal>

      <div className="w-[80vw] h-screen">
        {children}
      </div>
    </main>
  )
}

export default Wrapper