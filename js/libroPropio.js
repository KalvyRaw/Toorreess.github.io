const URLSearchParams = new window.URLSearchParams(window.location.search);
const id = URLSearchParams.get("id");

var username = sessionStorage.getItem("username")
var carro = document.getElementById("carrito")
var elementos = document.getElementById("contador-elem")
var nelem = parseInt(elementos.innerHTML)
var nelemcar = document.getElementById("nelem")

const carritoMapJSON = sessionStorage.getItem("carritoMap")
var carritoMap = new Map(JSON.parse(carritoMapJSON))
console.log(carritoMap)

let listProducts = [];

function redirectToCategory(category) {
  window.location.href = `categorias.html?category=${category}`;
}

window.redirectToCategory = redirectToCategory;

function cambiaImagen(element) {

  var main_product_image = document.getElementById('mainProductImage');
  main_product_image.src = element.src;
}

window.cambiaImagen = cambiaImagen;

//Por cuestiones de errores con la carga de libros del json he metido las operaciones del carrito aqui

//Carga los libros desde un array de ids
async function cargarLibrosInicial(){
  console.log("llega cargar")
  var igual = false
  const response = await fetch('libros.json');
    const data = await response.json();
  listProducts = data.books
  for (let [id, cant] of carritoMap) {
    var libro = listProducts.find(function (book) {
      return book.id == id
    })
    addLibro(libro, cant, igual)
  }
}

//Le llega un div de libro, le saca la id y lo manda a añadir
async function cargaLibro(libroIdDiv){
  var libroId = libroIdDiv.id
  const response = await fetch('libros.json');
  const data = await response.json();
  listProducts = data.books
  var libro = listProducts.find(function (book) {
    return book.id == libroId
  })
  var cantidad = 0

  if (carritoMap.size == 0) {
    cantidad = 1
    carritoMap.set(libro.id, cantidad)
    console.log("PRIMERO")
  } else {
    var igual = false
    for (let [id, cant] of carritoMap.entries()) {
      if (libro.id === id) {
        cantidad = cant + 1
        carritoMap.set(libro.id, cantidad)
        igual = true
        console.log("IGUALES")
      }
    }
    if (igual == false) {
      cantidad = 1
      console.log("DISTINTOS")
      carritoMap.set(libro.id, cantidad)
    }

  }
  console.log(carritoMap)

  //Guarda el libro en un JSON para almacenar el carrito entre pestañas
  const carritoMapJSON = JSON.stringify(Array.from(carritoMap.entries()))
  sessionStorage.setItem("carritoMap", carritoMapJSON)
  console.log(carritoMapJSON)

  addLibro(libro, cantidad, igual)

  turnGreen(libroIdDiv)
  setTimeout(() => {
    returnNormal(libroIdDiv);
    carritoNoPermitePagoVacio();
  }, 1000);
}

