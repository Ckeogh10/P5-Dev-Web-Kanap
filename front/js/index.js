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

// getAllProducts first fetches and verifies the product information from the server. It then executes the createItem function for each product while also giving it the 
// information it requires to build a list of products for the index page.

function createImg(article, url, title) {
    let img = document.createElement("img");
    // This creates the <img> element within index.html
    img.src = url;
    img.alt = "Lorem ipsum dolor sit amet, " + title;
    // These two lines create a src and alt element within <img> and gives them the needed product information.
    article.appendChild(img);
    // This line adds the <img> element to the <article> element created by createItem.
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

// These three functions take the information given to them by createItem and they insert it into the html document, creating html code as needed.

function createItem(data) {
    let section = document.getElementById('items');
    // This line finds the area within index.html where we wish to insert the product information.
    let a = document.createElement("a");
    let article = document.createElement("article");
    section.appendChild(a);
    a.appendChild(article);
    // These lines first create an <a> element within the <items> element of the html code. They then create an <article> element within that <a> element. The <a> will ensure that
    // all of the elements contained within will become a link to the product's page. The <article> element will contain the product's information.
    a.href = "./product.html?" + "id=" + data._id;
    // This line adds href to the <a> element and then takes the product's id from the server and adds it to the end of the link, allowing each created item to have its own
    // unique link.
    createImg(article, data.imageUrl, data.name);
    createTitle(article, data.name);
    createText(article, data.description);
    // These three functions are explained above, but it is here that they are given the information they need. "article" is required for them to all be appended to the same
    // element and "data.xxx" takes the server information fetched by getAllProducts (data) and searches for the desired information (.imageUrl, .name etc.).
}

getAllProducts();