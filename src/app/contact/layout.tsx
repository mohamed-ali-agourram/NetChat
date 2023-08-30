import type { Metadata } from 'next'
import Wrapper from '../compnents/Sidebar/Wrapper'
import UsersList from './components/UsersList'
import { getContact } from '../helpers/getContact'
import { getUnreadMessages } from '../helpers/getUnreadMessages'


export const metadata: Metadata = {
    title: 'Freinds',
    description: 'NetChat Messaging app',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const contact = await getContact()
    const unreadMessages = await getUnreadMessages()
    
    return (
        <Wrapper dataLength={unreadMessages.length} data={contact} content={<UsersList users={contact}/>}>
            {children}
        </Wrapper>
    )
}
