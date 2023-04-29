getInfo();

document.getElementById( "search" ).addEventListener( "click", search); 

//Funktio joka hakee kaikki dokumentit kannasta
function getInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/getall", false);

    xhttp.onreadystatechange = function() {
        document.getElementById("forum").innerHTML = xhttp.response;
    };

    xhttp.send();
}

//Luodaan Event Listenerit kaikille "poisto" napeille
var closeButtons = document.getElementsByClassName( "delete" );

for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", deleteDocument);
}

//Luodaan Event Listernerit kaikille "päivitys" napeille
var updateButtons = document.getElementsByClassName( "update" );

for (let i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener("click", updateDocument);
}

//Funktio komentin/dokumentin poistamiseen
function deleteDocument() {
    var id = this.parentElement.id;

    var uri = "/api/delete/" + id;

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", uri, false);

    xhttp.onreadystatechange = function() {
        window.location.href = '/';
    }

    xhttp.send();
}

function updateDocument() {
    var date =new Date;
    var id = this.parentElement.id;

    var uri = "/api/update/" + id;

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", uri, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function() {
        window.location.href = '/';
        document.getElementById( "updated" ).classList.remove( "hidden" )
    }

    const updates = JSON.stringify({
        "username":"Viivi",
        "country":"Finland",
        "message":"Moromoro!",
        "time":date
    });

    xhttp.send( updates );
}

function search() {
    var haku = document.getElementById( "hakuehto" );
    var hakuehto = haku.value;

    var uri = "/api/" + hakuehto;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", uri, false);

    xhttp.onreadystatechange = function() {
        console.log( "Tiedon haku onnistu!" );
    };

    xhttp.send();

    haku.value = "";
}