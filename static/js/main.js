document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const tema = params.get('tema');
    const path = window.location.pathname;
    const pregunta = document.querySelector(".hero_title");
    const numero = document.querySelector(".hero_subtitle");
    const respuestas = document.querySelectorAll(".hero_respuestas-container");
    const botones = document.querySelectorAll(".hero_respuestas-text");
    const enviarRespuesta = document.querySelector(".hero_button");
    const barra_progreso = document.getElementById("barra-progreso");
    let preguntas = [];
    let indice = 0;
    let haRespondido = false;
    let puntuacion = 0;


    if (path.includes('preguntas')) {
        // Establecemos el header segun el tema en el que estemos
        let logoHeader = document.getElementById("logo-header");
        let temaPreguntas = document.querySelector(".header_preguntas_tema-text");
        let containerPreguntas = document.querySelectorAll(".header_preguntas_tema-container");

        const colorPorCategoria = {
            HTML: "#FFF5ED",
            CSS: "#E0FDEF",
            Javascript: "#EBF0FF",
            Accessibility: "#F6E7FF"
        }

        if (logoHeader && tema) {
            logoHeader.src = `/static/images/icon-${tema.toLowerCase()}.svg`;
        }

        containerPreguntas.forEach(pregunta => {
            pregunta.style.backgroundColor = colorPorCategoria[tema];
        })

        temaPreguntas.textContent = tema;


        function actualizarBarraProgreso() {
            const progreso = ((indice + 1) / preguntas.length) * 100;
            barra_progreso.style.width = `${progreso}%`;
        }


        function mostrarPregunta() {
            const actual = preguntas[indice];
            pregunta.textContent = actual.question;
            numero.textContent = `Question ${indice + 1} of 10`;
            

            botones.forEach((boton, i) => {
                boton.textContent = actual.options[i];
            })

            respuestaSeleccionada = null;
            contenedorSeleccionado = null;
        }


        // Damos estilos a las respuestas cuando se haga click sobre ellas
        respuestas.forEach(respuesta => {
            respuesta.addEventListener("click", () => {
                if (!haRespondido) {
                // Quitamos los estilos de todos
                respuestas.forEach(r => {
                    let fondo = r.querySelector(".letra_container");
                    let letra = r.querySelector(".letra");

                    r.style.border = "";
                    fondo.style.backgroundColor = "#F4F6FA";
                    letra.style.color = "#626C7F";
                });
                
                    // Damos estilos solamente a la respuesta clickeada
                    const fondo = respuesta.querySelector(".letra_container");
                    const letra = respuesta.querySelector(".letra");
            
                    fondo.style.backgroundColor = "#A729F5";
                    letra.style.color = "white";
                    respuesta.style.border = "3px solid #A729F5";
                }
            })
        })


        let respuestaSeleccionada;
        let contenedorSeleccionado;


        botones.forEach(boton => {
            boton.addEventListener("click", () => {
                respuestaSeleccionada = boton.textContent;
                contenedorSeleccionado = boton.parentElement;
            })
        })

        function validarRespuesta() {
            const correcta = preguntas[indice].answer;

            const letraContainer = contenedorSeleccionado.querySelector(".letra_container");
            const letra = contenedorSeleccionado.querySelector(".letra");
            const check = contenedorSeleccionado.querySelector(".check");

            if (!respuestaSeleccionada || !contenedorSeleccionado) {
                seleccionaRespuesta.style.display = "flex";
            }

            if (respuestaSeleccionada === correcta) {
                letraContainer.style.backgroundColor = "#2FD887";
                letra.style.color = "white";
                contenedorSeleccionado.style.border = "3px solid #2FD887";
                check.src = "/static/images/icon-correct.svg";
                check.classList.add("respuesta_correcta-check");
                puntuacion += 1;
            } else {
                letraContainer.style.backgroundColor = "#EE5454";
                letra.style.color = "white";
                contenedorSeleccionado.style.border = "3px solid #EE5454";
                check.src = "/static/images/icon-incorrect.svg";
                check.classList.add("respuesta_check");


                // Mostrar la correcta
                const opciones = document.querySelectorAll(".hero_respuestas-container");
                opciones.forEach(opcion => {
                    const texto = opcion.querySelector(".hero_respuestas-text").textContent;
                    if (texto === correcta) {
                        const check = opcion.querySelector(".check");
        
                        check.src = "/static/images/icon-correct.svg";
                        check.classList.add("respuesta_check");
                    }
                });
            }

        }

        function limpiarEstilos() {
            const opciones = document.querySelectorAll(".hero_respuestas-container");
        

            opciones.forEach(opcion => {
                const letraContainer = opcion.querySelector(".letra_container");
                const letra = opcion.querySelector(".letra");
                const check = opcion.querySelector(".check");

                letraContainer.style.backgroundColor = "#F4F6FA";
                letra.style.color = "#626C7F";
                opcion.style.border = "none";
            
                if (check) {
                    check.src = "";
                    check.classList.remove("respuesta_check");
                }
            });

            respuestaSeleccionada = undefined;

        }

        const seleccionaRespuesta = document.querySelector(".hero_seleccionarRespuesta");


        // logica de la pagina
        enviarRespuesta.addEventListener("click", () => {

            if (!haRespondido) {
                if (!respuestaSeleccionada) {
                    seleccionaRespuesta.style.display = "flex";
                }
                validarRespuesta();
                haRespondido = true;
                seleccionaRespuesta.style.display = "none";
                enviarRespuesta.textContent = "Next Question";


            } else {
                seleccionaRespuesta.style.display = "none";
                indice++;
                enviarRespuesta.textContent = "Submit Answer";
                

                if (indice < preguntas.length) {
                    mostrarPregunta();
                    limpiarEstilos();
                    actualizarBarraProgreso();
                    haRespondido = false;
                } else {
                    alert("Has terminado el cuestionario");
                    localStorage.setItem("Puntuacion", puntuacion);
                    localStorage.setItem("total", preguntas.length);
                    localStorage.setItem("tema", tema);

                    if (tema) {
                        window.location.href = `/puntuacion/?tema=${tema}`;
                    } else {
                        console.error("No se encontró el tema");
                    }
                }
            }
        })

            }


    // Código común a todas las páginas...
    fetch("/static/data.json")
    .then((response) => {
        if (!response.ok) {
        throw new Error("Error al cargar el archivo JSON");
        }
        return response.json();
    })
        .then((data) => {
            if (tema) {
                const quiz = data.quizzes.find(q => q.title.toLowerCase() === tema.toLowerCase());
                preguntas = quiz.questions;
                mostrarPregunta();
            } else {
                console.log("el tema es null");
            }
    })

    
    // Configuracion modo oscuro
    const toggleBtn = document.querySelector(".toggle-theme");


    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Alternamos entre modo oscuro y modo claro
    toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });




