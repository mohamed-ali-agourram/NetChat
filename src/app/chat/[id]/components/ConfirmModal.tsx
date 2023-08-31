import { GoAlertFill } from "react-icons/go";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import type { Conversation, User } from "@prisma/client";
import { BsPencilSquare } from "react-icons/bs"
import Image from "next/image";
import MembersList from "./MembersList";
import { useState, FormEvent } from "react";
import { AiOutlineCheck } from "react-icons/ai"
import { BsPersonFillAdd } from "react-icons/bs"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import clsx from "clsx";
import { useRouter } from "next/navigation";
import DeleteModal from "@/app/compnents/Modals/DeleteModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConfirmModalProps {
    id: string
    isGroup: boolean
    hideModal: () => void
    mode: string
    chat?: Conversation & { users: User[] }
    handleUplaodImage?: (result: any) => void
    updateMembers: (mode: string, id?: string, newMembers?: string[]) => void
    members: User[]
    contact?: User[]
    currentUser: User
}

const ConfirmModal = ({ id, isGroup, hideModal, mode, chat, members, handleUplaodImage, updateMembers, contact, currentUser }: ConfirmModalProps) => {
    const [groupName, setGroupName] = useState(chat?.name ?? "")
    const [isLoading, setIsLoading] = useState(false)
    const [membersEmails, SetMembersEmails] = useState<string[]>([])
    const router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        axios.put("/api/settings", { isGroup: true, groupName, convoId: chat?.id })
            .finally(() => {
                hideModal()
            })
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleChange = (event: SelectChangeEvent<typeof membersEmails>) => {
        const {
            target: { value },
        } = event;
        SetMembersEmails(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const addMemebers = () => {
        updateMembers("edit", chat?.id, membersEmails)
        hideModal()
        axios.put("/api/settings", { isGroup: true, members: membersEmails, convoId: chat?.id })
            .finally(() => {
                router.refresh()
            })
    }

    const deleteCallback = async () => {
        try {
            await axios.delete(`/api/conversation/${id}`, {
                data: {
                    isGroup
                }
            })
                .then(() => {
                    hideModal()
                    setIsLoading(false)
                    router.refresh();
                    router.push("/chat")
                })
        } catch (error: any) {
            console.error(error.message);
            setIsLoading(false)
            throw error.message;
        }
    }

    const deleteConvo = () => {
        if (id) {
            setIsLoading(true)
            toast.promise(
                deleteCallback(),
                {
                    pending: 'loading...',
                    success: {
                        render() {
                            return <p>{isGroup ? "Group Chat Deleted!" : "Conversation Deleted!"}</p>
                        }
                    },
                    error: {
                        render() {
                            return <p>Something Went Wrong!</p>
                        }
                    }
                }
            )
        }
    }

    return <div className={clsx(`bg-main-bg`,
        mode === "edit" && `flex-col
            justify-start
            items-start
            p-3
            px-4
            gap-2
            w-[50vw] md:w-[90vw] md:h-[90vh] sm:w-[98vw] sm:h-[98vh]
            `
    )}>
        {mode === "edit"
            ? <>
                <h1 className="font-bold text-[25px] flex items-center justify-center gap-2" ><BsPencilSquare /> <span>Edit Group</span></h1>
                <div className="flex items-end p-2 gap-3 w-[100%]">
                    <CldUploadButton
                        options={{ maxFiles: 1 }}
                        onUpload={handleUplaodImage}
                        uploadPreset="bgitn1b8"
                        className={clsx(`
                            mb-1 w-[20%] h-[100%]`,
                            mode === "edit" ? "self-start" : "self-center"
                        )}
                    >
                        <Image
                            src={chat?.groupImage ? chat?.groupImage : "/images/default-group.png"}
                            alt="user_profile"
                            height={100}
                            width={100}
                            className={clsx(`
                                rounded-full
                                cursor-pointer`
                            )}
                        />
                    </CldUploadButton>
                    {
                        mode === "edit"
                            ? <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-3 items-start w-[95%]">
                                <label htmlFor="groupName" className="text-gray-400">Group Name</label>
                                <div className="flex w-full">
                                    <input
                                        id="groupName"
                                        className="rounded-l-lg rounded-bl-lg bg-[#413f3f] focus:bg-[#413f3f] h-[7vh] p-2 mb-2 w-[100%]"
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-r-lg rounded-br-lg bg-[#413f3f] flex justify-end px-2 items-center text-[20px] font-bold h-[7vh] w-[4vw] p-2 cursor-pointer">
                                        <AiOutlineCheck />
                                    </button>
                                </div>

                            </form>
                            : chat?.name
                    }
                </div>
                <MembersList currentUser={currentUser} updateMembers={updateMembers} members={members!} adminId={chat?.adminId!} mode="edit" />
                <ThemeProvider theme={darkTheme}>
                    <InputLabel style={{ display: "flex", gap: "5px", justifyContent: "flex-start", alignItems: "center" }} id="demo-multiple-chip-label">
                        <BsPersonFillAdd className="text-gray-600 text-[20px]" />
                        <span className="text-gray-400 tex-[12px]">Add Members</span>
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        className="w-[100%]"
                        value={membersEmails}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >

                        {
                            contact?.map((user, index) => {
                                const isAlrdyIn = members.find(member => member.id === user.id) !== undefined ? true : false
                                return <MenuItem
                                    disabled={isAlrdyIn}
                                    key={index}
                                    value={user.email as string}
                                >
                                    {user.email}
                                </MenuItem>
                            })
                        }
                    </Select>
                </ThemeProvider>
                <div className="flex gap-1 p-1 justify-end w-full">
                    <button
                        onClick={hideModal}
                        className="cursor-pointer p-3">Cancel</button>
                    <button
                        onClick={addMemebers}
                        className="bg-blue-600 rounded p-3">Submit</button>
                </div>
            </>
            : <DeleteModal
                type="conversation"
                isLoading={isLoading}
                hideModal={hideModal}
                action={deleteConvo}
            />
        }
    </div>
}

export default ConfirmModal