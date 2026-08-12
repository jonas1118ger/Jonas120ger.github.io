// ============================================================
// STANDARDKATEGORIEN
// ============================================================

const defaultCategories = [
    {
        name: "Allgemein",
        color: "#ffffff"
    },
    {
        name: "Trinken",
        color: "#ffd54f"
    },
    {
        name: "Aufgabe",
        color: "#64b5f6"
    },
    {
        name: "Alle",
        color: "#81c784"
    },
    {
        name: "Spezial",
        color: "#e57373"
    },
    {
        name: "Lustig",
        color: "#ba68c8"
    }
];


// ============================================================
// STANDARDKARTEN
// ============================================================

const defaultCards = [
    {
        title: "Mut",
        text: "Trinke {1-5} Schlucke.",
        category: "Trinken",
        color: "#ffd54f",
        customColor: false
    },
    {
        title: "Glück",
        text: "Verteile {2-8} Schlucke.",
        category: "Trinken",
        color: "#ffd54f",
        customColor: false
    },
    {
        title: "Chaos",
        text: "Alle trinken {1-3} Schlucke.",
        category: "Alle",
        color: "#81c784",
        customColor: false
    }
];


// ============================================================
// HILFSFUNKTION
// ============================================================

function cloneData(data) {

    return JSON.parse(
        JSON.stringify(data)
    );

}


// ============================================================
// KATEGORIEN LADEN
// ============================================================

let categories = loadCategories();


function loadCategories() {

    try {

        const saved =
            localStorage.getItem("categories");


        if (!saved) {

            return cloneData(
                defaultCategories
            );

        }


        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            return cloneData(
                defaultCategories
            );

        }


        const result = [];


        parsed.forEach(category => {

            if (
                category &&
                typeof category.name === "string" &&
                category.name.trim() !== ""
            ) {

                result.push({

                    name:
                        category.name.trim(),

                    color:
                        typeof category.color === "string"
                            ? category.color
                            : "#ffffff"

                });

            }

        });


        if (result.length === 0) {

            return cloneData(
                defaultCategories
            );

        }


        // Allgemein darf nicht fehlen

        if (
            !result.some(
                category =>
                    category.name === "Allgemein"
            )
        ) {

            result.unshift({

                name: "Allgemein",

                color: "#ffffff"

            });

        }


        return result;


    } catch (error) {

        console.error(
            "Kategorien konnten nicht geladen werden:",
            error
        );


        return cloneData(
            defaultCategories
        );

    }

}


// ============================================================
// KARTEN LADEN
// ============================================================

let cards = loadCards();


function loadCards() {

    try {

        const saved =
            localStorage.getItem("cards");


        if (!saved) {

            return cloneData(
                defaultCards
            );

        }


        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            return cloneData(
                defaultCards
            );

        }


        return parsed.map(card => {

            const category =
                card.category ||
                "Allgemein";


            const categoryObject =
                categories.find(
                    item =>
                        item.name === category
                );


            const customColor =
                card.customColor === true;


            return {

                title:
                    card.title || "Ohne Titel",

                text:
                    card.text || "",

                category:

                    category,

                customColor:

                    customColor,

                color:

                    customColor

                        ? (
                            card.color ||
                            "#ffffff"
                        )

                        : (

                            categoryObject
                                ? categoryObject.color
                                : (
                                    card.color ||
                                    "#ffffff"
                                )

                        )

            };

        });


    } catch (error) {

        console.error(
            "Karten konnten nicht geladen werden:",
            error
        );


        return cloneData(
            defaultCards
        );

    }

}


// ============================================================
// GLOBALE VARIABLEN
// ============================================================

let deck = [];

let currentCard = -1;

let currentCategory = -1;


const container =
    document.getElementById(
        "cardContainer"
    );


// ============================================================
// SPEICHERN
// ============================================================

function saveCards() {

    try {

        localStorage.setItem(
            "cards",
            JSON.stringify(cards)
        );

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "Die Karten konnten nicht gespeichert werden."
        );

        return false;

    }

}


