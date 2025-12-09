import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogOut, TrendingUp, Users, Package } from 'lucide-react';

export default function Admin() {
    const { user, logout } = useAuth();

    const stats = [
        { title: 'Pedidos Hoje', value: '42', icon: Package, color: 'text-blue-400' },
        { title: 'Entregas Realizadas', value: '38', icon: CheckCircle, color: 'text-green-400' },
        { title: 'Motoboys Online', value: '5', icon: Users, color: 'text-yellow-400' },
    ];

    return (
        <div className="min-h-screen bg-brand-bg p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Painel Administrativo</h1>
                <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="flex items-center p-6">
                        <div className={`p-3 rounded-full bg-brand-bg ${stat.color} mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-text-secondary text-sm">{stat.title}</p>
                            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <h2 className="text-xl font-bold text-text-primary mb-4">Atividade Recente</h2>
                <div className="text-text-secondary text-center py-8">
                    Gráficos e relatórios detalhados em breve.
                </div>
            </Card>
        </div>
    );
}

function CheckCircle(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
