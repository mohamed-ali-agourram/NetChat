import { usePathname } from "next/navigation";

const useCoversation = () => {
    const pathname = usePathname().split("/")
    const convoId = pathname[pathname.length - 1]
    if(convoId.includes("chat")) return null
    return convoId
}

export default useCoversation