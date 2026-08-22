
"use strict";

/* =========================================================
                    CINEVERSE
                    CATEGORIAS.JS
========================================================= */

let peliculas = [];

const params =
    new URLSearchParams(
        window.location.search
    );

const generoSeleccionado =
    params.get("genero") || "";


/* =========================================================
                    DOM
========================================================= */

const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );

const categoryDescription =
    document.getElementById(
        "categoryDescription"
    );

const popularMovies =
    document.getElementById(
        "popularMovies"
    );

const allMovies =
    document.getElementById(
        "allMovies"
    );

const movieCount =
    document.getElementById(
        "movieCount"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const emptyText =
    document.getElementById(
        "emptyText"
    );

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );

const popularPrev =
    document.getElementById(
        "popularPrev"
    );

const popularNext =
    document.getElementById(
        "popularNext"
    );

const movieCardTemplate =
    document.getElementById(
        "movieCardTemplate"
    );


/* =========================================================
                    CATEGORÍAS
========================================================= */

const CATEGORIAS = {

    "accion": {

        nombre: "Acción",

        descripcion:
            "Explosiones, persecuciones y adrenalina."

    },

    "ciencia-ficcion": {

        nombre: "Ciencia ficción",

        descripcion:
            "Viajes espaciales, tecnología y mundos futuristas."

    },

    "ciencia ficcion": {

        nombre: "Ciencia ficción",

        descripcion:
            "Viajes espaciales, tecnología y mundos futuristas."

    },

    "fantasia": {

        nombre: "Fantasía",

        descripcion:
            "Magia, criaturas fantásticas y aventuras épicas."

    },

    "terror": {

        nombre: "Terror",

        descripcion:
            "Suspenso, misterio y miedo hasta el último minuto."

    },

    "animacion": {

        nombre: "Animación",

        descripcion:
            "Grandes historias contadas a través de la animación."

    },

    "anime": {

        nombre: "Anime",

        descripcion:
            "Aventuras, mundos y personajes inolvidables."

    }

};


/* =========================================================
                    INICIAR
========================================================= */

async function iniciarCategorias() {

    console.log(
        "🎬 Iniciando página de categoría..."
    );


    mostrarInformacionCategoria();


    await cargarPeliculas();


    if (!peliculas.length) {

        mostrarEstadoVacio(
            "No se pudo encontrar el catálogo de películas."
        );

        ocultarCarga();

        return;

    }


    const peliculasCategoria =
        peliculas.filter(
            pelicula =>
                perteneceCategoria(
                    pelicula,
                    generoSeleccionado
                )
        );


    console.log(
        "🎬 Categoría:",
        generoSeleccionado
    );


    console.log(
        "🎬 Películas encontradas:",
        peliculasCategoria.length
    );


    if (
        !peliculasCategoria.length
    ) {

        mostrarEstadoVacio(
            `Todavía no hay películas disponibles en ${obtenerNombreCategoria()}.`
        );

        ocultarCarga();

        return;

    }


    ocultarEstadoVacio();


    /*
     * =====================================================
     * PELÍCULAS MÁS VISTAS
     * =====================================================
     *
     * Ordenamos por rating.
     */

    const populares =
        [...peliculasCategoria]
            .sort(
                (a, b) =>
                    obtenerRating(b) -
                    obtenerRating(a)
            );


    /*
     * Mostramos hasta 10 en la sección
     * de películas más vistas.
     */

    const listaPopulares =
        populares.slice(
            0,
            10
        );


    renderizarPeliculas(
        popularMovies,
        listaPopulares
    );


    /*
     * =====================================================
     * TODAS LAS PELÍCULAS
     * =====================================================
     */

    const todas =
        [...peliculasCategoria]
            .sort(
                ordenarPeliculas
            );


    renderizarPeliculas(
        allMovies,
        todas
    );


    actualizarContador(
        todas.length
    );


    configurarFlechas();


    ocultarCarga();


    console.log(
        "✅ Categoría cargada correctamente."
    );

}


/* =========================================================
                    CARGAR PELÍCULAS
========================================================= */

async function cargarPeliculas() {

    try {

        const respuesta =
            await fetch(
                "peliculas.json?v=" +
                Date.now()
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar peliculas.json"
            );

        }


        const datos =
            await respuesta.json();


        if (!Array.isArray(datos)) {

            throw new Error(
                "peliculas.json debe contener un arreglo."
            );

        }


        peliculas =
            datos;


        console.log(
            "✅ Películas cargadas:",
            peliculas.length
        );

    }

    catch (error) {

        console.error(
            "❌ Error cargando peliculas.json:",
            error
        );

        peliculas = [];

    }

}


/* =========================================================
            MOSTRAR INFORMACIÓN DE CATEGORÍA
========================================================= */

