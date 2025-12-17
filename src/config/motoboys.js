export const AVAILABLE_MOTOBOYS = [
    { id: 'driver_thiago', name: 'Thiago', color: 'blue' },
    { id: 'driver_motoboy2', name: 'Motoboy Extra', color: 'green' }
];

export const getDriverName = (id) => {
    if (!id) return 'Aguardando...';
    const driver = AVAILABLE_MOTOBOYS.find(m => m.id === id);
    return driver ? driver.name : 'Desconhecido';
};
