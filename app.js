/* =========================================================
   NETVISION - APP.JS
   TV EN VIVO + M3U + PELÍCULAS + SERIES
   DATOS DE PRUEBA
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN TV
========================================================= */

const M3U_FILE = "./canales.m3u";


/* =========================================================
   VARIABLES TV
========================================================= */

let channels = [];
let currentChannel = null;
let currentCategory = null;
let hls = null;

let videoPlayer = null;
let playerPlaceholder = null;


/* =========================================================
   VARIABLES PELÍCULAS / SERIES
========================================================= */

let peliculas = [];
let series = [];

let contenidoActual = null;


/* =========================================================
   DATOS DE PRUEBA
========================================================= */

const PELICULAS_PRUEBA = [

    {
        id: "movie-001",
        titulo: "Horizonte Final",
        descripcion:
            "Una misión espacial descubre una señal desconocida que podría cambiar el destino de la humanidad.",
        genero: "Ciencia ficción",
        rating: "8.9",
        anio: "2026",
        duracion: "2h 08min",
        popular: true,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/101522/ffffff?text=Horizonte%20Final"
    },

    {
        id: "movie-002",
        titulo: "Operación Sombra",
        descripcion:
            "Un agente retirado debe regresar al campo para detener una amenaza internacional.",
        genero: "Acción",
        rating: "8.7",
        anio: "2025",
        duracion: "1h 58min",
        popular: true,
        nuevo: false,
        poster:
            "https://placehold.co/400x600/17110f/ffffff?text=Operacion%20Sombra"
    },

    {
        id: "movie-003",
        titulo: "El Reino Perdido",
        descripcion:
            "Un joven descubre un reino oculto donde la magia todavía existe.",
        genero: "Fantasía",
        rating: "8.5",
        anio: "2026",
        duracion: "2h 15min",
        popular: true,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/17121f/ffffff?text=El%20Reino%20Perdido"
    },

    {
        id: "movie-004",
        titulo: "La Casa Oscura",
        descripcion:
            "Una familia llega a una antigua casa donde comienzan a ocurrir fenómenos inexplicables.",
        genero: "Terror",
        rating: "8.2",
        anio: "2025",
        duracion: "1h 46min",
        popular: true,
        nuevo: false,
        poster:
            "https://placehold.co/400x600/130f16/ffffff?text=La%20Casa%20Oscura"
    },

    {
        id: "movie-005",
        titulo: "Guardianes del Tiempo",
        descripcion:
            "Un grupo de viajeros intenta impedir que una organización cambie la historia.",
        genero: "Ciencia ficción",
        rating: "8.8",
        anio: "2026",
        duracion: "2h 20min",
        popular: false,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/0d1820/ffffff?text=Guardianes%20del%20Tiempo"
    },

    {
        id: "movie-006",
        titulo: "Zona de Combate",
        descripcion:
            "Una unidad especial queda atrapada detrás de las líneas enemigas.",
        genero: "Acción",
        rating: "8.1",
        anio: "2025",
        duracion: "1h 52min",
        popular: false,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/20100e/ffffff?text=Zona%20de%20Combate"
    },

    {
        id: "movie-007",
        titulo: "Dragones de Valyria",
        descripcion:
            "Tres hermanos emprenden una aventura para recuperar un antiguo reino.",
        genero: "Fantasía",
        rating: "9.0",
        anio: "2025",
        duracion: "2h 31min",
        popular: true,
        nuevo: false,
        poster:
            "https://placehold.co/400x600/1b1425/ffffff?text=Dragones%20de%20Valyria"
    },

    {
        id: "movie-008",
        titulo: "Noche Sin Fin",
        descripcion:
            "Una pequeña ciudad queda atrapada en una noche que parece no terminar.",
        genero: "Terror",
        rating: "8.4",
        anio: "2026",
        duracion: "1h 49min",
        popular: false,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/120e13/ffffff?text=Noche%20Sin%20Fin"
    },

    {
        id: "movie-009",
        titulo: "Código Omega",
        descripcion:
            "Un hacker descubre un programa capaz de controlar sistemas militares.",
        genero: "Acción",
        rating: "8.3",
        anio: "2024",
        duracion: "2h 02min",
        popular: true,
        nuevo: false,
        poster:
            "https://placehold.co/400x600/101a20/ffffff?text=Codigo%20Omega"
    },

    {
        id: "movie-010",
        titulo: "Planeta Aurora",
        descripcion:
            "Una expedición encuentra un planeta que podría convertirse en el nuevo hogar de la humanidad.",
        genero: "Ciencia ficción",
        rating: "9.1",
        anio: "2026",
        duracion: "2h 18min",
        popular: true,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/101827/ffffff?text=Planeta%20Aurora"
    },

    {
        id: "movie-011",
        titulo: "El Bosque Encantado",
        descripcion:
            "Una joven entra a un bosque mágico buscando respuestas sobre su pasado.",
        genero: "Fantasía",
        rating: "8.0",
        anio: "2024",
        duracion: "1h 55min",
        popular: false,
        nuevo: false,
        poster:
            "https://placehold.co/400x600/102018/ffffff?text=El%20Bosque%20Encantado"
    },

    {
        id: "movie-012",
        titulo: "El Último Ritual",
        descripcion:
            "Un investigador descubre que una serie de desapariciones están relacionadas con un antiguo ritual.",
        genero: "Terror",
        rating: "8.6",
        anio: "2026",
        duracion: "1h 51min",
        popular: false,
        nuevo: true,
        poster:
            "https://placehold.co/400x600/171017/ffffff?text=El%20Ultimo%20Ritual"
    }

];


