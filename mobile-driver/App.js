import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';

// Mock data com 3 pedidos fictícios
const MOCK_ORDERS = [
    {
        id: '1',
        clientName: 'João Silva',
        pickup: 'Rua das Flores, 123 - Centro',
        delivery: 'Av. Paulista, 456 - Jardins',
        distance: '3.2 km',
        value: 'R$ 12,50',
        time: '15 min',
    },
    {
        id: '2',
        clientName: 'Maria Santos',
        pickup: 'Shopping Center - Loja 45',
        delivery: 'Rua Augusta, 789 - Consolação',
        distance: '5.1 km',
        value: 'R$ 18,00',
        time: '22 min',
    },
    {
        id: '3',
        clientName: 'Pedro Costa',
        pickup: 'Restaurante Bom Sabor - Centro',
        delivery: 'Rua Bahia, 321 - Higienópolis',
        distance: '2.8 km',
        value: 'R$ 10,00',
        time: '12 min',
    },
];

export default function App() {
    const [isAvailable, setIsAvailable] = useState(true);

    const handleLogout = () => {
        console.log('Logout pressionado');
        // Aqui você implementará a lógica de logout futuramente
    };

    const handleAcceptOrder = (orderId) => {
        console.log(`Pedido aceito: ${orderId}`);
        // Aqui você implementará a lógica de aceitar pedido futuramente
    };

    const renderOrderCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.orderValue}>{item.value}</Text>
            </View>

            <View style={styles.addressSection}>
                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <View style={styles.dotPickup} />
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Retirada</Text>
                        <Text style={styles.addressValue}>{item.pickup}</Text>
                    </View>
                </View>

                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <View style={styles.dotDelivery} />
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Entrega</Text>
                        <Text style={styles.addressValue}>{item.delivery}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>📍 {item.distance}</Text>
                    <Text style={styles.infoText}>⏱️ {item.time}</Text>
                </View>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptOrder(item.id)}
                >
                    <Text style={styles.acceptButtonText}>Aceitar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Olá, Motoboy</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* Status Switch */}
            <View style={styles.statusSection}>
                <View style={styles.statusRow}>
                    <View>
                        <Text style={styles.statusLabel}>Status</Text>
                        <Text
                            style={[
                                styles.statusValue,
                                { color: isAvailable ? '#16a34a' : '#dc2626' },
                            ]}
                        >
                            {isAvailable ? 'Disponível' : 'Indisponível'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#ef4444', true: '#22c55e' }}
                        thumbColor={isAvailable ? '#ffffff' : '#ffffff'}
                        ios_backgroundColor="#ef4444"
                        onValueChange={setIsAvailable}
                        value={isAvailable}
                        style={styles.switch}
                    />
                </View>
            </View>

            {/* Lista de Pedidos */}
            <View style={styles.ordersSection}>
                <Text style={styles.sectionTitle}>
                    Pedidos Disponíveis ({MOCK_ORDERS.length})
                </Text>
                <FlatList
                    data={MOCK_ORDERS}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    logoutButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1e40af',
        borderRadius: 8,
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    statusSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    ordersSection: {
        flex: 1,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    orderValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#16a34a',
    },
    addressSection: {
        marginBottom: 16,
    },
    addressRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    iconDot: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
    },
    dotPickup: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3b82f6',
    },
    dotDelivery: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#16a34a',
    },
    addressText: {
        flex: 1,
        marginLeft: 8,
    },
    addressLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    addressValue: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#6b7280',
    },
    acceptButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
