import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogOut, MapPin, Package, CheckCircle, Navigation, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

import { useOrders } from '../contexts/OrderContext';

export default function Motoboy() {
    const { user, logout } = useAuth();
    const { orders, assignMotoboy, updateOrderStatus, returnOrder } = useOrders();
    const [activeTab, setActiveTab] = useState('available'); // 'available' | 'my-orders'

    const availableOrders = orders.filter(o => (o.status === 'A_CAMINHO' || o.status === 'AGUARDANDO_ENTREGA' || o.status === 'EM_PREPARO') && !o.motoboyId);
    const myOrders = orders.filter(o => o.motoboyId === user?.id && o.status !== 'ENTREGUE');

    const handleAcceptOrder = (id) => {
        assignMotoboy(id, user.id);
        setActiveTab('my-orders');
    };

    const handleFinishOrder = (id) => {
        updateOrderStatus(id, 'ENTREGUE');
    };

    const handleReturnOrder = (id) => {
        returnOrder(id);
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            <header className="bg-brand-secondary p-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-text-primary">Motoboy App</h1>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="p-4 max-w-2xl mx-auto">
                {/* Tabs */}
                <div className="flex mb-6 bg-brand-secondary rounded-lg p-1">
                    <button
                        className={clsx(
                            "flex-1 py-2 text-center rounded-md font-medium transition-colors",
                            activeTab === 'available' ? "bg-brand-bg text-brand-red" : "text-text-secondary"
                        )}
                        onClick={() => setActiveTab('available')}
                    >
                        Disponíveis ({availableOrders.length})
                    </button>
                    <button
                        className={clsx(
                            "flex-1 py-2 text-center rounded-md font-medium transition-colors",
                            activeTab === 'my-orders' ? "bg-brand-bg text-brand-red" : "text-text-secondary"
                        )}
                        onClick={() => setActiveTab('my-orders')}
                    >
                        Meus Pedidos ({myOrders.length})
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {activeTab === 'available' && (
                        <>
                            {availableOrders.length === 0 ? (
                                <div className="text-center text-text-secondary py-8">
                                    Nenhuma entrega disponível no momento.
                                </div>
                            ) : (
                                availableOrders.map(order => (
                                    <Card key={order.id} className={clsx(
                                        "border-l-4",
                                        order.status === 'EM_PREPARO' ? "border-gray-500 opacity-75" : "border-yellow-500"
                                    )}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-lg text-text-primary">#{order.id}</span>
                                            <span className="text-text-secondary">{order.time}</span>
                                        </div>

                                        <div className="flex items-start gap-3 mb-2">
                                            <MapPin className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                                            <p className="text-text-primary text-lg">{order.address}</p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <Package className="w-5 h-5 text-text-secondary shrink-0" />
                                            <p className="text-text-secondary">{order.description}</p>
                                        </div>

                                        {order.status === 'EM_PREPARO' ? (
                                            <div className="w-full py-3 text-center font-bold text-text-secondary bg-brand-bg rounded border border-dashed border-gray-700">
                                                EM PREPARO...
                                            </div>
                                        ) : (
                                            <Button
                                                size="lg"
                                                className="w-full font-bold"
                                                onClick={() => handleAcceptOrder(order.id)}
                                            >
                                                ACEITAR ENTREGA
                                            </Button>
                                        )}
                                    </Card>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'my-orders' && (
                        <>
                            {myOrders.length === 0 ? (
                                <div className="text-center text-text-secondary py-8">
                                    Você não tem entregas ativas.
                                </div>
                            ) : (
                                myOrders.map(order => (
                                    <Card key={order.id} className="border-l-4 border-green-500">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-lg text-text-primary">#{order.id}</span>
                                            <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-sm">
                                                Em Andamento
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3 mb-2">
                                            <MapPin className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                                            <p className="text-text-primary text-lg">{order.address}</p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <Package className="w-5 h-5 text-text-secondary shrink-0" />
                                            <p className="text-text-secondary">{order.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-colors"
                                            >
                                                <Navigation className="w-5 h-5 mr-2" />
                                                NAVEGAR
                                            </a>

                                            <Button
                                                size="lg"
                                                variant="secondary"
                                                className="w-full font-bold text-green-400 border border-green-400/30"
                                                onClick={() => handleFinishOrder(order.id)}
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                FINALIZAR
                                            </Button>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full mt-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            onClick={() => handleReturnOrder(order.id)}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Devolver Pedido
                                        </Button>
                                    </Card>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
