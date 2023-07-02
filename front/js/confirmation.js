function createOrderId() {
    let str = window.location.href;
    let url = new URL(str);
    const id = url.searchParams.get("id");
    let orderId = document.getElementById('orderId')
    orderId.innerText = id;
}

createOrderId();

// createOrderId takes the ID received from the page's URL (which was placed there by the finalConfirmation() function in cart.js) and inserts it into the HTML code, allowing the
// user to easily view their order's ID.