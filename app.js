/* =========================================================
   NETVISION - APP.JS
   TV EN VIVO + M3U + HLS
   PELÍCULAS + SERIES + ZONAAPI
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const M3U_FILE = "./canales.m3u";

const API_BASE = "https://zonaapis.arcando.cloud";

const API_MOVIES =
    `${API_BASE}/list?type=movies&page=1`;

const API_SERIES =
    `${API_BASE}/list?type=tvshows&page=1`;


/* =========================================================
   VARIABLES TV
========================================================= */

let channels = [];

let currentChannel = null;

let currentCategory = null;

let hls = null;

let videoPlayer;

let playerPlaceholder;


/* =========================================================
   VARIABLES PELÍCULAS / SERIES
========================================================= */

let movies = [];

let series = [];

let moviesLoaded = false;

let seriesLoaded = false;

let currentContent = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    cacheElements();

    setupNavigation();

    setupSearch();

    setupProfile();

    setupModal();

    setupSeeAllButtons();

    loadM3U();

    loadMovies();

    loadSeries();

}


/* =========================================================
   DOM
========================================================= */

function cacheElements() {

    videoPlayer =
        document.getElementById(
            "videoPlayer"
        );

    playerPlaceholder =
        document.getElementById(
            "playerPlaceholder"
        );

}


/* =========================================================
   UTILIDAD $
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        const page =
                            button.dataset.page;

                        if (!page) {

                            return;

                        }

                        showPage(page);

                    }
                );

            }
        );


    const mobileMenuBtn =
        $("mobileMenuBtn");

    const mainNav =
        $("mainNav");


    if (
        mobileMenuBtn &&
        mainNav
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                mainNav.classList.toggle(
                    "open"
                );

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !mainNav.contains(
                        event.target
                    ) &&
                    event.target !==
                    mobileMenuBtn
                ) {

                    mainNav.classList.remove(
                        "open"
                    );

                }

            }
        );

    }

}


function showPage(page) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            section => {

                section.classList.toggle(
                    "active-page",
                    section.id ===
                    `page-${page}`
                );

            }
        );


    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(
            link => {

                link.classList.toggle(
                    "active",
                    link.dataset.page ===
                    page
                );

            }
        );


    const mainNav =
        $("mainNav");


    if (mainNav) {

        mainNav.classList.remove(
            "open"
        );

    }


    if (page !== "tv") {

        stopTV();

    }


    if (
        page === "movies" &&
        !moviesLoaded
    ) {

        loadMovies();

    }


    if (
        page === "series" &&
        !seriesLoaded
    ) {

        loadSeries();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   BOTONES "VER TODO"
========================================================= */

function setupSeeAllButtons() {

    document
        .querySelectorAll(
            ".see-all"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        const page =
                            button.dataset.page;

                        if (page) {

                            showPage(page);

                        }

                    }
                );

            }
        );

}


/* =========================================================
   BUSCADOR
========================================================= */

function setupSearch() {

    const searchBtn =
        $("searchBtn");

    const searchOverlay =
        $("searchOverlay");

    const closeSearch =
        $("closeSearch");

    const globalSearch =
        $("globalSearch");


    if (
        !searchBtn ||
        !searchOverlay
    ) {

        return;

    }


    searchBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            searchOverlay.classList.add(
                "show"
            );


            if (globalSearch) {

                globalSearch.value = "";

                renderSearchResults("");

                setTimeout(
                    () => {

                        globalSearch.focus();

                    },
                    50
                );

            }

        }
    );


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchOverlay.classList.remove(
                    "show"
                );

            }
        );

    }


    searchOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                searchOverlay
            ) {

                searchOverlay.classList.remove(
                    "show"
                );

            }

        }
    );


    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            () => {

                renderSearchResults(
                    globalSearch.value
                );

            }
        );


        globalSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    searchOverlay.classList.remove(
                        "show"
                    );

                }

            }
        );

    }

}


/* =========================================================
   RESULTADOS DEL BUSCADOR
========================================================= */

