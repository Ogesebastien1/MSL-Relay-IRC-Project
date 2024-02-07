import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

interface User {
    _id: string;
    name: string;
}  

export const useFetchRecipientUser = (chat: { members: string[]; }, user: { _id: string; }) => {
    const [recipientUser, setRecipientUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const recipientId = chat?.members.find((id: string) => id !==user?._id);

    useEffect(()=>{
        const getUser = async() =>{
            if(!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if(response.error){
                return setError(error);
            }

            setRecipientUser(response);

        };

        getUser()
    }, [])

 return{recipientUser};

}; 

    
