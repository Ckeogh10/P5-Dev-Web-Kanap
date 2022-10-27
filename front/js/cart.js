function saveCart(item) {
    const cartString = JSON.stringify(item)
    localStorage.setItem("cart", cartString);
    return true;
}

function getCart() {
    const cartStorage = JSON.parse(localStorage.getItem("cart"))
    if (cartStorage === null) {
        const cart = []
        return cart
    } else {
        return cartStorage
    }
}

const cart = getCart();

function getProduct() {
    let url = "http://localhost:3000/api/products/";
    Promise.all(cart.map(c => fetch(url + c.ID).then(d => d.json())))
    .then(function(data) {
        console.log(data);
        data.forEach(createItem)
    }) 
    
}

function createImg(item, url) {
    let imgParent = document.createElement('div');
    imgParent.classList.add("cart__item__img");
    let img = document.createElement('img');
    img.src = url;
    img.alt = "Photographie d'un canapé";
    item.appendChild(imgParent);
    imgParent.appendChild(img);
}

function createContent(item) {
    let contentParent = document.createElement('div');
    let contentDescription = document.createElement('div');
    let contentSettings = document.createElement('div');
    contentParent.classList.add("cart__item__content");
    contentDescription.classList.add("cart__item__content__description");
    contentSettings.classList.add("cart__item__content__settings");
    item.appendChild(contentParent);
    contentParent.appendChild(contentDescription);
    contentParent.appendChild(contentSettings);
}

// Functions for content description

function createContentDescription(i, data) {
    let contentDescParent = document.getElementsByClassName('cart__item__content__description')[i];
    createContentTitle(data.name, contentDescParent);
    createContentColor(cart[i].color, contentDescParent);
    createContentPrice(data.price, contentDescParent);
}

function createContentTitle(title, parent) {
    let contentTitle = document.createElement('h2');
    contentTitle.innerText = title;
    parent.appendChild(contentTitle);
}

function createContentColor(color, parent) {
    let contentColor = document.createElement('p');
    contentColor.innerText = color;
    parent.appendChild(contentColor);
}

function createContentPrice(price, parent) {
    let contentPrice = document.createElement('p');
    contentPrice.innerText = price + '€';
    parent.appendChild(contentPrice);
}

// Functions for content settings

function createContentSettings(i, data) {
    let contentSettingsParent = document.getElementsByClassName('cart__item__content__settings')[i];
    createContentQuantity(i, data, contentSettingsParent);
    createContentDelete(contentSettingsParent);
}

// Functions for quantity

function createContentQuantity(i, data, contentParent) {
    let quantityParent = document.createElement('div');
    quantityParent.classList.add("cart__item__content__settings__quantity");
    contentParent.appendChild(quantityParent);
    createQuantityText(quantityParent);
    createQuantityInput(i, data, quantityParent);
}

function createQuantityText(parent) {
    let text = document.createElement('p');
    text.innerText = 'Qté : '
    parent.appendChild(text);
}

// 

function createQuantityInput(i, data, parent) {
    let input = document.createElement('input');
    input.type = "number";
    input.classList.add("itemQuantity");
    input.min = "1";
    input.max = "100";
    input.name = "itemQuantity";
    input.value = cart[i].quantity;
    parent.appendChild(input);
    quantityButtonFunctionality(input, data)
}

function quantityButtonFunctionality(input, data) {
    input.addEventListener('change', function(event) {
        let inputChanged = event.target;
        let item = inputChanged.closest("article");
        let id = item.dataset.id;
        let color = item.dataset.color;
        let value = inputChanged.value
        changeCartItem(id, color, value, data)
    })
}

function changeCartItem(id, color, value, data) {
    for (let i = 0; i < cart.length; i++) {
        if (id === cart[i].ID && color === cart[i].color) {
            cart[i].quantity = value;
            totalQuantity[i] = parseInt(value);
            totalPrice.splice(i, 1, updatePrice(data.price, value))
            saveCart(cart);
            changeTotal()
            console.log(totalPrice)
        }
      } 
}

// Function for delete button

function createContentDelete(contentParent) {
    let deleteParent = document.createElement('div');
    deleteParent.classList.add("cart__item__content__settings__delete");
    let deleteBtn = document.createElement('p');
    deleteBtn.classList.add("deleteItem");
    deleteBtn.innerText = "Supprimer";
    contentParent.appendChild(deleteParent);
    deleteParent.appendChild(deleteBtn);
    deleteButtonFunctionality(deleteBtn);
}

function deleteButtonFunctionality(deleteBtn) {
    deleteBtn.addEventListener('click', function(event) {
        let btnClicked = event.target;
        let item = btnClicked.closest("article");
        let id = item.dataset.id;
        let color = item.dataset.color;
        item.remove()
        deleteCartItem(id, color);
    }) 
}

function deleteCartItem(id, color) {
    for (let i = 0; i < cart.length; i++) {
        if (id === cart[i].ID && color === cart[i].color) {
            cart.splice(i, 1)
            totalPrice.splice(i, 1)
            totalQuantity.splice(i, 1)
            saveCart(cart);
            changeTotal()
            console.log(totalPrice)
        }
      } 
}

// Following functions calculate the price and quantity total and display them at the bottom of the cart page.

function calculatePrice(price, quantity) {
    let sum = price * quantity;
    totalPrice.push(sum);
    return totalPrice
}

function calculateQuantity(quantity) {
    let quantityNum = parseInt(quantity)
    totalQuantity.push(quantityNum)
    return totalQuantity
}

const totalPrice = []
const totalQuantity = []

function calculateTotalPrice(price, quantity) {
    let prices = calculatePrice(price, quantity)
    let sum = prices.reduce((a, b) => a + b, 0);
    return sum
}

function calculateTotalQuantity(quantity) {
    let quantityTotal = calculateQuantity(quantity)
    let sum = quantityTotal.reduce((a, b) => a + b, 0);
    return sum
}

async function createTotal(price, quantity) {
    let totalQuantity = document.getElementById('totalQuantity');
    let totalPrice = document.getElementById('totalPrice');
    totalPrice.innerText = await calculateTotalPrice(price, quantity);
    totalQuantity.innerText = await calculateTotalQuantity(quantity);

}

// createItem calls the above functions to fill out the cart with products. It is called under the getProduct function and provides the server data (data) and the current 
// product being created from the cart array (i) to the other functions.

function createItem(data, i) {  
    let itemParent = document.getElementById('cart__items');
    let item = document.createElement('article');
    item.classList.add("cart__item");
    item.setAttribute('data-id', cart[i].ID)
    item.setAttribute('data-color', cart[i].color)
    itemParent.appendChild(item);
    createImg(item, data.imageUrl);
    createContent(item);
    createContentDescription(i, data);
    createContentSettings(i, data);
    createTotal(data.price, cart[i].quantity)
    console.log(totalPrice)
}

getProduct()

function updatePrice(price, quantity) {
    let sum = price * quantity;
    return sum;
}

function updateTotalPrice() {
    let sum = totalPrice.reduce((a, b) => a + b, 0);
    return sum
}

function updateTotalQuantity() {
    let quantityTotal = totalQuantity;
    let sum = quantityTotal.reduce((a, b) => a + b, 0);
    return sum
}

async function changeTotal() {
    let totalQuantity = document.getElementById('totalQuantity');
    let totalPrice = document.getElementById('totalPrice');
    totalPrice.innerText = await updateTotalPrice();
    totalQuantity.innerText = await updateTotalQuantity();

}