import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { AddressAutocomplete } from '../components/domain/AddressAutocomplete';
import { KanbanBoard } from '../components/domain/KanbanBoard';
import { LogOut, CheckCircle, X } from 'lucide-react';
import ReturnList from '../components/logistics/ReturnList';
import TrackingModal from '../components/logistics/TrackingModal';

import { useOrders } from '../contexts/OrderContext';

import { timeService } from '../services/timeService';

export default function Atendente() {
    const { user, logout } = useAuth();
    const { orders, addOrder, updateOrderStatus, updateOrderLocal } = useOrders();
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [description, setDescription] = useState('');
    const [showCompleted, setShowCompleted] = useState(false);

    // Logistics State
    const [selectedDriver, setSelectedDriver] = useState(null);
    const tenantStoreLocation = { lat: -25.4135, long: -49.3471 }; // São Braz

    // Mock Drivers (Lifted from LogisticsTest for demo)
    const [drivers, setDrivers] = useState([
        {
            driverId: '101',
            name: 'João Motoboy',
            current_lat: -25.4040, current_long: -49.3390,
            last_update: Date.now(),
            active_order_id: null,
            active_order_destination: null
        },
        {
            driverId: '102',
            name: 'Maria Entregas',
            current_lat: -25.4140, current_long: -49.3080,
            last_update: Date.now(),
            active_order_id: 'ORD-555',
            active_order_destination: { lat: -25.4143, long: -49.3088 }
        },
        {
            driverId: '103',
            name: 'Pedro Rápido',
            current_lat: -25.4250, current_long: -49.2700,
            last_update: Date.now(),
            active_order_id: null,
            active_order_destination: null
        }
    ]);

    const handleTrackOrder = async (order) => {
        console.log("Tracking order:", order);

        // 1. Try to find a real driver assigned to this order
        let driver = drivers.find(d => d.active_order_id === `ORD-${order.id}`);

        // 2. If no driver found (e.g. Test Button used), create a "Ghost Driver" for the demo
        if (!driver) {
            console.log("No driver found, creating ghost driver for demo.");
            driver = {
                driverId: 'ghost-1',
                name: 'Entregador Teste',
                current_lat: tenantStoreLocation.lat, // Start at store
                current_long: tenantStoreLocation.long,
                last_update: Date.now(),
                active_order_id: order.id,
                active_order_destination: null // Will be filled below
            };
        }

        // 3. Ensure we have a destination (Geocode if missing)
        if (!driver.active_order_destination && order.address) {
            // Default destination (Store)
            let destination = { ...tenantStoreLocation };
            let geocodeSuccess = false;

            const geocodeStrategies = [
                // Strategy 1: Full Specific Address
                `${order.address}, Curitiba, Paraná, Brazil`,
                // Strategy 2: Less Specific (City level)
                `${order.address}, Curitiba`,
                // Strategy 3: Just Street Name (remove numbers) if possible
                `${order.address.replace(/[0-9,]/g, '').trim()}, Curitiba`
            ];

            for (const query of geocodeStrategies) {
                if (geocodeSuccess) break;
                try {
                    console.log(`Attempting geocode with: ${query}`);
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                    const data = await response.json();

                    if (data && data.length > 0) {
                        destination = {
                            lat: parseFloat(data[0].lat),
                            long: parseFloat(data[0].lon)
                        };
                        console.log("Geocoded destination:", destination);
                        geocodeSuccess = true;
                    }
                } catch (error) {
                    console.warn(`Geocoding failed for query "${query}":`, error);
                }
            }

            if (!geocodeSuccess) {
                console.warn("All geocoding attempts failed, using default store location.");
                // Optional: Show a toast or alert here if you had a toast system
                // alert("Não foi possível localizar o endereço exato. Mostrando rota até a loja."); 
            }

            // Update the local driver object (and state if it's a real driver)
            driver = { ...driver, active_order_destination: destination };

            // If it's a real driver in our list, update the state too so we don't re-geocode every time
            if (drivers.some(d => d.driverId === driver.driverId)) {
                setDrivers(prev => prev.map(d => d.driverId === driver.driverId ? { ...d, active_order_destination: destination } : d));
            }
        }

        console.log("Selected driver:", driver);
        setSelectedDriver(driver);
    };

    React.useEffect(() => {
        timeService.sync();
    }, []);

    const handleCreateOrder = (e) => {
        e.preventDefault();
        if (!address || !number) return;

        // Formata o endereço completo: "Rua X, 123 - Bairro, Cidade - PR"
        const fullAddress = `${address}, ${number}`;

        const now = timeService.getNow();

        const newOrder = {
            address: fullAddress,
            description: description || 'Sem descrição',
            status: 'EM_PREPARO',
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: now.toISOString(), // Store full timestamp for timer
            motoboyId: null
        };

        addOrder(newOrder);
        setAddress('');
        setNumber('');
        setDescription('');
    };

    const handleMoveOrder = (id, newStatus) => {
        // Logic for assigning/releasing drivers
        if (newStatus === 'A_CAMINHO') {
            // Assign a driver (FIFO - First available)
            const availableDriver = drivers.find(d => !d.active_order_id);

            if (availableDriver) {
                // Update Driver State
                setDrivers(prevDrivers => prevDrivers.map(d =>
                    d.driverId === availableDriver.driverId
                        ? { ...d, active_order_id: `ORD-${id}`, active_order_destination: null } // We could set destination here if we had it
                        : d
                ));

                // Update Order with Driver Info (Mocking this update since we don't have a real backend for it yet)
                // In a real app, updateOrderStatus would handle this or we'd make a separate call
                updateOrderLocal(id, {
                    driverName: availableDriver.name,
                    driverId: availableDriver.driverId
                });
            } else {
                alert("Não há entregadores disponíveis!");
                return; // Prevent move if no driver
            }
        } else if (newStatus === 'ENTREGUE') {
            // Release the driver
            const order = orders.find(o => o.id === id);
            // Find driver who has this order
            const driverId = order?.driverId; // Or search by active_order_id if we didn't persist it well

            setDrivers(prevDrivers => prevDrivers.map(d =>
                (d.active_order_id === `ORD-${id}` || d.driverId === driverId)
                    ? { ...d, active_order_id: null, active_order_destination: null }
                    : d
            ));
        }

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
                                label="Logradouro"
                                value={address}
                                onChange={setAddress}
                                placeholder="Busque a rua..."
                            />

                            <Input
                                label="Número"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="Ex: 123"
                                required
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

                    {/* Return List */}
                    <div className="mt-6">
                        <ReturnList
                            drivers={drivers}
                            tenantStoreLocation={tenantStoreLocation}
                            onTrackDriver={setSelectedDriver}
                        />
                    </div>
                </div>

                {/* Kanban */}
                <div className="lg:col-span-3">
                    <KanbanBoard
                        orders={orders}
                        onMoveOrder={handleMoveOrder}
                        onTrackOrder={handleTrackOrder}
                    />
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
            {/* Tracking Modal */}
            {selectedDriver && (
                <TrackingModal
                    isOpen={!!selectedDriver}
                    onClose={() => setSelectedDriver(null)}
                    driver={selectedDriver}
                    tenantStoreLocation={tenantStoreLocation}
                />
            )}
        </div>
    );
}
