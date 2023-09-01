"use client"
import NavigationBar from "./NavigationBar"
import SideBar from "./SideBar"
import { useState } from "react";
import Profile from "../Profile";
import { useMemo } from "react";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import PopUpModal from "../Modals/PopUpModal";

interface WrapperProps {
  children: React.ReactNode
  content?: React.ReactNode
  data?: any
  dataLength?: number
  contact?: User[]
  currentUser?: User
}

const Wrapper = ({ children, content, data, dataLength, contact, currentUser }: WrapperProps) => {
  const [isProfile, setIsProfile] = useState(false)
  const pathname = usePathname()

  const isOpen = useMemo(() => {
    return !!pathname?.match(/^\/chat\/[^/]+$/);
  }, [pathname])

  const showProfile = () => {
    setIsProfile(true)
  }

  const hideProfile = () => {
    setIsProfile(false)
  }

  return (
    <main className="flex h-[100dvh] w-screen relative overflow-hidden z-0 md:flex-col">

      <div className={clsx(`
      flex
      md:flex-col-reverse`,
        isOpen ? "md:hidden" : "md:flex"
      )}>
        <NavigationBar dataLength={dataLength!} currentUser={currentUser!} showProfile={showProfile} />
        <SideBar contact={contact} data={data} content={content} />
      </div>

      <PopUpModal
        isOpen={isProfile}
        onClose={() => setIsProfile(false)}
        isCloseButton={true}
      >
        {
          currentUser
            ? <Profile
              isProfile={isProfile}
              hideProfile={hideProfile}
              currentUser={currentUser}
            />
            : null
        }

      </PopUpModal>

      <div className="w-[80vw] h-screen">
        {children}
      </div>
    </main>
  )
}

export default Wrapper