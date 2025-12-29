# OK Express - App Mobile do Motoboy

## 📱 Sobre

Aplicativo mobile React Native para os entregadores da OK Express.

## 🚀 Como executar

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- Expo Go instalado no seu celular (iOS ou Android)

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

4. Escaneie o QR code com:
   - **iOS**: Câmera do iPhone
   - **Android**: App Expo Go

## 📋 Funcionalidades Implementadas

### Versão Atual (Mock)
- ✅ Header com nome do motoboy e botão sair
- ✅ Switch de status (Disponível/Indisponível)
- ✅ Lista de pedidos com mock data
- ✅ Cards com informações completas:
  - Nome do cliente
  - Valor do pedido
  - Endereço de retirada
  - Endereço de entrega
  - Distância e tempo estimado
  - Botão "Aceitar"

### Próximas Implementações
- 🔄 Integração com API real
- 🔄 Autenticação de motoboy
- 🔄 Aceitar pedidos
- 🔄 Atualizar status de entrega
- 🔄 Navegação GPS
- 🔄 Histórico de entregas

## 📁 Estrutura

```
mobile-driver/
├── App.js          # Componente principal
├── index.js        # Entry point
├── app.json        # Configuração Expo
├── package.json    # Dependências
└── .gitignore      # Arquivos ignorados
```

## 🎨 Design

O app utiliza:
- React Native puro (sem bibliotecas externas de UI)
- Componentes nativos: View, Text, FlatList, Switch, TouchableOpacity
- StyleSheet para estilização
- Sombras e elevação para profundidade visual
- Cores do tema OK Express (azul #2563eb)

## ⚠️ Importante

Este é o **APP MOBILE** do motoboy. Não confundir com:
- `src/pages/Motoboy.jsx` - Painel web de visualização de entregas
