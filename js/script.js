let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');


function clickMenu(){
    if (navlist.style.display == 'block') {
        navlist.style.display = 'none'
    }else{
        navlist.style.display = 'block'
    }
}

