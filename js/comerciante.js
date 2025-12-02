// ======================================================
// ARQUIVO: js/comerciante.js
// Lógica do Dashboard do Lojista (RF-D1)
// ======================================================

// !! IMPORTANTE !! Cole aqui a sua URL de output do 'ok-express-iac-DEV'
const API_URL = "https://16layzd1jd.execute-api.sa-east-1.amazonaws.com";

// ID Fixo do Lojista (para a demo)
const LOJISTA_ID = "LOJISTA#PIZZARIADOZE";

document.addEventListener("DOMContentLoaded", () => {

    const totalAPagarEl = document.getElementById("total-a-pagar");
    const tabelaCorpoEl = document.getElementById("tabela-corpo");

    /**
     * RF-D1: Busca os dados financeiros e operacionais da API
     */
    async function carregarDashboard() {
        totalAPagarEl.innerText = "Carregando...";
        tabelaCorpoEl.innerHTML = `<tr><td colspan="5">Carregando...</td></tr>`;

        try {
            // Chama a API que usa o GSI-2 (PaymentStatusIndex)
            const response = await fetch(`${API_URL}/pedidos/lojista/${encodeURIComponent(LOJISTA_ID)}`);
            if (!response.ok) {
                throw new Error("Falha ao buscar dados do lojista.");
            }

            // A API (que nós escrevemos no app.mjs) já retorna os dados mastigados!
            const dados = await response.json();

            // RF-D1: Visão Financeira (Foco na Semana)
            // A API já nos manda o total calculado (totalAPagar)
            const formattedPrice = dados.totalAPagar.toLocaleString('pt-BR', {
                style: 'currency', currency: 'BRL'
            });
            totalAPagarEl.innerText = formattedPrice;

            // RF-D1: Visão Operacional (Foco no Dia/Semana)
            // Limpa a tabela
            tabelaCorpoEl.innerHTML = "";

            if (dados.pedidosPendentes.length === 0) {
                tabelaCorpoEl.innerHTML = `<tr><td colspan="5">Nenhum pedido pendente de pagamento.</td></tr>`;
                return;
            }

            // Preenche a tabela com os pedidos pendentes
            for (const pedido of dados.pedidosPendentes) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>Dia ${pedido.diaSimulado}</td>
                    <td>${pedido.pedidoId}</td>
                    <td>${pedido.motoboyId || 'N/D'}</td>
                    <td>${pedido.enderecoDestino}</td>
                    <td>R$ ${pedido.valorFrete.toFixed(2)}</td>
                `;
                tabelaCorpoEl.appendChild(tr);
            }

        } catch (error) {
            console.error(error);
            totalAPagarEl.innerText = "ERRO";
            tabelaCorpoEl.innerHTML = `<tr><td colspan="5">Erro ao carregar dados.</td></tr>`;
        }
    }

    // Carrega o dashboard assim que a página abre
    carregarDashboard();
});