function renderSearchResults(
    value
) {

    const container =
        $("searchResults");


    if (!container) {

        return;

    }


    const term =
        normalizarTexto(
            value
        );


    if (!term) {

        container.innerHTML = `

            <div class="search-empty">

                Escribe el nombre
                de una película,
                serie o canal.

            </div>

        `;

        return;

    }


    const channelResults =
        channels.filter(
            channel => {

                const name =
                    normalizarTexto(
                        cleanName(
                            channel.name
                        )
                    );

                const category =
                    normalizarTexto(
                        channel.category
                    );

                return (
                    name.includes(term) ||
                    category.includes(term)
                );

            }
        );


    const movieResults =
        movies.filter(
            movie =>
                normalizarTexto(
                    movie.title
                ).includes(term)
        );


    const seriesResults =
        series.filter(
            show =>
                normalizarTexto(
                    show.title
                ).includes(term)
        );


    if (
        !channelResults.length &&
        !movieResults.length &&
        !seriesResults.length
    ) {

        container.innerHTML = `

            <div class="search-empty">

                No encontramos resultados
                para

                "<strong>
                    ${escapeHTML(value)}
                </strong>".

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /* -----------------------------------------------------
       PELÍCULAS
    ----------------------------------------------------- */

    movieResults
        .slice(0, 5)
        .forEach(
            movie => {

                container.appendChild(
                    createSearchContentItem(
                        movie,
                        "PELÍCULA"
                    )
                );

            }
        );


    /* -----------------------------------------------------
       SERIES
    ----------------------------------------------------- */

    seriesResults
        .slice(0, 5)
        .forEach(
            show => {

                container.appendChild(
                    createSearchContentItem(
                        show,
                        "SERIE"
                    )
                );

            }
        );


    /* -----------------------------------------------------
       CANALES
    ----------------------------------------------------- */

    channelResults
        .slice(0, 5)
        .forEach(
            channel => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "search-result-item";


                item.innerHTML = `

                    <span
                        class="search-result-logo">

                        ${
                            channel.logo
                                ? `
                                    <img
                                        src="${escapeAttribute(
                                            channel.logo
                                        )}"
                                        alt="${escapeAttribute(
                                            channel.name
                                        )}">
                                `
                                : "📺"
                        }

                    </span>


                    <span
                        class="search-result-info">

                        <strong>

                            ${escapeHTML(
                                cleanName(
                                    channel.name
                                )
                            )}

                        </strong>


                        <small>

                            ${escapeHTML(
                                channel.category
                            )}
                            · EN VIVO

                        </small>

                    </span>


                    <span
                        class="search-result-arrow">

                        ›

                    </span>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        openChannel(
                            channel
                        );

                    }
                );


                container.appendChild(
                    item
                );

            }
        );

}


/* =========================================================
   RESULTADO DE PELÍCULA / SERIE
========================================================= */

function createSearchContentItem(
    item,
    type
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "search-result-item";


    button.innerHTML = `

        <span
            class="search-result-logo">

            ${
                item.image
                    ? `
                        <img
                            src="${escapeAttribute(
                                item.image
                            )}"
                            alt="${escapeAttribute(
                                item.title
                            )}">
                    `
                    : "🎬"
            }

        </span>


        <span
            class="search-result-info">

            <strong>

                ${escapeHTML(
                    item.title
                )}

            </strong>


            <small>

                ${type}
                · ${escapeHTML(
                    item.year || ""
                )}

            </small>

        </span>


        <span
            class="search-result-arrow">

            ›

        </span>

    `;


    button.addEventListener(
        "click",
        () => {

            openContent(
                item,
                type
            );

        }
    );


    return button;

}


/* =========================================================
   PERFIL
========================================================= */

