// const productsUrl = "http://localhost:3000/api/products"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

let str = window.location.href;
let url = new URL(str);
const id = url.searchParams.get("id");
console.log(id);

// data.forEach(function(item){ if (item.id === foundID){ createItem(item) }  })

product = "http://localhost:3000/api/products/" + id;

console.log(product);

function getProduct() {
    fetch(product)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data) {
        console.log(data);
        createItem(data);
        // data.forEach(createItem);
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

function createColorList(colors) {
    let createOption = new Option(colors, colors);
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