import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { AddressAutocomplete } from '../components/domain/AddressAutocomplete';
import { KanbanBoard } from '../components/domain/KanbanBoard';
import { LogOut, CheckCircle, X } from 'lucide-react';

import { useOrders } from '../contexts/OrderContext';

export default function Atendente() {
    const { user, logout } = useAuth();
    const { orders, addOrder, updateOrderStatus } = useOrders();
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);

    const handleCreateOrder = (e) => {
        e.preventDefault();
        if (!address) return;

        const newOrder = {
            address,
            description: description || 'Sem descrição',
            status: 'EM_PREPARO',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            motoboyId: null
        };

        addOrder(newOrder);
        setAddress('');
        setDescription('');
    };

    const handleMoveOrder = (id, newStatus) => {
        updateOrderStatus(id, newStatus);
    };

    return (
        <div className="min-h-screen bg-brand-bg p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Painel do Atendente</h1>
                <div className="flex items-center gap-4">
                    <span className="text-text-secondary hidden md:inline">Olá, {user?.name}</span>
                    <Button variant="outline" size="sm" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Order Form */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <h2 className="text-xl font-bold text-text-primary mb-4">Novo Pedido</h2>
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <AddressAutocomplete
                                label="Endereço"
                                value={address}
                                onChange={setAddress}
                                placeholder="Busque o endereço..."
                            />

                            <Input
                                label="Descrição"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: 2x Pizza"
                            />

                            <Button type="submit" className="w-full">
                                Criar Pedido
                            </Button>
                        </form>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full mt-4 border-green-500 text-green-500 hover:bg-green-500/10"
                        onClick={() => setShowCompleted(true)}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Ver Concluídas
                    </Button>
                </div>

                {/* Kanban */}
                <div className="lg:col-span-3">
                    <KanbanBoard orders={orders} onMoveOrder={handleMoveOrder} />
                </div>
            </div>

            {/* Completed Orders Modal */}
            {showCompleted && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowCompleted(false)}
                            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            Pedidos Concluídos
                        </h2>

                        <div className="space-y-3">
                            {orders.filter(o => o.status === 'ENTREGUE').length === 0 ? (
                                <p className="text-text-secondary text-center py-8">Nenhum pedido concluído.</p>
                            ) : (
                                orders
                                    .filter(o => o.status === 'ENTREGUE')
                                    .map(order => (
                                        <div key={order.id} className="p-3 bg-brand-bg rounded border border-gray-800">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-text-primary">#{order.id}</span>
                                                <span className="text-sm text-text-secondary">{order.time}</span>
                                            </div>
                                            <p className="text-text-primary">{order.address}</p>
                                            <p className="text-sm text-text-secondary">{order.description}</p>
                                        </div>
                                    ))
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
