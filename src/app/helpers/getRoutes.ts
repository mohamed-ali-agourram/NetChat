import { signOut } from "next-auth/react"
import { BiSolidMessageDetail } from "react-icons/bi"
import { MdOutlineLogout, MdPeopleAlt } from "react-icons/md"
import { CgProfile } from "react-icons/cg"

export default function getRoutes(pathname: string) {
    const routes = [
        {
            name: "chat",
            href: "/chat",
            icon: BiSolidMessageDetail,
            active: pathname.includes("/chat")
        },
        {
            name: "Contact",
            href: "/contact",
            icon: MdPeopleAlt,
            active: pathname === "/contact"
        },
        {
            name: "Profile",
            href: "#",
            icon: CgProfile
        },
        {
            name: "logout",
            href: "#",
            icon: MdOutlineLogout,
            onClick: () => signOut()
        }
    ]
    return routes
}