
/* =========================================================
   NETVISION - APP.JS
   TV EN VIVO + HLS + PELICULAS + SERIES + BUSCADOR
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const M3U_FILE = "./canales.m3u";

const CONTENT_API =
    "https://zonaapis.arcando.cloud";

const API_MAX_PAGES = 3;


/* =========================================================
   VARIABLES GLOBALES
========================================================= */

let channels = [];

let movies = [];

let series = [];

let currentChannel = null;

let currentCategory = null;

let currentMovie = null;

let hls = null;

let videoPlayer = null;

let playerPlaceholder = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


async function init() {

    cacheElements();

    setupNavigation();

    setupSearch();

    setupProfile();

    setupModal();

    setupModalPlayButton();

    /*
     * TV se carga independientemente.
     * Si la API falla, TV seguirá funcionando.
     */

    loadM3U();

    /*
     * Cargar películas y series.
     */

    await loadContentAPI();

}


/* =========================================================
   ELEMENTOS DOM
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
   UTILIDAD DOM
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll("[data-page]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const page =
                        button.dataset.page;

                    if (!page) return;

                    showPage(page);

                }
            );

        });


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
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.toggle(
                "active-page",
                section.id ===
                `page-${page}`
            );

        });


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.page ===
                page
            );

        });


    const mainNav =
        $("mainNav");


    if (mainNav) {

        mainNav.classList.remove(
            "open"
        );

    }


    /*
     * Si salimos de TV detenemos
     * el reproductor.
     */

    if (page !== "tv") {

        stopTV();

    }


    /*
     * Cuando entramos a películas
     * aseguramos que el catálogo
     * esté renderizado.
     */

    if (page === "movies") {

        renderMoviesPage();

    }


    /*
     * Cuando entramos a series.
     */

    if (page === "series") {

        renderSeriesPage();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   API DE CONTENIDO
========================================================= */

async function loadContentAPI() {

    console.log(
        "🎬 NETVISION: cargando contenido..."
    );


    try {

        const [
            movieData,
            seriesData
        ] = await Promise.all([

            loadAPIType(
                "movies"
            ),

            loadAPIType(
                "tvshows"
            )

        ]);


        movies =
            normalizeContentList(
                movieData,
                "movie"
            );


        series =
            normalizeContentList(
                seriesData,
                "series"
            );


        console.log(
            "🎬 Películas:",
            movies.length
        );


        console.log(
            "📺 Series:",
            series.length
        );


        renderHomeMovies();

        renderMoviesPage();

        renderSeriesPage();

        renderSearchContent();


    } catch (error) {

        console.error(
            "❌ Error cargando contenido:",
            error
        );

        /*
         * TV no se toca si la API falla.
         */

    }

}


/* =========================================================
   CARGAR PÁGINAS DE LA API
========================================================= */

async function loadAPIType(
    type
) {

    const resultados = [];

    let pagina = 1;

    let continuar = true;


    while (
        continuar &&
        pagina <= API_MAX_PAGES
    ) {

        try {

            const url =
                `${CONTENT_API}/list?type=${encodeURIComponent(type)}&page=${pagina}`;


            console.log(
                `🌐 API ${type}: página ${pagina}`
            );


            const response =
                await fetch(
                    url,
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


            /*
             * Agregar featured.
             */

            if (
                Array.isArray(
                    data.featured
                )
            ) {

                resultados.push(
                    ...data.featured
                );

            }


            /*
             * La API puede entregar
             * películas en distintas
             * propiedades.
             */

            if (
                Array.isArray(
                    data.results
                )
            ) {

                resultados.push(
                    ...data.results
                );

            }


            if (
                Array.isArray(
                    data.items
                )
            ) {

                resultados.push(
                    ...data.items
                );

            }


            if (
                Array.isArray(
                    data.data
                )
            ) {

                resultados.push(
                    ...data.data
                );

            }


            /*
             * Determinar si existe
             * otra página.
             */

            continuar =
                data.hasNextPage === true;


            if (
                data.remainingPages !==
                undefined
            ) {

                continuar =
                    Number(
                        data.remainingPages
                    ) > 0;

            }


            pagina++;

        } catch (error) {

            console.error(
                `❌ API ${type} página ${pagina}:`,
                error
            );

            break;

        }

    }


    return resultados;

}


/* =========================================================
   NORMALIZAR CONTENIDO
========================================================= */

function normalizeContentList(
    lista,
    tipo
) {

    if (
        !Array.isArray(lista)
    ) {

        return [];

    }


    const mapa =
        new Map();


    lista.forEach(item => {

        if (!item) return;


        const titulo =
            item.title ||
            item.name ||
            "Sin título";


        const imagen =
            item.image ||
            item.poster ||
            item.cover ||
            item.thumbnail ||
            "";


        const year =
            item.year ||
            item.anio ||
            "";


        const rating =
            item.rating ||
            "0.0";


        const url =
            item.url ||
            "";


        const extractUrl =
            item.extractUrl ||
            "";


        const id =
            item.id ||
            slug(
                titulo +
                "-" +
                year
            );


        const contenido = {

            id: String(id),

            titulo: String(
                titulo
            ),

            image: imagen,

            poster: imagen,

            anio: String(
                year
            ),

            rating: String(
                rating
            ),

            url,

            extractUrl,

            tipo,

            descripcion:
                item.description ||
                item.descripcion ||
                "Contenido disponible en NETVISION.",

            categoria:
                item.category ||
                "",

            original:
                item

        };


        /*
         * Evitar duplicados.
         */

        const clave =
            `${tipo}-${normalizarTexto(titulo)}-${year}`;


        if (
            !mapa.has(clave)
        ) {

            mapa.set(
                clave,
                contenido
            );

        }

    });


    return Array.from(
        mapa.values()
    );

}


/* =========================================================
   HOME - PELÍCULAS
========================================================= */

function renderHomeMovies() {

    const populares =
        $("homePopularMovies");


    const nuevas =
        $("homeNewMovies");


    if (populares) {

        populares.innerHTML = "";


        const lista =
            [...movies]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            b.rating
                        ) -
                        Number(
                            a.rating
                        )
                )
                .slice(
                    0,
                    8
                );


        lista.forEach(
            pelicula => {

                populares.appendChild(
                    createMovieCard(
                        pelicula
                    )
                );

            }
        );

    }


    if (nuevas) {

        nuevas.innerHTML = "";


        const lista =
            [...movies]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            b.anio
                        ) -
                        Number(
                            a.anio
                        )
                )
                .slice(
                    0,
                    8
                );


        lista.forEach(
            pelicula => {

                nuevas.appendChild(
                    createMovieCard(
                        pelicula
                    )
                );

            }
        );

    }

}


