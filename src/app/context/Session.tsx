"use client"
import { SessionProvider } from "next-auth/react"

interface SessionProps {
    children: React.ReactNode
}

const Session = ({
    children
}: SessionProps) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default Session