const SERIES_PRUEBA = [

    {
        id: "series-001",
        titulo: "Guardianes del Futuro",
        descripcion:
            "Un grupo de viajeros protege diferentes líneas temporales.",
        genero: "Ciencia ficción",
        rating: "9.0",
        anio: "2026",
        temporadas: "2 temporadas",
        poster:
            "https://placehold.co/400x600/101b27/ffffff?text=Guardianes%20del%20Futuro"
    },

    {
        id: "series-002",
        titulo: "Distrito 9",
        descripcion:
            "Una unidad especial investiga los casos más peligrosos de la ciudad.",
        genero: "Acción",
        rating: "8.7",
        anio: "2025",
        temporadas: "3 temporadas",
        poster:
            "https://placehold.co/400x600/1c1311/ffffff?text=Distrito%209"
    },

    {
        id: "series-003",
        titulo: "Reino de Sombras",
        descripcion:
            "Una princesa debe descubrir el secreto detrás de una antigua maldición.",
        genero: "Fantasía",
        rating: "8.9",
        anio: "2026",
        temporadas: "1 temporada",
        poster:
            "https://placehold.co/400x600/171122/ffffff?text=Reino%20de%20Sombras"
    },

    {
        id: "series-004",
        titulo: "Archivo Paranormal",
        descripcion:
            "Investigadores estudian fenómenos que desafían toda explicación.",
        genero: "Terror",
        rating: "8.4",
        anio: "2025",
        temporadas: "2 temporadas",
        poster:
            "https://placehold.co/400x600/110e15/ffffff?text=Archivo%20Paranormal"
    },

    {
        id: "series-005",
        titulo: "Academia Zero",
        descripcion:
            "Un grupo de jóvenes descubre que poseen habilidades extraordinarias.",
        genero: "Acción",
        rating: "8.2",
        anio: "2026",
        temporadas: "1 temporada",
        poster:
            "https://placehold.co/400x600/10151f/ffffff?text=Academia%20Zero"
    },

    {
        id: "series-006",
        titulo: "Más Allá de Marte",
        descripcion:
            "La humanidad comienza su primera colonia fuera de la Tierra.",
        genero: "Ciencia ficción",
        rating: "9.2",
        anio: "2026",
        temporadas: "1 temporada",
        poster:
            "https://placehold.co/400x600/101722/ffffff?text=Mas%20Alla%20de%20Marte"
    },

    {
        id: "series-007",
        titulo: "Crónicas del Dragón",
        descripcion:
            "Un joven guerrero descubre que es el último heredero de una antigua familia.",
        genero: "Fantasía",
        rating: "8.8",
        anio: "2025",
        temporadas: "2 temporadas",
        poster:
            "https://placehold.co/400x600/191321/ffffff?text=Cronicas%20del%20Dragon"
    },

    {
        id: "series-008",
        titulo: "La Última Puerta",
        descripcion:
            "Una puerta misteriosa aparece cada noche en diferentes lugares.",
        genero: "Terror",
        rating: "8.5",
        anio: "2026",
        temporadas: "1 temporada",
        poster:
            "https://placehold.co/400x600/120f14/ffffff?text=La%20Ultima%20Puerta"
    }

];


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    cacheElements();

    cargarContenidoPrueba();

    setupNavigation();

    setupSearch();

    setupProfile();

    setupModal();

    setupSeeAllButtons();

    loadM3U();

    console.log(
        "NETVISION: aplicación iniciada."
    );

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
   CARGAR DATOS DE PRUEBA
