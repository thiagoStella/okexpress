// VERSÃO FINALÍSSIMA

const API_URL = "https://ydebkj5xa0.execute-api.sa-east-1.amazonaws.com/v1/calcular";

// --- Mapeamento dos elementos ---
const calcForm = document.getElementById('calc-form');
const originInput = document.getElementById('origin-input');
const destinationInput = document.getElementById('destination-input');
const resultDiv = document.getElementById('result-div');
const resultValor = document.getElementById('result-valor');
const resultDistancia = document.getElementById('result-distancia');
const submitButton = document.getElementById('submit-button');
const whatsappButtonContainer = document.getElementById('whatsapp-button-container');
const whatsappButton = document.getElementById('whatsapp-button'); // Mudamos de 'whatsapp-link' para 'whatsapp-button'

// --- Variável para guardar a URL do WhatsApp ---
let dynamicWhatsappUrl = '#';

// --- Event Listener para o clique no botão do WhatsApp ---
whatsappButton.addEventListener('click', () => {
    if (dynamicWhatsappUrl !== '#') {
        window.open(dynamicWhatsappUrl, '_blank'); // Abre a URL em uma nova aba
    }
});

// --- Event Listener para o envio do formulário ---
calcForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const originAddress = originInput.value;
    const destinationAddress = destinationInput.value;

    resultDiv.innerHTML = '<p>Calculando...</p>';
    resultValor.textContent = '...';
    resultDistancia.textContent = '...';
    submitButton.disabled = true;
    whatsappButtonContainer.style.display = 'none';

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

        resultDiv.innerHTML = '';
        resultValor.textContent = data.valor;
        resultDistancia.textContent = data.distancia;

        const phone = "41999003318";
        const message = `Olá! Acabei de fazer uma cotação no site.\n\n*Origem:* ${originAddress}\n*Destino:* ${destinationAddress}\n\n*Valor:* ${data.valor}\n*Distância:* ${data.distancia}\n\nGostaria de confirmar a corrida.`;
        
        // Agora apenas guardamos a URL na variável
        dynamicWhatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(message)}`;
        
        whatsappButtonContainer.style.display = 'block';

    } catch (error) {
        console.error('Falha na chamada da API:', error);
        resultDiv.innerHTML = `<p style="color: #ed1e22;">Erro: ${error.message}</p>`;
        resultValor.textContent = 'R$ 0.00';
        resultDistancia.textContent = '0 km';
        whatsappButtonContainer.style.display = 'none';
    } finally {
        submitButton.disabled = false;
    }
});