let products = [];

const icons = {
    fav: "./assets/images/Favorite (1).svg",
    wish: "./assets/images/colored-favourite.svg",
    cart: "./assets/images/Group 1.svg",
};

const ProductsContainer = document.querySelector(".products");
const wishlist = JSON.parse(localStorage.getItem("wishs")) || {};
const counter = document.querySelector(".counter")
const countofwish = document.querySelector(".wishs")
const btnWishs = document.querySelector(".wishs")

const updataCounters = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const wishlist = JSON.parse(localStorage.getItem("wishs")) || {};

    if (counter) {
        counter.textContent = Object.keys(cart).length;
    }

    if (countofwish) {
        countofwish.textContent = Object.keys(wishlist).length;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    updataCounters();
});


const cartProducts = JSON.parse(localStorage.getItem("cart")) || {}
const AddToCart = (btn, id) => {
    cartProducts[id] = true
    localStorage.setItem("cart", JSON.stringify(cartProducts))
    btn.classList.remove("btn-primary")
    btn.classList.add("btn-danger")
    btn.textContent = "Remove From Cart"
    btn.onclick = () => RemoveFromCart(btn, id);
    // displayProducts(products)
    updataCounters()
}

const RemoveFromCart = (btn, id) => {
    delete cartProducts[id]
    localStorage.setItem("cart", JSON.stringify(cartProducts))
    btn.classList.add("btn-primary");
    btn.classList.remove("btn-danger");
    // btn.textContent = "Add to Cart";
    btn.innerHTML = `
        <img src="${icons.cart}" class="me-2">`
    btn.onclick = () => AddToCart(btn, id);
    counter.textContent = Object.keys(cartProducts).length;
    updataCounters()
}

const favourite = (btn, id) => {
    wishlist[id] = true
    localStorage.setItem("wishs", JSON.stringify(wishlist))
    btn.innerHTML = `
        <img src="${icons.wish}">`
    btn.onclick = () => RemoveFromWish(btn, id);
    // displayProducts(products)
    updataCounters()

}

btnWishs.addEventListener("click", function () {
    const filteredWishlist = products.filter(product => wishlist[product.id]);
    if (filteredWishlist.length === 0) {
        ProductsContainer.innerHTML = `
            <p class="text-center fs-3 text-secondary">No Favorites Found</p>
        `;
        return;
    }
    displayProducts(filteredWishlist);
});

const RemoveFromWish = (btn, id) => {
    delete wishlist[id]
    localStorage.setItem("wishs", JSON.stringify(wishlist))
    btn.innerHTML =
        `<img src="${icons.fav}">`
    btn.onclick = () => favourite(btn, id);
    // displayProducts(products)
    updataCounters()
}

const displayProducts = (products) => {
    ProductsContainer.innerHTML = " "
    products.forEach(product => {
        ProductsContainer.innerHTML += `
        <div class="card">
            <div class="h-100 img">
                <img class="card-img-top p-2 rounded-4" src="${product.thumbnail}">
            </div>
            <div class="card-body">
                <h2 class="card-title">${product.brand}</h2>
                <h3 class="card-text fs-6">${product.description}</h3>

                <p class="card-text fs-4 text-success">
                    $${product.price}
                    <span class="fs-6 text-decoration-line-through text-danger">
                            $${product.price + 200}
                    </span>
                </p>
                    <div class="button">
                        <button class="btn btn-primary pt-3 pb-3 ${cartProducts[product.id] ? 'btn-danger' : 'btn-primary'}" 
                            onclick="${cartProducts[product.id] ? `RemoveFromCart(this, ${product.id})` : `AddToCart(this, ${product.id})`}">
                                ${cartProducts[product.id] ? 'Remove From Cart' : `<img src="${icons.cart}">`}
                        </button> 
                        <button class="wish border border-primary border-1 bg-light border border-primary}" onclick="${wishlist[product.id] ? `RemoveFromWish(this, ${product.id})` : `favourite(this, ${product.id})`}">
                            ${wishlist[product.id] ? `<img src="${icons.wish}">` : `<img src="${icons.fav}">`}
                        </button>
                    
                </div>
        </div>`
    })
}
displayProducts(products)


const spinner = document.querySelector(".loader")

const ApiProuduct = () => {
    spinner.style.display = "flex";  // block*
    fetch('https://dummyjson.com/products/search?q=phone&limit=8')
        .then(res => res.json())
        .then(data => {
            // products = data.products;
            products = data.products.map(product => ({
                id: product.id,
                brand: product.brand,
                price: product.price,
                description: product.description,
                thumbnail: product.thumbnail
            }))
            displayProducts(products)
            // spinner
            spinner.style.display = "none";
        })
}

document.addEventListener("DOMContentLoaded", () => {
    ApiProuduct();
})

const searchBtn = document.querySelector(".search-btn")
const searchInput = document.querySelector(".search-input")

searchBtn.addEventListener("click", function () {
    // preventDefault() --> form ?
    // event.preventDefault()
    ProductsContainer.innerHTML = "";

    const input = searchInput.value.toLowerCase().trim();
    if (input === "" || input === " ") {
        ProductsContainer.innerHTML =
            `<p class=" fs-4 w-100 text-danger">Please enter a search value !</p>`;
        return;
    }

    const filteredNamePtoducts = products.filter((product) => {
        return product.brand.toLowerCase().includes(input);
    });

    if (filteredNamePtoducts.length === 0) {
        ProductsContainer.innerHTML =
            `<p class="text-center fs-2 text-secondary">No Data Found</p>`;
        return;
    }
    displayProducts(filteredNamePtoducts);
});


const priceBtn = document.querySelector(".price-btn")
const maxPrice = document.querySelector(".max-price")
const minPrice = document.querySelector(".min-price")

priceBtn.addEventListener("click", function () {
    ProductsContainer.innerHTML = "";
    const max = Number(maxPrice.value)
    const min = Number(minPrice.value)

    if (min < 0 || max < 0) {
        ProductsContainer.innerHTML = `
        <p class="text-center fs-4 text-danger">
            Please enter positive numbers only
        </p>`;
        return;
    } else if (minPrice.value.trim() === "" || maxPrice.value.trim() === "") {
        ProductsContainer.innerHTML = `
        <p class="text-center fs-4 text-danger">
            Please enter both minimum and maximum prices
        </p>`;
        return;
    }
    const filteredPrice = products.filter((product) => {
        // replace ?
        const price = Number(product.price)
        return price >= min && price <= max
    })
    if (filteredPrice.length === 0) {
        ProductsContainer.innerHTML =
            `<p class="text-center fs-2 text-secondary"> No Data Found </p> `;
        return;
    }
    displayProducts(filteredPrice)
})

const hour = document.querySelector(".hour")
const minute = document.querySelector(".minute")
const secounde = document.querySelector(".secound")

let countdown = (7 * 60 * 60) + (23 * 60) + 46
setInterval(() => {
    if (countdown <= 0) {
        clearInterval(timer)
        console.log('00:00:00')
        return
    }
    // %
    countdown--
    const hours = Math.floor(countdown / 3600)
    const minutes = Math.floor((countdown % 3600) / 60)
    const secounds = countdown % 60

    hour.textContent = '0' + hours
    minute.textContent = minutes
    secounde.textContent = secounds
    console.log(`${hours}:${minutes}:${secounds}`)
}, 1000);
