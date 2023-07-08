/****************
****VARIABLES****
****************/

/*Les variables qui vont manipuler l'url*/
const href = window.location.href;
const url = new URL(href);
const id = url.searchParams.get("id");

/*Les variables qui vont recevoir le contenu HTML*/
const img = document.querySelector("div.item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");

/*Les variables et l'événement qui vont manipuler la couleur de l'article*/
let colorValue;
const select = document.getElementById("colors");
select.addEventListener("change", function(e) {
    colorValue = e.target.value;
})

/*Les variables et l'événement qui vont manipuler la quantité d'articles*/
let quantityValue;
const quantity = document.getElementById("quantity");
quantity.addEventListener("change", function(e) {
    quantityValue = parseInt(e.target.value);
})

/*Le bouton qui va ajouter les données dans localStorage*/
const buttonAddToCart = document.getElementById("addToCart");


/****************
****FONCTIONS****
****************/


/*Les fonctions qui vont manipuler le localStorage (set, get, addObjectTo)*/
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart === null) {
        return [];
    }
    else {
        return JSON.parse(cart);
    }
}
function addProduct() {
/*On initie un objet article contenant les informations qui nous intéressent*/
    let product = {
        id: id,
        colors: colorValue,
        quantity: quantityValue
    };
/*On récupère le panier*/
    let cart = getCart();
/*On fait une recherche dans le panier pour savoir si l'article y est déjà présent*/
    let findProduct = cart.find(p => p.id == product.id);
    let findColor = cart.find(p => p.colors == product.colors);
/*Si l'article n'est pas déjà présent dans le panier, on ajoute cet article*/
    if (findProduct == undefined) {
        product.quantity = quantityValue;
        cart.push(product); 
    }
/*Si l'article est déjà présent mais d'une couleur différente, on ajoute cet article*/ 
    else {
        if (findColor == undefined) {
            product.quantity = quantityValue;
            cart.push(product);
        }
/*Si l'article exact est déjà présent (même type, même couleur), on augmente la quantité de cet article dans le panier*/
        else {
            findProduct.quantity += quantityValue;
        }
    }
/*On sauvegarde le panier*/
    saveCart(cart);
}

/*La fonction qui va récupérer les données de l'API puis les injecter dans le HTML*/
function getApi_products() {
/*On importe les données de l'article qui correspond à l'id présent dans l'url*/
    fetch(`http://localhost:3000/api/products/${id}`)
/*Test de validation : si OK, récupération des données de l'API*/
    .then(function(res) {
        if (res.ok) {
          return res.json();
        }
    })
/*On injecte du code HTML dynamique dans nos variables*/
    .then(function(value) {
        img.innerHTML = `<img src="${value.imageUrl}"/>`;
        title.textContent = value.name;
        price.textContent = value.price;
        description.textContent = value.description;
        quantity.value = 0;
        for (let each of value.colors) {
            select.innerHTML += `<option value=${each}>${each}</option>`;
        }
    })
    .catch(function(err) {
    })
}
/*La fonction se déclenche au chargement de la page*/
window.addEventListener("DOMContentLoaded", function() {
    getApi_products();
})


/*La fonction d'ajout de produit se déclenche quand on clique sur le bouton*/
buttonAddToCart.addEventListener("click", function(e) {
/*Il est nécessaire de choisir une couleur...*/
    if (colorValue == undefined) {
        e.preventDefault();
        alert("Veuillez choisir la couleur de votre article");
    }
/*...et une quantité...*/
    else if (quantityValue == undefined) {
        e.preventDefault();
        alert("Veuillez choisir un nombre d'articles");
    }
/*...pour envoyer le formulaire*/
    else {
        addProduct();
        alert("Article(s) ajouté(s) au panier !");
    } 
})