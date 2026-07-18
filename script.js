// ===============================
// Standardkarten
// ===============================
const defaultCards = [
    {
        title: "Mut",
        text: "Trinke {1-5} Schlucke.",
        color: "#ffd54f"
    },
    {
        title: "Glück",
        text: "Verteile {2-8} Schlucke.",
        color: "#81c784"
    },
    {
        title: "Chaos",
        text: "Alle trinken {1-3} Schlucke.",
        color: "#64b5f6"
    }
];

// ===============================
// Karten laden
// ===============================
let cards = JSON.parse(localStorage.getItem("cards"));

if (!cards) {
    cards = [...defaultCards];
}

let deck = [];
let currentCard = -1;

const container = document.getElementById("cardContainer");

// ===============================
// Speichern
// ===============================
function saveCards() {
    localStorage.setItem("cards", JSON.stringify(cards));
}

// ===============================
// Mischen
// ===============================
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}

// ===============================
// Platzhalter ersetzen
// ===============================
function replaceVariables(text) {

    return text.replace(/\{(\d+)-(\d+)\}/g, (match, min, max) => {

        min = parseInt(min);
        max = parseInt(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;

    });

}

// ===============================
// Deck neu erstellen
// ===============================
function resetDeck() {

    deck = [...cards];

    shuffle(deck);

}

// ===============================
// Karte ziehen
// ===============================
function drawCard() {

    if (deck.length === 0) {

        resetDeck();

        alert("Alle Karten wurden gezogen. Der Stapel wurde neu gemischt.");

    }

    const card = deck.pop();

    container.innerHTML = `
        <div class="card" style="background:${card.color}">
            <h2>${card.title}</h2>
            <p>${replaceVariables(card.text).replace(/\n/g, "<br>")}</p>
            <small>Noch ${deck.length} Karten im Stapel</small>
        </div>
    `;

}

// ===============================
// Dropdown aktualisieren
// ===============================
function refreshCardList() {

    const select = document.getElementById("cardSelect");

    if (!select) return;

    select.innerHTML = "";

    cards.forEach((card, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = card.title;

        select.appendChild(option);

    });

}

// ===============================
// Karte laden
// ===============================
function loadSelectedCard() {

    const select = document.getElementById("cardSelect");

    currentCard = Number(select.value);

    const card = cards[currentCard];

    if (!card) return;

    document.getElementById("titleInput").value = card.title;
    document.getElementById("textInput").value = card.text;
    document.getElementById("colorInput").value = card.color;

}

// ===============================
// Neue Karte
// ===============================
function newCard() {

    currentCard = -1;

    document.getElementById("titleInput").value = "";
    document.getElementById("textInput").value = "";
    document.getElementById("colorInput").value = "#ffffff";

}

// ===============================
// Karte speichern
// ===============================
function saveCard() {

    const title = document.getElementById("titleInput").value.trim();
    const text = document.getElementById("textInput").value.trim();
    const color = document.getElementById("colorInput").value;

    if (title === "" || text === "") {

        alert("Bitte Titel und Text eingeben.");

        return;

    }

    const card = {
        title,
        text,
        color
    };

    if (currentCard === -1) {

        cards.push(card);

        currentCard = cards.length - 1;

    } else {

        cards[currentCard] = card;

    }

    saveCards();
    refreshCardList();
    resetDeck();

    alert("Karte gespeichert.");

}

// ===============================
// Karte löschen
// ===============================
function deleteCard() {

    if (currentCard === -1) {

        alert("Bitte zuerst eine Karte auswählen.");

        return;

    }

    if (!confirm("Diese Karte wirklich löschen?")) {

        return;

    }

    cards.splice(currentCard, 1);

    currentCard = -1;

    saveCards();
    refreshCardList();
    resetDeck();
    newCard();

}

// ===============================
// Einstellungen
// ===============================
function toggleSettings() {

    const overlay = document.getElementById("settingsOverlay");

    if (overlay.style.display === "flex") {

        overlay.style.display = "none";

    } else {

        overlay.style.display = "flex";

    }

}

// ===============================
// Initialisieren
// ===============================
resetDeck();
refreshCardList();

document.getElementById("drawButton").addEventListener("click", drawCard);
document.getElementById("deck").addEventListener("click", drawCard);