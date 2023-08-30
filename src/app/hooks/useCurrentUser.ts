import { User } from "@prisma/client";
import getCurrentUser from "../helpers/getCurrentUser_F";
import { useMemo, useEffect, useState } from "react";

const useCurrentUser = (user_email :string | null | undefined) => {
    const [ currentUser, setCurrentUser ] = useState<User | undefined>()

    const currentUserCallback = useMemo(() => {
        if (user_email) {
            return getCurrentUser(user_email);
        }
        return null;
    }, [user_email]);

    useEffect(() => {
        if (currentUserCallback) {
            currentUserCallback.then(callback => {
               setCurrentUser(callback)
            });
        }
    }, [currentUserCallback]);

    return currentUser;
}

export default useCurrentUser