function mostrarInformacionCategoria() {

    const categoria =
        CATEGORIAS[
            normalizarTexto(
                generoSeleccionado
            )
        ];


    if (categoryTitle) {

        categoryTitle.textContent =
            categoria
                ? categoria.nombre
                : capitalizar(
                    generoSeleccionado
                );

    }


    if (categoryDescription) {

        categoryDescription.textContent =
            categoria
                ? categoria.descripcion
                : "Descubre películas seleccionadas para ti.";

    }

}


/* =========================================================
                OBTENER NOMBRE
========================================================= */

function obtenerNombreCategoria() {

    const categoria =
        CATEGORIAS[
            normalizarTexto(
                generoSeleccionado
            )
        ];


    if (categoria) {

        return categoria.nombre;

    }


    return capitalizar(
        generoSeleccionado
    );

}


/* =========================================================
                COMPROBAR CATEGORÍA
========================================================= */

function perteneceCategoria(
    pelicula,
    genero
) {

    if (!pelicula) {

        return false;

    }


    const buscado =
        normalizarTexto(
            genero
        );


    if (!buscado) {

        return false;

    }


    const campos = [];


    if (pelicula.genero) {

        campos.push(
            pelicula.genero
        );

    }


    if (pelicula.subgenero) {

        campos.push(
            pelicula.subgenero
        );

    }


    if (
        Array.isArray(
            pelicula.generos
        )
    ) {

        campos.push(
            ...pelicula.generos
        );

    }


    if (
        Array.isArray(
            pelicula.tags
        )
    ) {

        campos.push(
            ...pelicula.tags
        );

    }


    return campos.some(
        campo => {

            const valor =
                normalizarTexto(
                    campo
                );


            return (
                valor === buscado ||
                valor.includes(
                    buscado
                ) ||
                buscado.includes(
                    valor
                )
            );

        }
    );

}


/* =========================================================
                    NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(
    texto
) {

    return String(
        texto || ""
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
                    RATING
========================================================= */

function obtenerRating(
    pelicula
) {

    const rating =
        parseFloat(
            pelicula.rating
        );


    if (
        Number.isNaN(
            rating
        )
    ) {

        return 0;

    }


    return rating;

}


/* =========================================================
                ORDENAR PELÍCULAS
========================================================= */

function ordenarPeliculas(
    a,
    b
) {

    const añoA =
        parseInt(
            a.anio ||
            a.year ||
            0
        );


    const añoB =
        parseInt(
            b.anio ||
            b.year ||
            0
        );


    return añoB - añoA;

}


/* =========================================================
                    RENDERIZAR
========================================================= */

function renderizarPeliculas(
    contenedor,
    lista
) {

    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    if (
        !Array.isArray(lista) ||
        !lista.length
    ) {

        return;

    }


    lista.forEach(
        pelicula => {

            const tarjeta =
                crearTarjeta(
                    pelicula
                );


            if (tarjeta) {

                contenedor.appendChild(
                    tarjeta
                );

            }

        }
    );

}


/* =========================================================
                    CREAR TARJETA
========================================================= */

function crearTarjeta(
    pelicula
) {

    if (!pelicula) {

        return null;

    }


    let tarjeta = null;


    /*
     * Utilizamos el template de categorias.html
     */

    if (movieCardTemplate) {

        const clon =
            movieCardTemplate.content.cloneNode(
                true
            );


        tarjeta =
            clon.querySelector(
                ".movieCard"
            );

    }


    /*
     * Si no existe template,
     * creamos la tarjeta manualmente.
     */

    if (!tarjeta) {

        tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.className =
            "movieCard";


        tarjeta.innerHTML = `

            <div class="moviePoster">

                <img
                    class="poster"
                    src=""
                    alt="">

                <div class="movieOverlay">

                    <button
                        class="playMovie"
                        type="button">

                        <i class="fa-solid fa-play"></i>

                    </button>

                </div>

            </div>

            <div class="movieInfo">

                <h3
                    class="movieTitle">
                </h3>

                <div class="movieMeta">

                    <span
                        class="movieYear">
                    </span>

                    <span
                        class="movieRating">
                    </span>

                </div>

            </div>

        `;

    }


    /*
     * POSTER
     */

    const poster =
        tarjeta.querySelector(
            ".poster"
        );


    if (poster) {

        const imagen =
            pelicula.poster ||
            pelicula.imagen ||
            pelicula.image ||
            pelicula.banner ||
            "";


        poster.src =
            prepararImagen(
                imagen
            );


        poster.alt =
            pelicula.titulo ||
            pelicula.title ||
            "Película";


        poster.onerror =
            () => {

                poster.onerror =
                    null;

                poster.style.display =
                    "none";

            };

    }


    /*
     * TÍTULO
     */

    const titulo =
        tarjeta.querySelector(
            ".movieTitle"
        );


    if (titulo) {

        titulo.textContent =
            pelicula.titulo ||
            pelicula.title ||
            "Sin título";

    }


    /*
     * AÑO
     */

    const anio =
        tarjeta.querySelector(
            ".movieYear"
        );


    if (anio) {

        anio.textContent =
            pelicula.anio ||
            pelicula.year ||
            "";

    }


    /*
     * RATING
     */

    const rating =
        tarjeta.querySelector(
            ".movieRating"
        );


    if (rating) {

        rating.textContent =
            `⭐ ${
                pelicula.rating ||
                "0.0"
            }`;

    }


    /*
     * ID
     */

    if (
        pelicula.id !== undefined
    ) {

        tarjeta.dataset.id =
            pelicula.id;

    }


    /*
     * BOTÓN PLAY
     */

    const play =
        tarjeta.querySelector(
            ".playMovie"
        );


    if (play) {

        play.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                abrirPelicula(
                    pelicula
                );

            }
        );

    }


    /*
     * CLICK EN TARJETA
     */

    tarjeta.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".playMovie"
                )
            ) {

                return;

            }


            abrirPelicula(
                pelicula
            );

        }
    );


    return tarjeta;

}