function setupProfile() {

    const profileBtn =
        $("profileBtn");

    const profileMenu =
        $("profileMenu");


    if (
        !profileBtn ||
        !profileMenu
    ) {

        return;

    }


    profileBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            profileMenu.classList.toggle(
                "show"
            );

        }
    );


    const card =
        profileMenu.querySelector(
            ".profile-card"
        );


    if (
        card &&
        !card.querySelector(
            ".profile-close-btn"
        )
    ) {

        const close =
            document.createElement(
                "button"
            );


        close.type =
            "button";


        close.className =
            "close-btn profile-close-btn";


        close.setAttribute(
            "aria-label",
            "Cerrar perfil"
        );


        close.textContent =
            "×";


        close.addEventListener(
            "click",
            () => {

                profileMenu.classList.remove(
                    "show"
                );

            }
        );


        card.prepend(
            close
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (
                !profileMenu.contains(
                    event.target
                ) &&
                event.target !==
                profileBtn
            ) {

                profileMenu.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    const modal =
        $("contentModal");

    const close =
        $("closeContent");


    if (!modal) {

        return;

    }


    if (close) {

        close.addEventListener(
            "click",
            () => {

                closeContentModal();

            }
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                closeContentModal();

            }

        }
    );

}


/* =========================================================
   CARGAR M3U
========================================================= */

async function loadM3U() {

    try {

        const response =
            await fetch(
                M3U_FILE,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const text =
            await response.text();


        channels =
            parseM3U(
                text
            );


        console.log(
            `NETVISION: ${channels.length} canales cargados.`
        );


        if (!channels.length) {

            showTVMessage(
                "La lista M3U está vacía."
            );

            return;

        }


        renderCategories();

        renderHomeChannels();


    } catch (error) {

        console.error(
            "NETVISION M3U:",
            error
        );


        showTVMessage(
            "No se pudo cargar canales.m3u."
        );

    }

}


/* =========================================================
   PARSER M3U
========================================================= */

function parseM3U(text) {

    const lines =
        text
            .split(/\r?\n/)
            .map(
                line =>
                    line.trim()
            )
            .filter(Boolean);


    const result = [];


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        if (
            !lines[i].startsWith(
                "#EXTINF:"
            )
        ) {

            continue;

        }


        const info =
            lines[i].substring(8);


        const comma =
            info.indexOf(",");


        const attrs =
            comma >= 0
                ? info.substring(
                    0,
                    comma
                )
                : info;


        const name =
            comma >= 0
                ? info.substring(
                    comma + 1
                ).trim()
                : "Canal sin nombre";


        let url =
            "";


        for (
            let j = i + 1;
            j < lines.length;
            j++
        ) {

            if (
                !lines[j].startsWith("#")
            ) {

                url =
                    lines[j];

                break;

            }

        }


        if (!url) {

            continue;

        }


        result.push({

            id:
                getAttr(
                    attrs,
                    "tvg-id"
                ) ||
                slug(name),

            name,

            url,

            logo:
                getAttr(
                    attrs,
                    "tvg-logo"
                ),

            category:
                getAttr(
                    attrs,
                    "group-title"
                ) ||
                "Otros"

        });

    }


    return result;

}


/* =========================================================
   ATRIBUTO M3U
========================================================= */

function getAttr(
    text,
    attr
) {

    const regex =
        new RegExp(
            `${attr}="([^"]*)"`,
            "i"
        );


    const match =
        text.match(
            regex
        );


    return match
        ? match[1]
        : "";

}


/* =========================================================
   CATEGORÍAS TV
========================================================= */

function renderCategories() {

    const container =
        $("tvCategories");


    if (!container) {

        return;

    }


    const categories =
        [
            ...new Set(
                channels.map(
                    channel =>
                        channel.category ||
                        "Otros"
                )
            )
        ];


    container.innerHTML =
        "";


    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "tv-category-button";


            button.dataset.category =
                category;


            button.innerHTML = `

                <span
                    class="category-icon">

                    ${categoryIcon(
                        category
                    )}

                </span>


                <span
                    class="category-name">

                    ${escapeHTML(
                        category
                    )}

                </span>


                <span
                    class="category-arrow">

                    ›

                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    selectCategory(
                        category
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );


    if (categories.length) {

        selectCategory(
            currentCategory ||
            categories[0]
        );

    }

}


/* =========================================================
   SELECCIONAR CATEGORÍA TV
========================================================= */

function selectCategory(
    category
) {

    currentCategory =
        category;


    document
        .querySelectorAll(
            ".tv-category-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                    category
                );

            }
        );


    const list =
        channels.filter(
            channel =>
                channel.category ===
                category
        );


    renderSelectedChannels(
        category,
        list
    );

}


/* =========================================================
   CANALES SELECCIONADOS
========================================================= */

function renderSelectedChannels(
    category,
    list
) {

    const title =
        $("selectedCategoryTitle");

    const count =
        $("selectedCategoryCount");

    const container =
        $("selectedCategoryChannels");


    if (!container) {

        return;

    }


    if (title) {

        title.innerHTML = `

            ${categoryIcon(
                category
            )}

            CANALES DE:

            <span>

                ${escapeHTML(
                    category
                )}

            </span>

        `;

    }


    if (count) {

        count.textContent =
            `${list.length} ${
                list.length === 1
                    ? "canal"
                    : "canales"
            }`;

    }


    container.innerHTML =
        "";


    list.forEach(
        channel => {

            container.appendChild(
                createChannelCard(
                    channel
                )
            );

        }
    );

}


/* =========================================================
   TARJETA CANAL
========================================================= */

function createChannelCard(
    channel
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "channel-card";


    card.tabIndex =
        0;


    card.innerHTML = `

        <div class="channel-logo">

            ${
                channel.logo
                    ? `
                        <img
                            src="${escapeAttribute(
                                channel.logo
                            )}"
                            alt="${escapeAttribute(
                                channel.name
                            )}"
                            loading="lazy">
                    `
                    : `<span>TV</span>`
            }

        </div>


        <div
            class="channel-card-info">

            <div
                class="channel-name">

                ${escapeHTML(
                    cleanName(
                        channel.name
                    )
                )}

            </div>


            <div
                class="channel-meta">

                ● EN VIVO

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openChannel(
                channel
            );

        }
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openChannel(
                    channel
                );

            }

        }
    );


    return card;

}


/* =========================================================
   ABRIR CANAL
========================================================= */

