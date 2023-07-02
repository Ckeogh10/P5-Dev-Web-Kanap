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
        data.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        data.forEach(createItem)
    }) 
    
}

// The getProduct() function had to change to ensure all products load correctly upon entering the page. Using Promise.all ensures that the function will wait until the data
// of every product within the cart array is fetched before the createItem function is called. Without this many display errors occur as the page fails to fully load one product's
// data before moving onto the next. We also sort the data by name using data.sort to ensure that all products are correctly grouped together.

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

// Function that adds an event listener to input. When input changes changeCartItem is called. This function changes the value of the corresponding cart and totalQuantity 
// arrays (see deleteCartItem for more info on the loop) to match the new value. It then removes the corresponding price from totalPrice and replaces it with a new value 
// that it gets from the updatePrice() function. This function takes the current value (i.e. the changed quantity) and multiplies it with the price (which it takes from the data
// parameter passed down from createItem()). After this cart is saved and the total price and quantity are recalculated.

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
            updateTotal()
            console.log(totalPrice)
        }
      } 
}

// Function for the creation of the delete buttons

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

// Function that adds an event listener to deleteBtn. When clicked it will remove the closest article of its target. deleteCartItem is attached to it, which will
// loop through cart and find the object that contains both the id and color taken from the article's dataset. Once found, that object will be removed from cart and
// the values it created in totalPrice and totalQuantity will also be removed. The cart is then saved and the total price and quantity are recalculated.

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
            cart.splice(i, 1);
            totalPrice.splice(i, 1);
            totalQuantity.splice(i, 1);
            products.splice(i, 1);
            saveCart(cart);
            updateTotal();
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
    products.push(cart[i].ID)
}

// Functions used to update total quantity/price --- Refer to deleteCartItem and changeCartItem found under createContentSettings for more details

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

async function updateTotal() {
    let totalQuantity = document.getElementById('totalQuantity');
    let totalPrice = document.getElementById('totalPrice');
    totalPrice.innerText = await updateTotalPrice();
    totalQuantity.innerText = await updateTotalQuantity();
}

// Functions that verify user input. formVerification allows for instant user feedback as they fill the form out. finalVerification verifies both the contact (with the checkContact
// function) and product info (with the checkProducts function) upon clicking the submit button and if both are valid it will add the user's info to contact{} and begin the 
// POST request.
 

function formVerification() {
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let city = document.getElementById('city');
    let addressInput = document.getElementById('address');
    let emailInput = document.getElementById('email');
    firstNameVerification(firstName);
    lastNameVerification(lastName);
    addressVerification(addressInput);
    cityVerification(city);
    emailVerification(emailInput);
    finalVerification(firstName, lastName, addressInput, city, emailInput)
}

function finalVerification(firstName, lastName, address, city, email) {
    let submitBtn = document.getElementById('order')

    submitBtn.onclick = (e) => {
    if (checkContact(firstName, lastName, address, city, email) == true && checkProducts() == true) {

            contact.firstName = firstName.value;
            contact.lastName = lastName.value;
            contact.address = address.value;
            contact.city = city.value;
            contact.email = email.value

            sendOrder()
            e.preventDefault()
            return true
        }
        else {
            e.preventDefault()
            return false
        }

}
    
}

function checkContact(firstName, lastName, address, city, email) {
    if (nameTest(firstName.value) == true &&
        nameTest(lastName.value) == true &&
        addressTest(address.value) == true &&
        nameTest(city.value) == true &&
        emailTest(email.value)) {
            return true
        } else {
            alert('Vos informations ne sont pas toutes valides!')
            return false
        }
}

function checkProducts() {
    if (products == null || products.length < 1) {
        alert('Votre panier est vide!')
        return false
    } else {
        return true
    }
}

// The information verification tests. Each input has its own individual event listener but there are only 3 tests: name, address and email. First, last and city name all share
// a test whereas email and address have their own test. The Test functions do the real work and as such are used by both the checkContact function (which is used as the final
// test before the information is sent) and the Verification functions (which are used for instant user feedback).

function firstNameVerification(firstName) {
    firstName.addEventListener('input', function(event) {
        let name = event.target.value;
        if (nameTest(name) == true) {
            document.getElementById('firstNameErrorMsg').innerText = ''
            return true
        } else {
            document.getElementById('firstNameErrorMsg').innerText = 'Prénom invalide!'
            return false
        }
    })
}

function lastNameVerification(lastName) {
    lastName.addEventListener('input', function(event) {
        let name = event.target.value;
        if (nameTest(name) == true) {
            document.getElementById('lastNameErrorMsg').innerText = ''
            return true
        } else {
            document.getElementById('lastNameErrorMsg').innerText = 'Nom invalide!'
            return false
        }
    })
}

function addressVerification(addressInput) {
    addressInput.addEventListener('input', function(event) {
        let address = event.target.value;
        if (addressTest(address) == true) {
            document.getElementById('addressErrorMsg').innerText = ''
            return true
        } else {
            document.getElementById('addressErrorMsg').innerText = 'Addresse invalide! Veillez bien mettre le numéro de l`adresse puis l`adresse elle même.'
            return false
        }
    })
}

function cityVerification(city) {
    city.addEventListener('input', function(event) {
        let name = event.target.value;
        if (nameTest(name) == true) {
            document.getElementById('cityErrorMsg').innerText = ''
            return true
        } else {
            document.getElementById('cityErrorMsg').innerText = 'Nom de ville invalide!'
            return false
        }
    })
}

function emailVerification(emailInput) {
    emailInput.addEventListener('input', function(event) {
        let email = event.target.value;
        if (emailTest(email) == true) {
            document.getElementById('emailErrorMsg').innerText = ''
            return true
        } else {
            document.getElementById('emailErrorMsg').innerText = 'Email invalide!'
            return false
        }
    })
}

function nameTest(name) {
    return /^[A-Z][a-zA-Z-àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ.]{1,20}$/.test(name);
}

function addressTest(address) {
    return /^\d{1,5}\s[a-zA-Z- 0-9àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ.]{1,40}$/.test(address);
}

function emailTest(email) {
    return /^[\w.+]{1,25}[@]{1}[a-zA-Z-àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]{1,15}[.]{1}[a-zA-Z-àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]{1,10}$/.test(email)
}

let contact = {}; 

let products = []

function sendOrder() {
    let orderInfo = {
        contact,
        products
    };
    let order = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderInfo),
}
    fetch('http://localhost:3000/api/products/order', order)
    .then((response) => {
        if (response.status == 201) {
            return response.json();
        } else {
            console.log('POST error!')
        }
    })
    .then((data) => {
        console.log(data)
        finalConfirmation(data.orderId)
    })
};

// The above code is how we get the order's ID from the server. The sendOrder() function is called by the finalVerification() function which checks the validity of the contact and
// product information. If they are valid then sendOrder() takes the contact and product arrays and places them within orderInfo. We then create a POST method named 
// order which will stringify orderInfo. Finally we use the fetch function to send the order to the server. If the response is valid then it will be returned, changed into
// json and passed to the finalConfirmation() function which will send the user to the confirmation page after inserting the orderId into the page's URL.

function finalConfirmation(orderId) {
    localStorage.clear();
    window.location.href = 'confirmation.html?' + 'id=' + orderId;
}

getProduct()

formVerification()