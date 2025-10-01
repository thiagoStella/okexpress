// Arquivo: js/calculadora.js

// --- PASSO 1: COLE A URL DA SUA API AQUI ---
// Substitua a string abaixo pela URL de Invocação que você copiou do API Gateway.
// Garanta que o caminho /calcular esteja no final!
const API_URL = "https://cwf0s13bkc.execute-api.sa-east-1.amazonaws.com/v1";

// --- Mapeamento dos elementos do HTML ---
const calcForm = document.getElementById('calc-form');
const originInput = document.getElementById('origin-input');
const destinationInput = document.getElementById('destination-input');
const resultDiv = document.getElementById('result-div');
const resultValor = document.getElementById('result-valor');
const resultDistancia = document.getElementById('result-distancia');
const submitButton = document.getElementById('submit-button');

// --- O que acontece quando o formulário é enviado ---
calcForm.addEventListener('submit', async (event) => {
    // Impede o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // Pega os valores digitados nos campos de endereço
    const originAddress = originInput.value;
    const destinationAddress = destinationInput.value;

    // Feedback visual para o usuário
    resultDiv.innerHTML = '<p>Calculando...</p>';
    resultValor.textContent = '...';
    resultDistancia.textContent = '...';
    submitButton.disabled = true; // Desabilita o botão para evitar cliques duplos

    // Bloco try...catch para lidar com possíveis erros na chamada
    try {
        // --- A MÁGICA ACONTECE AQUI ---
        const response = await fetch(API_URL, {
            method: 'POST', // Estamos enviando dados
            headers: {
                'Content-Type': 'application/json' // Avisamos que estamos enviando JSON
            },
            // Montamos o corpo da requisição no formato que nosso Lambda espera
            body: JSON.stringify({
                origin: originAddress,
                destination: destinationAddress
            })
        });

        // Pega a resposta da API e a transforma em um objeto JavaScript
        const data = await response.json();

        // Se a resposta da API indicar um erro (ex: status 500)
        if (!response.ok) {
            // Lança um erro com a mensagem que veio do nosso backend
            throw new Error(data.error || 'Ocorreu um erro ao calcular.');
        }

        // --- SUCESSO! ATUALIZA A TELA ---
        resultDiv.innerHTML = ''; // Limpa a mensagem de "Calculando..."
        resultValor.textContent = data.valor;
        resultDistancia.textContent = data.distancia;

    } catch (error) {
        // --- ERRO! MOSTRA A MENSAGEM DE ERRO NA TELA ---
        console.error('Falha na chamada da API:', error);
        resultDiv.innerHTML = `<p style="color: #ed1e22;">Erro: ${error.message}</p>`;
        resultValor.textContent = 'R$ 0.00';
        resultDistancia.textContent = '0 km';
    } finally {
        // Este bloco SEMPRE executa, seja com sucesso ou erro
        submitButton.disabled = false; // Reabilita o botão
    }
});