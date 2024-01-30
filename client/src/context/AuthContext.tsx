import React, { createContext, useState } from "react";
type User = {
    name: string;
 
}

export const AuthContext = createContext<{ user: User } | null>(null);

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({
        name: "Charles"
    });

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};