========================================================= */

function cargarContenidoPrueba() {

    peliculas =
        [...PELICULAS_PRUEBA];

    series =
        [...SERIES_PRUEBA];


    renderHomeMovies();

    renderMoviePage();

    renderSeriesPage();

    console.log(
        `NETVISION: ${peliculas.length} películas de prueba.`
    );

    console.log(
        `NETVISION: ${series.length} series de prueba.`
    );

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

                        if (!page) return;

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


    if (
        page !== "tv"
    ) {

        stopTV();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

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

        console.warn(
            "NETVISION: no se encontró el botón de búsqueda."
        );

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

                Escribe el nombre de una
                película, serie o canal.

            </div>

        `;

        return;

    }


    const movieResults =
        peliculas.filter(
            pelicula =>
                contenidoCoincide(
                    pelicula,
                    term
                )
        );


    const seriesResults =
        series.filter(
            serie =>
                contenidoCoincide(
                    serie,
                    term
                )
        );


    const channelResults =
        channels.filter(
            channel => {

                const name =
                    cleanName(
                        channel.name
                    ).toLowerCase();

                const category =
                    String(
                        channel.category ||
                        ""
                    ).toLowerCase();

                return (
                    name.includes(term) ||
                    category.includes(term)
                );

            }
        );


    const total =
        movieResults.length +
        seriesResults.length +
        channelResults.length;


    if (!total) {

        container.innerHTML = `

            <div class="search-empty">

                No encontramos resultados
                para "<strong>
                ${escapeHTML(value)}
                </strong>".

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    movieResults
        .slice(0, 8)
        .forEach(
            pelicula => {

                container.appendChild(
                    crearResultadoBusqueda(
                        pelicula,
                        "PELÍCULA"
                    )
                );

            }
        );


    seriesResults
        .slice(0, 8)
        .forEach(
            serie => {

                container.appendChild(
                    crearResultadoBusqueda(
                        serie,
                        "SERIE"
                    )
                );

            }
        );


    channelResults
        .slice(0, 8)
        .forEach(
            channel => {

                container.appendChild(
                    crearResultadoCanal(
                        channel
                    )
                );

            }
        );

}


/* =========================================================
   RESULTADO CONTENIDO
========================================================= */

function crearResultadoBusqueda(
    contenido,
    tipo
) {

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

            <img
                src="${escapeAttribute(
                    contenido.poster
                )}"
                alt="${escapeAttribute(
                    contenido.titulo
                )}"
                loading="lazy">

        </span>


        <span
            class="search-result-info">

            <strong>
                ${escapeHTML(
                    contenido.titulo
                )}
            </strong>

            <small>
                ${tipo}
                ·
                ${escapeHTML(
                    contenido.genero
                )}
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

            openContent(
                contenido,
                tipo
            );

        }
    );


    return item;

}


/* =========================================================
   RESULTADO CANAL
========================================================= */