/* =========================================================
   PÁGINA DE PELÍCULAS
========================================================= */

function renderMoviesPage() {

    const container =
        $("movieCategories");


    if (!container) return;


    if (!movies.length) {

        container.innerHTML = `
            <div class="search-empty">
                No hay películas disponibles.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    /*
     * MÁS VISTAS
     */

    const popularSection =
        createContentSection(
            "🔥",
            "Más vistas",
            "Las películas mejor valoradas"
        );


    const popularRow =
        document.createElement(
            "div"
        );


    popularRow.className =
        "movie-row";


    [...movies]
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    b.rating
                ) -
                Number(
                    a.rating
                )
        )
        .slice(
            0,
            12
        )
        .forEach(
            pelicula => {

                popularRow.appendChild(
                    createMovieCard(
                        pelicula
                    )
                );

            }
        );


    popularSection
        .querySelector(
            ".dynamic-content"
        )
        .appendChild(
            popularRow
        );


    container.appendChild(
        popularSection
    );


    /*
     * CATÁLOGO COMPLETO
     */

    const allSection =
        createContentSection(
            "🎬",
            "Todas las películas",
            `${movies.length} películas disponibles`
        );


    const allRow =
        document.createElement(
            "div"
        );


    allRow.className =
        "movie-row";


    movies.forEach(
        pelicula => {

            allRow.appendChild(
                createMovieCard(
                    pelicula
                )
            );

        }
    );


    allSection
        .querySelector(
            ".dynamic-content"
        )
        .appendChild(
            allRow
        );


    container.appendChild(
        allSection
    );

}


/* =========================================================
   PÁGINA DE SERIES
========================================================= */

function renderSeriesPage() {

    const container =
        $("seriesCategories");


    if (!container) return;


    if (!series.length) {

        container.innerHTML = `
            <div class="search-empty">
                No hay series disponibles.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    /*
     * MÁS VISTAS
     */

    const popularSection =
        createContentSection(
            "🔥",
            "Series más vistas",
            "Las series mejor valoradas"
        );


    const popularRow =
        document.createElement(
            "div"
        );


    popularRow.className =
        "movie-row";


    [...series]
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    b.rating
                ) -
                Number(
                    a.rating
                )
        )
        .slice(
            0,
            12
        )
        .forEach(
            item => {

                popularRow.appendChild(
                    createMovieCard(
                        item
                    )
                );

            }
        );


    popularSection
        .querySelector(
            ".dynamic-content"
        )
        .appendChild(
            popularRow
        );


    container.appendChild(
        popularSection
    );


    /*
     * TODAS LAS SERIES
     */

    const allSection =
        createContentSection(
            "📺",
            "Todas las series",
            `${series.length} series disponibles`
        );


    const allRow =
        document.createElement(
            "div"
        );


    allRow.className =
        "movie-row";


    series.forEach(
        item => {

            allRow.appendChild(
                createMovieCard(
                    item
                )
            );

        }
    );


    allSection
        .querySelector(
            ".dynamic-content"
        )
        .appendChild(
            allRow
        );


    container.appendChild(
        allSection
    );

}


