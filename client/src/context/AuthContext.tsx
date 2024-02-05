import React, { createContext, useState, ReactNode, useCallback, useEffect } from "react";
import { baseUrl, postRequest } from "../utils/services";

type User = {
    name: string;
}

type RegisterInfoType = {
    name: string;
    email: string;
    password: string;
};

type loginInfoType = {
    email: string;
    password: string;
    name: string;
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
    logoutUser: () => void;
    loginInfo: {
        email: string;
        password: string;
        name: string;
    };
    loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; 
    loginError: ErrorResponse | null;
    updateLoginInfo: (info: loginInfoType) => void; 
    isLoginLoading: boolean; 
    
};

const defaultAuthContext: AuthContextType = {
    user: {name: ""},
    registerInfo: { name: "", email: "", password: "" },
    updateRegisterInfo: () => {},
    registerUser: async () => {},
    registerError: null,
    isRegisterLoading: false,
    logoutUser: () => {},
    loginInfo: {email: "", password: "", name: "" },
    loginUser: async () => {},
    loginError: null,
    updateLoginInfo: () => {},
    isLoginLoading: false,
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

    const [loginError, setLoginError] = useState<ErrorResponse | null>(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState<loginInfoType>({
        email: "",
        password: "",
        name: ""
    });

    useEffect(()=>{
        const userString  = localStorage.getItem("user");

        if (userString ) {
            const userObject = JSON.parse(userString);
            setUser(userObject);
        }
    }, []);

    const updateRegisterInfo = useCallback((info: RegisterInfoType) => {
        setRegisterInfo(info);
    }, []);

    const updateLoginInfo = useCallback((info: loginInfoType) => {
        setLoginInfo(info);
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

    }, [registerInfo]
    );

    const loginUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        setIsLoginLoading(true)
        setLoginError(null)

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        
        setIsLoginLoading(false)

        if(response.error){
            return setLoginError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);

    },[loginInfo])



    const logoutUser = useCallback(()=>{
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user, 
            registerInfo, 
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginUser,
            loginError,
            loginInfo,
            updateLoginInfo,
            isLoginLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
