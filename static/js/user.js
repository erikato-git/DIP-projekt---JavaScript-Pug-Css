let submitButton = document.querySelector('button[type="submit"]');
let inputs = document.querySelectorAll('form input:not(#photo):not(#female):not(#male):not(#birthday)');
let overlay = document.querySelector('#overlay');
let modal = document.querySelector('#modal');
let closeButtonPopup = document.querySelector('.close');

closeButtonPopup.addEventListener('click', function(){
    overlay.style.display = 'none';
    modal.style.display = 'none';
});


let tbodyTag = document.querySelector('tbody');


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function displayUser(inputUsername) {
    console.log(inputUsername)


    for (let i = 0; i < users.length; i++) {
        user = users[i]

        if (user.userName === inputUsername) {
            console.log(user)
            for (key in user) {

                if (key === 'birthday') {
                    $("#" + key).val(formatDate(user[key]))
                    continue
                } else if (key === 'sex') {
                    //$('#female').checked = true
                    user[key] === 'mand' ? $('#male').attr('checked', true) : $('#female').attr('checked', true)
                }
                $("#" + key).val(user[key])
            }

        }
    
    
    }



    overlay.style.display = 'block';
    modal.style.display = 'block';
}

let buttons = document.querySelectorAll('.create, .edit');

for(button of buttons){
    button.addEventListener('click', function(){
        overlay.style.display = 'block';
        modal.style.display = 'block';
    });
}

for(input of inputs){
    input.addEventListener('keyup', function(){
        hideError();
    });
}

submitButton.addEventListener('click', function(){
    for(input of inputs){
        if(this.type !== 'email'){
            if(!normalChars(this.value)){
                showError(this, 'Kun bogstaver og tal tilladt');
                return false;
            }
        }
        if(this === document.querySelector('#address')){
            if(!validAddress(this.value)){
                showError(this, 'Mindst et tal og et bogstav');
                return false;
            }
        }
        if(this.type === 'email'){
            if(!validEmail(this.value)){
                showError(this, 'En gyldig email');
                return false;
            }
        }
        if(this.type === 'password'){
            if(!validPassword(this.value)){
                showError(this, 'Kun bogstaver og tal tilladt');
                return false;
            }
        }
    }
});

//husk at trimme input strings for whitespaces

function showError(inputElement, errorMessage){
    let messageElement = document.createElement('p');
    messageElement.setAttribute('class', 'error');
    let message = document.createTextNode(errorMessage);
    messageElement.appendChild(message);
    inputElement.insertAdjacentElement('afterend', messageElement);
}

function hideError(){
    let pTag = document.querySelector('form p');
    if(pTag){
        pTag.remove();
    }
}

function normalChars(value){
    //let noSpecialChars = /^[A-z0-9][^@]*$/g;
    //let noSpecialChars = /^[a-zA-Z0-9æøåÆØÅ]*$/;
    let noSpecialChars = /^[a-z0-9]+$/g;
    return noSpecialChars.test(value);
}

function validAddress(value){
    let minOneNumOneChar = /^/;
    return minOneNumOneChar.test(value);
}

function validEmail(value){
    let oneDotoneAt = /^/; //Et punktum, et @, mindst 2 bogstaver efter punktum og mindst en karakter før og efter @
    return oneDotoneAt.test(value);
}

function validPassword(value){
    let minOneNumOneLowerCharOneUpperChar = /^/; //sæt min length attribute
    return minOneNumOneLowerCharOneUpperChar.test(value);
}
users = [{"email":"jens@mail.com","er_admin":true,"address":"arhusvej 12","city":"aarhus","firstName":"jens","phone":"112","lastName":"Jensen","zip":"6000","salt":"1A8FB30","userName":"jensJensen","hashed_password":"a364e6e2583eaed198034176fb7040656240c2bca383dfd2b9ca842d382dc337","birthday":"03-03-1995","sex":"kvinde"}]

dummyBruger = users[0]

for (key in dummyBruger) {
	$("#" + key).val(dummyBruger[key])
}

var users = []

function refreshUsers() {

    console.log("start")
    fetch('/admin/getUsers', {
        method: 'POST',
        headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
        body: '{"minNøgle": "-"}'
    }).then((res) => { 
        res.text().then( text => {
            console.log(text)
            users = JSON.parse(text)
            renderUsers()
        })
    })
}


function renderUsers() {

    let accHtml = '<tr><th>Brugere</th><th>Handlinger</th></tr>';

    for (let i = 0; i < users.length; i++) {
        user = users[i]
    
    
        userInQts = "'" + user.userName + "'"
    
        accHtml += '<tr>';
        accHtml += '<td>' + user.userName + '</td>';
        accHtml += '<td><button class="edit" onclick="displayUser(' + userInQts + ')">Rediger</button><button class="delete" onClick="deleteUser(' + 
            userInQts + ')">Slet</button></td>'
         //'onClick="deleteuser(' + userInQts + ')>Slet</button></td>';
        accHtml += '</tr>';
    }
    tbodyTag.innerHTML = accHtml;
    console.log(accHtml)
}


function deleteUser(userName) {

    fetch('/admin/deleteUser', {
        method: 'POST',
        headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
        body: '{"userName": "' + userName + '"}'
    }).then((res) => { 
        res.text().then( text => {
            refreshUsers()
        })
    })
}


/*





buttons = document.querySelectorAll('.create, .edit');

for(button of buttons){
    button.addEventListener('click', function(){
        overlay.style.display = 'block';
        modal.style.display = 'block';
    });
}

*/