function openChannel(
    channel
) {

    if (!channel) {

        return;

    }


    const searchOverlay =
        $("searchOverlay");


    if (searchOverlay) {

        searchOverlay.classList.remove(
            "show"
        );

    }


    showPage(
        "tv"
    );


    currentChannel =
        channel;


    if (channel.category) {

        selectCategory(
            channel.category
        );

    }


    const name =
        $("selectedChannelName");

    const category =
        $("selectedChannelCategory");

    const logo =
        $("currentChannelLogo");


    if (name) {

        name.textContent =
            cleanName(
                channel.name
            );

    }


    if (category) {

        category.textContent =
            `${channel.category} · EN VIVO`;

    }


    if (logo) {

        logo.innerHTML =
            channel.logo
                ? `
                    <img
                        src="${escapeAttribute(
                            channel.logo
                        )}"
                        alt="${escapeAttribute(
                            channel.name
                        )}">
                `
                : "TV";

    }


    playStream(
        channel.url
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   REPRODUCIR HLS
========================================================= */

function playStream(
    url
) {

    if (!videoPlayer) {

        return;

    }


    destroyHLS();


    videoPlayer.pause();

    videoPlayer.removeAttribute(
        "src"
    );

    videoPlayer.load();


    if (
        window.Hls &&
        Hls.isSupported()
    ) {

        hls =
            new Hls({

                enableWorker:
                    true,

                lowLatencyMode:
                    true,

                backBufferLength:
                    90

            });


        hls.loadSource(
            url
        );


        hls.attachMedia(
            videoPlayer
        );


        hls.on(
            Hls.Events.MANIFEST_PARSED,
            () => {

                videoPlayer
                    .play()
                    .catch(
                        () => {}
                    );


                hidePlaceholder();

            }
        );


        hls.on(
            Hls.Events.ERROR,
            (
                event,
                data
            ) => {

                console.error(
                    "HLS:",
                    data
                );


                if (
                    !data.fatal
                ) {

                    return;

                }


                if (
                    data.type ===
                    Hls.ErrorTypes.NETWORK_ERROR
                ) {

                    hls.startLoad();

                }

                else if (
                    data.type ===
                    Hls.ErrorTypes.MEDIA_ERROR
                ) {

                    hls.recoverMediaError();

                }

                else {

                    showPlayerError();

                    destroyHLS();

                }

            }
        );


        return;

    }


    if (
        videoPlayer.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        videoPlayer.src =
            url;


        videoPlayer.addEventListener(
            "loadedmetadata",
            () => {

                videoPlayer
                    .play()
                    .catch(
                        () => {}
                    );


                hidePlaceholder();

            },
            {
                once:
                    true
            }
        );


        return;

    }


    showPlayerError();

}


/* =========================================================
   STOP TV
========================================================= */

function stopTV() {

    currentChannel =
        null;


    destroyHLS();


    if (videoPlayer) {

        videoPlayer.pause();

        videoPlayer.removeAttribute(
            "src"
        );

        videoPlayer.load();

    }


    const name =
        $("selectedChannelName");


    const category =
        $("selectedChannelCategory");


    const logo =
        $("currentChannelLogo");


    if (name) {

        name.textContent =
            "Ningún canal seleccionado";

    }


    if (category) {

        category.textContent =
            "Selecciona un canal";

    }


    if (logo) {

        logo.textContent =
            "TV";

    }


    showPlaceholder();

}


/* =========================================================
   DESTRUIR HLS
========================================================= */

function destroyHLS() {

    if (!hls) {

        return;

    }


    try {

        hls.stopLoad();

    } catch {}


    try {

        hls.detachMedia();

    } catch {}


    try {

        hls.destroy();

    } catch {}


    hls =
        null;

}


/* =========================================================
   PLACEHOLDER
========================================================= */

function hidePlaceholder() {

    if (playerPlaceholder) {

        playerPlaceholder.classList.add(
            "hidden"
        );

    }

}


function showPlaceholder() {

    if (playerPlaceholder) {

        playerPlaceholder.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   ERROR PLAYER
========================================================= */

function showPlayerError() {

    if (!playerPlaceholder) {

        return;

    }


    playerPlaceholder.classList.remove(
        "hidden"
    );


    playerPlaceholder.innerHTML = `

        <div class="player-icon">

            ⚠

        </div>


        <h3>

            No se pudo reproducir

        </h3>


        <p>

            El canal no está disponible
            en este momento.

        </p>

    `;

}


/* =========================================================
   MENSAJE TV
========================================================= */

function showTVMessage(
    message
) {

    const container =
        $("tvCategories");


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div
            style="
                padding:12px;
                color:#ff7580;
            "
        >

            ⚠️
            ${escapeHTML(
                message
            )}

        </div>

    `;

}


/* =========================================================
   CANALES EN HOME
========================================================= */

function renderHomeChannels() {

    const popular =
        $("homePopularChannels");

    const newest =
        $("homeNewChannels");


    if (popular) {

        popular.innerHTML =
            "";


        channels
            .slice(0, 8)
            .forEach(
                channel => {

                    popular.appendChild(
                        createHomeChannelCard(
                            channel
                        )
                    );

                }
            );

    }


    if (newest) {

        newest.innerHTML =
            "";


        channels
            .slice(-8)
            .reverse()
            .forEach(
                channel => {

                    newest.appendChild(
                        createHomeChannelCard(
                            channel
                        )
                    );

                }
            );

    }

}


function createHomeChannelCard(
    channel
) {

    return createChannelCard(
        channel
    );

}


/* =========================================================
   API - PELÍCULAS
========================================================= */

async function loadMovies() {

    const popular =
        $("homePopularMovies");

    const catalog =
        $("movieCategories");


    if (popular) {

        popular.innerHTML = `

            <div class="search-empty">

                🎬 Cargando películas...

            </div>

        `;

    }


    try {

        const response =
            await fetch(
                API_MOVIES,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        movies =
            extractContentList(
                data
            );


        moviesLoaded =
            true;


        console.log(
            "NETVISION películas:",
            movies.length
        );


        renderHomeMovies();

        renderMoviesPage();


    } catch (error) {

        console.error(
            "NETVISION API películas:",
            error
        );


        if (popular) {

            popular.innerHTML = `

                <div class="search-empty">

                    ⚠️ No se pudieron
                    cargar las películas.

                </div>

            `;

        }

    }

}


/* =========================================================
   API - SERIES
========================================================= */

async function loadSeries() {

    const catalog =
        $("seriesCategories");


    if (catalog) {

        catalog.innerHTML = `

            <div class="search-empty">

                📺 Cargando series...

            </div>

        `;

    }


    try {

        const response =
            await fetch(
                API_SERIES,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        series =
            extractContentList(
                data
            );


        seriesLoaded =
            true;


        console.log(
            "NETVISION series:",
            series.length
        );


        renderSeriesPage();


    } catch (error) {

        console.error(
            "NETVISION API series:",
            error
        );


        if (catalog) {

            catalog.innerHTML = `

                <div class="search-empty">

                    ⚠️ No se pudieron
                    cargar las series.

                </div>

            `;

        }

    }

}


/* =========================================================
   EXTRAER LISTA DE CONTENIDO
========================================================= */

function extractContentList(
    data
) {

    if (
        Array.isArray(data)
    ) {

        return data;

    }


    if (
        Array.isArray(
            data.featured
        )
    ) {

        return data.featured;

    }


    if (
        Array.isArray(
            data.results
        )
    ) {

        return data.results;

    }


    if (
        Array.isArray(
            data.movies
        )
    ) {

        return data.movies;

    }


    if (
        Array.isArray(
            data.tvshows
        )
    ) {

        return data.tvshows;

    }


    if (
        Array.isArray(
            data.items
        )
    ) {

        return data.items;

    }


    return [];

}


/* =========================================================
   HOME - PELÍCULAS
========================================================= */

function renderHomeMovies() {

    const popular =
        $("homePopularMovies");

    const newest =
        $("homeNewMovies");


    if (!movies.length) {

        if (popular) {

            popular.innerHTML =
                emptyContent(
                    "Aún no hay películas."
                );

        }

        if (newest) {

            newest.innerHTML =
                emptyContent(
                    "Aún no hay películas nuevas."
                );

        }

        return;

    }


    /* -----------------------------------------------------
       MÁS VISTAS
    ----------------------------------------------------- */

    const popularMovies =
        [...movies]
            .sort(
                (a, b) =>
                    Number(
                        b.rating || 0
                    ) -
                    Number(
                        a.rating || 0
                    )
            )
            .slice(
                0,
                8
            );


    renderMovieRow(
        popular,
        popularMovies
    );


    /* -----------------------------------------------------
       NUEVAS
    ----------------------------------------------------- */

    const newestMovies =
        [...movies]
            .sort(
                (a, b) =>
                    Number(
                        b.year || 0
                    ) -
                    Number(
                        a.year || 0
                    )
            )
            .slice(
                0,
                8
            );


    renderMovieRow(
        newest,
        newestMovies
    );

}


/* =========================================================
   RENDER MOVIE ROW
========================================================= */

function renderMovieRow(
    container,
    list
) {

    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    list.forEach(
        movie => {

            container.appendChild(
                createMovieCard(
                    movie,
                    "PELÍCULA"
                )
            );

        }
    );

}


/* =========================================================
   PÁGINA DE PELÍCULAS
========================================================= */

function renderMoviesPage() {

    const container =
        $("movieCategories");


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (!movies.length) {

        container.innerHTML =
            emptyContent(
                "Todavía no hay películas disponibles."
            );

        return;

    }


    const section =
        document.createElement(
            "section"
        );


    section.className =
        "content-section";


    section.innerHTML = `

        <div class="section-header">

            <div>

                <span class="section-kicker">

                    CATÁLOGO

                </span>

                <h2>

                    🎬 Todas las películas

                </h2>

            </div>


            <span class="movie-count">

                ${movies.length}
                películas

            </span>

        </div>


        <div
            class="movie-row">

        </div>

    `;


    const row =
        section.querySelector(
            ".movie-row"
        );


    movies.forEach(
        movie => {

            row.appendChild(
                createMovieCard(
                    movie,
                    "PELÍCULA"
                )
            );

        }
    );


    container.appendChild(
        section
    );

}


/* =========================================================
   PÁGINA DE SERIES
========================================================= */

function renderSeriesPage() {

    const container =
        $("seriesCategories");


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (!series.length) {

        container.innerHTML =
            emptyContent(
                "Todavía no hay series disponibles."
            );

        return;

    }


    const section =
        document.createElement(
            "section"
        );


    section.className =
        "content-section";


    section.innerHTML = `

        <div class="section-header">

            <div>

                <span class="section-kicker">

                    CATÁLOGO

                </span>


                <h2>

                    📺 Todas las series

                </h2>

            </div>


            <span class="movie-count">

                ${series.length}
                series

            </span>

        </div>


        <div
            class="movie-row">

        </div>

    `;


    const row =
        section.querySelector(
            ".movie-row"
        );


    series.forEach(
        show => {

            row.appendChild(
                createMovieCard(
                    show,
                    "SERIE"
                )
            );

        }
    );


    container.appendChild(
        section
    );

}


/* =========================================================
   TARJETA PELÍCULA / SERIE
========================================================= */

function createMovieCard(
    item,
    type
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "movie-card";


    card.tabIndex =
        0;


    const title =
        item.title ||
        "Sin título";


    const year =
        item.year ||
        "";


    const rating =
        item.rating ||
        "0.0";


    const image =
        item.image ||
        "";


    card.innerHTML = `

        <div
            class="movie-poster"
            style="
                background-image:
                    ${
                        image
                            ? `url("${escapeAttribute(
                                image
                            )}")`
                            : "none"
                    };
                background-size:cover;
                background-position:center;
            "
        >

            ${
                !image
                    ? `
                        <div
                            class="movie-poster-content">

                            <div
                                class="movie-number">

                                🎬

                            </div>

                        </div>
                    `
                    : ""
            }


            <div
                class="movie-card-gradient"
                style="
                    position:absolute;
                    inset:0;
                    background:
                        linear-gradient(
                            to top,
                            rgba(0,0,0,.92),
                            transparent 60%
                        );
                    pointer-events:none;
                "
            ></div>


            <div
                class="movie-poster-content"
                style="
                    position:absolute;
                    left:12px;
                    right:12px;
                    bottom:12px;
                    z-index:2;
                "
            >

                <strong
                    style="
                        display:block;
                        color:#fff;
                        font-size:13px;
                        line-height:1.3;
                    "
                >

                    ${escapeHTML(
                        title
                    )}

                </strong>


                <small
                    style="
                        display:block;
                        margin-top:5px;
                        color:rgba(
                            255,
                            255,
                            255,
                            .7
                        );
                    "
                >

                    ${escapeHTML(
                        year
                    )}

                    ${
                        rating
                            ? ` · ⭐ ${escapeHTML(
                                rating
                            )}`
                            : ""
                    }

                </small>

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openContent(
                item,
                type
            );

        }
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter" ||
                event.key ===
                " "
            ) {

                event.preventDefault();

                openContent(
                    item,
                    type
                );

            }

        }
    );


    return card;

}


