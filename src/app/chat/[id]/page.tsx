import { getConversation } from "@/app/helpers/getConversation"
import { getMessages } from "@/app/helpers/getMessages"
import { getContact } from "@/app/helpers/getContact"
import getUser from "@/app/helpers/getUser"
import Main from "./Main"
import getCurrentUser from "@/app/helpers/getCurrentUser"

interface chatParams {
  id: string
}

const page = async ({ params }: { params: chatParams }) => {
  const chat = await getConversation(params.id)
  const initialMembers = chat?.users
  const admin = await getUser(chat?.adminId)
  const messages = await getMessages(params.id)
  const contact = await getContact()
  const currentUser = await getCurrentUser()

  return (
    <Main
      currentUser={currentUser!}
      admin={admin!}
      chat={chat!}
      contact={contact}
      initialMembers={initialMembers!}
      initialMessages={messages}
    />
  )
}

export default page