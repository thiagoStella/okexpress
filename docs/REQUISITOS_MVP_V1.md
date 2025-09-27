# Minuta de Definição de Requisitos | MVP v1: Calculador de Corridas

**Data:** 27 de Setembro de 2025
**Participantes:** Analista de Requisitos (Gemini), Thiago Stella Pontes (Stakeholder/Desenvolvedor)

## 1. Problema Central Identificado

O processo atual para cotação de valor de corridas é manual, baseado em consultas ao Google Maps e cálculos feitos na hora. Isso gera atrito, lentidão e uma imagem pouco profissional durante a prospecção de novos clientes (comerciantes), impactando negativamente a agilidade e a confiança no momento da venda.

## 2. Objetivo Estratégico do MVP

Desenvolver uma ferramenta de vendas pública e instantânea que permita a qualquer visitante do site calcular o valor de uma corrida de forma precisa e transparente. O objetivo é remover a fricção do processo de prospecção, passando uma imagem de profissionalismo e eficiência para potenciais clientes.

## 3. User Story Aprovada

"Como um **Visitante do site** (seja o dono da empresa demonstrando ou o próprio comerciante), eu quero **inserir endereços de partida e destino para calcular o valor de uma corrida instantaneamente**, para que **eu possa ter uma estimativa de custo clara, rápida e transparente.**"

## 4. Critérios de Aceite (Definition of "Done")

Para que a funcionalidade seja considerada completa e "pronta", os seguintes critérios devem ser atendidos:

1.  **Cálculo Visível:** O sistema deve permitir a inserção de um endereço de partida e um de destino e, ao acionar um botão, exibir o valor final da corrida de forma clara para o usuário.
2.  **Regra de Negócio Aplicada:** O cálculo do valor deve ser baseado na distância em KM (obtida via API), multiplicada por R$ 3,00. A distância em KM deve ser arredondada matematicamente (casas decimais >= 0.5 arredondam para cima, < 0.5 arredondam para baixo) antes da multiplicação.
3.  **Formato de Exibição:** O valor final deve ser exibido em formato de moeda brasileira (ex: "Valor da Corrida: R$ 27,00").
4.  **Tratamento de Erros:** O sistema deve apresentar uma mensagem de erro amigável e clara caso um dos endereços seja inválido ou uma rota não possa ser traçada entre os pontos.
5.  **Experiência do Usuário (Autocomplete):** O sistema deve sugerir endereços completos e válidos (autocomplete) enquanto o usuário digita nos campos, a fim de minimizar erros de digitação e agilizar o preenchimento.

## 5. Escopo Futuro (Itens em Backlog para v2 e além)

As seguintes funcionalidades foram discutidas e intencionalmente adiadas para garantir a agilidade na entrega do MVP. Elas compõem o backlog para futuras versões do produto:

* Área de login para comerciantes cadastrados.
* Integração com métodos de pagamento para solicitação da corrida.
* Disparo de notificações de novos pedidos (via e-mail ou WhatsApp) para o administrador.
* Sistema de cadastro, gestão e atribuição de motoboys (potencialmente em um PWA - Progressive Web App).