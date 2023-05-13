var boton = document.getElementById("inicio")
var usuario = document.getElementById("usuario")

var username = sessionStorage.getItem("username")
console.log(username)
var loged=false

if(username!==null){
    loged=true
}

if(loged){
    var icon= '<i class="fas fa-user"></i>'
    boton.innerHTML=" Mi perfil"
    boton.href="../perfil.html"
    boton.insertAdjacentHTML("afterbegin", icon)
}

function redirectToCategory(category) {
    window.location.href = `categorias.html?category=${category}`;
  }
function redirectSearch() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  console.log(searchQuery)

  var param = encodeURIComponent(searchQuery);

  window.location.href = 'index.html?busqueda=' + param;
}

window.redirectSearch = redirectSearch;

