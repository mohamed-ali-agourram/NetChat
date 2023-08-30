import Link from "next/link"
import clsx from "clsx"

type Route = {
    href: string
    name: string
    icon: string
    active?: boolean
    onClick?: () => void
}

interface NavItemProps {
    route: Route,
    showProfile: () => void
    dataLength?: number
}

const NavItem = ({ route, showProfile, dataLength }: NavItemProps) => {
    const { href, onClick, icon: Icon, active, name } = route
    return (
        <li
            onClick={() => {
                if (onClick) return onClick()
                if (name === "Profile") return showProfile()
            }}
            title={name}
            className={clsx(`
            text-2xl
            cursor-pointer
            w-full
            text-gray-500
            border-r-4
            border-transparent
            hover:border-blue-400
            hover:text-blue-400
            flex
            items-center
            justify-center
            md:border-none
        `,
                active && 'border-r-4 !border-blue-400 !text-blue-400 md:bg-[#0000005b]',
                name === "Profile" && "hidden md:flex"
            )}
        >
            <Link className="w-full flex justify-center py-2" href={href}>
                <div className="relative">
                    <Icon />
                    { dataLength && dataLength > 0 ? <div className="absolute bg-red-600 text-[10px] p-2 flex justify-center items-center h-[2vh] w-[2vh] -right-2 -top-1 text-white rounded-full">{dataLength}</div> : null }
                </div>
    
            </Link>
        </li>

    )
}

export default NavItem