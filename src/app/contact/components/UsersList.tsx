"use client"
import type { User } from "@prisma/client"
import UserBox from "./UserBox"
import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/app/libs/pusher"

const UsersList = ({ initailUsers }: { initailUsers: User[] }) => {
  const [users, setUsers] = useState(initailUsers)
  const session = useSession()
  const user_email = useMemo(() => {
    return session.data?.user?.email
  }, [session])

  useEffect(() => {
    if (!user_email) return;

    const handleNew = (newConvo: FullConvoType) => {
      console.log(newConvo);
      if (newConvo.isGroup === false) {
        const usersToAdd = newConvo.users.filter((newUser) => {
          return !users.some((existingUser) => existingUser.id === newUser.id);
        });
    
        const filteredUsers = usersToAdd.filter((newUser) => {
          return newUser.email !== user_email;
        });

        setUsers((prevUsers) => [...prevUsers, ...filteredUsers]);
      }
    };
    

    pusherClient.subscribe(user_email)
    pusherClient.bind("conversation:new", handleNew)

    return () => {
      pusherClient.unsubscribe(user_email)
      pusherClient.unbind("conversation:new", handleNew)
    }
  }, [user_email, users])

  return (
    <div>
      <ul className="flex flex-col gap-1 w-full">
        {
          users.map((user) => {
            return <li key={user.id}>
              <UserBox user={user} />
            </li>
          })
        }
      </ul>
    </div>
  )
}

export default UsersList