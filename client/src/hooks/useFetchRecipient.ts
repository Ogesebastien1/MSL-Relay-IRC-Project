import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

interface User {
    _id: string;
    name: string;
}

interface Chat {
    _id: string;
    members: string[];
    name: string;
}

export const useFetchRecipientUser = (chat: Chat | null | undefined, user: User | null) => {
    const [recipientUser, setRecipientUser] = useState<User | null>(null);
    const [err, setError] = useState<string | null>(null);

    const recipientId = chat?.members.find((id: string) => id !==user?._id);

    useEffect(()=>{
        const getUser = async() =>{
            if(!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            // if(response.status !== 200){
            //     return setError(err);
            // }

            setRecipientUser(response);

        };

        getUser()
    }, [recipientId])

 return{recipientUser};

}; 

    
