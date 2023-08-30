import { FaUserCircle } from "react-icons/fa";
import clsx from "clsx";
import axios from "axios";
import Image from "next/image";
import { FormEvent } from "react";
import format from "date-fns/format";
import { useState, useEffect, useMemo } from "react";
import { CldUploadButton } from "next-cloudinary";
import { BiPencil, BiSolidUserRectangle } from "react-icons/bi"
import { FaTrash } from "react-icons/fa"
import { CiCalendarDate } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import useCurrentUser from "../hooks/useCurrentUser";
import PopUpModal from "./Modals/PopUpModal";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import DeleteModal from "./Modals/DeleteModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileProps {
  email: string
  isProfile: boolean
  hideProfile: () => void
}

const Profile = ({ hideProfile, email }: ProfileProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const router = useRouter()
  const currentUser = useCurrentUser(email)
  const [name, setName] = useState(currentUser?.name ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");


  const updateProfielCallback = async () => {
    try {
      await axios.put("/api/settings", { name, bio })
        .finally(() => {
          setIsLoading(false)
          hideProfile()
        })
    } catch (error: any) {
      return error
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    toast.promise(
      updateProfielCallback(),
      {
        pending: "loading...",
        success: "Profile Updated Successfully",
        error: "Something went wrong!"
      }
    )
  }

  const handleUplaodImage = (result: any) => {
    axios.put("/api/settings", { isGroup: false, image: result?.info?.secure_url })
      .finally(() => {
        hideProfile()
      })
  }

  const deleteProfile = () => {
    axios.delete("/api/settings").then(() => signOut()).finally(() => router.push("/"))
  }

  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser?.name!)
    }
    if (currentUser?.bio) {
      setBio(currentUser?.bio);
    }
  }, [currentUser])

  const joindAt = useMemo(() => {
    if (currentUser) return format(new Date(currentUser?.createdAt), "PP")
    return undefined
  }, [currentUser])

  return <div
    className={clsx(`
        rounded-md
        text-white 
        profile
        bg-main-bg
        w-[45vw]
        xl:w-[70vw]
        md:w-[80vw]
        sm:w-[98vw]
        sm:h-[98vh]
        transition duration-500
        flex
        flex-col
        justify-between
        sm:justify-normal
        gap-2
        xsm:gap-6
        p-2
    `,
    )}
  >
    <PopUpModal
      isOpen={isModal}
      onClose={() => setIsModal(false)}
    >
      <DeleteModal
        type="Profile"
        action={deleteProfile}
        hideModal={() => setIsModal(false)}
      />
    </PopUpModal>
    <PopUpModal
      onClose={() => setIsImageOpen(false)}
      isOpen={isImageOpen}
      isCloseButton={false}
    >
      <div className="w-[40vh] h-[40vh] sm:w-[50vh] sm:h-[50vh] overflow-hidden rounded-full">
        <Image
          src={currentUser?.image ? currentUser?.image : '/images/default-profile.jpg'}
          alt="user_profile"
          height={100}
          width={100}
          className="rounded-full object-cover w-[100%] h-[100%]"
        />
      </div>
    </PopUpModal>
    <div className="flex items-end gap-1 p-2 px-3">
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-1 text-[13px] sm:text-[15px] font-bold text-gray-600">
          <BiSolidUserRectangle />
          <span>Photo</span>
        </p>
        <div className="w-[10vh] h-[10vh]">
          <Image
            onClick={() => setIsImageOpen(true)}
            src={currentUser?.image ? currentUser?.image : '/images/default-profile.jpg'}
            alt={currentUser?.name ? currentUser?.name : "user_profile"}
            width={150}
            height={150}
            className="rounded-full cursor-pointer w-[100%] h-[100%] delay-75 hover:scale-105"
          />
        </div>
      </div>
      <div className="h-full">
        <CldUploadButton
          options={{ maxFiles: 1, cropping: true }}
          onUpload={handleUplaodImage}
          uploadPreset="bgitn1b8"
          className="self-center m-[1vh] flex items-center gap-1 hover:scale-105"
        >
          <span>Change</span>
          <BiPencil />
        </CldUploadButton>
      </div>

    </div>
    <form onSubmit={(e) => handleSubmit(e)} className="h-full flex flex-col gap-2">
      <div className="flex flex-col gap-2 justify-center w-[100%] px-3 sm:p-1 sm:px-2">
        <div className="w-full flex flex-col gap-1">
          <p className="flex items-center gap-1 text-[13px] sm:text-[13px] font-bold text-gray-600">
            <span>Name</span>
            <BiPencil />
          </p>
          <input
            type="text"
            value={name}
            placeholder="user name"
            onChange={(e) => setName(e.target.value)}
            className="bg-[#80808044] w-[100%] p-2 px-2 sm:p-2 rounded bg-opacity-25 focus:bg-[#80808044]"
            id="name"
            name="name"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <p className="flex items-center gap-1 text-[13px] sm:text-[13px] font-bold text-gray-600">
            <span>Bio</span>
            <BiPencil />
          </p>
          <div className="flex items-center justify-between">
            <input
              onChange={(e) => setBio(e.target.value)}
              type="text"
              className="bg-[#80808044] w-[100%] p-2 px-2 sm:p-2 rounded bg-opacity-25 focus:bg-[#80808044]"
              value={bio}
              placeholder="Add a new bio"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 px-3">
        <div className="flex flex-col gap-1 items-start">
          <p className="text-[13px] sm:text-[16px] font-bold text-gray-600 flex items-center">
            <MdAlternateEmail />
            <span>Email</span>
          </p>
          <p className="text-[15px]">{currentUser?.email ?? <BeatLoader size={10} className="text-white" />}</p>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <p className="text-[13px] sm:text-[16px] font-bold text-gray-600 flex items-center gap-1">
            <CiCalendarDate />
            <span>Joined At</span>
          </p>
          <p className="text-[14px]">{joindAt ?? <BeatLoader size={10} className="text-white" />}</p>
        </div>
      </div>

      <div className="flex justify-between items-center sm:h-[100%] sm:items-end sm:py-1">
        <p className="border-r-5 flex items-center gap-2 p-2 border-l-4 border-blue-400 text-lg sm:hidden">
          <FaUserCircle />
          <span>Profil</span>
        </p>

        <div className="flex gap-1 p-3 sm:py-0 sm:px-1 self-end sm:w-[100%] sm:flex-col sm:justify-end">
          <button className={clsx(`
          p-2
          rounded
          transition-all delay-75
          cursor-pointer
          bg-blue-500
          hover:bg-blue-600 
          `,
            (isLoading) && "!bg-gray-600 !cursor-default hover:!bg-gray-600"
          )}
            type="submit"
            disabled={isLoading}
          >Save Chnages</button>
          <button
            className="bg-red-700 p-2 rounded flex transition-all delay-75 justify-center items-center gap-2 hover:bg-red-800"
            type="button"
            onClick={() => setIsModal(true)}
          >
            <FaTrash />
            <span>Delete This Account</span>
          </button>

        </div>

      </div>
    </form>
  </div>
}

export default Profile