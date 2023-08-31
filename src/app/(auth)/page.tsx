"use client"
import { useState } from "react";
import AuthForm from "./components/AuthForm"
import { AiFillWechat } from "react-icons/ai";

const Home = () => {
    const [isRegister, setIsRegister] = useState(false)

    return (
        <div className="bg-cover bg-center bg-fixed h-screen">
            <main
                style={{ background: "linear-gradient(41deg, rgba(39,42,55,0.9752275910364145) 40%, rgba(39,42,55,0.3449754901960784) 100%)" }}>
                <div className="h-screen flex flex-col text-white w-[41.5%] lg:w-[75%] sm:w-[100%]">
                    <header className="font p-8 lg:py-3 flex gap-1 content-center text-3xl sm:self-center">
                        <AiFillWechat style={{ color: "#075985" }} />
                        <span>NetChat</span>
                    </header>

                    <div className="p-7 lg:py-5 sm:p-2 flex flex-col gap-5">

                        <div className="flex flex-col text-start gap-5 sm:gap-1 sm:text-center">
                            <p className="text-gray-500 font-bold text-3xl sm:text-xl">Chat With The World!</p>
                            <h1 className="text-5xl sm:text-2xl font-bold">
                                {
                                    isRegister
                                        ? <span>Create a new account</span>
                                        : <span>Login to your account</span>
                                }
                            </h1>

                            <div className="flex gap-1 justify-start sm:justify-center">
                                <p className="text-gray-500 font-bold">
                                    {
                                        isRegister
                                            ? "Alraedy Have an Acoount?"
                                            : "Dont Have an Acoount?"
                                    }
                                </p>


                                <button
                                    className="text-sky-800 font-bold"
                                    onClick={() => setIsRegister(!isRegister)}
                                >{isRegister ? "LogIn" : "Regitser"}</button>
                            </div>

                        </div>
                            <AuthForm isRegister={isRegister} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home