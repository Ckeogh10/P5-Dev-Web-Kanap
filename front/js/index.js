const productsUrl = "http://localhost:3000/api/products"

function getAllProducts() {
    fetch(productsUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data) {
        console.log(data);
        data.forEach(createItem);
    })
    .catch(function(error) {
        // An error has occured
    });
}

function createImg(article, url, title) {
    let img = document.createElement("img");
    img.src = url;
    img.alt = "Lorem ipsum dolor sit amet, " + title;
    article.appendChild(img);
}

function createTitle(article, title) {
    let h3 = document.createElement("h3");
    h3.innerText = title;
    article.appendChild(h3);
}

function createText(article, description) {
    let p = document.createElement("p");
    p.innerText = description;
    article.appendChild(p);
}

function createItem(data) {
    let section = document.getElementById('items');
    let a = document.createElement("a");
    let article = document.createElement("article");
    section.appendChild(a);
    a.appendChild(article);
    a.href = "./product.html?" + "id=" + data._id;
    createImg(article, data.imageUrl, data.name);
    createTitle(article, data.name);
    createText(article, data.description);
}

getAllProducts();