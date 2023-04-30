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

//Luodaan Event Listenerit kaikille "päivitys" napeille
var updateButtons = document.getElementsByClassName( "update" );

for (let i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener("click", updateDocument);
}

//Luodaan Event Listenerit kaikille "tallennus" napeille
var saveButtons = document.getElementsByClassName( "save" );

for (let i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener("click", saveDocument);
}

//Funktio kommentin/dokumentin poistamiseen
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

//Funktio kommentin/dokumentin viestin päivittämiseen
function updateDocument() {
    let card_header = this.parentElement;
    let this_card = card_header.parentElement;
    var element = this_card.querySelector( "#message" );

    card_header.querySelector( "#save" ).classList.remove( "hidden" );

    if( element.disabled == true){
        element.disabled = false;
    }
}

//Funktio kommentin tallentamiseen
function saveDocument() {
    var id = this.parentElement.id;
    let card_header = this.parentElement;
    let this_card = card_header.parentElement;

    var element = this_card.querySelector( "#message" );

    var message = element.value;

    var uri = "/api/update/" + id;

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", uri, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function() {
        this_card.querySelector("#updated").classList.remove("hidden")
        element.disabled = true;
        //window.location.href = '/';
    }

    const updates = JSON.stringify({
        "message": message,
        "time" : new Date()
    });

    xhttp.send( updates );    
}

//Funktio kommentin hakemiseen
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