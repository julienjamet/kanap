/****************
****VARIABLES****
****************/


/*La variable qui va recevoir le contenu HTML*/
const items = document.querySelector("section.items");


/****************
****FONCTIONS****
****************/


/*La fonction qui va récupérer les données de l'API
puis les injecter dans le HTML*/
function getApi_index() {
  fetch("https://julienjamet-kanap-k9uu.onrender.com/api/products")
    /*Test de validation : si OK, récupération des données de l'API*/
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      /*Pour chaque itération du tableau de valeurs qu'on vient de récupérer...*/
      for (let each of value) {
        /*On injecte du code HTML dynamique dans notre variable*/
        items.innerHTML += (`<a href="./frontend/html/product.html?id=${each._id}#item"><article><img src="${each.imageUrl}"/><h3 class='productName'>${each.name}</h3><p class='productDescription'>${each.description}</p></article></a>`);
      }
    })
    .catch(function (err) {
    });
}
/*La fonction se déclenche au chargement de la page*/
window.addEventListener("DOMContentLoaded", function () {
  getApi_index();
})