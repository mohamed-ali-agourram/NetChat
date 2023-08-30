import { usePathname } from "next/navigation";

const useCoversation = () => {
    const pathname = usePathname();
    
    if (pathname === null) {
        return null;
    }

    const splitPath = pathname.split("/");
    const convoId = splitPath[splitPath.length - 1];

    if (convoId.includes("chat")) {
        return null;
    }
    
    return convoId;
}

export default useCoversation;