function saveCategories() {

    try {

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "Die Kategorien konnten nicht gespeichert werden."
        );

        return false;

    }

}


// ============================================================
// KATEGORIE SUCHEN
// ============================================================

function getCategoryByName(name) {

    return categories.find(
        category =>
            category.name === name
    );

}


// ============================================================
// MISCHEN
// ============================================================

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


// ============================================================
// ZUFALLSZAHLEN
// ============================================================

function replaceVariables(text) {

    return text.replace(
        /\{(\d+)-(\d+)\}/g,
        (match, min, max) => {

            min =
                parseInt(min);

            max =
                parseInt(max);


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


// ============================================================
// KATEGORIE-FILTER
// ============================================================

function getSelectedCategory() {

    return document
        .getElementById(
            "categoryFilter"
        )
        .value;

}


function getFilteredCards() {

    const selected =
        getSelectedCategory();


    if (
        selected ===
        "Alle Kategorien"
    ) {

        return [...cards];

    }


    return cards.filter(
        card =>
            (
                card.category ||
                "Allgemein"
            ) === selected
    );

}


// ============================================================
// DECK NEU AUFBAUEN
// ============================================================

function resetDeck() {

    deck =
        getFilteredCards();


    shuffle(deck);


    updateDeckInfo();

}


function updateDeckInfo() {

    const info =
        document.getElementById(
            "deckInfo"
        );


    if (!info) return;


    info.textContent =
        `${deck.length} Karten im Stapel`;

}


// ============================================================
// KARTE ZIEHEN
// ============================================================

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


    const card =
        deck.pop();


    if (!card) return;


    updateDeckInfo();


    const category =
        card.category ||
        "Allgemein";


    container.innerHTML = `

        <div
            class="card"
            style="background:${escapeHtml(card.color)}">

            <div class="cardCategory">

                ${escapeHtml(category)}

            </div>

            <h2>

                ${escapeHtml(card.title)}

            </h2>

            <p>

                ${escapeHtml(
                    replaceVariables(
                        card.text
                    )
                ).replace(
                    /\n/g,
                    "<br>"
                )}

            </p>

            <small>

                Noch ${deck.length} Karten

            </small>

        </div>

    `;


    // Animation starten

    requestAnimationFrame(() => {

        const drawnCard =
            container.querySelector(
                ".card"
            );


        if (drawnCard) {

            drawnCard.classList.add(
                "cardVisible"
            );

        }

    });

}


// ============================================================
// HTML SICHERHEIT
// ============================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// KATEGORIE-FILTER AKTUALISIEREN
// ============================================================

function refreshCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );


    if (!select) return;


    const previous =
        select.value;


    select.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value =
        "Alle Kategorien";


    allOption.textContent =
        "Alle Kategorien";


    select.appendChild(
        allOption
    );


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.name;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        }
    );


    const exists =
        [...select.options].some(
            option =>
                option.value ===
                previous
        );


    select.value =
        exists
            ? previous
            : "Alle Kategorien";

}


// ============================================================
// KATEGORIE-AUSWAHL FÜR KARTE
// ============================================================

function refreshCategoryInput() {

    const select =
        document.getElementById(
            "categoryInput"
        );


    if (!select) return;


    const previous =
        select.value;


    select.innerHTML = "";


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.name;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        categories.some(
            category =>
                category.name ===
                previous
        )
    ) {

        select.value =
            previous;

    } else {

        select.value =
            "Allgemein";

    }

}


// ============================================================
// KATEGORIE-MANAGER AKTUALISIEREN
// ============================================================