/* =========================================================
   ABRIR PELÍCULA / SERIE
========================================================= */

async function openContent(
    item,
    type
) {

    if (!item) {

        return;

    }


    currentContent =
        item;


    const searchOverlay =
        $("searchOverlay");


    if (searchOverlay) {

        searchOverlay.classList.remove(
            "show"
        );

    }


    const modal =
        $("contentModal");


    if (!modal) {

        console.warn(
            "No existe contentModal."
        );

        return;

    }


    const poster =
        $("modalPoster");

    const modalType =
        $("modalType");

    const modalTitle =
        $("modalTitle");

    const modalDescription =
        $("modalDescription");


    if (poster) {

        poster.innerHTML =
            item.image
                ? `
                    <img
                        src="${escapeAttribute(
                            item.image
                        )}"
                        alt="${escapeAttribute(
                            item.title
                        )}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                    >
                `
                : "🎬";

    }


    if (modalType) {

        modalType.textContent =
            type;

    }


    if (modalTitle) {

        modalTitle.textContent =
            item.title ||
            "Sin título";

    }


    if (modalDescription) {

        modalDescription.innerHTML = `

            <strong>

                ${escapeHTML(
                    item.year || ""
                )}

            </strong>

            ${
                item.rating
                    ? `
                        · ⭐
                        ${escapeHTML(
                            item.rating
                        )}
                    `
                    : ""
            }

            <br><br>

            ${
                item.description
                    ? escapeHTML(
                        item.description
                    )
                    : `
                        Contenido disponible
                        desde NETVISION.
                    `
            }

        `;

    }


    modal.classList.add(
        "show"
    );


    prepararBotonReproducirModal(
        item,
        type
    );

}


