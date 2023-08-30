import { useMemo } from "react"
import { AiFillWechat } from "react-icons/ai";
import getRoutes from "@/app/helpers/getRoutes";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import Link from "next/link";
import Avatar from "./Avatar";
import type { User } from "@prisma/client";

interface NavigationBarProps {
    showProfile: () => void
    user: User
    dataLength: number
}

const NavigationBar = ({ showProfile, user, dataLength }: NavigationBarProps) => {
    const pathname = usePathname()
    const routes = useMemo(() => getRoutes(pathname!), [pathname])

    return (
        <nav className="flex flex-col relative items-center justify-between bg-main-bg box-shadow w-[6vw] xl:w-[8vw] md:w-screen md:h-[10vh] md:flex-row">

            <div className="w-full flex flex-col md:h-full">
                <Link href="/chat" className="flex justify-center text-4xl text-white text-center py-5 cursor-pointer md:hidden">
                    <AiFillWechat />
                </Link>
                <ul className="w-full flex flex-col gap-5 md:flex-row h-full md:gap-0">
                    {routes.map(route => {
                        return <NavItem dataLength={ route.name === "chat" ? dataLength : undefined}  key={route.name} showProfile={showProfile} route={route} />
                    })}
                </ul>                
            </div>
            
            <Avatar user={user as User} showProfile={showProfile} />
        </nav>
    )
}

export default NavigationBar