function crearResultadoCanal(
    channel
) {

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

                ?

                `<img
                    src="${escapeAttribute(
                        channel.logo
                    )}"
                    alt="${escapeAttribute(
                        channel.name
                    )}"
                    loading="lazy">`

                :

                "📺"
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


    return item;

}


/* =========================================================
   BUSCAR CONTENIDO
========================================================= */

function contenidoCoincide(
    contenido,
    term
) {

    const texto = [

        contenido.titulo,

        contenido.genero,

        contenido.descripcion,

        contenido.anio

    ]
        .map(
            valor =>
                normalizarTexto(
                    valor
                )
        )
        .join(" ");


    return texto.includes(
        term
    );

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


    if (!modal) return;


    if (close) {

        close.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "show"
                );

                contenidoActual =
                    null;

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

                contenidoActual =
                    null;

            }

        }
    );

}


/* =========================================================
   ABRIR CONTENIDO
========================================================= */

function openContent(
    contenido,
    tipo
) {

    if (!contenido) return;


    contenidoActual =
        contenido;


    const modal =
        $("contentModal");


    if (!modal) {

        mostrarToast(
            `${contenido.titulo} seleccionado.`
        );

        return;

    }


    const poster =
        $("modalPoster");

    const title =
        $("modalTitle");

    const description =
        $("modalDescription");

    const type =
        $("modalType");


    if (poster) {

        poster.innerHTML = `

            <img
                src="${escapeAttribute(
                    contenido.poster
                )}"
                alt="${escapeAttribute(
                    contenido.titulo
                )}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:10px;
                "
            >

        `;

    }


    if (title) {

        title.textContent =
            contenido.titulo;

    }


    if (type) {

        type.textContent =
            tipo;

    }


    if (description) {

        description.innerHTML = `

            ${escapeHTML(
                contenido.descripcion
            )}

            <br><br>

            <strong>
                ⭐ ${escapeHTML(
                    contenido.rating
                )}
            </strong>

            &nbsp;&nbsp;

            <strong>
                📅 ${escapeHTML(
                    contenido.anio
                )}
            </strong>

            ${
                contenido.duracion

                ?

                `
                &nbsp;&nbsp;

                <strong>
                    🕒 ${escapeHTML(
                        contenido.duracion
                    )}
                </strong>
                `

                :

                `
                &nbsp;&nbsp;

                <strong>
                    📺 ${escapeHTML(
                        contenido.temporadas
                    )}
                </strong>
                `
            }

        `;

    }


    const playButton =
        modal.querySelector(
            ".primary-btn"
        );


    if (playButton) {

        playButton.onclick =
            () => {

                /*
                 * Los datos actuales son
                 * únicamente de prueba.
                 *
                 * Cuando tengamos una fuente
                 * de video autorizada,
                 * aquí conectaremos el
                 * reproductor.
                 */

                mostrarToast(
                    "Esta película es un dato de prueba. El reproductor se conectará cuando agreguemos la fuente de video."
                );

            };

    }


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   PELÍCULAS - INICIO
========================================================= */

function renderHomeMovies() {

    const popular =
        $("homePopularMovies");

    const newest =
        $("homeNewMovies");


    if (popular) {

        popular.innerHTML =
            "";


        peliculas
            .filter(
                pelicula =>
                    pelicula.popular
            )
            .slice(0, 8)
            .forEach(
                pelicula => {

                    popular.appendChild(
                        createMovieCard(
                            pelicula
                        )
                    );

                }
            );

    }


    if (newest) {

        newest.innerHTML =
            "";


        peliculas
            .filter(
                pelicula =>
                    pelicula.nuevo
            )
            .slice(0, 8)
            .forEach(
                pelicula => {

                    newest.appendChild(
                        createMovieCard(
                            pelicula
                        )
                    );

                }
            );

    }

}


/* =========================================================
   TARJETA PELÍCULA
========================================================= */

function createMovieCard(
    pelicula
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "movie-card";


    card.tabIndex =
        0;


    card.innerHTML = `

        <div
            class="movie-poster">

            <img
                src="${escapeAttribute(
                    pelicula.poster
                )}"
                alt="${escapeAttribute(
                    pelicula.titulo
                )}"
                loading="lazy"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    position:absolute;
                    inset:0;
                ">


            <div
                class="movie-poster-content"
                style="
                    position:relative;
                    z-index:2;
                    width:100%;
                    margin-top:auto;
                    padding-top:70%;
                    background:
                    linear-gradient(
                        transparent,
                        rgba(0,0,0,.88)
                    );
                ">

                <div
                    class="movie-title">

                    ${escapeHTML(
                        pelicula.titulo
                    )}

                </div>


                <div
                    class="movie-meta">

                    ⭐ ${escapeHTML(
                        pelicula.rating
                    )}

                    ·

                    ${escapeHTML(
                        pelicula.anio
                    )}

                </div>

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openContent(
                pelicula,
                "PELÍCULA"
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
                    pelicula,
                    "PELÍCULA"
                );

            }

        }
    );


    return card;

}


/* =========================================================
   PÁGINA DE PELÍCULAS
========================================================= */

function renderMoviePage() {

    const container =
        $("movieCategories");


    if (!container) return;


    container.innerHTML =
        "";


    const categorias =
        obtenerCategorias(
            peliculas
        );


    categorias.forEach(
        categoria => {

            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "category-section";


            const lista =
                peliculas.filter(
                    pelicula =>
                        normalizarTexto(
                            pelicula.genero
                        ) ===
                        normalizarTexto(
                            categoria
                        )
                );


            section.innerHTML = `

                <div
                    class="section-header">

                    <div>

                        <span
                            class="section-kicker">

                            ${escapeHTML(
                                categoria
                            )}

                        </span>


                        <h2>

                            ${iconoGenero(
                                categoria
                            )}

                            ${escapeHTML(
                                categoria
                            )}

                        </h2>

                    </div>


                    <span
                        class="see-all">

                        ${lista.length}
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


            lista.forEach(
                pelicula => {

                    row.appendChild(
                        createMovieCard(
                            pelicula
                        )
                    );

                }
            );


            container.appendChild(
                section
            );

        }
    );

}