/* =========================================================
   BOTÓN REPRODUCIR MODAL
========================================================= */

function prepararBotonReproducirModal(
    item,
    type
) {

    const modal =
        $("contentModal");


    if (!modal) {

        return;

    }


    const info =
        modal.querySelector(
            ".modal-info"
        );


    if (!info) {

        return;

    }


    let button =
        info.querySelector(
            ".modal-play-button"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "primary-btn modal-play-button";


        info.appendChild(
            button
        );

    }


    button.innerHTML =
        "▶ Reproducir";


    button.disabled =
        false;


    button.onclick =
        () => {

            reproducirContenidoAPI(
                item,
                type,
                button
            );

        };

}


/* =========================================================
   EXTRACT API
========================================================= */

async function reproducirContenidoAPI(
    item,
    type,
    button
) {

    if (!item.url) {

        mostrarToast(
            "Este contenido no tiene URL disponible."
        );

        return;

    }


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Cargando...";

    }


    try {

        const endpoint =
            `${API_BASE}/extract?url=${
                encodeURIComponent(
                    item.url
                )
            }`;


        const response =
            await fetch(
                endpoint,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "NETVISION EXTRACT:",
            data
        );


        const stream =
            encontrarStream(
                data
            );


        const embed =
            encontrarEmbed(
                data
            );


        if (stream) {

            reproducirStreamContenido(
                stream
            );

            return;

        }


        if (embed) {

            abrirEmbed(
                embed
            );

            return;

        }


        const posibles =
            encontrarURLs(
                data
            );


        if (posibles.length) {

            reproducirStreamContenido(
                posibles[0]
            );

            return;

        }


        mostrarToast(
            "La API no devolvió un video reproducible para este contenido."
        );


    } catch (error) {

        console.error(
            "NETVISION EXTRACT:",
            error
        );


        mostrarToast(
            "No se pudo obtener el video desde la API."
        );

    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "▶ Reproducir";

        }

    }

}


