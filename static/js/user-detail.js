

let editButton = document.querySelector('.edit');

editButton.addEventListener('click', function () {
    overlay.style.display = 'block';
    modal.style.display = 'block';
});

let closeButtonRediger = document.querySelector('.close');

closeButtonRediger.addEventListener('click', function(){
    overlay.style.display = 'none';
    modal.style.display = 'none';
});

