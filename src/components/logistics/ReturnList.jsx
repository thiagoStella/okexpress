import React from 'react';

const ReturnList = ({ drivers, onTrackDriver }) => {
    // Filter drivers who are NOT active (i.e., returning or idle)
    // Logic: active_order_id is null or undefined
    const returningDrivers = drivers.filter(d => !d.active_order_id);

    if (returningDrivers.length === 0) {
        return <div className="p-4 text-gray-500 text-sm">Nenhum motoboy retornando no momento.</div>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-4">
            <h3 className="text-md font-semibold mb-3 text-gray-700">Retornando à Base ({returningDrivers.length})</h3>
            <ul className="space-y-2">
                {returningDrivers.map(driver => (
                    <li key={driver.driverId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-800">{driver.name || `Motoboy #${driver.driverId}`}</span>
                        </div>
                        <button
                            onClick={() => onTrackDriver(driver)}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
                        >
                            Ver Mapa
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReturnList;