/* =========================================================
   BUSCAR STREAM
========================================================= */

function encontrarStream(
    data
) {

    const urls =
        encontrarURLs(
            data
        );


    const directas =
        urls.filter(
            url => {

                const lower =
                    url.toLowerCase();


                return (
                    lower.includes(
                        ".m3u8"
                    ) ||
                    lower.includes(
                        ".mp4"
                    ) ||
                    lower.includes(
                        ".mkv"
                    ) ||
                    lower.includes(
                        ".webm"
                    )
                );

            }
        );


    return directas.length
        ? directas[0]
        : null;

}


/* =========================================================
   BUSCAR EMBED
========================================================= */

function encontrarEmbed(
    data
) {

    const urls =
        encontrarURLs(
            data
        );


    const embeds =
        urls.filter(
            url => {

                const lower =
                    url.toLowerCase();


                return (
                    lower.includes(
                        "youtube.com"
                    ) ||
                    lower.includes(
                        "youtu.be"
                    ) ||
                    lower.includes(
                        "iframe"
                    ) ||
                    lower.includes(
                        "embed"
                    ) ||
                    lower.includes(
                        "player"
                    )

                );

            }
        );


    return embeds.length
        ? embeds[0]
        : null;

}


/* =========================================================
   EXTRAER URLS RECURSIVAMENTE
========================================================= */

function encontrarURLs(
    data
) {

    const resultado =
        [];


    function recorrer(
        value
    ) {

        if (!value) {

            return;

        }


        if (
            typeof value ===
            "string"
        ) {

            const urls =
                value.match(
                    /https?:\/\/[^\s"'<>]+/gi
                );


            if (urls) {

                urls.forEach(
                    url => {

                        const limpia =
                            url
                                .replace(
                                    /[),\]}]+$/,
                                    ""
                                );


                        if (
                            !resultado.includes(
                                limpia
                            )
                        ) {

                            resultado.push(
                                limpia
                            );

                        }

                    }
                );

            }


            return;

        }


        if (
            Array.isArray(
                value
            )
        ) {

            value.forEach(
                recorrer
            );

            return;

        }


        if (
            typeof value ===
            "object"
        ) {

            Object.values(
                value
            ).forEach(
                recorrer
            );

        }

    }


    recorrer(
        data
    );


    return resultado;

}


/* =========================================================
   REPRODUCIR STREAM DE PELÍCULA
========================================================= */

function reproducirStreamContenido(
    url
) {

    const modal =
        $("contentModal");


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    let overlay =
        document.getElementById(
            "moviePlayerOverlay"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "moviePlayerOverlay";


        overlay.style.cssText = `

            position:fixed;
            inset:0;
            z-index:9999;
            background:
                rgba(0,0,0,.96);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;

        `;


        document.body.appendChild(
            overlay
        );

    }


    overlay.innerHTML = `

        <button
            type="button"
            id="closeMoviePlayer"
            style="
                position:absolute;
                top:18px;
                right:18px;
                z-index:10;
                width:44px;
                height:44px;
                border:0;
                border-radius:50%;
                background:
                    rgba(255,255,255,.12);
                color:#fff;
                font-size:25px;
                cursor:pointer;
            "
        >

            ×

        </button>


        <video
            id="contentVideoPlayer"
            controls
            autoplay
            playsinline
            style="
                width:min(
                    1200px,
                    96vw
                );
                max-height:90vh;
                background:#000;
                border-radius:12px;
            "
        ></video>

    `;


    const player =
        document.getElementById(
            "contentVideoPlayer"
        );


    const close =
        document.getElementById(
            "closeMoviePlayer"
        );


    if (close) {

        close.onclick =
            () => {

                destruirMoviePlayer();

            };

    }


    if (
        /\.m3u8($|\?)/i.test(
            url
        ) &&
        window.Hls &&
        Hls.isSupported()
    ) {

        const movieHls =
            new Hls();


        movieHls.loadSource(
            url
        );


        movieHls.attachMedia(
            player
        );


        player._cineverseHls =
            movieHls;


        movieHls.on(
            Hls.Events.MANIFEST_PARSED,
            () => {

                player
                    .play()
                    .catch(
                        () => {}
                    );

            }
        );


        return;

    }


    player.src =
        url;


    player.play()
        .catch(
            () => {}
        );

}


