"use client"
import { useState, FormEvent } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import clsx from "clsx";
import type { User } from "@prisma/client";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GroupModalProps {
    hideModal: () => void
    data?: User[]
}

const GroupModal = ({ hideModal, data }: GroupModalProps) => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [membersIds, SetMembersIds] = useState<string[]>([])

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

    const handleChange = (event: SelectChangeEvent<typeof membersIds>) => {
        const {
            target: { value },
        } = event;
        SetMembersIds(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const callbackFunction = async ()=>{
        try{
            await axios.post("/api/conversation", { name: name, members: membersIds, isGroup: true })
            .then(()=>{
                setName("")
                SetMembersIds([])
                setIsLoading(false)
                hideModal()
            })
        }catch(error: any){
            console.error(error);
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (name && membersIds.length > 1) {
            setIsLoading(true)
            toast.promise(
                callbackFunction(),
                {
                    pending: 'loading...',
                    success: "Group Chat Created!",
                    error:"Something Went Wrong!"
                }
            )
        }

    }

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className="min-h-[60vh] w-[40vw] md:w-[60vw] sm:w-[90vw] sm:h-[90vh] p-[2vh] flex flex-col justify-between items-start gap-3 bg-main-bg text-start"
        >
            <div className="flex flex-col items-start">
                <h1 className="text-[25px]">Start a Group Conversation</h1>
                <p className="text-gray-500">Initiate a chat with three or more participants</p>
            </div>
            <div className="flex flex-col items-start gap-1 w-full">
                <label htmlFor="name">Group Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border w-full rounded border-gray-500 p-2 bg-main-bg focus:bg-main-bg focus:border-blue-400"
                />
            </div>
            <div className="flex flex-col w-full !text-white">
                <ThemeProvider theme={darkTheme}>
                    <InputLabel id="demo-multiple-chip-label">Group Members</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={membersIds}
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
                        {data?.map((user, index) => (
                            //@ts-ignore
                            <MenuItem
                                key={index}
                                value={user.email}
                            >
                                {user.email}
                            </MenuItem>
                        ))}
                    </Select>
                </ThemeProvider>
            </div>

            <div className="flex w-full justify-end gap-2">
                <button
                    onClick={hideModal}
                    className={clsx(`
                    rounded
                    transition-all delay-75
                    p-2`,
                        isLoading ? "bg-loading cursor-default" : "bg-main-bg cursor-pointer"
                    )}
                    disabled={isLoading}
                    type="button">
                    Cancel
                </button>
                <button
                    className={clsx(`
                    rounded
                    transition-all delay-75
                    p-2`,
                        isLoading ? "bg-loading cursor-default" : "bg-blue-600 cursor-pointer"
                    )}
                    disabled={isLoading}
                    type="submit">
                    Create Group
                </button>
            </div>

        </form>
    )
}

export default GroupModal