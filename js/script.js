document.addEventListener("DOMContentLoaded", function () {
    initTranslations();
    initMobileMenu();
    initAppFilters();
});

/* =========================================================
   TRADUÇÕES
   ========================================================= */

function initTranslations() {
    /*
     * Quando o HTML é aberto diretamente com file://,
     * o navegador pode bloquear fetch() por CORS.
     * Nesse caso simplesmente não tentamos carregar a tradução.
     */

    if (window.location.protocol === "file:") {
        return;
    }

    const language = (navigator.language || "pt-BR").split("-")[0];

    fetch(`translations/${language}.json`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    `Erro ao carregar tradução: ${response.status}`
                );
            }

            return response.json();
        })
        .then(function (data) {
            const elements = document.querySelectorAll(".heads_up_class");

            elements.forEach(function (element) {
                if (data.welcome) {
                    element.textContent = data.welcome;
                }
            });
        })
        .catch(function (error) {
            console.warn("Traduções não carregadas:", error);
        });
}

/* =========================================================
   MENU MOBILE
   ========================================================= */

function initMobileMenu() {
    const toggle = document.getElementById("appsMobileToggle");
    const menu = document.getElementById("appsMobileMenu");

    if (!toggle || !menu) {
        return;
    }

    toggle.addEventListener("click", function () {
        const isOpen = menu.classList.toggle("is-open");

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });

    const links = menu.querySelectorAll("a");

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("is-open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}

/* =========================================================
   FILTROS E BUSCA
   ========================================================= */

function initAppFilters() {
    const searchInput = document.getElementById("appSearch");
    const clearSearchButton = document.getElementById("clearSearch");
    const resetButton = document.getElementById("resetAppFilters");
    const filterButtons = document.querySelectorAll(".app-filter");
    const cards = document.querySelectorAll(".app-card");
    const noResults = document.getElementById("appsNoResults");
    const resultsCount = document.getElementById("appsResultsCount");

    if (!cards.length) {
        console.warn("Nenhum aplicativo encontrado.");
        return;
    }

    let currentFilter = "all";
    let currentSearch = "";

    /* ---------------------------------------------------------
       Normaliza texto
       Exemplo:
       "Educação" -> "educacao"
       "Música" -> "musica"
       --------------------------------------------------------- */

    function normalizeText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    /* ---------------------------------------------------------
       Verifica busca
       --------------------------------------------------------- */

    function cardMatchesSearch(card) {
        if (!currentSearch) {
            return true;
        }

        const name = normalizeText(
            card.dataset.name
        );

        const description = normalizeText(
            card.dataset.description
        );

        const category = normalizeText(
            card.dataset.category
        );

        const text = normalizeText(
            card.textContent
        );

        const link = card.querySelector("a");

        const href = link
            ? normalizeText(link.getAttribute("href"))
            : "";

        const searchableText = [
            name,
            description,
            category,
            text,
            href
        ].join(" ");

        /*
         * Permite buscas com mais de uma palavra.
         *
         * Exemplo:
         * "lembrete agua"
         *
         * precisa encontrar os dois termos.
         */

        const terms = currentSearch
            .split(/\s+/)
            .filter(Boolean);

        return terms.every(function (term) {
            return searchableText.includes(term);
        });
    }

    /* ---------------------------------------------------------
       Verifica categoria
       --------------------------------------------------------- */

    function cardMatchesFilter(card) {
        if (currentFilter === "all") {
            return true;
        }

        const categories = normalizeText(
            card.dataset.category
        )
            .split(/\s+/)
            .filter(Boolean);

        return categories.includes(
            normalizeText(currentFilter)
        );
    }

    /* ---------------------------------------------------------
       Aplica busca + filtro
       --------------------------------------------------------- */

    function updateResults() {
        let visibleCount = 0;

        cards.forEach(function (card) {
            const matchesSearch = cardMatchesSearch(card);
            const matchesFilter = cardMatchesFilter(card);

            const shouldShow =
                matchesSearch && matchesFilter;

            if (shouldShow) {
                card.classList.remove("hidden");
                card.style.display = "";
                visibleCount++;
            } else {
                card.classList.add("hidden");
                card.style.display = "none";
            }
        });

        /* -----------------------------------------------------
           Mensagem de nenhum resultado
           ----------------------------------------------------- */

        if (noResults) {
            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";
        }

        /* -----------------------------------------------------
           Quantidade de resultados
           ----------------------------------------------------- */

        if (resultsCount) {
            resultsCount.textContent =
                visibleCount === 1
                    ? "1 aplicativo"
                    : `${visibleCount} aplicativos`;
        }

        /* -----------------------------------------------------
           Estado dos botões
           ----------------------------------------------------- */

        filterButtons.forEach(function (button) {
            const buttonFilter = normalizeText(
                button.dataset.filter
            );

            const isActive =
                buttonFilter ===
                normalizeText(currentFilter);

            button.classList.toggle(
                "active",
                isActive
            );
        });

        /* -----------------------------------------------------
           Botão limpar busca
           ----------------------------------------------------- */

        if (clearSearchButton) {
            clearSearchButton.style.display =
                currentSearch
                    ? "flex"
                    : "none";
        }
    }

    /* =========================================================
       EVENTOS DOS FILTROS
       ========================================================= */

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            currentFilter =
                button.dataset.filter || "all";

            updateResults();
        });
    });

    /* =========================================================
       EVENTO DA BUSCA
       ========================================================= */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            function () {
                currentSearch = normalizeText(
                    searchInput.value
                );

                updateResults();
            }
        );

        searchInput.addEventListener(
            "search",
            function () {
                currentSearch = normalizeText(
                    searchInput.value
                );

                updateResults();
            }
        );
    }

    /* =========================================================
       LIMPAR BUSCA
       ========================================================= */

    if (clearSearchButton) {
        clearSearchButton.addEventListener(
            "click",
            function () {
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                }

                currentSearch = "";

                updateResults();
            }
        );
    }

    /* =========================================================
       RESETAR FILTROS
       ========================================================= */

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            function () {
                currentFilter = "all";
                currentSearch = "";

                if (searchInput) {
                    searchInput.value = "";
                }

                updateResults();
            }
        );
    }

    /* =========================================================
       ESTADO INICIAL
       ========================================================= */

    updateResults();
}