/* =========================================================
   ABRIR EMBED
========================================================= */

function abrirEmbed(
    url
) {

    const modal =
        $("contentModal");


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   CERRAR REPRODUCTOR
========================================================= */

function destruirMoviePlayer() {

    const overlay =
        document.getElementById(
            "moviePlayerOverlay"
        );


    if (!overlay) {

        return;

    }


    const player =
        overlay.querySelector(
            "video"
        );


    if (
        player &&
        player._cineverseHls
    ) {

        try {

            player._cineverseHls.destroy();

        } catch {}

    }


    if (player) {

        player.pause();

        player.removeAttribute(
            "src"
        );

    }


    overlay.remove();

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function closeContentModal() {

    const modal =
        $("contentModal");


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   CONTENIDO VACÍO
========================================================= */

function emptyContent(
    message
) {

    return `

        <div
            class="search-empty"
            style="
                padding:25px;
                color:
                    rgba(
                        255,
                        255,
                        255,
                        .65
                    );
            "
        >

            ${escapeHTML(
                message
            )}

        </div>

    `;

}


/* =========================================================
   ICONOS TV
========================================================= */

function categoryIcon(
    category
) {

    const name =
        String(
            category || ""
        )
            .toLowerCase()
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    if (
        name.includes(
            "musica"
        ) ||
        name.includes(
            "music"
        )
    ) {

        return "🎵";

    }


    if (
        name.includes(
            "noticia"
        ) ||
        name.includes(
            "news"
        )
    ) {

        return "📰";

    }


    if (
        name.includes(
            "pelicula"
        ) ||
        name.includes(
            "movie"
        )
    ) {

        return "🎬";

    }


    if (
        name.includes(
            "entretenimiento"
        )
    ) {

        return "🎭";

    }


    if (
        name.includes(
            "deporte"
        ) ||
        name.includes(
            "sport"
        )
    ) {

        return "⚽";

    }


    if (
        name.includes(
            "caricatura"
        ) ||
        name.includes(
            "kids"
        )
    ) {

        return "🎨";

    }


    if (
        name.includes(
            "anime"
        )
    ) {

        return "🍥";

    }


    if (
        name.includes(
            "relig"
        )
    ) {

        return "✝️";

    }


    if (
        name.includes(
            "document"
        ) ||
        name.includes(
            "curiosity"
        )
    ) {

        return "🔬";

    }


    if (
        name.includes(
            "infantil"
        )
    ) {

        return "🧸";

    }


    return "📺";

}


/* =========================================================
   LIMPIAR NOMBRE
========================================================= */

function cleanName(
    name
) {

    return String(
        name || "Canal"
    )
        .replace(
            /\s*\[[^\]]*\]\s*/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


/* =========================================================
   SLUG
========================================================= */

function slug(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
    mensaje
) {

    let toast =
        document.getElementById(
            "cineverseToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "cineverseToast";


        toast.style.cssText = `

            position:fixed;
            left:50%;
            bottom:30px;
            transform:
                translateX(-50%)
                translateY(20px);
            z-index:100000;
            padding:13px 20px;
            border-radius:12px;
            background:
                rgba(20,20,30,.95);
            border:
                1px solid
                rgba(255,255,255,.12);
            color:#fff;
            font-size:13px;
            box-shadow:
                0 15px 40px
                rgba(0,0,0,.4);
            opacity:0;
            transition:
                all .3s ease;

        `;


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        mensaje;


    toast.style.opacity =
        "1";


    toast.style.transform =
        "translateX(-50%) translateY(0)";


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";


                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            3000
        );

}


/* =========================================================
   CERRAR AL ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeContentModal();

            destruirMoviePlayer();

            const search =
                $("searchOverlay");


            if (search) {

                search.classList.remove(
                    "show"
                );

            }

        }

    }
);


/* =========================================================
   LIMPIAR TV AL SALIR
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopTV();

        destruirMoviePlayer();

    }
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "🔥 NETVISION APP.JS - TV + PELÍCULAS + SERIES"
);

console.log(
    "🎬 API películas:",
    API_MOVIES
);

console.log(
    "📺 API series:",
    API_SERIES
);
