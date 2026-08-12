// ===============================
// Standardkarten
// ===============================

const defaultCards = [

    {
        title: "Mut",
        text: "Trinke {1-5} Schlucke.",
        color: "#ffd54f",
        category: "Trinken"
    },

    {
        title: "Glück",
        text: "Verteile {2-8} Schlucke.",
        color: "#81c784",
        category: "Trinken"
    },

    {
        title: "Chaos",
        text: "Alle trinken {1-3} Schlucke.",
        color: "#64b5f6",
        category: "Alle"
    }

];


// ===============================
// Karten laden
// ===============================

let cards = loadCardsFromStorage();

function loadCardsFromStorage() {

    try {

        const saved = localStorage.getItem("cards");

        if (!saved) {

            return JSON.parse(
                JSON.stringify(defaultCards)
            );

        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {

            return JSON.parse(
                JSON.stringify(defaultCards)
            );

        }

        // Alte Karten bekommen automatisch
        // die Kategorie "Allgemein"

        return parsed.map(card => ({

            title: card.title || "Ohne Titel",

            text: card.text || "",

            color: card.color || "#ffffff",

            category: card.category || "Allgemein"

        }));

    } catch (error) {

        console.error(error);

        return JSON.parse(
            JSON.stringify(defaultCards)
        );

    }

}


let deck = [];

let currentCard = -1;

const container =
    document.getElementById("cardContainer");


// ===============================
// Speichern
// ===============================

function saveCards() {

    try {

        localStorage.setItem(
            "cards",
            JSON.stringify(cards)
        );

        return true;

    } catch (error) {

        alert(
            "Die Karten konnten nicht gespeichert werden."
        );

        return false;

    }

}


// ===============================
// Mischen
// ===============================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
        [array[j], array[i]];

    }

}


// ===============================
// Zufallszahlen
// ===============================

function replaceVariables(text) {

    return text.replace(
        /\{(\d+)-(\d+)\}/g,
        (match, min, max) => {

            min = parseInt(min);
            max = parseInt(max);

            if (min > max) {

                [min, max] =
                [max, min];

            }

            return Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;

        }
    );

}


// ===============================
// Aktuelle Kategorie
// ===============================

function getSelectedCategory() {

    return document
        .getElementById("categoryFilter")
        .value;

}


// ===============================
// Gefilterte Karten
// ===============================

function getFilteredCards() {

    const category =
        getSelectedCategory();

    if (category === "Alle") {

        return [...cards];

    }

    return cards.filter(
        card =>
            (card.category || "Allgemein")
            === category
    );

}


// ===============================
// Deck neu erstellen
// ===============================

function resetDeck() {

    deck =
        getFilteredCards();

    shuffle(deck);

    updateDeckInfo();

}


// ===============================
// Kartenanzahl anzeigen
// ===============================

function updateDeckInfo() {

    const info =
        document.getElementById(
            "deckInfo"
        );

    if (!info) return;

    info.textContent =
        `${deck.length} Karten im Stapel`;

}


// ===============================
// Karte ziehen
// ===============================

function drawCard() {

    if (cards.length === 0) {

        alert(
            "Es sind keine Karten vorhanden."
        );

        return;

    }


    if (deck.length === 0) {

        resetDeck();

        if (deck.length === 0) {

            alert(
                "Für diese Kategorie sind keine Karten vorhanden."
            );

            return;

        }

    }


    const card = deck.pop();

    if (!card) return;


    updateDeckInfo();


    // Karte zunächst unsichtbar
    // einsetzen

    container.innerHTML = `

        <div
            class="card cardDrawing"
            style="background:${escapeHtml(card.color)}">

            <h2>
                ${escapeHtml(card.title)}
            </h2>

            <p>
                ${escapeHtml(
                    replaceVariables(card.text)
                ).replace(/\n/g, "<br>")}
            </p>

            <div class="cardCategory">
                ${escapeHtml(
                    card.category || "Allgemein"
                )}
            </div>

            <small>
                Noch ${deck.length} Karten
            </small>

        </div>

    `;


    // Animation starten

    requestAnimationFrame(() => {

        const drawnCard =
            container.querySelector(".card");

        if (drawnCard) {

            drawnCard.classList.add(
                "cardVisible"
            );

        }

    });

}


// ===============================
// HTML-Sicherheit
// ===============================

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// Kategorien aktualisieren
// ===============================

