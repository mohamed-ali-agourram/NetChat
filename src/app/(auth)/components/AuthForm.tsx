"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Input from "@/app/compnents/inputs/Input";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import clsx from "clsx"
import axios from "axios";
import { FcGoogle } from "react-icons/fc"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FieldValues, SubmitErrorHandler, useForm } from "react-hook-form";

interface AuthFormProps {
    isRegister: boolean
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegister }) => {

    const router = useRouter()
    const session = useSession()
    const [isShowen, setIsShowen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passError, setPassError] = useState(false)

    const {
        register,
        handleSubmit,
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/chat")
        }
    }, [router, session])

    const togglePass = () => {
        setIsShowen(!isShowen)
    }

    const onSubmit: SubmitErrorHandler<FieldValues> = (data) => {
        setLoading(true)
        const id = toast.loading("Please wait...")
        if (isRegister) {
            axios.post("/api/register", data)
                .then(() => {
                    toast.update(id, { render: "Account created!", type: "success", isLoading: false, autoClose: 5000, draggable: true, draggablePercent: 30 });
                    signIn("credentials", {
                        ...data,
                        redirect: false
                    })
                }).catch((error: any) => {
                    setLoading(false)
                    if (error.response) {
                        const errorMessage = error.response.data;
                        switch (errorMessage) {
                            case "Name must be between 3 and 25 characters":
                                setNameError(true)
                                break;
                            case "Invalid Email":
                            case "Email already exists":
                                setEmailError(true)
                                break;
                            case "Password must contains atleast 8 cracters":
                                setPassError(true)
                                break;
                        }
                        toast.update(id, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000, draggable: true, draggablePercent: 30, bodyStyle: { width: "50vw" } })
                    } else {
                        toast.update(id, { render: error.message, type: "error", isLoading: false, autoClose: 5000, draggable: true, draggablePercent: 30 })
                    }
                })
        } else {
            signIn("credentials", {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    setLoading(false)
                    switch (callback?.error) {
                        case "Email is incorrect":
                            setEmailError(true)
                            break;
                        case "Password is incorrect":
                            setPassError(true)
                            break;
                    }
                    toast.update(id, { render: callback?.error, type: "error", isLoading: false, autoClose: 5000, draggable: true, draggablePercent: 30 });
                }

                if (callback?.ok && !callback?.error) {
                    toast.update(id, { render: "Logged In!", type: "success", isLoading: false, autoClose: 5000, draggable: true, draggablePercent: 30 });
                }
            })
        }

    }

    const googleProvider = () => {
        setLoading(true)
        signIn("google", { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged In!!!")
                }
            })
            .finally(() => setLoading(false))
    }

    return <form
        method="post"   
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:gap-2"
    >
        {
            isRegister
            &&
            <Input
                id="name"
                label="Name"
                type="text"
                register={register}
                icon={BsFillPersonVcardFill}
                disabled={loading}
                state={nameError}
                setState={setNameError}
            />
        }
        <Input
            id="email"
            label="Email"
            type="text"
            register={register}
            icon={IoMail}
            disabled={loading}
            state={emailError}
            setState={setEmailError}
        />
        <Input
            id="password"
            label="Password"
            type={isShowen ? "text" : "password"}
            disabled={loading}
            register={register}
            icon={isShowen ? AiFillEyeInvisible : AiFillEye}
            onclick={togglePass}
            state={passError}
            setState={setPassError}
        />

        <div className="flex gap-3 justify-between sm:flex-col-reverse">
            <button
                disabled={loading as boolean}
                type="button"
                className={clsx(`flex items-center justify-center gap-2 bg-white text-black p-3 w-full rounded text-sm text-1x duration-300 sm:p-4 text-[15px] select-none
                `, loading && "disabled")}
                onClick={googleProvider}
            >
                <FcGoogle className="text-2xl" />
                {isRegister ? "Sign Up " : "Sign In "}with Google
            </button>
            <button
                disabled={loading}
                className={clsx(`bg-sky-800 p-3 sm:p-4 text-[15px] w-full rounded text-1xl hover:bg-sky-600 duration-300
                `, loading && "disabled")}
            >
                {
                    isRegister
                        ? "Create an account"
                        : "Login"
                }
            </button>
        </div>
    </form>
}

export default AuthForm