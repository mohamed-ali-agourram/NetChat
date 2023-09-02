"use client"
import { FormEvent } from "react"
import { RiSendPlane2Fill } from "react-icons/ri"
import { FaImages } from "react-icons/fa";
import axios from "axios"
import { useState } from "react"
import { CldUploadButton } from "next-cloudinary";

const Form = ({ id }: { id: string }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message) {
      axios.post("/api/messages", { body: message, convoId: id })
      setMessage("")
    }
  }

  const handleImageUpload = (result: any) => {
    axios.post("/api/messages", { image: result?.info?.secure_url, convoId: id })
  }

  return (
    <div
      className="flex justify-around items-center w-full h-[8.5vh] md:h-[8vh] sm:h-[7vh] my-2 px-3 gap-2">
      <CldUploadButton
        className="w-[5%] sm:w-[6%] flex items-center justify-center text-2xl"
        options={{ maxFiles: 1 }}
        onUpload={handleImageUpload}
        uploadPreset="bgitn1b8"
      >
        <FaImages />
      </CldUploadButton>
      <form onSubmit={(e) => handleSubmit(e)} className="flex w-full gap-1">
        <input
          type="text"
          placeholder="type somthing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-second-bg focus:bg-second-bg h-full border-1 border-blue-950 rounded-md p-4 sm:p-3 xsm:p-2 w-[100%]"
        />
        <button
          className="w-[5%] sm:w-[6%] flex items-center justify-center text-2xl"
          type='submit'
        ><RiSendPlane2Fill /></button>
      </form>
    </div>
  )
}

export default Form