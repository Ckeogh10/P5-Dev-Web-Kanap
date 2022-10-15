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

function createImg(parent, url, title) {
    let img = document.createElement("img");
    img.src = url;
    img.alt = "Lorem ipsum dolor sit amet, " + title;
    parent.appendChild(img);
    console.log(img);
}

function createItem(data) {
    let imgParent = document.getElementsByClassName('item__img');
    console.log(imgParent);
    createImg(imgParent, data.imageUrl, data.name);
}

getProduct()