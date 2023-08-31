import getCurrentUser from "@/app/helpers/getCurrentUser"
import prisma from "@/app/libs/prisma"
import { NextResponse } from "next/server"

export async function DELETE() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser?.id) return NextResponse.json("Unauthorized", { status: 401 })

        const profile = await prisma.user.findUnique({
            where: {
                id: currentUser.id
            }
        })

        if (!profile) return NextResponse.json("Profile Not Found!", { status: 100 })

        const deletedProfile = await prisma.user.delete({
            where: {
                id: profile.id
            }
        })

        return NextResponse.json({ deletedProfile })
    } catch (error: any) {
        return NextResponse.json(`Internal Error ${error}`, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser?.id) return NextResponse.json("Unauthorized", { status: 401 })

        const req_body = await request.json()
        const { name, bio, image, groupName, removedUserId, members, isGroup, convoId } = req_body

        if (isGroup) {
            const convo = await prisma.conversation.findUnique({
                where: {
                    id: convoId
                }
            })

            if (!convo) return NextResponse.json("InvalidId", { status: 404 })

            if (convo.adminId === currentUser.id) {
                const updated_conversation = await prisma.conversation.update({
                    where: {
                        id: convo.id
                    },
                    data: {
                        groupImage: image,
                        name: groupName,
                        users: {
                            disconnect: removedUserId ? [{ id: removedUserId }] : [],
                            connect: members?.map((email: string) => ({ email }))
                        }
                    },
                    include: {
                        users: true
                    }
                })

                return NextResponse.json(updated_conversation)
            }

            return NextResponse.json("Unauthorized", { status: 401 })
        }

        const updated_profile = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                image,
                name,
                bio
            }
        })

        return NextResponse.json(updated_profile)
    } catch (error: any) {
        return NextResponse.json(`Internal Error ${error}`, { status: 500 })
    }
}