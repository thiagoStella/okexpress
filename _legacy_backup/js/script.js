let menuIcon = document.querySelector('#menu-icon'); 
let navlist = document.querySelector('.navlist');

function clickMenu(){
    
    // Mostra/Esconde o menu usando a classe .active
    
    navlist.classList.toggle('active');
    // Troca o ícone de 'menu' para 'X' e vice-versa
    if (menuIcon.classList.contains('bx-menu')) {
        menuIcon.classList.remove('bx-menu');
        menuIcon.classList.add('bx-x');
    } else {
        menuIcon.classList.remove('bx-x');
        menuIcon.classList.add('bx-menu');
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