/* =========================================================
                    PREPARAR IMAGEN
========================================================= */

function prepararImagen(
    imagen
) {

    if (!imagen) {

        return "";

    }


    if (
        imagen.startsWith(
            "http://"
        ) ||
        imagen.startsWith(
            "https://"
        ) ||
        imagen.startsWith(
            "data:"
        )
    ) {

        return imagen;

    }


    return encodeURI(
        imagen
    );

}


/* =========================================================
                    ABRIR PELÍCULA
========================================================= */

function abrirPelicula(
    pelicula
) {

    if (!pelicula) {

        return;

    }


    const id =
        pelicula.id;


    if (
        id === undefined ||
        id === null
    ) {

        mostrarToast(
            "Esta película todavía no tiene un ID."
        );

        return;

    }


    window.location.href =
        `reproductor.html?id=${
            encodeURIComponent(
                id
            )
        }`;

}


/* =========================================================
                    CONTADOR
========================================================= */

function actualizarContador(
    cantidad
) {

    if (!movieCount) {

        return;

    }


    movieCount.textContent =
        cantidad === 1
            ? "1 película"
            : `${cantidad} películas`;

}


/* =========================================================
                    ESTADO VACÍO
========================================================= */

function mostrarEstadoVacio(
    mensaje
) {

    if (emptyText) {

        emptyText.textContent =
            mensaje;

    }


    if (emptyState) {

        emptyState.hidden =
            false;

    }


    if (popularMovies) {

        popularMovies.innerHTML =
            "";

    }


    if (allMovies) {

        allMovies.innerHTML =
            "";

    }


    if (movieCount) {

        movieCount.textContent =
            "0 películas";

    }

}


function ocultarEstadoVacio() {

    if (emptyState) {

        emptyState.hidden =
            true;

    }

}


/* =========================================================
                    FLECHAS
========================================================= */

function configurarFlechas() {

    if (
        !popularMovies
    ) {

        return;

    }


    if (popularPrev) {

        popularPrev.addEventListener(
            "click",
            () => {

                popularMovies.scrollBy({

                    left:
                        -500,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    if (popularNext) {

        popularNext.addEventListener(
            "click",
            () => {

                popularMovies.scrollBy({

                    left:
                        500,

                    behavior:
                        "smooth"

                });

            }
        );

    }

}


/* =========================================================
                    VOLVER
========================================================= */

function configurarVolver() {

    const botones =
        document.querySelectorAll(
            ".backHome"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                event => {

                    /*
                     * Permitimos que el enlace
                     * siga normalmente hacia index.html.
                     */

                    console.log(
                        "↩️ Volviendo al inicio..."
                    );

                }
            );

        }
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


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        mensaje;


    toast.classList.add(
        "visible"
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
                );

            },
            2800
        );

}


/* =========================================================
                    LOADING
========================================================= */

function ocultarCarga() {

    if (!loadingScreen) {

        return;

    }


    loadingScreen.classList.add(
        "hide"
    );


    setTimeout(
        () => {

            loadingScreen.style.display =
                "none";

        },
        700
    );

}


/* =========================================================
                    CAPITALIZAR
========================================================= */

function capitalizar(
    texto
) {

    if (!texto) {

        return "Categoría";

    }


    return String(
        texto
    )
        .charAt(0)
        .toUpperCase() +
        String(
            texto
        ).slice(1);

}


/* =========================================================
                    INICIO
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            configurarVolver();

            iniciarCategorias();

        }
    );

} else {

    configurarVolver();

    iniciarCategorias();

}


/* =========================================================
                    DEBUG
========================================================= */

console.log(
    "🔥 categorias.js cargado correctamente."
);
