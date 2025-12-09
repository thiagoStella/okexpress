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

    /**
     * RF-M1: Busca os pedidos disponíveis para o motoboy
     */
    async function carregarPedidos() {
        console.log("Buscando pedidos para motoboys...");
        listaPedidos.innerHTML = '<p>Carregando...</p>';

        try {
            const response = await fetch(`${API_URL}/pedidos/motoboy`);

            if (!response.ok) {
                throw new Error("Falha ao buscar pedidos.");
            }

            const pedidos = await response.json();
            listaPedidos.innerHTML = ""; // Limpa

            if (pedidos.length === 0) {
                listaPedidos.innerHTML = '<p>Nenhum pedido aguardando entrega no momento.</p>';
                return;
            }

            pedidos.forEach(pedido => {
                renderizarCardMotoboy(pedido);
            });

        } catch (error) {
            console.error(error);
            listaPedidos.innerHTML = `<p style="color:red">Erro: ${error.message}</p>`;
        }
    }

    /**
     * Renderiza um card de pedido na lista
     */
    function renderizarCardMotoboy(pedido) {
        const card = document.createElement('div');
        card.className = 'card-pedido';
        card.id = pedido.SK;

        let botoesHTML = '';

        // Se o pedido está AGUARDANDO, qualquer um pode pegar
        if (pedido.deliveryStatus === 'AGUARDANDO_ENTREGA') {
            botoesHTML = `
                <button class="btn-card btn-coletar">
                    <i class="fas fa-hand-paper"></i> COLETAR
                </button>
             `;
        }
        // Se está A_CAMINHO, só quem pegou vê os botões de ação
        else if (pedido.deliveryStatus === 'A_CAMINHO' && pedido.motoboyId === MOTOBY_ID_LOGADO) {
            botoesHTML = `
                <button class="btn-card btn-devolver">
                    <i class="fas fa-undo-alt"></i> DEVOLVER
                </button>
                <button class="btn-card btn-finalizar">
                    <i class="fas fa-check-circle"></i> FINALIZAR
                </button>
             `;
        } else {
            // Se está a caminho com OUTRO motoboy, ou entregue, não mostra nada (ou nem deveria vir da API)
            return;
        }

        card.innerHTML = `
            <h4>Pedido #${pedido.pedidoId}</h4>
            <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
            <p><strong>Endereço:</strong> ${pedido.enderecoDestino}, ${pedido.bairro}</p>
            <p><strong>Frete:</strong> R$ ${pedido.valorFrete.toFixed(2)}</p>
            <div id="botoes-${pedido.SK}" class="botoes-card">
                ${botoesHTML}
            </div>
        `;

        listaPedidos.appendChild(card);

        // Adiciona listeners aos botões recém-criados
        const btnColetar = card.querySelector('.btn-coletar');
        if (btnColetar) btnColetar.onclick = () => handleColetar(pedido.SK);

        const btnDevolver = card.querySelector('.btn-devolver');
        if (btnDevolver) btnDevolver.onclick = () => handleDevolver(pedido.SK);

        const btnFinalizar = card.querySelector('.btn-finalizar');
        if (btnFinalizar) btnFinalizar.onclick = () => handleFinalizar(pedido.SK);
    }

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