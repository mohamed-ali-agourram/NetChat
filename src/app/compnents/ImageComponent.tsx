import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import { User } from "@prisma/client";

interface Props {
    src: string
    alt: string
    isGroup: boolean
    addedClass?: string
    divClass?: string
    user?: User
}

const ImageComponent = ({ src, alt, isGroup, addedClass, divClass, user }: Props) => {
    const { members } = useActiveList()
    const isActive = members.includes(user?.email!)

    return <div className="relative h-fit flex">
        <div className={`
        relative rounded-full inline-block overflow-hidden
        ${divClass
            ? divClass
            : "w-[9vh] max-h-[9vh] sm:max-h-[7vh] sm:w-[8vh]"

        }
        ${addedClass ? addedClass : ''}`
    }>
            <Image
                src={src ? src : (isGroup ? "/images/default-group.png" : "/images/default-profile.jpg")}
                alt={alt ? alt : (isGroup ? "group-profile" : "user-profile")}
                width={150}
                height={150}
                className="rounded-full cursor-pointer object-cover w-[100%] h-[100%]"
            />            
        </div>

        {
            isActive
                ? <div className="absolute w-3 h-3 p-[1px] bg-white rounded-full right-0 bottom-[3px]">
                    <div className="bg-green-700 w-full h-full rounded-full"></div>
                </div>
                : null
        }

    </div>
}

export default ImageComponent