const cards = [
{
    title: "Mut",
    text: "Heute darfst du einen kleinen Schritt aus deiner Komfortzone wagen."
},
{
    title: "Dankbarkeit",
    text: "Denke heute an drei Dinge, für die du wirklich dankbar bist."
},
{
    title: "Ruhe",
    text: "Nimm dir bewusst fünf Minuten Zeit nur für dich."
},
{
    title: "Kreativität",
    text: "Probiere heute etwas aus, das du noch nie gemacht hast."
},
{
    title: "Vertrauen",
    text: "Nicht alles muss heute kontrolliert werden."
},
{
    title: "Freude",
    text: "Suche heute bewusst nach einem kleinen Glücksmoment."
},
{
    title: "Neuanfang",
    text: "Jeder Tag bietet die Möglichkeit, neu zu beginnen."
},
{
    title: "Gelassenheit",
    text: "Konzentriere dich auf das, was du beeinflussen kannst."
}
];

let deck = [...cards];

const container = document.getElementById("cardContainer");

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];
    }

}

shuffle(deck);

function drawCard(){

    if(deck.length===0){

        alert("Alle Karten wurden gezogen. Der Stapel wird neu gemischt.");

        deck=[...cards];

        shuffle(deck);
    }

    const card=deck.pop();

    container.innerHTML=`
        <div class="card">
            <h2>${card.title}</h2>
            <p>${card.text}</p>
            <small>Noch ${deck.length} Karten im Stapel</small>
        </div>
    `;
}

document.getElementById("drawButton").addEventListener("click",drawCard);

document.getElementById("deck").addEventListener("click",drawCard);

function toggleSettings(){

    const panel=document.getElementById("settingsPanel");

    if(panel.style.display==="block"){

        panel.style.display="none";

    }else{

        panel.style.display="block";

    }

}
