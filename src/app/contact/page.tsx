import { AiFillWechat } from "react-icons/ai"

const HomePage = () => {
  return <main className="h-screen w-full bg-main-bg flex flex-col gap-2 items-center justify-center">
    <div className="text-[25vh]">
      <AiFillWechat />
    </div>
    <h1 className="font text-2xl font-bold">Select a user to start a conversation</h1>
  </main>

}

export default HomePage