/* =========================================================
   PÁGINA DE SERIES
========================================================= */

function renderSeriesPage() {

    const container =
        $("seriesCategories");


    if (!container) return;


    container.innerHTML =
        "";


    const categorias =
        obtenerCategorias(
            series
        );


    categorias.forEach(
        categoria => {

            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "category-section";


            const lista =
                series.filter(
                    serie =>
                        normalizarTexto(
                            serie.genero
                        ) ===
                        normalizarTexto(
                            categoria
                        )
                );


            section.innerHTML = `

                <div
                    class="section-header">

                    <div>

                        <span
                            class="section-kicker">

                            ${escapeHTML(
                                categoria
                            )}

                        </span>


                        <h2>

                            ${iconoGenero(
                                categoria
                            )}

                            ${escapeHTML(
                                categoria
                            )}

                        </h2>

                    </div>


                    <span
                        class="see-all">

                        ${lista.length}
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


            lista.forEach(
                serie => {

                    row.appendChild(
                        createSeriesCard(
                            serie
                        )
                    );

                }
            );


            container.appendChild(
                section
            );

        }
    );

}


/* =========================================================
   TARJETA SERIE
========================================================= */

function createSeriesCard(
    serie
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "movie-card";


    card.tabIndex =
        0;


    card.innerHTML = `

        <div
            class="movie-poster">

            <img
                src="${escapeAttribute(
                    serie.poster
                )}"
                alt="${escapeAttribute(
                    serie.titulo
                )}"
                loading="lazy"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    position:absolute;
                    inset:0;
                ">


            <div
                class="movie-poster-content"
                style="
                    position:relative;
                    z-index:2;
                    width:100%;
                    margin-top:auto;
                    padding-top:70%;
                    background:
                    linear-gradient(
                        transparent,
                        rgba(0,0,0,.88)
                    );
                ">

                <div
                    class="movie-title">

                    ${escapeHTML(
                        serie.titulo
                    )}

                </div>


                <div
                    class="movie-meta">

                    ⭐ ${escapeHTML(
                        serie.rating
                    )}

                    ·

                    ${escapeHTML(
                        serie.anio
                    )}

                </div>

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openContent(
                serie,
                "SERIE"
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
                    serie,
                    "SERIE"
                );

            }

        }
    );


    return card;

}


