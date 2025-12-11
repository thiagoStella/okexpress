import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const OrderContext = createContext();

export function useOrders() {
    return useContext(OrderContext);
}

export function OrderProvider({ children }) {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!user) return;

        try {
            let data = [];
            if (user.role === 'atendente' || user.role === 'admin') {
                // Hardcoded day '1' for MVP/Staging as per legacy logic
                data = await api.getOrdersAtendente('1');
            } else if (user.role === 'motoboy') {
                data = await api.getOrdersMotoboy();
            }

            setOrders(prevOrders => {
                const prevOrdersMap = new Map(prevOrders.map(o => [o.id, o]));

                // Ensure data is an array and map to frontend model
                return (Array.isArray(data) ? data : []).map(item => {
                    const prevOrder = prevOrdersMap.get(item.SK);

                    // If createdAt is missing from backend, try to use previous one, or generate new
                    let createdAt = item.createdAt;
                    if (!createdAt) {
                        createdAt = prevOrder?.createdAt || new Date().toISOString();
                    }

                    return {
                        id: item.SK, // Use SK as unique ID
                        address: item.enderecoDestino,
                        description: item.nomeCliente, // Mapping nomeCliente to description
                        status: item.deliveryStatus,
                        motoboyId: item.motoboyId,
                        time: item.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        createdAt: createdAt,
                        valorFrete: item.valorFrete,
                        distance: item.distance,
                        // Preserve local fields if not present in backend
                        driverName: item.driverName || prevOrder?.driverName,
                        driverId: item.driverId || prevOrder?.driverId
                    };
                });
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [user]);

    // Polling for real-time updates (every 5 seconds)
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const addOrder = async (orderData) => {
        try {
            // Adapt frontend model to backend model
            const backendOrder = {
                numeroPedido: Math.floor(Math.random() * 10000), // Temp ID generation
                nomeCliente: orderData.description || 'Cliente',
                enderecoDestino: orderData.address,
                bairro: 'Centro', // Placeholder
                diaSimulado: '1',
                time: orderData.time,
                createdAt: orderData.createdAt
            };

            await api.createOrder(backendOrder);
            await fetchOrders();
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            // Backend expects SK as ID (e.g., DIA#1#PEDIDO#123)
            // We need to ensure we are passing the full SK.
            // The fetchOrders returns items with SK.
            await api.updateOrderStatus(id, status);
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    };

    const assignMotoboy = async (id, motoboyId) => {
        try {
            await api.updateOrderStatus(id, 'A_CAMINHO', motoboyId);
            await fetchOrders();
        } catch (error) {
            console.error('Error assigning motoboy:', error);
            throw error;
        }
    };

    const returnOrder = async (id) => {
        try {
            await api.updateOrderStatus(id, 'AGUARDANDO_ENTREGA', null); // Reset to waiting
            await fetchOrders();
        } catch (error) {
            console.error('Error returning order:', error);
            throw error;
        }
    };

    // Helper for demo/local updates that shouldn't wait for backend
    const updateOrderLocal = (id, updates) => {
        setOrders(prevOrders => prevOrders.map(o =>
            o.id === id ? { ...o, ...updates } : o
        ));
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, assignMotoboy, returnOrder, refresh: fetchOrders, updateOrderLocal }}>
            {children}
        </OrderContext.Provider>
    );
}
