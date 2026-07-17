// -----------------------------
// Standardkarten
// -----------------------------
const defaultCards = [
    {
        title: "Mut",
        text: "Heute darfst du einen kleinen Schritt aus deiner Komfortzone wagen.",
        color: "#ffffff"
    },
    {
        title: "Dankbarkeit",
        text: "Denke heute an drei Dinge, für die du wirklich dankbar bist.",
        color: "#fff5b7"
    },
    {
        title: "Ruhe",
        text: "Nimm dir bewusst fünf Minuten Zeit nur für dich.",
        color: "#d9f7ff"
    },
    {
        title: "Freude",
        text: "Suche heute bewusst nach einem kleinen Glücksmoment.",
        color: "#ffe0b2"
    }
];

// -----------------------------
// Karten laden
// -----------------------------
let cards = JSON.parse(localStorage.getItem("cards"));

if (!cards) {
    cards = [...defaultCards];
    saveCards();
}

let deck = [...cards];

const container = document.getElementById("cardContainer");

// -----------------------------
// Speichern
// -----------------------------
function saveCards() {
    localStorage.setItem("cards", JSON.stringify(cards));
    refreshDeleteList();
}

// -----------------------------
// Mischen
// -----------------------------
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}

shuffle(deck);

// -----------------------------
// Karte ziehen
// -----------------------------
function replaceVariables(text) {

    return text.replace(/\{(\d+)-(\d+)\}/g, function(match, min, max) {

        min = parseInt(min);
        max = parseInt(max);

        const random =
            Math.floor(Math.random() * (max - min + 1)) + min;

        return random;

    });

}

function drawCard() {

    if (deck.length === 0) {

        alert("Alle Karten wurden gezogen. Der Stapel wird neu gemischt.");

        deck = [...cards];

        shuffle(deck);

    }

    const card = deck.pop();

    container.innerHTML = `
        <div class="card" style="background:${card.color}">
            <h2>${card.title}</h2>

            <p>${replaceVariables(card.text)}</p>

            <small>Noch ${deck.length} Karten im Stapel</small>
        </div>
    `;

}

// -----------------------------
// Neue Karte
// -----------------------------
function addCard() {

    const title = document.getElementById("titleInput").value.trim();

    const text = document.getElementById("textInput").value.trim();

    const color = document.getElementById("colorInput").value;

    if (title === "" || text === "") {

        alert("Bitte Titel und Text eingeben.");

        return;

    }

    cards.push({
        title,
        text,
        color
    });

    saveCards();

    deck = [...cards];

    shuffle(deck);

    document.getElementById("titleInput").value = "";
    document.getElementById("textInput").value = "";

    alert("Karte hinzugefügt.");

}

// -----------------------------
// Karte löschen
// -----------------------------
function deleteCard() {

    const index = document.getElementById("deleteSelect").value;

    if (index === "") return;

    cards.splice(index, 1);

    saveCards();

    deck = [...cards];

    shuffle(deck);

    container.innerHTML = "";

}

// -----------------------------
// Dropdown aktualisieren
// -----------------------------
function refreshDeleteList() {

    const select = document.getElementById("deleteSelect");

    select.innerHTML = "";

    cards.forEach((card, index) => {

        const option = document.createElement("option");

        option.value = index;

        option.textContent = card.title;

        select.appendChild(option);

    });

}

// -----------------------------
// Einstellungen öffnen/schließen
// -----------------------------
function toggleSettings() {

    const overlay = document.getElementById("settingsOverlay");

    if (overlay.style.display === "flex") {

        overlay.style.display = "none";

    } else {

        overlay.style.display = "flex";

    }

}

// -----------------------------
// Events
// -----------------------------
document.getElementById("drawButton").addEventListener("click", drawCard);

document.getElementById("deck").addEventListener("click", drawCard);

// -----------------------------
// Initialisieren
// -----------------------------
refreshDeleteList();