function refreshCategoryList() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    if (!select) return;


    const current =
        select.value;


    select.innerHTML = `

        <option value="Alle">
            Alle Kategorien
        </option>

    `;


    const categories =
        [...new Set(
            cards.map(
                card =>
                    card.category ||
                    "Allgemein"
            )
        )];


    categories
        .sort()
        .forEach(category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = category;

            option.textContent =
                category;

            select.appendChild(option);

        });


    if (
        categories.includes(current)
    ) {

        select.value = current;

    } else {

        select.value = "Alle";

    }

}


// ===============================
// Karten suchen + Dropdown
// ===============================

function refreshCardList() {

    const select =
        document.getElementById(
            "cardSelect"
        );

    if (!select) return;


    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    select.innerHTML = "";


    const filtered =
        cards.filter(card => {

            const title =
                (card.title || "")
                .toLowerCase();

            const text =
                (card.text || "")
                .toLowerCase();

            const category =
                (card.category || "Allgemein")
                .toLowerCase();


            return (
                title.includes(search) ||
                text.includes(search) ||
                category.includes(search)
            );

        });


    if (filtered.length === 0) {

        const option =
            document.createElement(
                "option"
            );

        option.textContent =
            "Keine Karten gefunden";

        option.value = "";

        select.appendChild(option);

        return;

    }


    filtered.forEach(card => {

        const index =
            cards.indexOf(card);

        const option =
            document.createElement(
                "option"
            );

        option.value = index;

        option.textContent =
            `${card.title} · ${card.category || "Allgemein"}`;

        select.appendChild(option);

    });

}


// ===============================
// Karte laden
// ===============================

function loadSelectedCard() {

    const select =
        document.getElementById(
            "cardSelect"
        );


    if (
        !select ||
        select.value === ""
    ) {

        alert(
            "Bitte zuerst eine Karte auswählen."
        );

        return;

    }


    currentCard =
        Number(select.value);


    const card =
        cards[currentCard];


    if (!card) return;


    document.getElementById(
        "titleInput"
    ).value =
        card.title;


    document.getElementById(
        "textInput"
    ).value =
        card.text;


    document.getElementById(
        "colorInput"
    ).value =
        card.color;


    document.getElementById(
        "categoryInput"
    ).value =
        card.category ||
        "Allgemein";

}


// ===============================
// Neue Karte
// ===============================

function newCard() {

    currentCard = -1;


    document.getElementById(
        "titleInput"
    ).value = "";


    document.getElementById(
        "textInput"
    ).value = "";


    document.getElementById(
        "colorInput"
    ).value =
        "#ffffff";


    document.getElementById(
        "categoryInput"
    ).value =
        "Allgemein";

}


// ===============================
// Karte speichern
// ===============================

function saveCard() {

    const title =
        document
            .getElementById(
                "titleInput"
            )
            .value
            .trim();


    const text =
        document
            .getElementById(
                "textInput"
            )
            .value
            .trim();


    const color =
        document
            .getElementById(
                "colorInput"
            )
            .value;


    const category =
        document
            .getElementById(
                "categoryInput"
            )
            .value;


    if (
        title === "" ||
        text === ""
    ) {

        alert(
            "Bitte Titel und Text eingeben."
        );

        return;

    }


    const card = {

        title,

        text,

        color,

        category

    };


    if (currentCard === -1) {

        cards.push(card);

        currentCard =
            cards.length - 1;

    } else {

        cards[currentCard] =
            card;

    }


    if (!saveCards()) return;


    refreshCardList();

    refreshCategoryList();

    resetDeck();


    alert(
        "Karte gespeichert."
    );

}


// ===============================
// Karte duplizieren
// ===============================

function duplicateCard() {

    if (currentCard === -1) {

        alert(
            "Bitte zuerst eine Karte laden."
        );

        return;

    }


    const original =
        cards[currentCard];


    if (!original) return;


    const copy = {

        title:
            original.title +
            " (Kopie)",

        text:
            original.text,

        color:
            original.color,

        category:
            original.category ||
            "Allgemein"

    };


    cards.push(copy);


    currentCard =
        cards.length - 1;


    saveCards();

    refreshCardList();

    refreshCategoryList();

    resetDeck();


    // Kopie direkt laden

    document.getElementById(
        "titleInput"
    ).value =
        copy.title;


    document.getElementById(
        "textInput"
    ).value =
        copy.text;


    document.getElementById(
        "colorInput"
    ).value =
        copy.color;


    document.getElementById(
        "categoryInput"
    ).value =
        copy.category;


    alert(
        "Karte wurde dupliziert."
    );

}


