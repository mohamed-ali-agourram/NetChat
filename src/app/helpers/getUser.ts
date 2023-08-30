import prisma from "@/app/libs/prisma";

const getUser = async (id: string | null | undefined) => {

    try {
        if(id){
            const users = await prisma.user.findUnique({
                where: {id}
            });

            return users;            
        }

    } catch (error: any) {
        return null;
    }
};

export default getUser;