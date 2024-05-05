"use client"
import { useEffect, useState, useMemo, MutableRefObject } from "react"
import clsx from "clsx"
import Image from "next/image"
import format from "date-fns/format"
import { Message, User } from "@prisma/client"
import { IoCheckmarkDoneOutline } from "react-icons/io5"
import { useSession } from "next-auth/react"
import PopUpModal from "@/app/compnents/Modals/PopUpModal"
import ImageComponent from "@/app/compnents/ImageComponent"

interface MessageProps {
  author: string
  message: Message & { sender: User, seen: User[], conversation: { isGroup: boolean | null } }
  isCurrentUser: boolean
  isLast?: boolean
  isGroup?: boolean
  lastMessageRef: MutableRefObject<HTMLParagraphElement | null>
}

const Message = ({
  author,
  message,
  isCurrentUser,
  isLast,
  isGroup,
  lastMessageRef
}: MessageProps) => {
  const [isSeen, setIsSeen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const session = useSession()
  const user_email = session.data?.user?.email

  useEffect(() => {
    const seenArray = message.seen.filter(user => user.email !== user_email);
    if (seenArray.length > 0 && message.sender.email === user_email) {
      setIsSeen(true);
    }
  }, [message, message.seen, user_email]);



  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lastMessageRef]);

  return (
    <li
      className={clsx(`
      flex
      gap-2
      justify-end
    `,
        !isCurrentUser && "flex-row-reverse"
      )}>
      <div
        title={isSeen ? "Seen" : ''}
        className={clsx(`flex
      flex-col
      gap-1
      `,
          isCurrentUser && "items-end"
        )}>
        <p className="text-[13px] sm:text-[11.5px]">{!isCurrentUser && author}</p>
        <div className="relative">
          {
            message.image
              ? <div className="sm:max-w-[65vw]">
                <Image
                  onClick={() => setIsOpen(true)}
                  src={message.image}
                  alt={message.sender.name!}
                  width={288}
                  height={288}
                  className="object-cover cursor-pointer hover:scale-[102%] transition translate rounded"
                />
                <PopUpModal
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                >
                  <Image
                    src={message.image}
                    alt={message.sender.name!}
                    width={288}
                    height={288}
                    className="object-cover transition translate rounded"
                  />
                </PopUpModal>
              </div>
              : <p
                className={clsx(`
              p-4
              sm:p-3
              w-fit
              rounded-3xl
              max-w-[30vw]
              md:max-w-[40vw]
              sm:max-w-[65vw]
              sm:text-[12.5px]
              break-words
              `,
                  isCurrentUser ? "rounded-tr-none bg-blue-400" : "rounded-tl-none bg-second-bg"
                )}>{message.body}
              </p>
          }
          {isSeen
            ?
            isGroup
              ? <ul
                onMouseEnter={() => setIsModal(true)}
                onMouseLeave={() => setIsModal(false)}
                className="flex relative gap-1 justify-end items-center p-1">
                {
                  isModal
                    ? <div className="absolute top-1 right-[80%] w-fit text-[12px] flex flex-col gap-2 bg-[#000000c7] rounded-md p-2 z-10">
                      {
                        message.seen.filter(user => user.email !== user_email).map(user => {
                          return <p className="whitespace-nowrap" key={user.id} >{user.name}</p>
                        })
                      }
                    </div>
                    : null
                }
                {
                  message.seen.filter(user => user.email !== user_email).length > 3
                    ? <li
                      className="bg-[#504e4e] flex justify-center items-center rounded-full w-[2.5vh] h-[2.5vh] text-[9px] cursor-pointer hover:scale-105">
                      + {(message.seen.filter(user => { user.email !== user_email }).length - 3)}
                    </li>
                    : null
                }

                {message.seen.filter(user => user.email !== user_email).slice(0, 3).map(user => {
                  return <li key={user.id} title={user.name!} className="text-[10px]">
                    <Image
                      src={user.image ? user.image : "/images/default-profile.jpg"}
                      alt="user_profile"
                      height={50}
                      width={50}
                      className="rounded-full w-[2.5vh] h-[2.5vh]"
                    />
                  </li>
                })
                }
              </ul>
              : <span className="absolute -right-1 -bottom-1 text-[22px]"><IoCheckmarkDoneOutline /></span>
            : null}
        </div>


        <p ref={isLast ? lastMessageRef : null} className="text-[10px] text-gray-500">{format(new Date(message.createdAt), 'Pp')}</p>
      </div>

      {/* <div className="w-[4vw] md:!w-[6vw] sm:!w-[10vw] h-[4vw] md:!h-[6vw] sm:!h-[10vw]"> */}
        <ImageComponent
          src={message?.sender.image ? message?.sender.image : "/images/default-profile.jpg"}
          alt="profile_iamge"
          isGroup={false}
          divClass="w-[4vw] md:!w-[6vw] sm:!w-[10vw] h-[4vw] md:!h-[6vw] sm:!h-[10vw]"
          addedClass={isCurrentUser ? "order-2" : ''}
          user={message.sender}
        />
        {/* <Image
          src={message?.sender.image ? message?.sender.image : "/images/default-profile.jpg"}
        alt="profile_iamge"
        width={100}
        height={100}
        className={clsx(`
            rounded-full
            w-full
            `,
          isCurrentUser && "order-2"
        )}
        /> */}
      {/* </div> */}
    </li>
  )
}

export default Message