// ===============================
// Karte löschen
// ===============================

function deleteCard() {

    if (currentCard === -1) {

        alert(
            "Bitte zuerst eine Karte laden."
        );

        return;

    }


    if (
        !confirm(
            "Diese Karte wirklich löschen?"
        )
    ) {

        return;

    }


    cards.splice(
        currentCard,
        1
    );


    currentCard = -1;


    saveCards();

    refreshCardList();

    refreshCategoryList();

    resetDeck();

    newCard();


    alert(
        "Karte gelöscht."
    );

}


// ===============================
// Alle Karten löschen
// ===============================

function deleteAllCards() {

    if (
        !confirm(
            `Möchtest du wirklich ALLE ${cards.length} Karten löschen?`
        )
    ) {

        return;

    }


    cards = [];

    currentCard = -1;


    saveCards();

    refreshCardList();

    refreshCategoryList();

    resetDeck();

    newCard();


    container.innerHTML = "";


    alert(
        "Alle Karten wurden gelöscht."
    );

}


// ===============================
// Standardkarten
// ===============================

function restoreDefaultCards() {

    if (
        !confirm(
            "Aktuelle Karten durch Standardkarten ersetzen?"
        )
    ) {

        return;

    }


    cards =
        JSON.parse(
            JSON.stringify(
                defaultCards
            )
        );


    currentCard = -1;


    saveCards();

    refreshCardList();

    refreshCategoryList();

    resetDeck();

    newCard();


    container.innerHTML = "";


    alert(
        "Standardkarten wiederhergestellt."
    );

}


// ===============================
// Backup exportieren
// ===============================

function exportCards() {

    if (cards.length === 0) {

        alert(
            "Keine Karten zum Sichern vorhanden."
        );

        return;

    }


    const backup = {

        app: "Bierkarten",

        version: 2,

        createdAt:
            new Date().toISOString(),

        cards: cards

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "bierkarten-backup.json";


    link.click();


    URL.revokeObjectURL(url);


    alert(
        "Backup wurde erstellt."
    );

}


// ===============================
// Backup importieren
// ===============================

function importCards(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );


                const imported =
                    Array.isArray(data)
                        ? data
                        : data.cards;


                if (
                    !Array.isArray(imported)
                ) {

                    throw new Error();

                }


                cards =
                    imported.map(
                        card => ({

                            title:
                                card.title ||
                                "Ohne Titel",

                            text:
                                card.text ||
                                "",

                            color:
                                card.color ||
                                "#ffffff",

                            category:
                                card.category ||
                                "Allgemein"

                        })
                    );


                saveCards();

                currentCard = -1;

                refreshCardList();

                refreshCategoryList();

                resetDeck();

                newCard();


                alert(
                    `${cards.length} Karten wiederhergestellt.`
                );


            } catch {

                alert(
                    "Ungültiges Backup."
                );

            }


            event.target.value = "";

        };


    reader.readAsText(file);

}


// ===============================
// Einstellungen
// ===============================

function toggleSettings() {

    const overlay =
        document.getElementById(
            "settingsOverlay"
        );


    overlay.classList.toggle(
        "open"
    );

}


function closeSettingsOnOverlay(event) {

    if (
        event.target.id ===
        "settingsOverlay"
    ) {

        toggleSettings();

    }

}


// ===============================
// Kategorie wechseln
// ===============================

document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        function() {

            resetDeck();

            container.innerHTML = "";

        }
    );


// ===============================
// ESC
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            const overlay =
                document.getElementById(
                    "settingsOverlay"
                );


            if (
                overlay.classList.contains(
                    "open"
                )
            ) {

                toggleSettings();

            }

        }

    }
);


// ===============================
// Initialisieren
// ===============================

refreshCategoryList();

refreshCardList();

resetDeck();


document
    .getElementById(
        "drawButton"
    )
    .addEventListener(
        "click",
        drawCard
    );


document
    .getElementById(
        "deck"
    )
    .addEventListener(
        "click",
        drawCard
    );