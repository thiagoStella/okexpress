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
            // Ensure data is an array and map to frontend model
            const mappedData = (Array.isArray(data) ? data : []).map(item => ({
                id: item.SK, // Use SK as unique ID
                address: item.enderecoDestino,
                description: item.nomeCliente, // Mapping nomeCliente to description
                status: item.deliveryStatus,
                motoboyId: item.motoboyId,
                time: '10:30' // Placeholder time, backend doesn't have it yet
            }));
            setOrders(mappedData);
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
                nomeCliente: 'Cliente', // Placeholder if not provided
                enderecoDestino: orderData.address,
                bairro: 'Centro', // Placeholder
                diaSimulado: '1'
            };

            // If description contains more info, we might parse it, but for now sending basics
            // The backend expects specific fields. We might need to adjust Atendente.jsx to send correct fields
            // or map them here.
            // Mapping 'description' to 'nomeCliente' or similar for now to avoid breaking backend validation
            backendOrder.nomeCliente = orderData.description || 'Cliente';

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

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, assignMotoboy, returnOrder, refresh: fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
}
