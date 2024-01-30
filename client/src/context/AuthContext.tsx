import React, { createContext, useState, ReactNode } from "react";

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
    const [user, setUser] = useState<User>({
        name: "Charles",
    });

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};
