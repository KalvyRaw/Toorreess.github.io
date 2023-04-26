let listProducts = [];

// Función para cargar los libros desde un archivo JSON
async function fetchBooks() {
  try {
    const response = await fetch('libros.json');
    const data = await response.json();
    listProducts = data.books;
    renderBooks();
  } catch (error) {
    console.log(error);
  }
}

// Función para buscar los libros según el título o autor
function searchBooks() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const filteredBooks = listProducts.filter((book) => {
    return book.titulo.toLowerCase().includes(searchQuery) || book.autor.toLowerCase().includes(searchQuery);
  });
  renderBooks(filteredBooks);
}

// Función para renderizar los libros
function renderBooks(books = listProducts) {
  let librosHTML = "";

  books.forEach(libro => {
    librosHTML += `
      <div class="col d-flex" id="${libro.id}">
        <div class="card flex-fill">
          <a href="pagLibro.html?id=${libro.id}">
            <img src="${libro.portada}" class="card-img-top" alt="...">
          </a>
          <div class="card-body">
            <h5 class="card-title">${libro.titulo}</h5>
            <p class="card-subtitle text-muted mb-2">${libro.autor}</p>
            <h4 class="card-text mb-0">${libro.precio}€</h4>
          </div>
          <div class="card-footer">
            <a onclick="addLibro(document.getElementById('${libro.id}'))" class="btn btn-dark">Añadir al carrito</a>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("countResults").innerHTML = librosHTML;
}

// Cargar los libros al cargar la página
fetchBooks();

// Agregar un evento al botón de búsqueda para activar la función searchBooks
document.getElementById("searchButton").addEventListener("click", searchBooks);

function limpiarBusqueda() {
  document.getElementById("searchInput").value = "";
  fetchBooks();
}

function redirectToCategory(category) {
  window.location.href = `categorias.html?category=${category}`;
}

