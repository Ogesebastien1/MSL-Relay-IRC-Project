import React, { createContext, useState, ReactNode, useCallback } from "react";
import { baseUrl, postRequest } from "../utils/services";

type User = {
    name: string;
}

type RegisterInfoType = {
    name: string;
    email: string;
    password: string;
};

type ErrorResponse = {
    error: any;
    message: string;
};


type AuthContextType = {
    user: User | null;
    registerInfo: { 
        name: string; 
        email: string; 
        password: string; 
    };
    updateRegisterInfo: (info: RegisterInfoType) => void;
    registerUser: (e: any) => Promise<void>;
    registerError: ErrorResponse | null;
    isRegisterLoading: boolean;
};

const defaultAuthContext: AuthContextType = {
    user: {name: ""},
    registerInfo: { name: "", email: "", password: "" },
    updateRegisterInfo: () => {},
    registerUser: async () => {},
    registerError: null,
    isRegisterLoading: false
};

interface AuthContextProviderProps {
    children: ReactNode;
}
  
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); 
    const [registerError, setRegisterError] = useState<ErrorResponse | null>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState<RegisterInfoType>({
        name: "",
        email: "",
        password: "",
    });

    console.log("registerInfo", registerInfo)

    const updateRegisterInfo = useCallback((info: RegisterInfoType) => {
        setRegisterInfo(info);
    }, []);

    // using callback to optimize the function(do not re-render the function unless updating)
    const registerUser = useCallback(async(e: any)=>{
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

        // registration process is finished
        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }

        // if no error ...
        // saving user in the local storage to not have to login again
        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);

    }, [registerInfo])

    return (
        <AuthContext.Provider value={{
            user, 
            registerInfo, 
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
