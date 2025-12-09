import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('ok_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (username, password) => {
        // Simulation of login logic based on legacy code
        // In a real app, this would be an API call
        let role = null;
        let id = null;

        if (username === 'admin' && password === 'admin') {
            role = 'admin';
            id = 'admin-1';
        } else if (username === 'atendente' && password === '123') {
            role = 'atendente';
            id = 'atendente-1';
        } else if (username === 'motoboy' && password === '123') {
            role = 'motoboy';
            id = 'motoboy-1';
        } else if (username === 'lojista' && password === '123') {
            role = 'lojista';
            id = 'lojista-1';
        }

        if (role) {
            const userData = { id, username, role, name: username.charAt(0).toUpperCase() + username.slice(1) };
            setUser(userData);
            localStorage.setItem('ok_user', JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ok_user');
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'ok_user') {
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
