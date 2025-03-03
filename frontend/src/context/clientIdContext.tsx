"use client"; // ✅ Ensure it runs only on the client

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ClientIDContextType {
    clientID: string | null;
}

const ClientIDContext = createContext<ClientIDContextType | null>(null);

export function ClientIDProvider({ children }: { children: React.ReactNode }) {
    const [clientID, setClientID] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            let storedClientID = localStorage.getItem("clientID");
            if (!storedClientID) {
                storedClientID = crypto.randomUUID(); // ✅ Use built-in browser method
                localStorage.setItem("clientID", storedClientID);
            }
            setClientID(storedClientID);
        }
    }, []);

    if (!clientID) return null; // ✅ Prevent rendering before context is set

    return (
        <ClientIDContext.Provider value={{ clientID }}>
            {children}
        </ClientIDContext.Provider>
    );
}

export const useClientID = (): ClientIDContextType => {
    const context = useContext(ClientIDContext);
    if (!context) {
        throw new Error("useClientID must be used within a ClientIDProvider");
    }
    return context;
};
