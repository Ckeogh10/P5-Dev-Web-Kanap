let str = window.location.href;
let url = new URL(str);
const id = url.searchParams.get("id");
productUrl = "http://localhost:3000/api/products/" + id;

// These lines of code take the url of the current page and isolate the "id" search parameter, allowing us to easily obtain the id of the product that the page is displaying.
// We can then use this id to search the server for this specific product's information using getProduct.

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

// The above all works as explained in the comments in index.js.

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

// The above functions provide the framework for our cart. saveCart(item) saves (item) to the browser's local storage by first stringifying (item) then by saving it under 
// "cart" through localStorage.setItem. getCart() first parses the stringified "cart" item in localStorage then returns it, allowing us to easily access the saved information.
// Before returning getCart() checks to see whether "cart" is null and if so defines it as an empty array to avoid errors.

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

// The saveProduct() function collects the relevant information from the page and saves it to an array named product. When it is called it first verifies that a color has been
// selected or that the quantity is not equal to 0 (there is no need to verify that it is not below 0 because the html input does not allow it). If this is the case it returns
// the product array, otherwise it displays an alert for the user and returns false.

function addProductToCart(product) {
    if (product === false) {
        return
    } else {
        if (checkForDuplicate(cart, product) === true) {
        alert('Ce produit est déjà dans votre panier. La quantité a donc était augmentée!')
        return true
    }   else {
        alert('Votre produit à été ajouté à votre panier!')
        cart.push(product);
    }
    }
}

// The addProductToCart() function is used alongside the saveProduct() function (as seen below on line 149). It takes the result returned by saveProduct() and if it is false then 
// nothing happens, as saveProduct() has its own error message that would display. If the result is successfully returned then it will add it to the cart array. Before doing so it
// uses the check() function below to check whether a product with the same id and color is already in the cart and if so will not add anything to the cart and instead allow
// the check() function to resolve.

function checkForDuplicate(cart, product) {  
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

// The checkForDuplicate() function is used to check whether a product being added to the array is already in the array. To do this it takes the product.ID and product.color 
// defined in saveProduct() and uses a loop to search through the cart array. If it finds an entry in the cart array that has an ID and color equal to the product.ID and 
// product.color it will add product.quantity to that entry's cart.quantity and then returns true. It will otherwise return false and allow addProductToCart() to instead push the 
// product directly to the cart.

const button = document.getElementById('addToCart');

button.onclick = (event) => {
    addProductToCart(saveProduct());
    saveCart(cart);
}

// The code above adds an event listener to the addToCart html element. When clicked the addProductToCart() function will run using the information it received from the 
// saveProduct() function. This process is explained above and will result in the product's ID, color and quantity being saved to the cart array which will then be taken by
// saveCart() and saved to local storage, allowing it to be accessed on other pages of the site.