/* =========================================================
   CREAR SECCIÓN
========================================================= */

function createContentSection(
    icon,
    titulo,
    descripcion
) {

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "content-section dynamic-content-section";


    section.innerHTML = `

        <div class="section-header">

            <div>

                <span class="section-kicker">
                    NETVISION
                </span>

                <h2>
                    ${icon}
                    ${escapeHTML(titulo)}
                </h2>

                <p class="content-description">
                    ${escapeHTML(descripcion)}
                </p>

            </div>

        </div>

        <div class="dynamic-content"></div>

    `;


    return section;

}


/* =========================================================
   TARJETA DE PELÍCULA / SERIE
========================================================= */

function createMovieCard(
    item
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "movie-card";


    card.tabIndex =
        0;


    const imagen =
        item.image ||
        item.poster ||
        "";


    const tipo =
        item.tipo === "series"
            ? "SERIE"
            : "PELÍCULA";


    card.innerHTML = `

        <div class="movie-poster">

            ${
                imagen

                ?

                `
                <img
                    src="${escapeAttribute(imagen)}"
                    alt="${escapeAttribute(item.titulo)}"
                    loading="lazy"
                    onerror="this.style.display='none';"
                >
                `

                :

                `
                <div class="movie-no-image">
                    🎬
                </div>
                `
            }

            <div class="movie-card-overlay">

                <button
                    type="button"
                    class="movie-play-btn"
                    aria-label="Abrir ${escapeAttribute(item.titulo)}">

                    ▶

                </button>

            </div>

        </div>


        <div class="movie-card-info">

            <h3>
                ${escapeHTML(item.titulo)}
            </h3>


            <div class="movie-card-meta">

                <span>
                    ${escapeHTML(item.anio)}
                </span>

                <span>
                    ⭐ ${escapeHTML(item.rating)}
                </span>

                <span>
                    ${tipo}
                </span>

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openContent(
                item
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

                openContent(
                    item
                );

            }

        }
    );


    return card;

}


/* =========================================================
   ABRIR CONTENIDO
========================================================= */

function openContent(
    item
) {

    if (!item) return;


    currentMovie =
        item;


    /*
     * Por ahora mostramos
     * información en el modal.
     *
     * No conectamos extract/proxyvideo
     * todavía.
     */

    openContentModal(
        item
    );

}


/* =========================================================
   MODAL DE CONTENIDO
========================================================= */

function openContentModal(
    item
) {

    const modal =
        $("contentModal");


    if (!modal) return;


    const poster =
        $("modalPoster");


    const title =
        $("modalTitle");


    const description =
        $("modalDescription");


    const type =
        $("modalType");


    if (title) {

        title.textContent =
            item.titulo;

    }


    if (type) {

        type.textContent =
            item.tipo === "series"
                ? "SERIE"
                : "PELÍCULA";

    }


    if (description) {

        description.textContent =
            item.descripcion ||
            `Año: ${item.anio} · Rating: ${item.rating}`;

    }


    if (poster) {

        if (item.image) {

            poster.innerHTML = `

                <img
                    src="${escapeAttribute(item.image)}"
                    alt="${escapeAttribute(item.titulo)}"
                >

            `;

        } else {

            poster.innerHTML =
                "🎬";

        }

    }


    modal.classList.add(
        "show"
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


    if (!modal) return;


    if (close) {

        close.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "show"
                );

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

                modal.classList.remove(
                    "show"
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   BOTÓN REPRODUCIR DEL MODAL
========================================================= */

function setupModalPlayButton() {

    const modal =
        $("contentModal");


    if (!modal) return;


    modal.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".primary-btn"
                );


            if (
                !button ||
                !currentMovie
            ) {

                return;

            }


            /*
             * Todavía no enviamos
             * el contenido al reproductor.
             */

            mostrarToast(
                "El reproductor de películas lo conectaremos en el siguiente paso."
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

                globalSearch.value =
                    "";


                renderSearchResults(
                    ""
                );


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
   RESULTADOS DE BÚSQUEDA
========================================================= */

function renderSearchResults(
    value
) {

    const container =
        $("searchResults");


    if (!container) return;


    const term =
        normalizarTexto(
            value
        );


    if (!term) {

        container.innerHTML = `

            <div class="search-empty">

                Escribe el nombre de una película,
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
                        channel.name
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
            item => {

                return
                    normalizarTexto(
                        item.titulo
                    ).includes(term);

            }
        );


    const seriesResults =
        series.filter(
            item => {

                return
                    normalizarTexto(
                        item.titulo
                    ).includes(term);

            }
        );


    /*
     * IMPORTANTE:
     * El return de arriba con salto
     * puede ser problemático.
     * Por eso volvemos a filtrar
     * correctamente aquí.
     */

    const peliculasEncontradas =
        movies.filter(
            item =>
                normalizarTexto(
                    item.titulo
                ).includes(term)
        );


    const seriesEncontradas =
        series.filter(
            item =>
                normalizarTexto(
                    item.titulo
                ).includes(term)
        );


    if (
        !channelResults.length &&
        !peliculasEncontradas.length &&
        !seriesEncontradas.length
    ) {

        container.innerHTML = `

            <div class="search-empty">

                No encontramos resultados para
                "<strong>
                    ${escapeHTML(value)}
                </strong>".

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /*
     * CANALES
     */

    channelResults
        .slice(
            0,
            5
        )
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

                    <span class="search-result-logo">

                        ${
                            channel.logo

                            ?

                            `<img
                                src="${escapeAttribute(channel.logo)}"
                                alt="${escapeAttribute(channel.name)}"
                            >`

                            :

                            "📺"
                        }

                    </span>


                    <span class="search-result-info">

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


                    <span class="search-result-arrow">
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


    /*
     * PELÍCULAS
     */

    peliculasEncontradas
        .slice(
            0,
            5
        )
        .forEach(
            pelicula => {

                container.appendChild(
                    createSearchContentItem(
                        pelicula
                    )
                );

            }
        );


    /*
     * SERIES
     */

    seriesEncontradas
        .slice(
            0,
            5
        )
        .forEach(
            item => {

                container.appendChild(
                    createSearchContentItem(
                        item
                    )
                );

            }
        );

}


function createSearchContentItem(
    item
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

        <span class="search-result-logo">

            ${
                item.image

                ?

                `<img
                    src="${escapeAttribute(item.image)}"
                    alt="${escapeAttribute(item.titulo)}"
                >`

                :

                "🎬"
            }

        </span>


        <span class="search-result-info">

            <strong>
                ${escapeHTML(
                    item.titulo
                )}
            </strong>

            <small>

                ${
                    item.tipo === "series"
                        ? "SERIE"
                        : "PELÍCULA"
                }

                · ${escapeHTML(
                    item.anio
                )}

                · ⭐ ${escapeHTML(
                    item.rating
                )}

            </small>

        </span>


        <span class="search-result-arrow">
            ›
        </span>

    `;


    button.addEventListener(
        "click",
        () => {

            $("searchOverlay")
                ?.classList.remove(
                    "show"
                );


            openContent(
                item
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


    profileMenu.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                profileMenu
            ) {

                profileMenu.classList.remove(
                    "show"
                );

            }

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
   M3U
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
            "No se pudo cargar canales.m3u. Verifica que esté en la misma carpeta que index.html."
        );

    }

}


