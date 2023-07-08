/****************
****VARIABLES****
****************/

/*Les variables qui vont manipuler l'url*/
const href = window.location.href;
const url = new URL(href);
const id = url.searchParams.get("id");

/*Les variables qui vont recevoir le contenu HTML*/
const cartItems = document.getElementById("cart__items");
const numberOfProducts = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const article = document.getElementsByClassName("cart__item");

/*Les variables du formulaire (input + message d'erreur associé à chacun)*/
const firstName = document.getElementById("firstName");
const firstNameValidation = document.getElementById("firstNameErrorMsg");

const lastName = document.getElementById("lastName");
const lastNameValidation = document.getElementById("lastNameErrorMsg");

const address = document.getElementById("address");
const addressValidation = document.getElementById("addressErrorMsg");

const city = document.getElementById("city");
const cityValidation = document.getElementById("cityErrorMsg");

const email = document.getElementById("email");
const emailValidation = document.getElementById("emailErrorMsg");

/*Le bouton qui permet de requêter l'API et de récupérer le numéro de commande*/
const order = document.getElementById("order");


/****************
****FONCTIONS****
****************/


/*Les fonctions qui vont manipuler le localStorage (set, get)*/
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

/*La fonction qui va afficher le contenu du panier*/
async function showCart() {
    let cart = getCart();
    let sumProducts = 0;
    let sumPrice = 0;

    /*On appelle l'API pour récupérer les données de chaque article contenu dans le panier, via son id*/
    for (let i in cart) {
        await fetch(`http://localhost:3000/api/products/${cart[i].id}`)
            /*Test de validation : si OK, récupération des données de l'API*/
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            /*On injecte du code HTML dynamique dans nos variables*/
            .then(async function (value) {
                cartItems.innerHTML +=
                    `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].colors}">
                <div class="cart__item__img">
                    <img src="${value.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${value.name}</h2>
                        <p>${cart[i].colors}</p>
                        <p>${value.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}"/>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;

                /*On calcule et on affiche le nombre total d'articles dans le panier, ainsi que le montant total*/
                sumProducts += JSON.parse(cart[i].quantity);
                numberOfProducts.textContent = (sumProducts);
                sumPrice += JSON.parse(cart[i].quantity * value.price);
                totalPrice.textContent = (sumPrice);
            })
    }
}

/*La fonction qui va modifier la quantité de chaque article*/
const changeQuantity = document.getElementsByClassName("itemQuantity");

function modifyQuantity() {
    for (let i = 0; i < changeQuantity.length; i++) {
        changeQuantity[i].addEventListener("change", function (e) {
            const itemId = article[i].dataset.id;
            const itemColor = article[i].dataset.color;
            const itemQuantity = e.target.value;

            function addProduct() {
                /*On initie un objet article contenant les informations qui nous intéressent*/
                let product = {
                    id: itemId,
                    colors: itemColor,
                    quantity: itemQuantity
                };
                /*On récupère le panier*/
                let cart = getCart();
                /*On fait une recherche dans le panier pour savoir si l'article y est déjà présent*/
                let findProduct = cart.find(p => p.id == product.id);
                findProduct.quantity = itemQuantity;
                /*On sauvegarde le panier*/
                saveCart(cart);
            }
            addProduct();
            /*On actualise la page*/
            window.location.reload();
        })
    }
}

/*La fonction qui va supprimer un article*/
const removeItem = document.getElementsByClassName("deleteItem");

function deleteItem() {
    for (let i = 0; i < removeItem.length; i++) {
        removeItem[i].addEventListener("click", function () {
            function deleteProduct() {
                /*On récupère le panier*/
                let cart = getCart();
                /*On supprime l'article*/
                cart.splice(i, 1);
                /*On sauvegarde le panier*/
                saveCart(cart);
            }
            deleteProduct();
            /*On actualise la page*/
            window.location.reload();
        })
    }
}

/*Les fonctions se déclenchent au chargement de la page, avec un décalage de 500ms pour "modifier" et
"supprimer". On s'assure ainsi que tous les articles auront eu le temps de se charger avant d'interagir
avec eux*/
window.addEventListener("DOMContentLoaded", function () {
    showCart();
    setTimeout(function () {
        modifyQuantity()
    }, 1000);
    setTimeout(function () {
        deleteItem()
    }, 1000);
})


/*FORMULAIRE*/


/*On initialise les éléments qui vont constituer notre objet user*/
let firstNameInput = "";
let lastNameInput = "";
let addressInput = "";
let cityInput = "";
let emailInput = "";

/*On contrôle les données saisies par l'utilisateur avec des Regex*/
firstName.addEventListener("input", function (e) {
    firstNameInput = e.target.value;
    if (/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15})([-\s]{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15}){0,2}$/.test(e.target.value)) {
        firstNameValidation.textContent = "ok";
        firstNameValidation.style.opacity = 0;
    }
    /*On affiche un message d'erreur sous l'input concerné en cas d'erreur*/
    else {
        firstNameValidation.textContent = "Veuillez renseigner un prénom valide (exemple : Jean-Pierre)";
        firstNameValidation.style.color = "red";
        firstNameValidation.style.fontWeight = "bold";
        firstNameValidation.style.opacity = 1;
    }
})
lastName.addEventListener("input", function (e) {
    lastNameInput = e.target.value;
    if (/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15})([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){0,3}$/.test(e.target.value)) {
        lastNameValidation.textContent = "ok";
        lastNameValidation.style.opacity = 0;
    }
    else {
        lastNameValidation.textContent = "Veuillez renseigner un nom valide (exemple : Dupont)";
        lastNameValidation.style.color = "red";
        lastNameValidation.style.fontWeight = "bold";
        lastNameValidation.style.opacity = 1;
    }
})
address.addEventListener("input", function (e) {
    addressInput = e.target.value;
    if (/^([0-9]{0,4})([-\s]{0,1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,15}){0,1}([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){1,8}$/.test(e.target.value)) {
        addressValidation.textContent = "ok";
        addressValidation.style.opacity = 0;
    }
    else {
        addressValidation.textContent = "Veuillez renseigner une adresse valide (exemple : 12 rue des Chats)";
        addressValidation.style.color = "red";
        addressValidation.style.fontWeight = "bold";
        addressValidation.style.opacity = 1;
    }
})
city.addEventListener("input", function (e) {
    cityInput = e.target.value;
    if (/^([^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15})([-\s']{1}[^0-9\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{1,15}){0,6}$/.test(e.target.value)) {
        cityValidation.textContent = "ok";
        cityValidation.style.opacity = 0;
    }
    else {
        cityValidation.textContent = "Veuillez renseigner une ville valide (exemple : Saint-Martin-de-Londres)";
        cityValidation.style.color = "red";
        cityValidation.style.fontWeight = "bold";
        cityValidation.style.opacity = 1;
    }
})
email.addEventListener("input", function (e) {
    emailInput = e.target.value;
    if (/^([a-z0-9\.-]{1,20})@([a-z]{1,8})\.([a-z]{2,3})$/.test(e.target.value)) {
        emailValidation.textContent = "ok";
        emailValidation.style.opacity = 0;
    }
    else {
        emailValidation.textContent = "Veuillez renseigner une adresse mail valide (exemple : jp_dupont@gmail.com)";
        emailValidation.style.color = "red";
        emailValidation.style.fontWeight = "bold";
        emailValidation.style.opacity = 1;
    }
})

order.addEventListener("click", function (e) {
    /*On contrôle globalement le formulaire. Si le panier est vide, on bloque le formulaire et on affiche une alerte*/
    let cart = getCart();
    if (cart.length == 0) {
        e.preventDefault();
        alert("Le panier est vide !");
    }
    /*Même chose si des inputs sont vides ou contiennent des erreurs*/
    else if (firstNameValidation.textContent != "ok" || lastNameValidation.textContent != "ok" || cityValidation.textContent != "ok" || emailValidation.textContent != "ok") {
        e.preventDefault();
        alert("Erreur(s) dans le formulaire !");
    }
    /*Sinon, on constitue notre objet user avec les données saisies...*/
    else {
        e.preventDefault();
        let user = {
            firstName: firstNameInput,
            lastName: lastNameInput,
            address: addressInput,
            city: cityInput,
            email: emailInput
        };
        /*...et on fabrique un array qui contient les id de tous les articles contenus dans le panier*/
        let cart = getCart();
        let idList = [];
        for (let i in cart) {
            idList.push(cart[i].id);
        }
        /*On effectue ensuite une requête POST sur l'API*/
        function send() {
            fetch(`http://localhost:3000/api/products/order`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                /*On envoie à l'API notre objet user et notre array articles*/
                body: JSON.stringify({ contact: user, products: idList })
            })
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function (value) {
                    /*On récupère un numéro de commande qu'on injecte dans l'url vers laquelle on redirige l'utilisateur*/
                    setTimeout(function () {
                        document.location.href = `./confirmation.html?id=${value.orderId}#confirm`
                    }, 1000);
                });
        }
        send();
    }
})