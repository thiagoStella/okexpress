import React from 'react';
import { timeService } from '../../services/timeService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function KanbanBoard({ orders, onMoveOrder, onTrackOrder }) {
    const [orderToCancel, setOrderToCancel] = React.useState(null);

    const handleCancelClick = (orderId) => {
        setOrderToCancel(orderId);
    };

    const confirmCancel = () => {
        if (orderToCancel) {
            onMoveOrder(orderToCancel, 'CANCELADO');
            setOrderToCancel(null);
        }
    };

    const columns = [
        { id: 'em_preparo', title: 'Em Preparo', status: 'EM_PREPARO' },
        { id: 'aguardando', title: 'Aguardando', status: 'AGUARDANDO_ENTREGA' },
        { id: 'em_entrega', title: 'Em Entrega', status: 'A_CAMINHO' },
    ];

    return (
        <>
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
                                            <div className="text-right">
                                                <span className="block text-sm text-text-secondary">{order.time}</span>
                                                <OrderTimer createdAt={order.createdAt} />
                                                {order.distance && (
                                                    <span className="block text-xs text-text-secondary">{order.distance} km</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-text-primary mb-2">{order.address}</p>
                                        <p className="text-sm text-text-secondary mb-3">{order.description}</p>

                                        <div className="flex flex-col gap-2 mt-2">
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

                                            {(col.id === 'em_preparo' || col.id === 'aguardando') && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                                                    onClick={() => handleCancelClick(order.id)}
                                                >
                                                    Cancelar
                                                </Button>
                                            )}

                                            {/* Temporary Test Button: Start Delivery */}
                                            {col.id === 'aguardando' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                                    onClick={() => onMoveOrder(order.id, 'A_CAMINHO')}
                                                >
                                                    Iniciar Entrega (Teste)
                                                </Button>
                                            )}

                                            {col.id === 'em_entrega' && (
                                                <>
                                                    {order.driverName && (
                                                        <div className="mb-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            <span className="text-xs font-bold text-gray-700">{order.driverName}</span>
                                                        </div>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
                                                        onClick={() => onTrackOrder(order)}
                                                    >
                                                        Track
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                                                        onClick={() => onMoveOrder(order.id, 'ENTREGUE')}
                                                    >
                                                        Finalizar Entrega (Teste)
                                                    </Button>
                                                </>
                                            )}
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

            {/* Cancel Confirmation Modal */}
            {orderToCancel && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-sm text-center">
                        <h3 className="text-xl font-bold text-text-primary mb-2">Atenção</h3>
                        <p className="text-text-secondary mb-6">Deseja cancelar este pedido?</p>

                        <div className="flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="w-full font-bold bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg border border-transparent"
                                onClick={() => setOrderToCancel(null)}
                            >
                                VOLTAR
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                onClick={confirmCancel}
                            >
                                cancelar o pedido
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}

function OrderTimer({ createdAt }) {
    const [elapsed, setElapsed] = React.useState(0);

    React.useEffect(() => {
        if (!createdAt) return;

        const interval = setInterval(() => {
            // We use timeService to be consistent, but Date.now() diff is usually fine.
            // Using timeService.getNow() ensures we are comparing Server Time to Server Time.
            const now = timeService.getNow().getTime();
            const created = new Date(createdAt).getTime();
            setElapsed(Math.max(0, now - created));
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt]);

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const isLate = seconds > 10;

    return (
        <span className={`block text-xs font-bold font-mono mt-1 ${isLate ? 'text-red-500' : 'text-text-secondary'}`}>
            {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
        </span>
    );
}
