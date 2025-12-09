import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogOut, Plus } from 'lucide-react';

export default function Lojista() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-brand-bg p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Painel do Lojista</h1>
                <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 hover:border-brand-red transition-colors cursor-pointer group">
                    <div className="p-4 rounded-full bg-brand-secondary group-hover:bg-brand-red/10 mb-4 transition-colors">
                        <Plus className="w-8 h-8 text-brand-red" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Novo Pedido</h3>
                    <p className="text-text-secondary text-center">Clique para solicitar um motoboy</p>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-text-primary mb-4">Meus Pedidos Ativos</h3>
                    <div className="text-text-secondary text-center py-8">
                        Nenhum pedido ativo no momento.
                    </div>
                </Card>
            </div>
        </div>
    );
}
