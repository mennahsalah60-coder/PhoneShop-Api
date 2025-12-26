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
const AddToCart = (id) => {
    cartProducts[id] = true
    localStorage.setItem("cart", JSON.stringify(cartProducts))
    displayProducts(products)
    updataCounters()
}

const RemoveFromCart = (id) => {
    delete cartProducts[id]
    localStorage.setItem("cart", JSON.stringify(cartProducts))
    displayProducts(products)
    counter.textContent = Object.keys(cartProducts).length;
    updataCounters()
}

const favourite = (id) => {
    wishlist[id] = true
    localStorage.setItem("wishs", JSON.stringify(wishlist))
    displayProducts(products)
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

const RemoveFromWish = (id) => {
    delete wishlist[id]
    localStorage.setItem("wishs", JSON.stringify(wishlist))
    displayProducts(products)
    updataCounters()
}

const spinner = document.querySelector(".loader")
const displayProducts = (products) => {
    ProductsContainer.innerHTML = " "

    products.forEach(product => {
        ProductsContainer.innerHTML += `
                    <div class="card">
                        <div class="h-100">
                            <img class="card-img-top p-2 rounded-4 h-75" src="${product.thumbnail}">
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

                        ${cartProducts[product.id] ? `
                        <div class="button">
                            <button class="btn btn-danger pt-3 pb-3" onclick="RemoveFromCart(${product.id})">
                        Remove From Cart</button>
                        `: `
                        <div class="button">
                            <button class="btn btn-primary pt-3 pb-3" onclick="AddToCart(${product.id})">
                            <img src="${icons.cart}" alt="Cart Icon" class="">
                        </button> `
            }

                        ${wishlist[product.id] ?
                `<button class="bg-light border border-primary ">
                            <img class="heart-two w-75" onClick="RemoveFromWish(${product.id})" src="${icons.wish}" alt="Cart Icon">
                        </button>
                        `: `         
                        <button class=" bg-light border border-primary ">
                            <img class="heart w-75" onClick="favourite(${product.id})" src="${icons.fav}" alt="Cart Icon">
                        </button>
                        `}
                        </div>
                </div>
                `
    });
}
displayProducts(products)

const ApiProuduct = () => {
    spinner.style.display = "block";
    fetch('https://dummyjson.com/products/search?q=phone&limit=8')
        .then(res => res.json())
        .then(data => {
            products = data.products;
            displayProducts(products)
            // spinner
            spinner.style.display = "none";
        })
}

ApiProuduct()


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
