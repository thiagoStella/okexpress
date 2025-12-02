// ======================================================
// ARQUIVO: js/ok.js
// Lógica do Dashboard do Admin (RF-D3: Fechar Ciclo)
// ======================================================

// !! IMPORTANTE !! Cole aqui a sua URL de output do 'ok-express-iac-DEV'
const API_URL = "https://16layzd1jd.execute-api.sa-east-1.amazonaws.com";

// ID Fixo do Lojista (para a demo)
const LOJISTA_ID = "LOJISTA#PIZZARIADOZE";

document.addEventListener("DOMContentLoaded", () => {
    
    const btnFecharCiclo = document.getElementById("btn-fechar-ciclo");

    /**
     * RF-D3: Lógica do botão "Fechar Ciclo Semanal"
     */
    btnFecharCiclo.addEventListener("click", async () => {
        
        if (!confirm("TEM CERTEZA?\n\nIsso irá 'pagar' todos os fretes pendentes da 'Pizzaria do Zé' e zerar o ciclo financeiro.")) {
            return;
        }

        btnFecharCiclo.disabled = true;
        btnFecharCiclo.innerText = "Processando...";

        try {
            // 1. Chama a API "mágica" de finanças
            const response = await fetch(`${API_URL}/ciclo/fechar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lojistaId: LOJISTA_ID 
                })
            });

            if (!response.ok) {
                throw new Error("Falha ao fechar o ciclo na API.");
            }
            
            const resultado = await response.json();

            // 2. A Prova!
            alert(`SUCESSO!\n\nCiclo fechado. ${resultado.pedidosAtualizados} pedidos foram marcados como 'PAGO'.\n\n(Peça ao 'Lojista' para recarregar (F5) o dashboard dele. O valor deverá estar R$ 0,00)`);
            
        } catch (error) {
            console.error("Erro ao fechar ciclo:", error);
            alert("Erro ao fechar o ciclo. Verifique o console.");
        } finally {
            btnFecharCiclo.disabled = false;
            btnFecharCiclo.innerText = "FECHAR CICLO SEMANAL";
        }
    });

});