//Añade el libro al carrito (le llega un objeto Libro del JSON)
function addLibro(libroElegido, cant, igual) {
  const miLibro = libroElegido

  if (igual) {
    nelem++
    elementos.innerHTML = nelem
    nelemcar.innerHTML = "Hay " + nelem + " elementos en el carrito"

    var libros = carro.getElementsByTagName("div")
    for (var i = 0; i < libros.length; i++) {
      if (libros[i].id == miLibro.id) {
        var libroAct = libros[i]
        break
      }
    }
    console.log(libroAct)
    var newCant = libroAct.querySelector('h6')
    newCant.innerHTML = "Cant.: " + cant
    sumarPrecio(miLibro.precio + "€")
  } else {

    for (var i = 0; i < cant; i++) {
      nelem++
    }
    elementos.innerHTML = nelem
    nelemcar.innerHTML = "Hay " + nelem + " elementos en el carrito"

    var newLibro = document.createElement("div")
    newLibro.className = "container"
    newLibro.id = miLibro.id

    var newRow = document.createElement("div")
    newRow.className = "row"

    var newCol = document.createElement("div")
    newCol.className = "col-sm"

    var newImg = document.createElement("img")
    newImg.src = miLibro.portada
    newImg.width = "110"
    newCol.appendChild(newImg)

    var newInfo = document.createElement("div")
    newInfo.className = "container col-sm"

    var newInfoRow1 = document.createElement("div")
    newInfoRow1.className = "row"

    var newTitulo = document.createElement("h3")
    newTitulo.className = "fs-5"
    newTitulo.innerHTML = miLibro.titulo
    newInfoRow1.append(newTitulo)
    newInfo.append(newInfoRow1)

    var newInfoRow2 = document.createElement("div")
    newInfoRow2.className = "row"

    var newAutor = document.createElement("h5")
    newAutor.className = "fs-6"
    newAutor.innerHTML = miLibro.autor
    newInfoRow2.append(newAutor)
    newInfo.append(newInfoRow2)

    newRow.append(newCol)
    newRow.append(newInfo)
    newLibro.append(newRow)

    var newRow2 = document.createElement("div")
    newRow2.className = "row mt-2"

    var newCol2 = document.createElement("div")
    newCol2.className = "col-sm"

    var eliminar = document.createElement("button")
    eliminar.type = "button"
    eliminar.className = "btn btn-danger"
    eliminar.innerHTML = "Eliminar"
    newCol2.append(eliminar)
    eliminar.addEventListener("click", removeLibro, false)
    eliminar.addEventListener("click", carritoNoPermitePagoVacio, false)

    var newCol3 = document.createElement("div")
    newCol3.className = "col-sm"

    var newPrecio = document.createElement("h5")
    newPrecio.innerHTML = miLibro.precio + "€"
    for (var i = 0; i < cant; i++) {
      sumarPrecio(newPrecio.innerHTML)
    }
    newCol3.append(newPrecio)

    var newCol4 = document.createElement("div")
    newCol4.className = "col-sm"
    var cantidad = document.createElement("h6")
    cantidad.innerHTML = "Cant.: " + cant
    newCol4.append(cantidad)

    newRow2.append(newCol2)
    newRow2.append(newCol4)
    newRow2.append(newCol3)

    newLibro.append(newRow2)
    newLibro.append(document.createElement("hr"))

    carro.querySelectorAll('div')[1].appendChild(newLibro)
  }

  function removeLibro() {
    restarPrecio(newPrecio.innerHTML)
    if (newLibro.querySelector('h6').innerHTML === "Cant.: 1") {
      newLibro.parentNode.removeChild(newLibro)
    }
    nelem--
    elementos.innerHTML = nelem
    nelemcar.innerHTML = "Hay " + nelem + " elementos en el carrito"
    cant = newLibro.querySelector('h6').innerHTML.slice(7, newLibro.querySelector('h6').innerHTML.length)
    cant--
    cantidad.innerHTML = "Cant.: " + cant

    //Elimina el elemento seleccionado del array
    for (let [id, cant] of carritoMap) {
      console.log(id)
      if (id == miLibro.id) {
        console.log("ELIMINADO")
        if (cant == 1) {
          carritoMap.delete(id)
        } else {
          cant--
          carritoMap.set(id, cant)
        }
      }
    }
    const carritoArrayJSON = JSON.stringify(Array.from(carritoMap.entries()))
    sessionStorage.setItem("carritoMap", carritoArrayJSON)
    console.log(carritoArrayJSON)
    carritoNoPermitePagoVacio();
  }

}

function turnGreen(libro){
  var miLibro = libro
  var boton = miLibro.querySelector('div[id="datos"]').querySelector('div').querySelector('div[id="boton"]').querySelectorAll('button')[0]
  boton.className="btn btn-success"
  boton.innerHTML = "¡Añadido al carrito!"
}

function returnNormal(libro){
  var miLibro = libro
  var boton = miLibro.querySelector('div[id="datos"]').querySelector('div').querySelector('div[id="boton"]').querySelectorAll('button')[0]
  boton.className="btn btn-dark"
  boton.innerHTML = "Añadir al carrito"
}

function sumarPrecio(precio){
  var pActualStr = document.getElementById("total").innerHTML
  pActualStr = pActualStr.slice(0, pActualStr.length - 1)
  var pActual = parseFloat(pActualStr.replace("," , "."))

  var pSumar = precio.slice(0, precio.length -1)

  var pFinal = parseFloat(pSumar.replace(",", "."))+pActual

  var pFinalStr = pFinal.toFixed(2).toString()
  pFinalStr = pFinalStr.replace(".", ",")+"€"

  document.getElementById("total").innerHTML = pFinalStr
}

function restarPrecio(precio){
  var pActualStr = document.getElementById("total").innerHTML
  pActualStr = pActualStr.slice(0, pActualStr.length - 1)
  var pActual = parseFloat(pActualStr.replace("," , "."))

  var pRestar = precio.slice(0, precio.length -1)
  pRestar =parseFloat(pRestar.replace(",", "."))
  console.log(pActual)
  console.log(pRestar)
  var pFinal = pActual - pRestar

  var pFinalStr = pFinal.toFixed(2).toString()
  pFinalStr = pFinalStr.replace(".", ",")+"€"

  document.getElementById("total").innerHTML = pFinalStr
}

function carritoNoPermitePagoVacio(){
  if(carritoMap.size===0){
    document.getElementById("btnpago").style.display = 'none';
  }else{
    document.getElementById("btnpago").style.display = 'block';
  }
}
