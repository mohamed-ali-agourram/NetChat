import Main from "./Sidebar/Wrapper"
import { AiFillWechat } from "react-icons/ai"

const loading = () => {
    return (
        <Main>
            <main className="bg-main-bg flex flex-col gap-2 items-center justify-center w-[85%]">
                <div className="text-[25vh]">
                    <AiFillWechat />
                </div>
                <h1 className="text-2xl font-bold">Select a user to start a conversation</h1>
            </main>
        </Main>
    )
}

export default loading