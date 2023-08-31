import Wrapper from '../compnents/Sidebar/Wrapper'
import { getConversations } from '../helpers/getConversations'
import ConversationsList from './components/ConversationsList'
import { getUnreadMessages } from '../helpers/getUnreadMessages'
import { getContact } from '../helpers/getContact'
import getCurrentUser from "@/app/helpers/getCurrentUser"

export async function generateMetadata() {
  const unreadMessages = await getUnreadMessages()
  return {
    title: unreadMessages.length > 0 ? `Messages (${unreadMessages.length})` : "Messages",
    description: 'NetChat Messaging app'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const conversations = await getConversations()
  const unreadMessages = await getUnreadMessages()
  const contact = await getContact()
  const currentUser = await getCurrentUser()

  return (
    <Wrapper
      currentUser={currentUser!}
      contact={contact}
      dataLength={unreadMessages.length}
      data={unreadMessages}
      content={<ConversationsList initialConversations={conversations} currentUser={currentUser!} />}
    >
      {children}
    </Wrapper>
  )
}
