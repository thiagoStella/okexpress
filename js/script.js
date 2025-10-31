let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');


function clickMenu(){
    if (navlist.style.display == 'block') {
        navlist.style.display = 'none';
    }else{
        navlist.style.display = 'block';
    }
}

// Pega o elemento do header
const header = document.querySelector("header");

// Escuta o evento de scroll da janela
window.addEventListener("scroll", function () {
    // Adiciona a classe 'window-scrolled' ao header se o scroll for maior que 10 pixels
    // Remove a classe se o scroll voltar para o topo
    header.classList.toggle("window-scrolled", window.scrollY > 10);
});