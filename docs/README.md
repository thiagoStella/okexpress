# Projeto Frete Rápido - Calculadora de Corridas (MVP v1)

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)

## 🚀 Projeto ao Vivo

Você pode testar a calculadora em funcionamento no link abaixo:

**[https://okmotoboys.com.br/calculadora.html](https://okmotoboys.com.br/calculadora.html)**

---

## 🎯 Objetivo

Este projeto é uma ferramenta web para cálculo de valor de corridas de motofrete, baseando-se na distância entre dois pontos. O objetivo é eliminar o processo manual de cotação, agilizar a prospecção de clientes e fortalecer a imagem da empresa, aplicando regras de negócio que garantem a sustentabilidade do serviço para os entregadores.

## 🛠️ Arquitetura da Solução

A aplicação foi construída utilizando uma arquitetura **100% Serverless na AWS**, garantindo alta disponibilidade, escalabilidade, segurança e baixo custo.

* **Frontend:** HTML, CSS e JavaScript puros (Vanilla JS), com deploy feito na Hostinger.
* **Backend API:** Uma API REST criada com **Amazon API Gateway**, servindo como a porta de entrada segura para a lógica de negócio.
* **Lógica de Negócio:** Uma função **AWS Lambda** em Node.js que aplica as regras de negócio, incluindo a cobrança de valor mínimo para corridas curtas.
* **Geolocalização:** O backend utiliza o **Amazon Location Service** para realizar a geocodificação (converter endereços em coordenadas) e o cálculo de rotas.
* **Segurança:** As permissões são gerenciadas de forma granular utilizando **AWS IAM Roles**. A comunicação entre o frontend e a API é protegida por CORS.

## ✨ Tecnologias Utilizadas

- **Cloud:** AWS Lambda, Amazon API Gateway, Amazon Location Service, AWS IAM
- **Backend:** Node.js
- **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
- **Versionamento:** Git & GitHub

## 📄 Documentação de Requisitos

O processo de levantamento de requisitos, a definição da User Story e os Critérios de Aceite para o MVP podem ser encontrados no link abaixo:

➡️ **[Documentação e Requisitos do Projeto](https://github.com/thiagoStella/okexpress/blob/main/docs/REQUISITOS_MVP_V1.md)**

