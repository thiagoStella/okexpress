// Espera a página carregar antes de rodar o script
document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("login-form");
    const loginInput = document.getElementById("login");
    const senhaInput = document.getElementById("senha");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", (event) => {
        // Impede o formulário de recarregar a página
        event.preventDefault(); 

        const login = loginInput.value;
        const senha = senhaInput.value;

        // RF-L3: Lógica de Redirecionamento "Fake"
        switch (login) {
            case "atendente":
                if (senha === "atendente") {
                    window.location.href = 'atendente.html';
                }
                break;
            case "thiago":
                if (senha === "thiago") {
                    window.location.href = 'motoboy.html';
                }
                break;
            case "levy":
                if (senha === "levy") {
                    window.location.href = 'motoboy.html';
                }
                break;
            case "comerciante":
                if (senha === "comerciante") {
                    window.location.href = 'comerciante.html';
                }
                break;
            case "ok":
                if (senha === "ok") {
                    window.location.href = 'ok.html';
                }
                break;
            default:
                // RF-L4: Tratamento de Erro
                showError("Login/Senha inválidos");
        }
        
        // RF-L4: Tratamento de Erro (caso o usuário esteja certo mas a senha errada)
        if (window.location.href.endsWith('login.html')) { // Se não redirecionou
             showError("Login/Senha inválidos");
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        // Limpa a mensagem de erro após 3 segundos
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 3000);
    }
});