if (path.includes('puntuacion')) {
    const logos = document.querySelectorAll("#logo-header");
    const tema = params.get('tema');
    
    const score = localStorage.getItem("Puntuacion");
    const nota = document.getElementById("puntos");
    const temaHeader = document.getElementById("temaHeader");
    const containerPreguntas = document.querySelectorAll(".header_preguntas_tema-container");
    const titulo = document.getElementById("titulo_tema");
    const titulos_header = document.querySelectorAll(".header_preguntas_tema-text");

    const imagenesPorTema = {
        HTML: "/static/images/icon-html.svg",
        CSS: "/static/images/icon-css.svg",
        Javascript: "/static/images/icon-javascript.svg",
        Accessibility: "/static/images/icon-accessibility.svg"
    };

    const colorPorCategoria = {
        HTML: "#FFF5ED",
        CSS: "#E0FDEF",
        Javascript: "#EBF0FF",
        Accessibility: "#F6E7FF"
    }

    logos.forEach(logo => {
        logo.src = `/static/images/icon-${tema.toLowerCase()}.svg`;
        console.log(logo);
    })

    containerPreguntas.forEach(pregunta => {
        pregunta.style.backgroundColor = colorPorCategoria[tema];
    })

    titulos_header.forEach(titulo_header => {
        titulo_header.textContent = tema;
    })

    nota.textContent = score;

    const volverAtras = document.querySelector(".puntuacion_button");

    volverAtras.addEventListener("click", () => {
        window.location.href = "/";
    })

    localStorage.removeItem("tema");
    localStorage.removeItem("Puntuacion");
    localStorage.removeItem("total");
}

})