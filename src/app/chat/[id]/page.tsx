import { getConversation } from "@/app/helpers/getConversation"
import { getMessages } from "@/app/helpers/getMessages"
import { getContact } from "@/app/helpers/getContact"
import getUser from "@/app/helpers/getUser"
import Main from "./Main"


interface chatParams {
  id: string
}

const page = async ({ params }: { params: chatParams }) => {
  const chat = await getConversation(params.id)
  const initialMembers = chat?.users
  const admin = await getUser(chat?.adminId)
  const messages = await getMessages(params.id)
  const contact = await getContact()

  return (
    <Main
      admin={admin!}
      chat={chat!}
      contact={contact}
      initialMembers={initialMembers!}
      initialMessages={messages}
    />
  )
}

export default page