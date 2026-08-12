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

        return parsed;

    } catch (error) {

        console.error(
            "Karten konnten nicht geladen werden:",
            error
        );

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
// Karten speichern
// ===============================

function saveCards() {

    try {

        localStorage.setItem(
            "cards",
            JSON.stringify(cards)
        );

        return true;

    } catch (error) {

        console.error(
            "Karten konnten nicht gespeichert werden:",
            error
        );

        alert(
            "Die Karten konnten nicht gespeichert werden."
        );

        return false;

    }

}


// ===============================
// Karten mischen
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

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}


// ===============================
// Zufallszahlen ersetzen
//
// Beispiele:
//
// {1-5}
// {5-20}
// {100-500}
// ===============================

function replaceVariables(text) {

    return text.replace(
        /\{(\d+)-(\d+)\}/g,
        (match, min, max) => {

            min = parseInt(min);

            max = parseInt(max);

            if (min > max) {

                [
                    min,
                    max
                ] = [
                    max,
                    min
                ];

            }

            return Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;

        }
    );

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

    if (cards.length === 0) {

        alert(
            "Es sind keine Karten vorhanden.\n\n" +
            "Füge zuerst eine Karte hinzu " +
            "oder stelle die Standardkarten wieder her."
        );

        return;

    }


    if (deck.length === 0) {

        resetDeck();

        alert(
            "Alle Karten wurden gezogen.\n\n" +
            "Der Stapel wurde neu gemischt."
        );

    }


    const card = deck.pop();

    if (!card) return;


    container.innerHTML = `

        <div
            class="card"
            style="background:${escapeHtml(card.color)}"
        >

            <h2>
                ${escapeHtml(card.title)}
            </h2>

            <p>
                ${escapeHtml(
                    replaceVariables(card.text)
                ).replace(/\n/g, "<br>")}
            </p>

            <small>
                Noch ${deck.length} Karten im Stapel
            </small>

        </div>

    `;

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
// Karten-Dropdown aktualisieren
// ===============================

function refreshCardList() {

    const select =
        document.getElementById("cardSelect");

    if (!select) return;


    select.innerHTML = "";


    if (cards.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Keine Karten vorhanden";

        select.appendChild(option);

        return;

    }


    cards.forEach(
        (card, index) => {

            const option =
                document.createElement("option");

            option.value = index;

            option.textContent =
                card.title ||
                `Karte ${index + 1}`;

            select.appendChild(option);

        }
    );

}


// ===============================
// Karte laden
// ===============================

function loadSelectedCard() {

    const select =
        document.getElementById("cardSelect");


    if (
        !select ||
        select.value === "" ||
        cards.length === 0
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
        card.title || "";


    document.getElementById(
        "textInput"
    ).value =
        card.text || "";


    document.getElementById(
        "colorInput"
    ).value =
        card.color || "#ffffff";

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

}


// ===============================
// Karte speichern
// ===============================

function saveCard() {

    const title =
        document
            .getElementById("titleInput")
            .value
            .trim();


    const text =
        document
            .getElementById("textInput")
            .value
            .trim();


    const color =
        document
            .getElementById("colorInput")
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

        title: title,

        text: text,

        color: color

    };


    // Neue Karte

    if (currentCard === -1) {

        cards.push(card);

        currentCard =
            cards.length - 1;

    }

    // Bestehende Karte bearbeiten

    else {

        if (!cards[currentCard]) {

            alert(
                "Die ausgewählte Karte existiert nicht mehr."
            );

            newCard();

            return;

        }


        cards[currentCard] =
            card;

    }


    if (!saveCards()) return;


    refreshCardList();

    resetDeck();


    const select =
        document.getElementById(
            "cardSelect"
        );


    if (
        select &&
        currentCard >= 0
    ) {

        select.value =
            String(currentCard);

    }


    alert(
        "Karte gespeichert."
    );

}


// ===============================
// Einzelne Karte löschen
// ===============================

function deleteCard() {

    if (currentCard === -1) {

        alert(
            "Bitte zuerst eine Karte laden."
        );

        return;

    }


    if (!cards[currentCard]) {

        alert(
            "Die ausgewählte Karte existiert nicht mehr."
        );

        newCard();

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

    resetDeck();

    newCard();


    alert(
        "Karte gelöscht."
    );

}


// ===============================
// ALLE Karten löschen
// ===============================

function deleteAllCards() {

    if (cards.length === 0) {

        alert(
            "Es sind keine Karten vorhanden."
        );

        return;

    }


    if (
        !confirm(
            `Möchtest du wirklich ALLE ${cards.length} Karten löschen?\n\n` +
            "Du kannst sie nur über ein Backup wiederherstellen."
        )
    ) {

        return;

    }


    cards = [];

    currentCard = -1;


    saveCards();

    refreshCardList();

    resetDeck();

    newCard();


    container.innerHTML = "";


    alert(
        "Alle Karten wurden gelöscht."
    );

}


// ===============================
// Standardkarten wiederherstellen
// ===============================

function restoreDefaultCards() {

    if (
        !confirm(
            "Möchtest du wirklich die Standardkarten wiederherstellen?\n\n" +
            "Deine aktuellen Karten werden dadurch ersetzt."
        )
    ) {

        return;

    }


    cards =
        JSON.parse(
            JSON.stringify(defaultCards)
        );


    currentCard = -1;


    saveCards();

    refreshCardList();

    resetDeck();

    newCard();


    container.innerHTML = "";


    alert(
        "Die Standardkarten wurden wiederhergestellt."
    );

}


// ===============================
// BACKUP
// Karten sichern
// ===============================

function exportCards() {

    if (cards.length === 0) {

        alert(
            "Es sind keine Karten zum Sichern vorhanden."
        );

        return;

    }


    const backup = {

        app: "Bierkarten",

        version: 1,

        createdAt:
            new Date().toISOString(),

        cards: cards

    };


    const data =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "bierkarten-backup.json";


    document
        .body
        .appendChild(link);


    link.click();


    document
        .body
        .removeChild(link);


    URL.revokeObjectURL(url);


    alert(
        `${cards.length} Karten wurden als Backup gesichert.`
    );

}


// ===============================
// BACKUP
// Karten wiederherstellen
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

                const importedData =
                    JSON.parse(
                        e.target.result
                    );


                let importedCards;


                // Neues Backup-Format

                if (
                    importedData &&
                    Array.isArray(
                        importedData.cards
                    )
                ) {

                    importedCards =
                        importedData.cards;

                }

                // Altes Array-Format

                else if (
                    Array.isArray(
                        importedData
                    )
                ) {

                    importedCards =
                        importedData;

                }

                else {

                    throw new Error(
                        "Ungültiges Backup-Format."
                    );

                }


                if (
                    importedCards.length === 0
                ) {

                    throw new Error(
                        "Das Backup enthält keine Karten."
                    );

                }


                const validCards =
                    importedCards.every(
                        card =>

                            card &&

                            typeof card.title ===
                                "string" &&

                            typeof card.text ===
                                "string" &&

                            typeof card.color ===
                                "string"

                    );


                if (!validCards) {

                    throw new Error(
                        "Ungültige Karten."
                    );

                }


                if (
                    !confirm(
                        `Sollen ${importedCards.length} Karten wiederhergestellt werden?\n\n` +
                        "Die aktuell gespeicherten Karten werden ersetzt."
                    )
                ) {

                    event.target.value = "";

                    return;

                }


                cards =
                    importedCards.map(
                        card => ({

                            title:
                                card.title,

                            text:
                                card.text,

                            color:
                                card.color

                        })
                    );


                currentCard = -1;


                if (!saveCards()) {

                    return;

                }


                refreshCardList();

                resetDeck();

                newCard();


                container.innerHTML =
                    "";


                alert(
                    `${cards.length} Karten erfolgreich wiederhergestellt.`
                );

            }

            catch(error) {

                console.error(
                    error
                );


                alert(
                    "Die Datei konnte nicht gelesen werden.\n\n" +
                    "Bitte verwende eine gültige Bierkarten-Backup-Datei."
                );

            }

            finally {

                // Ermöglicht,
                // dieselbe Datei erneut auszuwählen

                event.target.value =
                    "";

            }

        };


    reader.onerror =
        function() {

            alert(
                "Die Backup-Datei konnte nicht gelesen werden."
            );


            event.target.value =
                "";

        };


    reader.readAsText(
        file
    );

}


// ===============================
// Einstellungen öffnen/schließen
// ===============================

function toggleSettings() {

    const overlay =
        document.getElementById(
            "settingsOverlay"
        );


    if (!overlay) return;


    overlay.classList.toggle(
        "open"
    );

}


// ===============================
// Klick außerhalb des Menüs
// schließt Einstellungen
// ===============================

function closeSettingsOnOverlay(
    event
) {

    if (
        event.target.id ===
        "settingsOverlay"
    ) {

        toggleSettings();

    }

}


// ===============================
// ESC schließt Einstellungen
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            const overlay =
                document.getElementById(
                    "settingsOverlay"
                );


            if (
                overlay &&
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

resetDeck();

refreshCardList();


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