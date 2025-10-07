// Arquivo: js/calculadora.js - VERSÃO FINAL COM WHATSAPP DINÂMICO

// --- URL DA API ---
const API_URL = "https://ydebkj5xa0.execute-api.sa-east-1.amazonaws.com/v1/calcular";

// --- Mapeamento dos elementos do HTML ---
const calcForm = document.getElementById('calc-form');
const originInput = document.getElementById('origin-input');
const destinationInput = document.getElementById('destination-input');
const resultDiv = document.getElementById('result-div');
const resultValor = document.getElementById('result-valor');
const resultDistancia = document.getElementById('result-distancia');
const submitButton = document.getElementById('submit-button');
// --- Novos elementos para o botão WhatsApp ---
const whatsappButtonContainer = document.getElementById('whatsapp-button-container');
const whatsappLink = document.getElementById('whatsapp-link');

// --- O que acontece quando o formulário é enviado ---
calcForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const originAddress = originInput.value;
    const destinationAddress = destinationInput.value;

    // Feedback visual para o usuário
    resultDiv.innerHTML = '<p>Calculando...</p>';
    resultValor.textContent = '...';
    resultDistancia.textContent = '...';
    submitButton.disabled = true;
    whatsappButtonContainer.style.display = 'none'; // Esconde o botão ao iniciar novo cálculo

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                origin: originAddress,
                destination: destinationAddress
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ocorreu um erro ao calcular.');
        }

        // --- SUCESSO! ATUALIZA A TELA ---
        resultDiv.innerHTML = '';
        resultValor.textContent = data.valor;
        resultDistancia.textContent = data.distancia;

        // --- MONTA A MENSAGEM DINÂMICA DO WHATSAPP ---
        const phone = "41999003318"; // Número de telefone da OK Express
        const message = `Olá! Acabei de fazer uma cotação no site.\n\n*Origem:* ${originAddress}\n*Destino:* ${destinationAddress}\n\n*Valor:* ${data.valor}\n*Distância:* ${data.distancia}\n\nGostaria de confirmar a corrida.`;
        
        // Codifica a mensagem para ser usada em uma URL
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(message)}`;
        
        // Atualiza o link do botão e o exibe na tela
        whatsappLink.href = whatsappUrl;
        whatsappButtonContainer.style.display = 'block';

    } catch (error) {
        // --- ERRO! MOSTRA A MENSAGEM DE ERRO NA TELA ---
        console.error('Falha na chamada da API:', error);
        resultDiv.innerHTML = `<p style="color: #ed1e22;">Erro: ${error.message}</p>`;
        resultValor.textContent = 'R$ 0.00';
        resultDistancia.textContent = '0 km';
        whatsappButtonContainer.style.display = 'none'; // Garante que o botão fique escondido se der erro
    } finally {
        // Este bloco SEMPRE executa, seja com sucesso ou erro
        submitButton.disabled = false; // Reabilita o botão de cálculo
    }
});