function parseM3U(
    text
) {

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
            lines[i].substring(
                8
            );


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
                !lines[j].startsWith(
                    "#"
                )
            ) {

                url =
                    lines[j];

                break;

            }

        }


        if (!url) continue;


        result.push({

            id:
                getAttr(
                    attrs,
                    "tvg-id"
                ) ||
                slug(
                    name
                ),

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


    if (!container) return;


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

                <span class="category-icon">

                    ${categoryIcon(
                        category
                    )}

                </span>

                <span class="category-name">

                    ${escapeHTML(
                        category
                    )}

                </span>

                <span class="category-arrow">
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


    if (
        categories.length
    ) {

        selectCategory(
            currentCategory ||
            categories[0]
        );

    }

}


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


    if (!container) return;


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

                ?

                `<img
                    src="${escapeAttribute(channel.logo)}"
                    alt="${escapeAttribute(channel.name)}"
                    loading="lazy"
                >`

                :

                `<span>TV</span>`
            }

        </div>


        <div class="channel-card-info">

            <div class="channel-name">

                ${escapeHTML(
                    cleanName(
                        channel.name
                    )
                )}

            </div>


            <div class="channel-meta">

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
                event.key ===
                "Enter" ||
                event.key ===
                " "
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

    if (!channel) return;


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


    if (
        channel.category
    ) {

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

                ?

                `<img
                    src="${escapeAttribute(channel.logo)}"
                    alt="${escapeAttribute(channel.name)}"
                >`

                :

                "TV";

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
   REPRODUCTOR HLS
========================================================= */

function playStream(
    url
) {

    if (!videoPlayer) return;


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

                } else if (
                    data.type ===
                    Hls.ErrorTypes.MEDIA_ERROR
                ) {

                    hls.recoverMediaError();

                } else {

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
                once: true
            }
        );


        return;

    }


    showPlayerError();

}


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


