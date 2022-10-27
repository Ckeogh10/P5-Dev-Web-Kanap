// const productsUrl = "http://localhost:3000/api/products"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

let str = window.location.href;
let url = new URL(str);
const id = url.searchParams.get("id");
console.log(id);

// data.forEach(function(item){ if (item.id === foundID){ createItem(item) }  })

productUrl = "http://localhost:3000/api/products/" + id;

console.log(productUrl);

function getProduct() {
    fetch(productUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data) {
        console.log(data);
        createItem(data);
    })
    .catch(function(error) {
        // An error has occured
    });
}

function createImg(url, title) {
    let img = document.createElement("img");
    let imgParent = document.getElementsByClassName('item__img')[0];
    img.src = url;
    img.alt = "Lorem ipsum dolor sit amet, " + title;
    imgParent.appendChild(img);
}

function createTitle(title) {
    let titleElement = document.getElementById('title');
    titleElement.innerText = title;
}

function createPrice(price) {
    let priceElement = document.getElementById('price');
    priceElement.innerText = price;
}

function createDescription(description) {
    let descriptionElement = document.getElementById('description');
    descriptionElement.innerText = description;
}

function createColorList(color) {
    // let createOption = new Option(color, color);
    let createOption = document.createElement('option');
    createOption.value = color;
    createOption.text = color;
    let colorsParent = document.getElementById('colors');
    colorsParent.add(createOption);  
}

function createItem(data) {
    createTitle(data.name);
    createImg(data.imageUrl, data.name);
    createPrice(data.price);
    createDescription(data.description);
    data.colors.forEach(createColorList);
}

getProduct()

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

function saveProduct() {
    let productId = id;
    let productColor = document.getElementById('colors').value;
    let productQuantity = document.getElementById('quantity').value;
    let product = {ID: productId, color: productColor, quantity: productQuantity}
    if (productColor === "" || productQuantity === '0') {
        alert("Attention! Veillez bien choisir une couleur ou une quantité correcte!")
        return false
    } else {
        return product;
    }
}

function addProductToCart(product) {
    if (product === false) {
        return
    } else {
        if (check(cart, product) === true) {
        alert('Ce produit est déjà dans votre panier. La quantité a donc était augmentée!')
        return true
    }   else {
        alert('Votre produit à été ajouté à votre panier!')
        cart.push(product);
    }
    }
    
}

function check(cart, product) {  
    if (cart.length === 0) {
        return false;
    }
    else if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
            if (product.ID === cart[i].ID && product.color === cart[i].color) {
              console.log('Element Found');
              cart[i].quantity = Number(cart[i].quantity)+Number(product.quantity);
              return true;
            }
          } return false;
    }
}

const button = document.getElementById('addToCart');

button.onclick = (event) => {
    addProductToCart(saveProduct());
    saveCart(cart);
    console.log(cart);
    console.log(getCart());
}

