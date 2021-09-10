const items = [
    {id: 1, nom: "paquet de chips", prix: 4, image: "chips.jpeg"},
    {id: 2, nom: "jambonneau", prix: 30, image: "jambonneau-fume.jpg"},
    {id: 3, nom: "pack de bières", prix: 15, image: "bieres.jpg"},
    {id: 4, nom: "paquet de bonbons", prix: 7, image: "bonbons.jpg"},
    {id: 5, nom: "cacahuètes", prix: 2, image: "cacahuetes.jpeg"},
    {id: 6, nom: "chaton mignon", prix: Number.POSITIVE_INFINITY, image: "kitty.png"}
];

const contents = document.querySelector("#contents");

const cart = [];

const nbItems = document.querySelector("#nbItems");

/**
 * fonction de création de cards
 * @param product produit à formatter
 * @returns {string} card formatée
 */
function makeCard(product) {
    let newCard = `<div class="card" style="width: 18rem;">
                        <img src="images/${product.image}" class="card-img-top" alt="${product.nom}">
                        <div class="card-body">
                            <h5 class="card-title">${product.nom}</h5>
                            <p class="card-text">${product.prix} €</p>
                            <div class="ajout">
                                <button class="minus btn btn-secondary"><strong>-</strong></button>
                                <input type="text" class="compteur" value="0">
                                <button class="plus btn btn-secondary"><strong>+</strong></button>
                                <button class="btn btn-primary ajouter disabled" id="${product.id}">Ajouter au panier</button>
                            </div>
                           
                        </div>
                    </div>`;
    return newCard;
}

/**
 * créer des cards depuis un tableau
 * @param pArrayCards tableau de produits à formatter
 * @returns {string} cards formatées
 */
function getProducts(pArrayCards) {
    let cards ="";
    pArrayCards.forEach((element) => {
        cards += makeCard(element);
    });
    return cards;
}

/**
 * ajoute un au compteur du produit
 * @param input compteur à modifier
 * @param addToCart bouton ajouter
 */
function plus(input,addToCart) {
    input.value++
    if(parseInt(input.value) === 1){

        addToCart.classList.remove("disabled");
    }
    console.log(input.value);
}

/**
 * retire un au compteur du produit
 * @param input compteur à modifier
 * @param addToCart bouton ajouter au panier
 */
function minus(input,addToCart) {

    if(input.value > 0){
        input.value --;
        if (parseInt(input.value) === 0) {

            addToCart.classList.add("disabled");
        }
    }
    console.log(input.value);
}


/**
 * affichage des produits
 */
function showProducts() {
    contents.innerHTML = getProducts(items);

   const divsAjout = document.querySelectorAll(".ajout");
    divsAjout.forEach(div=>{
        const boutonMoins = div.querySelector(".minus");
        const boutonPlus = div.querySelector(".plus");
        const boutonAjout = div.querySelector(".ajouter");
        const compteur = div.querySelector(".compteur");

        boutonPlus.addEventListener("click",()=>{
            plus(compteur,boutonAjout)
        })

        boutonMoins.addEventListener("click",()=>{
            minus(compteur,boutonAjout)
        })

        boutonAjout.addEventListener("click",()=>{
            addToCart(boutonAjout.id,compteur.value);
        })
    })

}

showProducts();

const btnPanier = document.querySelector("#btnPanier");
btnPanier.addEventListener("click",showCart);
const btnShop = document.querySelector("#btnShop");
btnShop.addEventListener("click", showProducts);

/**
 * affiche le nombre d'éléments dans le panier
 */
function showNbCartItems() {
    let cptItems = 0
    cart.forEach(item=>{
        cptItems += item.quantity;
    })
    if (cptItems > 0) {
        nbItems.innerHTML = `(${cptItems})`;
    } else {
        nbItems.innerHTML = ''
    }
}

/**
 * ajouter un item au panier
 * @param idItem id à ajouter
 * @param quantity quantité à ajouter
 */
function addToCart(idItem,quantity){
    console.log(quantity)
    quantity = parseInt(quantity)
    console.log(quantity)
    let item = cart.find(element => element.id === idItem);
    if(item){
        item.quantity +=quantity;
    }else{
        cart.push({id: Number.parseInt(idItem), quantity: quantity});
    }

    showNbCartItems();
    console.log(cart);
}

/**
 * préparation du panier
 * @returns {{price: number, table: string}} panier rempli
 */
function prepareCart() {
    let table = "";
    let price = 0;
    cart.forEach(item => {
        let product = items.find(element => element.id === item.id);
        let subTotal = item.quantity * product.prix;
        table += `<tr>
                        <td>${product.nom}</td>
                        <td>${product.prix} €</td>
                        <td class="quantity" data-article="${item.id}">
                            <button class="btn btn-secondary minusCart"><strong>-</strong></button>
                            ${item.quantity}
                             <button class="btn btn-secondary plusCart"><strong>+</strong></button>
                         </td>
                        <td>${subTotal} €</td>
                        <td class="actions">
                           
                            <button class="btn btn-danger delete" id="${item.id}"><strong>X</strong></button>
                        </td>
                  </tr>
                    `;
        price += subTotal;
    })
    return {table, price};
}

/**
 * supprime un élément du panier
 * @param id
 */
function removeProductFromCart(id) {
    console.log(id);
    let item = cart.find((element) => element.id === id);
    let idx  = cart.findIndex((element) => element.id === id);
    cart.splice(idx, 1);
    showCart();

    showNbCartItems()
}

/**
 * ajoute un item au panier
 * @param id id de l'article
 */
function addItemToCart(id) {
    let item = cart.find(element => element.id === id);
    item.quantity++;
    showCart();
    showNbCartItems()
}

/**
 * supprime un item du panier
 * @param id id de l'article
 */
function removeItemFromCart(id) {
    let item = cart.find(element => element.id === id);
    if (item.quantity === 1) {
        removeProductFromCart(id)
    }else{
        item.quantity--;
        showCart();
        showNbCartItems()

    }

}

/**
 * affiche le panier
 */
function showCart()
{
    console.log(cart)
    const items = prepareCart();
    let table = `<table class="table table-striped">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Sous-total</th>
                    <th>actions</th>
                </tr>
            </thead>
            <tbody>
             ${items.table}
             </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>Total :</strong></td>
                    <td>${items.price} €</td>
                    <td><button class="btn btn-success">Payer</button></td>
                </tr>
            </tfoot>
        </table>`;

    contents.innerHTML = table;
    

    const tdsQuantity = document.querySelectorAll(".quantity")
    tdsQuantity.forEach(td=>{
       let id = td.getAttribute("data-article")
        let plusBtn=td.querySelector(".plusCart")
        plusBtn.addEventListener("click",()=>{
            addItemToCart(parseInt(id));
        })
        let minusBtn=td.querySelector(".minusCart")
        minusBtn.addEventListener("click",()=>{
            removeItemFromCart(parseInt(id));

        })
    })

    const deleteButtons = document.querySelectorAll(".delete")

    deleteButtons.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", () => {
            removeProductFromCart(parseInt(deleteBtn.id))
        })
    })
}






