# Documentação Técnica - Calculadora de Fretes OK Express v1.0

## 1. Lista de Versionamentos

| Versão | Data       | Autor                | Descrição da Alteração                                     |
|--------|------------|----------------------|------------------------------------------------------------|
| v1.0   | 07/10/2025 | Thiago Stella Pontes | Lançamento do MVP com cálculo de frete serverless via AWS. |
|        |            |                      | Adição de regra de valor mínimo e botão de WhatsApp.       |


## 2. Objetivo

### 2.1 Cenário Atual e Propósito
O processo de cotação de fretes da OK Express era manual, ineficiente e dependente de consultas externas. Este projeto implementa o MVP de uma ferramenta web para o cálculo de valor de corridas, com o propósito de automatizar, agilizar e profissionalizar o processo de prospecção de clientes.

### 2.2 Itens fora do escopo (Backlog)
As seguintes funcionalidades foram consideradas, mas adiadas para versões futuras para garantir a agilidade na entrega do MVP:
- Funcionalidade de Autocomplete de endereços (v1.1).
- Migração da hospedagem do frontend para a AWS (S3/CloudFront).
- Área de login para clientes.
- Integração com sistemas de pagamento.

## 3. Glossário de Termos

- **Serverless:** Arquitetura de nuvem onde não há gerenciamento de servidores. O código é executado sob demanda.
- **Lambda:** Serviço da AWS que executa o código do backend (nossa lógica de negócio).
- **API Gateway:** Serviço da AWS que cria o "endereço" público (URL) para nossa API e gerencia as requisições.
- **Location Service:** Serviço da AWS para geolocalização (endereço -> coordenadas) e roteamento (cálculo de distância).
- **IAM Role:** Uma "identidade" na AWS com permissões específicas, usada pela nossa função Lambda para acessar outros serviços de forma segura.
- **CORS:** (Cross-Origin Resource Sharing) Mecanismo de segurança do navegador que controla requisições entre domínios diferentes.

## 4. Regras de Negócio (RN)

- **RN-01 (Cálculo Base):** O valor final da corrida deve ser calculado com base na distância em KM da rota, multiplicada por uma taxa fixa de R$ 3,00. A distância em KM deve ser arredondada matematicamente antes da multiplicação.

- **RN-02 (Valor Mínimo):** Para garantir a viabilidade do serviço para o entregador, qualquer corrida com distância real entre 1 metro e 3.000 metros (3 km) deve ser tarifada como se tivesse 3 km.

- **RN-03 (Precisão Geográfica):** As buscas por endereços devem priorizar resultados geograficamente próximos à cidade de Curitiba-PR, para aumentar a precisão em casos de endereços ambíguos ou incompletos.

## 5. Requisitos Funcionais (RF)

- **RF-01 (Entrada de Dados):** O sistema deve fornecer ao usuário dois campos de texto para inserção de um endereço de Origem e um de Destino.

- **RF-02 (Acionamento do Cálculo):** O sistema deve possuir um botão ("Confirmar Cálculo") que, ao ser clicado, inicia o processo de cálculo de frete.

- **RF-03 (Exibição de Sucesso):** Em caso de um cálculo bem-sucedido, o sistema deve exibir de forma clara o Valor Final formatado em moeda brasileira (R$ XX,XX) e a Distância exata da rota (em km).

- **RF-04 (Exibição de Erro):** Caso um dos endereços seja inválido ou uma rota não possa ser traçada, o sistema deve exibir uma mensagem de erro amigável na interface do usuário.

- **RF-05 (Conversão do Cliente):** Após um cálculo bem-sucedido, o sistema deve exibir um botão ("Peça Agora via WhatsApp").

- **RF-06 (Mensagem Dinâmica):** Ao clicar no botão de WhatsApp, o sistema deve abrir o aplicativo com uma mensagem pré-preenchida, contendo os detalhes da cotação (Origem, Destino, Valor e Distância).