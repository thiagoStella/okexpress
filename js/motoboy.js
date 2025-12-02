// ======================================================
// ARQUIVO: js/motoboy.js
// Lógica COMPLETA do Motoboy (RF-M1 a RF-M6)
// ======================================================

// !! IMPORTANTE !! Cole aqui a sua URL de output do 'ok-express-iac-DEV'
const API_URL = "https://16layzd1jd.execute-api.sa-east-1.amazonaws.com";

// Espera a página carregar
document.addEventListener("DOMContentLoaded", () => {

    // --- Referências aos Elementos ---
    const listaPedidos = document.getElementById("lista-pedidos");
    const motoboyIdDisplay = document.getElementById("motoboy-id");

    // Simulação de Login (baseado no login.js)
    // No mundo real, isso viria de um token (localStorage)
    // Para a demo, vamos "fingir" que sabemos quem está logado.
    const MOTOBY_ID_LOGADO = "thiago"; // Mude para "levy" para simular o outro
    motoboyIdDisplay.innerText = `Motoboy: ${MOTOBY_ID_LOGADO}`;


    // ======================================================
    // LÓGICA DE CARREGAMENTO (RF-M1)
    // ======================================================

    /**
     * RF-M1: Busca os pedidos "AGUARDANDO_ENTREGA" na API
     */
    async function carregarPedidos() {
        console.log("Buscando pedidos para o motoboy...");
        listaPedidos.innerHTML = "Carregando pedidos..."; // Feedback

        try {
            // Chama a API que usa o GSI-1 (DeliveryStatusIndex)
            const response = await fetch(`${API_URL}/pedidos/motoboy`);
            if (!response.ok) {
                throw new Error("Falha ao buscar pedidos.");
            }

            const pedidosProntos = await response.json();

            // Limpa a lista
            listaPedidos.innerHTML = "";

            if (pedidosProntos.length === 0) {
                listaPedidos.innerText = "Nenhum pedido aguardando coleta.";
                return;
            }

            // RF-M2: Renderiza cada card
            for (const pedido of pedidosProntos) {
                renderizarCard(pedido);
            }

        } catch (error) {
            console.error(error);
            listaPedidos.innerText = "Erro ao carregar pedidos.";
        }
    }

    /**
     * RF-M2: Cria o HTML de um card
     */
    function renderizarCard(pedido) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-pedido';
        cardElement.id = pedido.SK; // Damos um ID para o elemento

        // Monta o HTML interno
        cardElement.innerHTML = `
            <div class="card-info">
                <h4>${pedido.pedidoId} (${pedido.nomeCliente})</h4>
                <p>${pedido.enderecoDestino}, ${pedido.bairro}</p>
                <p>Frete: R$ ${pedido.valorFrete.toFixed(2)}</p>
            </div>
            <div class="card-botoes" id="botoes-${pedido.SK}">
                <button class="btn-card btn-coletar">
                    <i class="fas fa-hand-paper"></i> COLETAR
                </button>
            </div>
        `;

        // Adiciona o card à lista na tela
        listaPedidos.appendChild(cardElement);

        // Adiciona o "escutador" de clique (RF-M4)
        const btnColetar = cardElement.querySelector('.btn-coletar');
        btnColetar.onclick = () => {
            handleColetar(pedido.SK);
        };
    }

    // ======================================================
    // LÓGICA DE AÇÕES DO MOTOBOY (RF-M4, M5, M6)
    // ======================================================

    /**
     * RF-M4: Lógica do botão [COLETAR]
     */
    async function handleColetar(pedidoSK) {
        if (!confirm("Confirmar coleta deste pedido?")) return;

        // Atualiza a API
        const sucesso = await atualizarStatusPedido(
            pedidoSK,
            'A_CAMINHO',
            MOTOBY_ID_LOGADO
        );

        if (sucesso) {
            // Atualiza a UI (muda os botões)
            const botoesContainer = document.getElementById(`botoes-${pedidoSK}`);
            botoesContainer.innerHTML = `
                <button class="btn-card btn-devolver">
                    <i class="fas fa-undo-alt"></i> DEVOLVER
                </button>
                <button class="btn-card btn-finalizar">
                    <i class="fas fa-check-circle"></i> FINALIZAR
                </button>
            `;

            // Adiciona novos escutadores
            botoesContainer.querySelector('.btn-devolver').onclick = () => {
                handleDevolver(pedidoSK);
            };
            botoesContainer.querySelector('.btn-finalizar').onclick = () => {
                handleFinalizar(pedidoSK);
            };
        }
    }

    /**
     * RF-M5: Lógica do botão [DEVOLVER] (A "Regra de Honra")
     */
    async function handleDevolver(pedidoSK) {
        if (!confirm("Devolver este pedido para a fila? (Regra de Honra)")) return;

        // Atualiza a API (status volta para 'AGUARDANDO' e motoboyId vira 'null')
        const sucesso = await atualizarStatusPedido(
            pedidoSK,
            'AGUARDANDO_ENTREGA',
            null // RF-M5
        );

        if (sucesso) {
            // Atualiza a UI (volta a ser o botão Coletar)
            const botoesContainer = document.getElementById(`botoes-${pedidoSK}`);
            botoesContainer.innerHTML = `
                <button class="btn-card btn-coletar">
                    <i class="fas fa-hand-paper"></i> COLETAR
                </button>
            `;

            // Adiciona o escutador de volta
            botoesContainer.querySelector('.btn-coletar').onclick = () => {
                handleColetar(pedidoSK);
            };
        }
    }

    /**
     * RF-M6: Lógica do botão [FINALIZAR] (O "Livro-Caixa")
     */
    async function handleFinalizar(pedidoSK) {
        if (!confirm("Finalizar esta entrega?")) return;

        // Atualiza a API (status vira 'ENTREGUE')
        const sucesso = await atualizarStatusPedido(
            pedidoSK,
            'ENTREGUE',
            MOTOBY_ID_LOGADO // Mantém o ID do motoboy para o histórico
        );

        if (sucesso) {
            // Atualiza a UI (Remove o card da lista)
            const cardElement = document.getElementById(pedidoSK);
            cardElement.remove();
        }
    }

    /**
     * Função "Faz-Tudo" que chama a API PATCH
     */
    async function atualizarStatusPedido(pedidoSK, deliveryStatus, motoboyId) {
        // Pega o card e desabilita os botões para evitar clique duplo
        const cardElement = document.getElementById(pedidoSK);
        const botoes = cardElement.querySelectorAll('button');
        botoes.forEach(btn => btn.disabled = true);

        try {
            const response = await fetch(`${API_URL}/pedido/${encodeURIComponent(pedidoSK)}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliveryStatus: deliveryStatus,
                    motoboyId: motoboyId
                })
            });

            if (!response.ok) {
                throw new Error("Falha ao atualizar status na API");
            }

            return true; // Sucesso

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Não foi possível atualizar o pedido. Tente recarregar a página.");
            botoes.forEach(btn => btn.disabled = false); // Reabilita se deu erro
            return false; // Falha
        }
    }


    // --- Inicia o Painel ---
    // Carrega os pedidos assim que a página abre
    carregarPedidos();
});