function refreshCategoryManager() {

    const select =
        document.getElementById(
            "categoryManagerSelect"
        );


    if (!select) return;


    select.innerHTML = "";


    categories.forEach(
        (category, index) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                `${category.name} · ${category.color}`;


            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// KARTENLISTE / SUCHFUNKTION
// ============================================================

function refreshCardList() {

    const select =
        document.getElementById(
            "cardSelect"
        );


    if (!select) return;


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    select.innerHTML = "";


    const filtered =
        cards.filter(card => {

            const title =
                (
                    card.title ||
                    ""
                ).toLowerCase();


            const text =
                (
                    card.text ||
                    ""
                ).toLowerCase();


            const category =
                (
                    card.category ||
                    "Allgemein"
                ).toLowerCase();


            return (

                title.includes(search) ||

                text.includes(search) ||

                category.includes(search)

            );

        });


    if (
        filtered.length === 0
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value = "";


        option.textContent =
            "Keine Karten gefunden";


        select.appendChild(
            option
        );


        return;

    }


    filtered.forEach(
        card => {

            const index =
                cards.indexOf(card);


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                `${card.title} · ${card.category || "Allgemein"}`;


            select.appendChild(
                option
            );

        }
    );

}


// ============================================================
// KARTE LADEN
// ============================================================

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
        Number(
            select.value
        );


    loadCardIntoEditor(
        currentCard
    );

}


// ============================================================
// KARTE IN EDITOR LADEN
// ============================================================

function loadCardIntoEditor(index) {

    const card =
        cards[index];


    if (!card) return;


    currentCard =
        index;


    document.getElementById(
        "titleInput"
    ).value =
        card.title;


    document.getElementById(
        "textInput"
    ).value =
        card.text;


    document.getElementById(
        "categoryInput"
    ).value =
        card.category ||
        "Allgemein";


    document.getElementById(
        "customColorInput"
    ).checked =
        card.customColor === true;


    document.getElementById(
        "colorInput"
    ).value =
        card.color ||
        "#ffffff";


    updateColorInputState();

}


// ============================================================
// NEUE KARTE
// ============================================================

function newCard() {

    currentCard = -1;


    document.getElementById(
        "titleInput"
    ).value = "";


    document.getElementById(
        "textInput"
    ).value = "";


    document.getElementById(
        "categoryInput"
    ).value =
        "Allgemein";


    document.getElementById(
        "customColorInput"
    ).checked =
        false;


    const category =
        getCategoryByName(
            "Allgemein"
        );


    document.getElementById(
        "colorInput"
    ).value =
        category
            ? category.color
            : "#ffffff";


    updateColorInputState();

}


// ============================================================
// FARBE AKTIVIEREN / DEAKTIVIEREN
// ============================================================

function updateColorInputState() {

    const checkbox =
        document.getElementById(
            "customColorInput"
        );


    const colorInput =
        document.getElementById(
            "colorInput"
        );


    const custom =
        checkbox.checked;


    colorInput.disabled =
        !custom;


    colorInput.style.opacity =
        custom
            ? "1"
            : "0.5";

}


// ============================================================
// KARTE SPEICHERN
// ============================================================

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


    const category =
        document.getElementById(
            "categoryInput"
        ).value;


    const customColor =
        document.getElementById(
            "customColorInput"
        ).checked;


    const categoryObject =
        getCategoryByName(
            category
        );


    const color =
        customColor

            ? document.getElementById(
                "colorInput"
            ).value

            : (
                categoryObject
                    ? categoryObject.color
                    : "#ffffff"
            );


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

        category,

        color,

        customColor

    };


    if (
        currentCard === -1
    ) {

        cards.push(card);


        currentCard =
            cards.length - 1;

    } else {

        cards[currentCard] =
            card;

    }


    saveCards();


    refreshCardList();

    refreshCategoryFilter();

    resetDeck();


    alert(
        "Karte gespeichert."
    );

}


// ============================================================
// KARTE DUPLIZIEREN
// ============================================================

function duplicateCard() {

    if (
        currentCard === -1
    ) {

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
            `${original.title} (Kopie)`,

        text:
            original.text,

        category:
            original.category ||
            "Allgemein",

        color:
            original.color,

        customColor:
            original.customColor === true

    };


    cards.push(copy);


    currentCard =
        cards.length - 1;


    saveCards();


    refreshCardList();

    refreshCategoryFilter();

    resetDeck();


    loadCardIntoEditor(
        currentCard
    );


    alert(
        "Karte wurde dupliziert."
    );

}


