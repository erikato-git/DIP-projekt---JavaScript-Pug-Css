let menuButton = document.querySelector('#menuButton');
let menu = document.querySelector('nav');
let closeButton = document.querySelector('.close');

menuButton.addEventListener('click', function(){
    if(menu.getAttribute('class') === 'visible'){
        menu.removeAttribute('class');
        this.removeAttribute('class');
        this.innerHTML = 'Menu';
    }
    else{
        menu.setAttribute('class', 'visible');
        this.setAttribute('class', 'move');
        this.innerHTML = '&#10006;';
    }
});