/* =========================================================
   CATEGORÍAS
========================================================= */

function obtenerCategorias(
    lista
) {

    return [
        ...new Set(
            lista
                .map(
                    item =>
                        item.genero
                )
                .filter(Boolean)
        )
    ];

}


function iconoGenero(
    genero
) {

    const nombre =
        normalizarTexto(
            genero
        );


    if (
        nombre.includes(
            "accion"
        )
    ) {

        return "⚡";

    }


    if (
        nombre.includes(
            "ciencia"
        )
    ) {

        return "🚀";

    }


    if (
        nombre.includes(
            "fantasia"
        )
    ) {

        return "🪄";

    }


    if (
        nombre.includes(
            "terror"
        )
    ) {

        return "👻";

    }


    if (
        nombre.includes(
            "anime"
        )
    ) {

        return "🍥";

    }


    return "🎬";

}


/* =========================================================
   BOTONES VER TODO
========================================================= */

function setupSeeAllButtons() {

    document
        .querySelectorAll(
            ".see-all[data-page]"
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

                            showPage(
                                page
                            );

                        }

                    }
                );

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
            .split(
                /\r?\n/
            )
            .map(
                line =>
                    line.trim()
            )
            .filter(
                Boolean
            );


    const result =
        [];


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
            info.indexOf(
                ","
            );


        const attrs =
            comma >= 0
                ? info.substring(
                    0,
                    comma
                )
                : info;


        const name =
            comma >= 0
                ? info
                    .substring(
                        comma + 1
                    )
                    .trim()
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

        <div
            class="channel-logo">

            ${
                channel.logo

                ?

                `<img
                    src="${escapeAttribute(
                        channel.logo
                    )}"
                    alt="${escapeAttribute(
                        channel.name
                    )}"
                    loading="lazy">`

                :

                `<span>
                    TV
                </span>`
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
                    src="${escapeAttribute(
                        channel.logo
                    )}"
                    alt="${escapeAttribute(
                        channel.name
                    )}">`

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
   REPRODUCCIÓN HLS
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


/* =========================================================
   DETENER TV
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
   ERROR REPRODUCTOR TV
========================================================= */

function showPlayerError() {

    if (!playerPlaceholder) return;


    playerPlaceholder.classList.remove(
        "hidden"
    );


    playerPlaceholder.innerHTML = `

        <div
            class="player-icon">

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

        <div
            style="
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
   CANALES EN INICIO
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
   UTILIDADES
========================================================= */

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


function escapeHTML(
    value
) {

    return String(
        value ??
        ""
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
   TOAST
========================================================= */

function mostrarToast(
    mensaje
) {

    let toast =
        document.getElementById(
            "netvisionToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "netvisionToast";


        toast.style.position =
            "fixed";


        toast.style.left =
            "50%";


        toast.style.bottom =
            "30px";


        toast.style.transform =
            "translateX(-50%)";


        toast.style.zIndex =
            "999999";


        toast.style.padding =
            "14px 20px";


        toast.style.borderRadius =
            "12px";


        toast.style.background =
            "rgba(10,12,20,.96)";


        toast.style.color =
            "#fff";


        toast.style.border =
            "1px solid rgba(255,255,255,.12)";


        toast.style.boxShadow =
            "0 15px 50px rgba(0,0,0,.5)";


        toast.style.fontSize =
            "14px";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        mensaje;


    toast.style.opacity =
        "1";


    clearTimeout(
        toast._timer
    );


    toast._timer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

            },
            3200
        );

}


/* =========================================================
   ANTES DE CERRAR
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopTV();

    }
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "🔥 NETVISION APP.JS COMPLETO CARGADO"
);
