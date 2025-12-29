# OK Express - App Mobile do Motoboy 🚀

## 📱 Sobre

Aplicativo mobile React Native com **GPS tracking em background** para os entregadores da OK Express.

## ✨ Funcionalidades Implementadas

### 🎨 Interface (Dark Mode)
- ✅ Fundo escuro (#111827) para melhor visualização
- ✅ Cards em cinza (#1f2937) com bordas sutis
- ✅ Texto claro e legível (#f3f4f6)
- ✅ Acentos de cor (verde/azul) para elementos importantes

### 📍 GPS Tracking em Background
- ✅ **Intervalo de tempo**: 10 segundos
- ✅ **Intervalo de distância**: 10 metros
- ✅ **Precisão**: High accuracy
- ✅ **Background service**: Continua funcionando com app em segundo plano
- ✅ **Notificação**: "OK Express - Rastreamento ativo"

### 🔐 Permissões
- ✅ Solicita permissão de localização (Foreground)
- ✅ Solicita permissão de localização (Background)
- ✅ Validações antes de iniciar rastreamento

### 🌐 Integração com API
- ✅ **Endpoint**: `POST /driver/tracking`
- ✅ **Dados enviados**:
  ```json
  {
    "driverId": 1,
    "latitude": -23.550520,
    "longitude": -46.633308,
    "timestamp": "2025-12-29T16:00:00.000Z"
  }
  ```
- ✅ **DriverID hardcoded**: 1 (Thiago) para testes

### 🎛️ Controles
- ✅ **Switch de status**: Liga/desliga rastreamento
- ✅ **Badge GPS**: Indicador visual quando ativo
- ✅ **Logs detalhados**: Console mostra cada envio

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- Expo CLI instalado: `npm install -g expo-cli`
- Expo Go no celular (iOS/Android)

### Instalação

1. Entre na pasta do projeto mobile:
```bash
cd mobile-driver
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Escaneie o QR code:
   - **iOS**: Câmera do iPhone
   - **Android**: App Expo Go

### 📋 Teste de Campo

1. Abra o app no celular
2. Aceite as permissões de localização (Foreground + Background)
3. Ative o switch "Disponível" (verde)
4. Veja no terminal os logs:
   ```
   📍 Nova localização capturada:
      Lat: -23.550520
      Lng: -46.633308
      Timestamp: 16:00:00
   🚀 Enviando localização para API...
   ✅ Localização enviada com sucesso!
   ```
5. A cada **10 segundos** ou **10 metros** andados, você verá novos logs

## 🔍 Logs Esperados

```
🔐 Solicitando permissões de localização...
✅ Permissão de foreground concedida
✅ Permissão de background concedida
🟢 Iniciando rastreamento GPS...
✅ Rastreamento GPS iniciado!
⏱️ Atualizações a cada 10 segundos ou 10 metros
📍 Nova localização capturada:
   Lat: -23.550520
   Lng: -46.633308
   Timestamp: 16:00:00
🚀 Enviando localização para API...
✅ Localização enviada com sucesso!
```

## 📦 Dependências

```json
{
  "expo": "~54.0.30",
  "expo-location": "~18.0.12",     // GPS tracking
  "expo-task-manager": "~12.0.12", // Background tasks
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🛠️ Configuração Técnica

### TaskManager
```javascript
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  // Captura lat/lng
  // Envia para API
  // Loga no console
});
```

### Location Updates
```javascript
await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  accuracy: Location.Accuracy.High,
  timeInterval: 10000,      // 10 segundos
  distanceInterval: 10,     // 10 metros
  foregroundService: { ... }
});
```

## 📁 Estrutura

```
mobile-driver/
├── App.js              # Componente principal com GPS
├── index.js            # Entry point
├── app.json            # Configuração + Permissões
├── package.json        # Dependências
└── README.md           # Esta documentação
```

## 🎯 Próximas Implementações

- 🔄 Buscar pedidos da API
- 🔄 Aceitar pedidos
- 🔄 Atualizar status de entrega
- 🔄 Autenticação real (login)
- 🔄 Mapa com rota
- 🔄 Histórico de entregas

## ⚠️ Importante

- **API URL**: `https://eix8rlheu8.execute-api.sa-east-1.amazonaws.com`
- **DriverID**: 1 (hardcoded como "Thiago")
- **Endpoint**: `POST /driver/tracking`
- Este é o **APP MOBILE**, não confundir com `src/pages/Motoboy.jsx` (painel web)

## 🐛 Troubleshooting

### Permissões negadas
- Vá em Configurações > Apps > Expo Go > Permissões
- Ative "Localização" com "Permitir sempre"

### GPS não está enviando
- Verifique se o switch está verde
- Olhe o badge "📡 GPS Ativo"
- Confira os logs no terminal

### API retorna erro
- Verifique se o backend está ativo
- Confirme que o endpoint `/driver/tracking` existe
- Veja o status HTTP nos logs
