import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated && user && user.role) {
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'atendente') return <Navigate to="/atendente" />;
        if (user.role === 'motoboy') return <Navigate to="/motoboy" />;
        if (user.role === 'lojista') return <Navigate to="/lojista" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(username, password);
        if (success) {
            if (username === 'admin') navigate('/admin');
            else if (username === 'atendente') navigate('/atendente');
            else if (username === 'motoboy') navigate('/motoboy');
            else if (username === 'lojista') navigate('/lojista');
            else navigate('/');
        } else {
            setError('Credenciais inválidas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-red mb-2">OK Express</h1>
                    <p className="text-text-secondary">Faça login para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ex: atendente"
                    />

                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                    />

                    {error && (
                        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        Entrar
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    <p>Credenciais de teste:</p>
                    <ul className="mt-2 space-y-1">
                        <li>atendente / 123</li>
                        <li>motoboy / 123</li>
                        <li>admin / admin</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}
