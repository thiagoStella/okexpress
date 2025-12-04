// ======================================================
// ARQUIVO: js/atendente.js
// Lógica COMPLETA do Atendente (RF-A1, A2, A3, A4, A5, A7)
// ======================================================

// !! IMPORTANTE !! Cole aqui a sua URL de output do 'ok-express-iac-DEV'
const API_URL = "https://16layzd1jd.execute-api.sa-east-1.amazonaws.com";

// Nomes dos dias para a simulação
const DIAS_DA_SEMANA = ["", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

// Espera a página carregar
document.addEventListener("DOMContentLoaded", () => {

    // --- Referências aos Elementos da Página ---
    const displayDia = document.getElementById("display-dia");
    const btnFecharLoja = document.getElementById("btn-fechar-loja");
    const formPedido = document.getElementById("form-pedido");

    // Referências das Colunas do Kanban
    const colunaPreparo = document.getElementById("coluna-preparo");
    const colunaAguardando = document.getElementById("coluna-aguardando");
    const colunaCaminho = document.getElementById("coluna-caminho");
    const colunaEntregue = document.getElementById("coluna-entregue");

    // --- LÓGICA DE CONTROLE DE TEMPO (RF-A2, RF-A7) ---

    let diaDaDemo = parseInt(localStorage.getItem('diaDaDemo')) || 1;
    displayDia.innerText = `[DIA ${diaDaDemo} - ${DIAS_DA_SEMANA[diaDaDemo]}]`;

    btnFecharLoja.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja fechar o dia e avançar para o próximo?")) {
            let proximoDia = diaDaDemo + 1;
            if (proximoDia > 7) {
                proximoDia = 1;
            }
            localStorage.setItem('diaDaDemo', proximoDia);
            location.reload();
        }
    });

    // --- LÓGICA DE CADASTRO DE PEDIDO (RF-A1, RF-A3) ---

    formPedido.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnSalvar = document.getElementById("btn-salvar-pedido");
        btnSalvar.disabled = true;
        btnSalvar.innerText = "Calculando rota e salvando...";

        const dadosDoForm = {
            numeroPedido: document.getElementById('numeroPedido').value.trim(),
            nomeCliente: document.getElementById('nomeCliente').value.trim(),
            enderecoDestino: document.getElementById('enderecoDestino').value.trim(),
            bairro: document.getElementById('bairro').value,
            diaSimulado: diaDaDemo
        };

        // --- VALIDAÇÃO (Input Hygiene) ---
        if (!dadosDoForm.numeroPedido || !dadosDoForm.nomeCliente || !dadosDoForm.enderecoDestino) {
            alert("Por favor, preencha todos os campos obrigatórios (Pedido, Cliente, Endereço).");
            btnSalvar.disabled = false;
            btnSalvar.innerText = "Salvar Pedido";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/pedido`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosDoForm)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || "Erro desconhecido da API");
            }

            const pedidoSalvo = await response.json();

            console.log("Pedido salvo!", pedidoSalvo);
            alert(`Pedido #${pedidoSalvo.pedidoId} salvo com frete de R$ ${pedidoSalvo.valorFrete.toFixed(2)}!`);

            // RF-A5: Adiciona o novo card direto na coluna "Em Preparo"
            renderizarCard(pedidoSalvo);

            formPedido.reset();

        } catch (error) {
            console.error("Falha ao salvar pedido:", error);
            alert(`Erro ao salvar pedido: ${error.message}`);
        } finally {
            btnSalvar.disabled = false;
            btnSalvar.innerText = "Salvar Pedido";
        }
    });

    // ======================================================
    // LÓGICA DO KANBAN (RF-A4, RF-A5) - (Implementação)
    // ======================================================

    /**
     * RF-A4: Busca os pedidos do dia na API e os renderiza
     */
    async function carregarKanban(dia) {
        console.log(`Buscando pedidos para o dia ${dia}...`);

        // Limpa as colunas antes de carregar
        colunaPreparo.innerHTML = "";
        colunaAguardando.innerHTML = "";
        colunaCaminho.innerHTML = "";
        colunaEntregue.innerHTML = "";

        try {
            const response = await fetch(`${API_URL}/pedidos/atendente/${dia}`);
            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || "Falha ao buscar pedidos do dia.");
            }

            const pedidosDoDia = await response.json();
            console.log("Pedidos recebidos:", pedidosDoDia);

            if (pedidosDoDia.length === 0) {
                colunaPreparo.innerText = "Nenhum pedido para este dia ainda.";
                return;
            }

            // 2. Renderiza cada card na coluna correta
            for (const pedido of pedidosDoDia) {
                renderizarCard(pedido);
            }

        } catch (error) {
            console.error(error);
            colunaPreparo.innerText = `Erro ao carregar pedidos: ${error.message}`;
        }
    }

    /**
     * RF-A4/A5: Cria o HTML de um card e o coloca na coluna correta
     */
    function renderizarCard(pedido) {
        // 1. Cria o elemento principal (o "card")
        const cardElement = document.createElement('div');
        cardElement.className = 'card-pedido';

        cardElement.dataset.sk = pedido.SK;
        cardElement.id = pedido.SK;

        // 2. Monta o HTML interno do card
        cardElement.innerHTML = `
            <h4>${pedido.pedidoId} (${pedido.nomeCliente})</h4>
            <p>${pedido.enderecoDestino}, ${pedido.bairro}</p>
            <p>Frete: R$ ${pedido.valorFrete.toFixed(2)}</p>
        `;

        // 3. Adiciona o botão [Pronto!] (Apenas se RF-A5 for aplicável)
        if (pedido.deliveryStatus === 'EM_PREPARO') {
            const btnPronto = document.createElement('button');
            btnPronto.className = 'btn-card';
            btnPronto.innerText = 'Pronto!';

            // Adiciona o "escutador" de clique (RF-A5)
            btnPronto.onclick = () => {
                handleMoverParaAguardando(pedido.SK);
            };

            cardElement.appendChild(btnPronto);

            // 4. Coloca o card na coluna "Em Preparo"
            colunaPreparo.appendChild(cardElement);

        } else if (pedido.deliveryStatus === 'AGUARDANDO_ENTREGA') {
            colunaAguardando.appendChild(cardElement);

        } else if (pedido.deliveryStatus === 'A_CAMINHO') {
            colunaCaminho.appendChild(cardElement);

        } else if (pedido.deliveryStatus === 'ENTREGUE') {
            cardElement.classList.add('card-entregue'); // (Fica cinza)
            colunaEntregue.appendChild(cardElement);
        }
    }

    /**
     * RF-A5: Lógica do botão [Pronto!]
     */
    async function handleMoverParaAguardando(pedidoSK) {
        console.log(`Movendo pedido ${pedidoSK} para "Aguardando Entrega"...`);

        const cardElement = document.getElementById(pedidoSK);
        if (!cardElement) return;

        const btn = cardElement.querySelector('button');
        if (btn) btn.disabled = true;

        try {
            // 1. Chama a API "Faz-Tudo" (PATCH)
            const response = await fetch(`${API_URL}/pedido/${encodeURIComponent(pedidoSK)}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliveryStatus: 'AGUARDANDO_ENTREGA'
                })
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || "Falha ao atualizar status na API");
            }

            // 2. A "Mágica" (RF-A6): Move o card de coluna, sem recarregar!
            if (btn) btn.remove();
            colunaAguardando.appendChild(cardElement);

        } catch (error) {
            console.error("Erro ao mover card:", error);
            alert(`Não foi possível mover o card: ${error.message}`);
            if (btn) btn.disabled = false;
        }
    }

    // --- Inicia o Kanban ---
    carregarKanban(diaDaDemo);
});