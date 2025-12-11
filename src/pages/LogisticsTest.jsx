import React, { useState } from 'react';
import ReturnList from '../components/logistics/ReturnList';
import TrackingModal from '../components/logistics/TrackingModal';

const LogisticsTest = () => {
    // Mock Tenant Location (The Store)
    // Address: Rua João Esmanhoto, 246, Curitiba (São Braz) - CEP 82300-600
    const tenantStoreLocation = {
        lat: -25.4135,
        long: -49.3471
    };

    // Mock Drivers Data
    const [drivers, setDrivers] = useState([
        {
            driverId: '101',
            name: 'João Motoboy',
            // Near Delivery A: R. Prof. Francisco Zardo, 58 (Santa Felicidade)
            current_lat: -25.4040,
            current_long: -49.3390,
            last_update: Date.now(),
            active_order_id: null, // Returning to Store (Rua João Esmalhoto)
            active_order_destination: null
        },
        {
            driverId: '102',
            name: 'Maria Entregas',
            // Near Delivery B: Av. Manoel Ribas, 100 (Mercês)
            current_lat: -25.4140,
            current_long: -49.3080,
            last_update: Date.now(),
            active_order_id: 'ORD-555', // Delivering to Delivery B
            active_order_destination: {
                lat: -25.4143, // Av. Manoel Ribas, 100
                long: -49.3088
            }
        },
        {
            driverId: '103',
            name: 'Pedro Rápido',
            current_lat: -25.4250,
            current_long: -49.2700,
            last_update: Date.now(),
            active_order_id: null, // Returning
            active_order_destination: null
        }
    ]);

    const [selectedDriver, setSelectedDriver] = useState(null);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Logistics Module Test</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Return List Component */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Component: ReturnList</h2>
                    <p className="text-sm text-gray-600 mb-2">Displays drivers with no active order (Returning).</p>
                    <ReturnList drivers={drivers} tenantStoreLocation={tenantStoreLocation} />
                </div>

                {/* Right Column: Manual Tracking Test */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Manual Tracking Test</h2>
                    <p className="text-sm text-gray-600 mb-2">Click to simulate tracking a specific driver.</p>

                    <div className="space-y-2">
                        {drivers.map(d => (
                            <div key={d.driverId} className="p-3 bg-white rounded shadow flex justify-between items-center">
                                <span>{d.name} ({d.active_order_id ? 'Delivering' : 'Returning'})</span>
                                <button
                                    onClick={() => setSelectedDriver(d)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Track
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for manual selection */}
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
};

export default LogisticsTest;
