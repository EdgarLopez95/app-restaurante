class Plato {
  constructor(image, title, recipe, price) {
    this.image = image;
    this.title = title;
    this.recipe = recipe;
    this.price = price;
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

  const platosEnLocalStorage = JSON.parse(localStorage.getItem(mesa));

  if (platosEnLocalStorage == null || platosEnLocalStorage == "") {
    mesaSeleccionada.innerHTML = "<h1>Agregue el pedido </h1>";
  } else {
    mostrarPlatosSeleccionados(platosEnLocalStorage);
  }
  mostrarListadePlatos();
}
function mostrarListadePlatos() {
  const contenedortitulo = document.getElementById("tituloPlato");
  contenedortitulo.innerHTML = `<h3 class="platosMesa">Platos de la mesa ${mesa}</h3>`;
  const contenedorOpciones = document.getElementById("opciones");
  contenedorOpciones.innerHTML = "";
  fetch(`../js/food.json`)
    .then((res) => res.json())
    .then((platos) => {
      platos.forEach((plato) => {
        let div = document.createElement("div");
        div.classList.add("section__plato");
        div.innerHTML = `
        
        <img src="${plato.image}" alt="Imagen del plato">
        <div class="contenedor_infoPlato">
        <h3>${plato.Title}</h3>
        <p>${plato.recipe}</p>
        <h4> ${plato.price}</h4>
        </div>
        `;
        const buttonAdd = document.createElement("button");
        div.append(buttonAdd);
        buttonAdd.innerText = "agregar plato";
        buttonAdd.addEventListener("click", () => {
          agregarPlatoEnMesa(plato);
        });

        contenedorOpciones.append(div);
      });
    });
}
function agregarPlatoEnMesa(plato) {
  const title = plato.Title;
  const image = plato.image;
  const recipe = plato.recipe;
  const price = plato.price;

  const platos = new Plato(image, title, recipe, price);

  const platosEnLocalStorage = JSON.parse(localStorage.getItem(mesa));

  if (platosEnLocalStorage == null) {
    localStorage.setItem(mesa, JSON.stringify([platos]));
    mostrarPlatosSeleccionados([platos]);
  } else {
    platosEnLocalStorage.push(platos);
    localStorage.setItem(mesa, JSON.stringify(platosEnLocalStorage));
    mostrarPlatosSeleccionados(platosEnLocalStorage);
  }
}

function mostrarPlatosSeleccionados(platos) {
  let platosSeleccionados = document.getElementById("platosSeleccionados");
  platosSeleccionados.innerHTML = "";

  platos.forEach((platos) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <hr> ${platos.image} - ${platos.title} - 
      ${platos.recipe} - ${platos.price}`;
    const botonBorrar = crearBotonEliminar(platos);
    li.appendChild(botonBorrar);
    platosSeleccionados.appendChild(li);
  });
}

function crearBotonEliminar(platos) {
  const botonBorrar = document.createElement("button"); // <button>Borrar</button>
  botonBorrar.innerText = "Borrar";
  botonBorrar.addEventListener("click", () => {
    eliminarPelicula(platos);
  });
  return botonBorrar;
}

function eliminarPelicula(platos) {
  const mesaSeleccionada = document.getElementById("platosSeleccionados");
  const mesasEnLocalStorage = JSON.parse(localStorage.getItem(mesa));

  let index = mesasEnLocalStorage.findIndex((i) => {
    i.title === platos.title;
  });
  mesasEnLocalStorage.splice(index, 1);
  //console.log(index);
  // if (index !== -1) {
  //   mesasEnLocalStorage.splice(index, 1);
  // }

  //   const condicionBorrar = (item) => item.title != platos.title;
  //   const nuevoArray = mesasEnLocalStorage.filter(condicionBorrar);
  console.log(mesasEnLocalStorage);
  localStorage.setItem(mesa, JSON.stringify(mesasEnLocalStorage));

  mostrarPlatosSeleccionados(mesasEnLocalStorage);
  //console.log(mesasEnLocalStorage);
  if (mesasEnLocalStorage == "") {
    mesaSeleccionada.innerHTML = "<h1>Agregue el pedido </h1>";
  }
}
