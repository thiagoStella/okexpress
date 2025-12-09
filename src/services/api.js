import { API_URL } from '../config';

export const api = {
    getOrdersAtendente: async (dia) => {
        const response = await fetch(`${API_URL}/pedidos/atendente/${dia}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    getOrdersMotoboy: async () => {
        const response = await fetch(`${API_URL}/pedidos/motoboy`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    createOrder: async (order) => {
        const response = await fetch(`${API_URL}/pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    updateOrderStatus: async (id, status, motoboyId = null) => {
        const body = { deliveryStatus: status };
        if (motoboyId) body.motoboyId = motoboyId;

        const response = await fetch(`${API_URL}/pedido/${encodeURIComponent(id)}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    }
};
