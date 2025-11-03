# Calculadora de Frete Serverless - OK Express

![Status](https://img.shields.io/badge/status-em%20produ%C3%A7%C3%A3o-brightgreen)

## 🚀 Projeto ao Vivo

A calculadora está 100% funcional e disponível no domínio oficial da empresa:

**[https://okmotoboys.com.br/calculadora.html](https://okmotoboys.com.br/calculadora.html)**

---

## 🎯 Objetivo

Este projeto implementa o MVP de uma ferramenta de cotação de fretes para a OK Express, com o objetivo de automatizar o processo de vendas, eliminar cálculos manuais e fortalecer a imagem profissional da empresa.

## 🛠️ Arquitetura Final (100% AWS)

A aplicação foi construída utilizando uma arquitetura **100% Serverless na AWS**, garantindo alta disponibilidade, escalabilidade, segurança e baixo custo.

* **Frontend:** HTML, CSS e JavaScript puros hospedados no **Amazon S3**, distribuídos globalmente com baixa latência pelo **Amazon CloudFront** e com segurança HTTPS gerenciada pelo **AWS Certificate Manager (ACM)**.
* **DNS:** O gerenciamento do domínio `okmotoboys.com.br` foi totalmente migrado para o **Amazon Route 53**.
* **Backend (IaC):** A infraestrutura do backend (Lambda, API Gateway, IAM Roles, Location Service) foi automatizada como **Infraestrutura como Código (IaC)** usando o **AWS SAM (Serverless Application Model)**.
* **Lógica de Negócio:** Uma função **AWS Lambda** em Node.js executa as regras de negócio, incluindo a cobrança de valor mínimo para corridas curtas e a geração de mensagens dinâmicas para o WhatsApp.
* **API:** Uma **API REST** criada com o **Amazon API Gateway** serve como a porta de entrada segura para o backend.
* **Geolocalização:** O backend utiliza o **Amazon Location Service** para geocodificação e cálculo de rotas.

## 📄 Documentação Completa

Toda a jornada do projeto, desde o levantamento de requisitos até a documentação técnica final, está disponível na pasta `/docs`:

* **[Requisitos do MVP v1.0](https://github.com/thiagoStella/okexpress/blob/main/docs/REQUISITOS_MVP_V1.md)**
* **[Documentação Técnica Detalhada](https://github.com/thiagoStella/okexpress/blob/main/docs/DOCUMENTACAO_TECNICA.md)**