function destroyHLS() {

    if (!hls) return;


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


function hidePlaceholder() {

    if (
        playerPlaceholder
    ) {

        playerPlaceholder.classList.add(
            "hidden"
        );

    }

}


function showPlaceholder() {

    if (
        playerPlaceholder
    ) {

        playerPlaceholder.classList.remove(
            "hidden"
        );

    }

}


function showPlayerError() {

    if (
        !playerPlaceholder
    ) {

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


function showTVMessage(
    message
) {

    const container =
        $("tvCategories");


    if (!container) return;


    container.innerHTML = `

        <div style="
            padding:12px;
            color:#ff7580;
        ">

            ⚠️
            ${escapeHTML(
                message
            )}

        </div>

    `;

}


/* =========================================================
   HOME - CANALES
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
            .slice(
                0,
                8
            )
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
            .slice(
                -8
            )
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
   ICONOS TV
========================================================= */

function categoryIcon(
    category
) {

    const name =
        String(
            category ||
            ""
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


        toast.style.position =
            "fixed";


        toast.style.left =
            "50%";


        toast.style.bottom =
            "30px";


        toast.style.transform =
            "translateX(-50%) translateY(20px)";


        toast.style.zIndex =
            "99999";


        toast.style.padding =
            "12px 18px";


        toast.style.borderRadius =
            "12px";


        toast.style.background =
            "rgba(15,15,25,.96)";


        toast.style.border =
            "1px solid rgba(255,255,255,.12)";


        toast.style.color =
            "#fff";


        toast.style.fontSize =
            "13px";


        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.4)";


        toast.style.opacity =
            "0";


        toast.style.transition =
            "all .3s ease";


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
            2800
        );

}


/* =========================================================
   UTILIDADES
========================================================= */

function cleanName(
    name
) {

    return String(
        name ||
        "Canal"
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


function slug(
    value
) {

    return String(
        value ||
        ""
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


function normalizarTexto(
    texto
) {

    return String(
        texto ||
        ""
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   CERRAR TV AL SALIR
========================================================= */

window.addEventListener(
    "beforeunload",
    stopTV
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "🔥 NETVISION APP.JS CARGADO"
);

console.log(
    "🌐 API:",
    CONTENT_API
);
