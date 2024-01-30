import React, { createContext, useState, ReactNode, useCallback } from "react";

type User = {
    name: string;
}

type AuthContextType = {
    user: User;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); 
    //! Initialize user as null waiting backend and need to add user in AuthContex.Provider! look Vidéo Vidéo 4 Exemple syntaxe : 
    // const [user, setUser] = useState<User>({
    //     name: "Charles",
    // });

    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    console.log("registerInfo", registerInfo)

    const updateRegisterInfo = useCallback((info : any) => {
        setRegisterInfo(info);
    }, [])


    return (
        <AuthContext.Provider value={{
            user, 
            registerInfo, 
            updateRegisterInfo
        }}>

            {children}
        </AuthContext.Provider>
    );
};
