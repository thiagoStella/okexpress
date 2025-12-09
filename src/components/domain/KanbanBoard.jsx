import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function KanbanBoard({ orders, onMoveOrder }) {
    const columns = [
        { id: 'em_preparo', title: 'Em Preparo', status: 'EM_PREPARO' },
        { id: 'aguardando', title: 'Aguardando', status: 'AGUARDANDO_ENTREGA' },
        { id: 'em_entrega', title: 'Em Entrega', status: 'A_CAMINHO' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
                <div key={col.id} className="flex-1 min-w-[300px]">
                    <h3 className="text-lg font-bold text-text-primary mb-3">{col.title}</h3>
                    <div className="space-y-3">
                        {orders
                            .filter(order => order.status === col.status)
                            .map(order => (
                                <Card key={order.id} className="border-l-4 border-brand-red">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-text-primary">#{order.id}</span>
                                        <span className="text-sm text-text-secondary">{order.time}</span>
                                    </div>
                                    <p className="text-text-primary mb-2">{order.address}</p>
                                    <p className="text-sm text-text-secondary mb-3">{order.description}</p>

                                    <div className="flex gap-2 mt-2">
                                        {col.id === 'em_preparo' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                                                onClick={() => onMoveOrder(order.id, 'AGUARDANDO_ENTREGA')}
                                            >
                                                Pronto para Entrega
                                            </Button>
                                        )}
                                        {/* No button for 'aguardando' - Motoboy must accept */}
                                        {/* No button for 'em_entrega' - Motoboy must finish */}
                                    </div>
                                </Card>
                            ))}

                        {orders.filter(order => order.status === col.status).length === 0 && (
                            <div className="text-center p-4 text-text-secondary border border-dashed border-gray-700 rounded">
                                Sem pedidos aqui
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
