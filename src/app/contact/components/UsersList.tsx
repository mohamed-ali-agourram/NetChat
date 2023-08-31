import type { User } from "@prisma/client"
import UserBox from "./UserBox"

const UsersList = ({ users }: { users: User[] }) => {

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