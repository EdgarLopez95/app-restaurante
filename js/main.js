class Pelicula {
  constructor(titulo, duracion, director, linkTrailer) {
    this.titulo = titulo;
    this.duracion = duracion;
    this.director = director;
    this.linkTrailer = linkTrailer;
  }
}

let mesa;

document
  .getElementById("formulario-usuario")
  .addEventListener("submit", manejadorSubmitMesa);

// CUANDO LE DOY CLICK A BUSCAR
// saco el numero de la mesa
// le pregunto al storage si hay algo en ese numero
// hago una condicion que si no hay nada ponga que agregue el pedido, de lo contrario que muestre lo que había antes
// y muestre la carta
function manejadorSubmitMesa(e) {
  e.preventDefault();
  mesa = document.getElementById("mesa").value;

  const mesaSeleccionada = document.getElementById("platosSeleccionados");

  const peliculas = JSON.parse(localStorage.getItem(mesa));

  if (peliculas == null || peliculas == "") {
    mesaSeleccionada.innerHTML = "<h1>Agregue el pedido </h1>";
  } else {
    mostrarPeliculas(peliculas);
  }
  mostrarCardsCarta();
}
function mostrarCardsCarta() {
  const contenedorOpciones = document.getElementById("opciones");
  opciones.innerHTML = `<h3>Platos de la mesa ${mesa}</h3>`;
  fetch(`../js/food.json`)
    .then((res) => res.json())
    .then((platos) => {
      platos.forEach((plato) => {
        let div = document.createElement("div");
        div.innerHTML = `
        <hr> 
        ${plato.image} - 
        ${plato.Title} -
        ${plato.recipe} -
        ${plato.price}
        `;
        const button = document.createElement("button");
        div.append(button);
        button.innerText = "agregar plato";
        button.addEventListener("click", () => {
          agregarPelicula(plato);
        });

        contenedorOpciones.appendChild(div);
      });
    });
}
function agregarPelicula(plato) {
  const titulo = plato.Title;
  const duracion = plato.image;
  const director = plato.recipe;
  const linkTrailer = plato.price;
  const pelicula = new Pelicula(titulo, duracion, director, linkTrailer);

  const peliculasEnLocalStorage = JSON.parse(localStorage.getItem(mesa));

  if (peliculasEnLocalStorage == null) {
    localStorage.setItem(mesa, JSON.stringify([pelicula]));
    mostrarPeliculas([pelicula]);
  } else {
    peliculasEnLocalStorage.push(pelicula);
    localStorage.setItem(mesa, JSON.stringify(peliculasEnLocalStorage));
    mostrarPeliculas(peliculasEnLocalStorage);
  }
}

function mostrarPeliculas(peliculas) {
  let platosSeleccionados = document.getElementById("platosSeleccionados");
  platosSeleccionados.innerHTML = "";

  peliculas.forEach((pelicula) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <hr> ${pelicula.titulo.toUpperCase()} - ${pelicula.duracion} minutos - 
      ${pelicula.director} - 
      <a href="${pelicula.linkTrailer}" target="blank"> Ver trailer </a>`;
    const botonBorrar = crearBotonEliminar(pelicula);
    li.appendChild(botonBorrar);
    platosSeleccionados.appendChild(li);
  });
}

function crearBotonEliminar(pelicula) {
  const botonBorrar = document.createElement("button"); // <button>Borrar</button>
  botonBorrar.innerText = "Borrar";
  botonBorrar.addEventListener("click", () => {
    eliminarPelicula(pelicula);
  });
  return botonBorrar;
}

function eliminarPelicula(pelicula) {
  const mesaSeleccionada = document.getElementById("platosSeleccionados");
  const peliculasEnLocalStorage = JSON.parse(localStorage.getItem(mesa));
  const nuevoArray = peliculasEnLocalStorage.filter(
    (item) => item.titulo != pelicula.titulo
  );
  localStorage.setItem(mesa, JSON.stringify(nuevoArray));

  mostrarPeliculas(nuevoArray);

  if (nuevoArray == "") {
    mesaSeleccionada.innerHTML = "<h1>Agregue el pedido </h1>";
  }
}
