let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
let allTds;
let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
    showModal();
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
    showModal();
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
    showModal();
}

function showCalendar(month, year) {

    fetch('/vagtApi/getVagter', {
        method: 'GET',
        headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
    }).then((res) => { 
        res.text().then( text => {

            vagter = JSON.parse(text)

            let firstDay = (new Date(year, month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();
        
            let tbl = document.getElementById("calendar-body"); // body of the calendar
        
            // clearing all previous cells
            tbl.innerHTML = "";
        
            // filing data about month and in the page via DOM.
            monthAndYear.innerHTML = months[month] + " " + year;
            selectYear.value = year;
            selectMonth.value = month;
        
            // creating all cells
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // creates a table row
                let row = document.createElement("tr");
        
                //creating individual cells, filing them up with data.
                for (let j = 0; j < 7; j++) {
        
                    if (i === 0 && j < firstDay) {
                        let cell = document.createElement("td");
                        let cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth) {
                        break;
                    }
                    else {
                        let cell = document.createElement("td");
                        let allDates = document.createElement("h4");
                        let cellText = document.createTextNode(date);
                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            cell.classList.add("bg-info");
                        } // color today's date
                        allDates.innerHTML = date// + " " + month + " " + year;
                        cell.appendChild(allDates);
                        row.appendChild(cell);

                        theDateStr = year + "-" + ('0'+(month + 1)).slice(-2) + "-" + ('0'+(date)).slice(-2)
                if (theDateStr in vagter) {
                    let vagtInfo = document.createElement("div");

                    out = ''
                    for (let i = 0; i < vagter[theDateStr].length; i++) {
                        vagtDict = vagter[theDateStr][i]

                        out += "<p>" + vagtDict.userName + "</p>" + "<p>" + vagtDict.timeFrom + 
                        " - "  + vagtDict.timeTo + "</p>"
                    }

                    vagtInfo.innerHTML = out
                    cell.appendChild(vagtInfo);
                }
                        date++;
                    }
                }
                tbl.appendChild(row); // appending each row into calendar body.
            }



            function showModal(){
                // Show modal-window:
                allTds = document.querySelectorAll('td');
                let overlay = document.getElementById('overlay');
                let modal = document.getElementById('modal');
            
                for(td of allTds){ 
                    td.addEventListener('click', function(){
                        if(this.innerHTML !== ''){
                            overlay.style.display = 'block';
                            modal.style.display = 'block';
                            insertDate(this);
                        }   
                    });
                }
            }
            
            showModal();
            
            // Hide modal-window:
            let btnCancel = document.getElementById('btnCancel');
            
            btnCancel.addEventListener('click', function(){
                overlay.style.display = 'none';
                modal.style.display = 'none';
            })
            
            // Indsætter dag/måned/år i showModal:
            function insertDate(td){
                let day = td.children[0].innerHTML;
                let month = parseInt(selectMonth.value) + 1;
                let year = selectYear.value;
                let date = document.getElementById('date');
                let dateString = year.toString() + '-' + month.toString().padStart(2, 0) + '-' + day.toString().padStart(2, 0);
                date.value = dateString;
            }
            
            
            let usersSelect = document.getElementById('users');
            
            let accHtml = "<option disabled selected>Vælg bruger</option>";



            function refreshUsers() {
                return fetch('/admin/getUsers', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
                    body: '{"minNøgle": "hej123123123"}'
                }).then((res) => { 
                    res.text().then( text => {
            
                        var users2 = JSON.parse(text)
                        for(let i = 0; i < users2.length; i++){
                            accHtml += "<option value=" + users2[i].userName + ">" + users2[i].userName + "</option>";
                        }
                        usersSelect.innerHTML = accHtml;
            
            
                    })
                })
            }
            
            refreshUsers()

        })
    })

}