// ============================================================
// KARTE LÖSCHEN
// ============================================================

function deleteCard() {

    if (
        currentCard === -1
    ) {

        alert(
            "Bitte zuerst eine Karte laden."
        );

        return;

    }


    const card =
        cards[currentCard];


    if (!card) return;


    if (
        !confirm(
            `„${card.title}“ wirklich löschen?`
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

    refreshCategoryFilter();

    resetDeck();

    newCard();


    alert(
        "Karte gelöscht."
    );

}


// ============================================================
// KATEGORIE LADEN
// ============================================================

function loadSelectedCategory() {

    const select =
        document.getElementById(
            "categoryManagerSelect"
        );


    if (
        !select ||
        select.value === ""
    ) {

        return;

    }


    currentCategory =
        Number(
            select.value
        );


    const category =
        categories[currentCategory];


    if (!category) return;


    document.getElementById(
        "categoryNameInput"
    ).value =
        category.name;


    document.getElementById(
        "categoryColorInput"
    ).value =
        category.color;

}


// ============================================================
// NEUE KATEGORIE
// ============================================================

function newCategory() {

    currentCategory = -1;


    document.getElementById(
        "categoryNameInput"
    ).value = "";


    document.getElementById(
        "categoryColorInput"
    ).value =
        "#ffffff";

}


// ============================================================
// KATEGORIE SPEICHERN
// ============================================================

function saveCategory() {

    const name =
        document
            .getElementById(
                "categoryNameInput"
            )
            .value
            .trim();


    const color =
        document.getElementById(
            "categoryColorInput"
        ).value;


    if (
        name === ""
    ) {

        alert(
            "Bitte einen Kategorienamen eingeben."
        );

        return;

    }


    // Prüfen, ob Name bereits existiert

    const duplicate =
        categories.some(
            (category, index) =>

                category.name.toLowerCase()
                    === name.toLowerCase()

                &&

                index !== currentCategory

        );


    if (duplicate) {

        alert(
            "Diese Kategorie existiert bereits."
        );

        return;

    }


    // Neue Kategorie

    if (
        currentCategory === -1
    ) {

        categories.push({

            name,

            color

        });


    }

    // Bestehende Kategorie

    else {

        const oldName =
            categories[
                currentCategory
            ].name;


        categories[
            currentCategory
        ] = {

            name,

            color

        };


        // Alle Karten dieser Kategorie
        // automatisch anpassen

        cards.forEach(
            card => {

                if (
                    (
                        card.category ||
                        "Allgemein"
                    ) === oldName
                ) {

                    card.category =
                        name;


                    // Nur Karten ohne
                    // eigene Farbe übernehmen
                    // die neue Kategorienfarbe

                    if (
                        card.customColor !== true
                    ) {

                        card.color =
                            color;

                    }

                }

            }
        );

    }


    saveCategories();

    saveCards();


    refreshCategoryManager();

    refreshCategoryInput();

    refreshCategoryFilter();

    refreshCardList();

    resetDeck();


    alert(
        "Kategorie gespeichert."
    );

}


// ============================================================
// KATEGORIE DUPLIZIEREN
// ============================================================

function duplicateCategory() {

    if (
        currentCategory === -1
    ) {

        alert(
            "Bitte zuerst eine Kategorie laden."
        );

        return;

    }


    const original =
        categories[
            currentCategory
        ];


    if (!original) return;


    let newName =
        `${original.name} (Kopie)`;


    let counter = 2;


    while (
        categories.some(
            category =>
                category.name ===
                newName
        )
    ) {

        newName =
            `${original.name} (Kopie ${counter})`;


        counter++;

    }


    categories.push({

        name:
            newName,

        color:
            original.color

    });


    currentCategory =
        categories.length - 1;


    saveCategories();


    refreshCategoryManager();

    refreshCategoryInput();

    refreshCategoryFilter();


    alert(
        "Kategorie wurde dupliziert."
    );

}


// ============================================================
// KATEGORIE LÖSCHEN
// ============================================================

function deleteCategory() {

    if (
        currentCategory === -1
    ) {

        alert(
            "Bitte zuerst eine Kategorie laden."
        );

        return;

    }


    const category =
        categories[
            currentCategory
        ];


    if (!category) return;


    if (
        category.name ===
        "Allgemein"
    ) {

        alert(
            "Die Kategorie „Allgemein“ kann nicht gelöscht werden."
        );

        return;

    }


    if (
        !confirm(
            `Kategorie „${category.name}“ wirklich löschen?\n\n` +
            "Die Karten dieser Kategorie werden auf „Allgemein“ gesetzt."
        )
    ) {

        return;

    }


    const general =
        getCategoryByName(
            "Allgemein"
        );


    cards.forEach(
        card => {

            if (
                (
                    card.category ||
                    "Allgemein"
                ) === category.name
            ) {

                card.category =
                    "Allgemein";


                if (
                    card.customColor !== true
                ) {

                    card.color =
                        general
                            ? general.color
                            : "#ffffff";

                }

            }

        }
    );


    categories.splice(
        currentCategory,
        1
    );


    currentCategory = -1;


    saveCategories();

    saveCards();


    refreshCategoryManager();

    refreshCategoryInput();

    refreshCategoryFilter();

    refreshCardList();

    resetDeck();

    newCategory();


    alert(
        "Kategorie gelöscht."
    );

}


// ============================================================
// ALLE KARTEN LÖSCHEN
// ============================================================

function deleteAllCards() {

    if (
        cards.length === 0
    ) {

        alert(
            "Es sind keine Karten vorhanden."
        );

        return;

    }


    if (
        !confirm(
            `Möchtest du wirklich ALLE ${cards.length} Karten löschen?\n\n` +
            "Die Kategorien bleiben erhalten."
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


// ============================================================
// STANDARDKARTEN + KATEGORIEN
// ============================================================

function restoreDefaultCards() {

    if (
        !confirm(
            "Möchtest du wirklich die Standardkarten und Kategorien wiederherstellen?\n\n" +
            "Deine aktuellen Karten und Kategorien werden ersetzt."
        )
    ) {

        return;

    }


    categories =
        cloneData(
            defaultCategories
        );


    cards =
        cloneData(
            defaultCards
        );


    currentCard = -1;

    currentCategory = -1;


    saveCategories();

    saveCards();


    refreshCategoryManager();

    refreshCategoryInput();

    refreshCategoryFilter();

    refreshCardList();

    resetDeck();

    newCard();

    newCategory();


    container.innerHTML = "";


    alert(
        "Standardkarten und Kategorien wurden wiederhergestellt."
    );

}


// ============================================================
// BACKUP EXPORTIEREN
// ============================================================

function exportCards() {

    const backup = {

        app:
            "Bierkarten",

        version:
            3,

        createdAt:
            new Date().toISOString(),

        cards:
            cards,

        categories:
            categories

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
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "bierkarten-backup.json";


    document
        .body
        .appendChild(
            link
        );


    link.click();


    document
        .body
        .removeChild(
            link
        );


    URL.revokeObjectURL(
        url
    );


    alert(
        "Karten und Kategorien wurden gesichert."
    );

}


// ============================================================
// BACKUP IMPORTIEREN
// ============================================================

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


                let importedCards;


                let importedCategories;


                // Neues Backup

                if (
                    data &&
                    Array.isArray(
                        data.cards
                    )
                ) {

                    importedCards =
                        data.cards;


                    importedCategories =
                        Array.isArray(
                            data.categories
                        )
                            ? data.categories
                            : null;

                }


                // Altes Backup
                // nur mit Karten

                else if (
                    Array.isArray(data)
                ) {

                    importedCards =
                        data;


                    importedCategories =
                        null;

                }


                else {

                    throw new Error(
                        "Ungültiges Backup."
                    );

                }


                // Kategorien übernehmen

                if (
                    importedCategories
                ) {

                    categories =
                        loadImportedCategories(
                            importedCategories
                        );

                }

                else {

                    categories =
                        cloneData(
                            defaultCategories
                        );

                }


                // Karten vorbereiten

                cards =
                    importedCards.map(
                        card => {

                            const category =
                                card.category ||
                                "Allgemein";


                            const categoryObject =
                                getCategoryByName(
                                    category
                                );


                            const customColor =
                                card.customColor === true;


                            return {

                                title:
                                    card.title ||
                                    "Ohne Titel",

                                text:
                                    card.text ||
                                    "",

                                category:

                                    category,

                                customColor:

                                    customColor,

                                color:

                                    customColor

                                        ? (
                                            card.color ||
                                            "#ffffff"
                                        )

                                        : (
                                            categoryObject
                                                ? categoryObject.color
                                                : (
                                                    card.color ||
                                                    "#ffffff"
                                                )
                                        )

                            };

                        }
                    );


                if (
                    !confirm(
                        `Sollen ${cards.length} Karten und ${categories.length} Kategorien wiederhergestellt werden?\n\n` +
                        "Die aktuellen Daten werden ersetzt."
                    )
                ) {

                    event.target.value = "";

                    return;

                }


                saveCategories();

                saveCards();


                currentCard = -1;

                currentCategory = -1;


                refreshCategoryManager();

                refreshCategoryInput();

                refreshCategoryFilter();

                refreshCardList();

                resetDeck();

                newCard();

                newCategory();


                container.innerHTML = "";


                alert(
                    "Backup erfolgreich wiederhergestellt."
                );


            } catch(error) {

                console.error(error);


                alert(
                    "Die Backup-Datei konnte nicht gelesen werden."
                );

            }


            event.target.value = "";

        };


    reader.readAsText(
        file
    );

}


// ============================================================
// IMPORTIERTE KATEGORIEN NORMALISIEREN
// ============================================================

function loadImportedCategories(data) {

    const result = [];


    if (
        Array.isArray(data)
    ) {

        data.forEach(
            category => {

                if (
                    category &&
                    typeof category.name ===
                        "string" &&

                    category.name.trim() !== ""
                ) {

                    result.push({

                        name:
                            category.name.trim(),

                        color:
                            category.color ||
                            "#ffffff"

                    });

                }

            }
        );

    }


    if (
        !result.some(
            category =>
                category.name ===
                "Allgemein"
        )
    ) {

        result.unshift({

            name:
                "Allgemein",

            color:
                "#ffffff"

        });

    }


    return result.length
        ? result
        : cloneData(
            defaultCategories
        );

}


// ============================================================
// EINSTELLUNGEN
// ============================================================

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


// ============================================================
// KATEGORIE BEI KARTE ÄNDERN
// ============================================================

document
    .getElementById(
        "categoryInput"
    )
    .addEventListener(
        "change",
        function() {

            const category =
                getCategoryByName(
                    this.value
                );


            if (!category) return;


            const custom =
                document
                    .getElementById(
                        "customColorInput"
                    )
                    .checked;


            if (!custom) {

                document
                    .getElementById(
                        "colorInput"
                    )
                    .value =
                    category.color;

            }

        }
    );


// ============================================================
// EIGENE FARBE
// ============================================================

document
    .getElementById(
        "customColorInput"
    )
    .addEventListener(
        "change",
        function() {

            updateColorInputState();


            if (!this.checked) {

                const category =
                    getCategoryByName(
                        document
                            .getElementById(
                                "categoryInput"
                            )
                            .value
                    );


                if (category) {

                    document
                        .getElementById(
                            "colorInput"
                        )
                        .value =
                        category.color;

                }

            }

        }
    );


// ============================================================
// KATEGORIE-FILTER
// ============================================================

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


// ============================================================
// ESC
// ============================================================

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


// ============================================================
// INITIALISIEREN
// ============================================================

refreshCategoryManager();

refreshCategoryInput();

refreshCategoryFilter();

refreshCardList();

resetDeck();

updateColorInputState();


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