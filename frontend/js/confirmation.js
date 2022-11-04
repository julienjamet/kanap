/****************
****VARIABLES****
****************/

/*Les variables qui vont manipuler l'url*/
const href = window.location.href;
const url = new URL(href);
const id = url.searchParams.get("id");

/*La variable qui va recevoir le contenu HTML*/
const orderId = document.getElementById("orderId");


/****************
****FONCTIONS****
****************/


/*La fonction qui va afficher le numéro de commande*/
function showOrderId() {
    orderId.textContent = `${id}`;
    orderId.style.color = "green";
    orderId.style.fontWeight = "bold";
}
/*La fonction se déclenche au chargement de la page*/
window.addEventListener("DOMContentLoaded", function() {
    showOrderId();
})