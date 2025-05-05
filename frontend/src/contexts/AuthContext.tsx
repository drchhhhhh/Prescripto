import React, { createContext, useState, useContext } from "react";
import { endpoints } from '../config/config'

// Define types for your context
type User = {
  username: string;
  // Add other user properties as needed
  [key: string]: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleLogout: () => Promise<void>;
};

// Create context with initial value typed
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);

    const handleLogin = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(endpoints.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Login Data: ", data);
            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return true;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Failed: ', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await fetch(endpoints.logout, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } catch (error) {
            console.error("Error Logging Out: ", error instanceof Error ? error.message : 'Unknown error');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const getUserData = async (token: string | null): Promise<string | null> => {
    if (!token) {
        console.error("No Token Found");
        return null;
    }
    try {
        const response = await fetch(endpoints.getUserId, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch user data");
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error instanceof Error ? error.message : 'Unknown error');
        return null;
    }
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};