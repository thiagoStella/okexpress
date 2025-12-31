import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    Linking,
} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

// Configuração
const API_URL = 'https://16layzd1jd.execute-api.sa-east-1.amazonaws.com';
const DRIVER_ID = 1; // Hardcoded como "Thiago"
const LOCATION_TASK_NAME = 'TASK_FETCH_LOCATION';

// Definição da tarefa em background
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('❌ Erro no GPS:', error.message);
        return;
    }

    if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
            const { latitude, longitude } = location.coords;

            console.log('📍 Nova localização capturada:');
            console.log(`   Lat: ${latitude}`);
            console.log(`   Lng: ${longitude}`);
            console.log(`   Timestamp: ${new Date().toLocaleTimeString()}`);

            // Enviar para API
            try {
                console.log('🚀 Enviando localização para API...');

                const response = await fetch(`${API_URL}/driver/tracking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        driverId: DRIVER_ID,
                        latitude,
                        longitude,
                        timestamp: new Date().toISOString(),
                    }),
                });

                if (response.ok) {
                    console.log('✅ Localização enviada com sucesso!');
                } else {
                    console.log(`⚠️ API respondeu com status: ${response.status}`);
                }
            } catch (err) {
                console.error('❌ Erro ao enviar localização:', err.message);
            }
        }
    }
});

export default function App() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [orders, setOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        requestPermissions();
        fetchOrders(); // Buscar pedidos ao iniciar

        // Polling: atualizar pedidos a cada 5 segundos (mesmo que web app)
        const interval = setInterval(fetchOrders, 5000);

        return () => clearInterval(interval); // Cleanup
    }, [fetchOrders]);

    const fetchOrders = useCallback(async () => {
        try {
            console.log('📦 Buscando pedidos...');
            const response = await fetch(`${API_URL}/pedidos/motoboy`);

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${data.length} pedidos recebidos do backend`);

                // Filtrar pedidos disponíveis
                const availableOrders = data.filter(order => {
                    const isAvailableStatus = order.deliveryStatus === 'EM_PREPARO' ||
                        order.deliveryStatus === 'AGUARDANDO_ENTREGA' ||
                        order.deliveryStatus === 'AGUARDANDO_MOTOBOY';
                    const hasNoDriver = !order.motoboyId || order.motoboyId === null;
                    return isAvailableStatus && hasNoDriver;
                });

                // Filtrar meus pedidos
                const driverOrders = data.filter(order => {
                    return order.motoboyId === DRIVER_ID && order.deliveryStatus === 'EM_ENTREGA';
                });

                console.log(`🔍 ${availableOrders.length} disponíveis | ${driverOrders.length} meus pedidos`);

                setOrders(availableOrders);
                setMyOrders(driverOrders);
            } else {
                console.log(`⚠️ Erro ao buscar pedidos: ${response.status}`);
            }
        } catch (err) {
            console.error('❌ Erro ao buscar pedidos:', err.message);
        }
    }, []);


    const requestPermissions = async () => {
        try {
            console.log('🔐 Solicitando permissões de localização...');

            // Foreground permission
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert(
                    'Permissão Negada',
                    'Precisamos de acesso à localização para rastrear entregas.'
                );
                return;
            }

            console.log('✅ Permissão de foreground concedida');

            // Background permission
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                Alert.alert(
                    'Permissão de Background',
                    'Para rastreamento contínuo, permita acesso em segundo plano.'
                );
            } else {
                console.log('✅ Permissão de background concedida');
            }

            setHasLocationPermission(true);
        } catch (err) {
            console.error('❌ Erro ao solicitar permissões:', err);
        }
    };

    const toggleAvailability = async (value) => {
        if (!hasLocationPermission) {
            Alert.alert('Permissão Necessária', 'Permita o acesso à localização primeiro.');
            return;
        }

        setIsAvailable(value);

        if (value) {
            // INICIAR rastreamento
            try {
                console.log('🟢 Iniciando rastreamento GPS...');

                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // 10 segundos
                    distanceInterval: 10, // 10 metros
                    foregroundService: {
                        notificationTitle: 'OK Express',
                        notificationBody: 'Rastreamento ativo',
                    },
                });

                console.log('✅ Rastreamento GPS iniciado!');
                console.log('⏱️ Atualizações a cada 10 segundos ou 10 metros');

            } catch (err) {
                console.error('❌ Erro ao iniciar rastreamento:', err);
                Alert.alert('Erro', 'Não foi possível iniciar o rastreamento.');
                setIsAvailable(false);
            }
        } else {
            // PARAR rastreamento
            try {
                console.log('🔴 Parando rastreamento GPS...');

                const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
                if (hasStarted) {
                    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                    console.log('✅ Rastreamento GPS parado');
                }
            } catch (err) {
                console.error('❌ Erro ao parar rastreamento:', err);
            }
        }
    };

    const handleLogout = async () => {
        // Parar rastreamento antes de sair
        if (isAvailable) {
            await toggleAvailability(false);
        }
        console.log('👋 Logout');
        Alert.alert('Logout', 'Você saiu do sistema');
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            console.log(`🚀 Aceitando pedido: ${orderId}`);

            const response = await fetch(`${API_URL}/pedidos/${orderId}/aceitar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motoboyId: DRIVER_ID })
            });

            if (response.ok) {
                console.log('✅ Pedido aceito com sucesso!');
                Alert.alert('Sucesso', 'Pedido aceito! Verifique "Meus Pedidos"');
                fetchOrders(); // Atualizar listas
            } else {
                const error = await response.json();
                console.error('❌ Erro ao aceitar:', error);
                Alert.alert('Erro', error.error || 'Pedido não disponível');
            }
        } catch (err) {
            console.error('❌ Erro ao aceitar pedido:', err.message);
            Alert.alert('Erro', 'Falha ao aceitar pedido');
        }
    };

    const handleOpenMap = (order) => {
        const endereco = order.enderecoDestino || 'Destino não informado';
        const url = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${encodeURIComponent(endereco)}`;

        console.log(`🗺️ Abrindo Maps para: ${endereco}`);
        Linking.openURL(url).catch(err => {
            console.error('❌ Erro ao abrir Maps:', err);
            Alert.alert('Erro', 'Não foi possível abrir o Google Maps');
        });
    };

    const handleFinalizeOrder = async (orderId) => {
        try {
            console.log(`🏁 Finalizando pedido: ${orderId}`);

            const response = await fetch(`${API_URL}/pedidos/${orderId}/finalizar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motoboyId: DRIVER_ID })
            });

            if (response.ok) {
                console.log('✅ Pedido finalizado com sucesso!');
                Alert.alert('Sucesso', 'Entrega finalizada!');
                fetchOrders(); // Atualizar listas
            } else {
                const error = await response.json();
                console.error('❌ Erro ao finalizar:', error);
                Alert.alert('Erro', error.error || 'Falha ao finalizar');
            }
        } catch (err) {
            console.error('❌ Erro ao finalizar pedido:', err.message);
            Alert.alert('Erro', 'Falha ao finalizar pedido');
        }
    };

    const renderOrderCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.clientName}>{item.nomeCliente || 'Cliente'}</Text>
                <Text style={styles.orderValue}>R$ {item.valorFrete?.toFixed(2) || '0.00'}</Text>
            </View>

            <View style={styles.addressSection}>
                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <View style={styles.dotDelivery} />
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Destino</Text>
                        <Text style={styles.addressValue}>{item.enderecoDestino || 'Endereço não informado'}</Text>
                    </View>
                </View>

                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <Text style={{ fontSize: 10 }}>📏</Text>
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Distância</Text>
                        <Text style={styles.addressValue}>{item.distanciaKm?.toFixed(2) || '0'} km</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>📍 {item.bairro || 'Bairro'}</Text>
                    <Text style={styles.infoText}>🔢 {item.pedidoId?.replace('PEDIDO#', '') || 'N/A'}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.acceptButton,
                        item.deliveryStatus === 'EM_PREPARO' && styles.acceptButtonDisabled
                    ]}
                    onPress={() => handleAcceptOrder(item.SK)}
                    disabled={item.deliveryStatus === 'EM_PREPARO'}
                >
                    <Text style={[
                        styles.acceptButtonText,
                        item.deliveryStatus === 'EM_PREPARO' && styles.acceptButtonTextDisabled
                    ]}>
                        {item.deliveryStatus === 'EM_PREPARO' ? 'Em preparo...' : 'Aceitar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMyOrderCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.clientName}>{item.nomeCliente || 'Cliente'}</Text>
                <Text style={styles.orderValue}>R$ {item.valorFrete?.toFixed(2) || '0.00'}</Text>
            </View>

            <View style={styles.addressSection}>
                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <View style={styles.dotDelivery} />
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Destino</Text>
                        <Text style={styles.addressValue}>{item.enderecoDestino || 'Endereço não informado'}</Text>
                    </View>
                </View>

                <View style={styles.addressRow}>
                    <View style={styles.iconDot}>
                        <Text style={{ fontSize: 10 }}>📏</Text>
                    </View>
                    <View style={styles.addressText}>
                        <Text style={styles.addressLabel}>Distância</Text>
                        <Text style={styles.addressValue}>{item.distanciaKm?.toFixed(2) || '0'} km</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>📍 {item.bairro || 'Bairro'}</Text>
                    <Text style={styles.infoText}>🔢 {item.pedidoId?.replace('PEDIDO#', '') || 'N/A'}</Text>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.mapButton, { flex: 1, marginRight: 6 }]}
                        onPress={() => handleOpenMap(item)}
                    >
                        <Text style={styles.mapButtonText}>🗺️ ROTA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.finalizeButton, { flex: 1, marginLeft: 6 }]}
                        onPress={() => handleFinalizeOrder(item.SK)}
                    >
                        <Text style={styles.finalizeButtonText}>🏁 FINALIZAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📦</Text>
            <Text style={styles.emptyTitle}>Nenhum pedido disponível</Text>
            <Text style={styles.emptySubtitle}>
                {isAvailable
                    ? 'Aguardando novos pedidos...'
                    : 'Ative o status para receber pedidos'}
            </Text>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111827" />

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
                                { color: isAvailable ? '#22c55e' : '#ef4444' },
                            ]}
                        >
                            {isAvailable ? '🟢 Disponível' : '🔴 Indisponível'}
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#ef4444', true: '#22c55e' }}
                        thumbColor="#ffffff"
                        ios_backgroundColor="#ef4444"
                        onValueChange={toggleAvailability}
                        value={isAvailable}
                        style={styles.switch}
                    />
                </View>
                {isAvailable && (
                    <View style={styles.trackingBadge}>
                        <Text style={styles.trackingText}>📡 GPS Ativo</Text>
                    </View>
                )}
            </View>

            {/* Lista de Pedidos */}
            <View style={styles.ordersSection}>
                <Text style={styles.sectionTitle}>
                    Pedidos Disponíveis ({orders.length})
                </Text>
                <FlatList
                    data={orders}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => item.SK || item.pedidoId || String(Math.random())}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyList}
                />
            </View>

            {/* Meus Pedidos */}
            {myOrders.length > 0 && (
                <View style={styles.myOrdersSection}>
                    <Text style={styles.sectionTitle}>
                        Meus Pedidos ({myOrders.length})
                    </Text>
                    <FlatList
                        data={myOrders}
                        renderItem={renderMyOrderCard}
                        keyExtractor={(item) => item.SK || item.pedidoId || String(Math.random())}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        backgroundColor: '#1f2937',
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f3f4f6',
    },
    logoutButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#374151',
        borderRadius: 8,
    },
    logoutText: {
        color: '#f3f4f6',
        fontSize: 14,
        fontWeight: '600',
    },
    statusSection: {
        backgroundColor: '#1f2937',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    trackingBadge: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#065f46',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    trackingText: {
        color: '#d1fae5',
        fontSize: 12,
        fontWeight: '600',
    },
    ordersSection: {
        flex: 1,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f3f4f6',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#1f2937',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#374151',
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
        color: '#f3f4f6',
    },
    orderValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#22c55e',
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
        backgroundColor: '#22c55e',
    },
    addressText: {
        flex: 1,
        marginLeft: 8,
    },
    addressLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginBottom: 2,
    },
    addressValue: {
        fontSize: 14,
        color: '#d1d5db',
        lineHeight: 20,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#374151',
        paddingTop: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#9ca3af',
    },
    acceptButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonDisabled: {
        backgroundColor: '#6b7280',
        opacity: 0.6,
    },
    acceptButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    acceptButtonTextDisabled: {
        color: '#d1d5db',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f3f4f6',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    myOrdersSection: {
        flex: 1,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: '#374151',
        paddingTop: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 12,
    },
    mapButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    finalizeButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    finalizeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
