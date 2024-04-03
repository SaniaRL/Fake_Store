const productsDOM = document.querySelector(".products-layout");
let category = "product";

let modal = document.querySelector(".custom-modal");
let cartIcon = document.querySelector(".cart-icon-btn");
let body = document.querySelector("body");
let closebtn = document.querySelector(".close-button");

cartIcon.onclick = function () {
  modal.style.display = "block";
  body.classList.toggle("show-cart");
  showCartProducts();
};

closebtn.addEventListener("click", () => {
  modal.style.display = "none";
  body.classList.remove("show-cart");
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    body.classList.remove("show-cart");
  }
};

document.querySelector(".check-out-button").addEventListener("click", () => {
  window.location.href = "purchaseformBS.html";
});

// document.querySelector(".clear-cart-button").addEventListener("click", () => {
//   console.log("clear cart");
//   localStorage.clear();
// });

//Sätt en lyssnare på knappen som nu egentligen inte är purchase, men add to cart
document
  .getElementById("purchase-button")
  .addEventListener("click", function (event) {
    //Kolla vilket produktID vi har (selectedProductID finns alltid)
    const productId = localStorage.getItem("selectedProductId");
    //Hämta alla produkter eller skapa tom array
    let cart = JSON.parse(localStorage.getItem("products")) || [];
    //Kolla om produkten finns i listan
    const index = cart.findIndex((product) => product.id == productId);
    //Om produkten redan finns
    if (index != -1) {
      //Om produkten finns ska kvantiteten öka. Alltså en produkt ska nu även ha ett kvantitetsattribut.
      cart[index].quantity = cart[index].quantity + 1;
    } else {
      //Hitta den modal som är rätt modal
      var modal = event.target.closest(".modal");
      //Hämta produktinfo från modal - använder textContent för text och src för bild
      const productName = modal.querySelector(".modal-title").textContent;
      const productImage = modal.querySelector(".rounded").src;
      //Priset innehåller dollartecken som bör tas bort för att kunna se summa framöver
      const productPrice = parseFloat(
        modal.querySelector(".modal-price").textContent.substring(1)
      );

      //Ny produkt sparas med id som nyckel och kvantitet 1.
      cart.push({
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1,
      });
    }
    //Spara ner den uppdaterade varukorgen
    localStorage.setItem("products", JSON.stringify(cart));
    //Uppdatera ikonen
    updateCartItemCount();
  });

//Lyssnare för check-out. Href uppdaterar inte show-cart
document
  .querySelector(".check-out-button")
  .addEventListener("click", function () {
    // Navigera till kassasidan
    window.location.href = "purchaseformBS.html";

    // Visa produkter i varukorgen när du navigerar till kassan
    showCartProducts();
  });

//skapa logik för att uppdatera iconens räkning av produkter
const updateCartItemCount = () => {
  //Hämta alla produkter (om det finns produkter)
  const products = JSON.parse(localStorage.getItem("products")) || [];
  //Variabel för att räkna produkter
  let itemCount = 0;
  //Öka summan med kvantiteten för alla produkter
  products.forEach((item) => {
    itemCount += item.quantity;
  });
  //uppdatera alla ikoner (på alla html-blad)
  document.querySelectorAll(".numberOfItems p").forEach((element) => {
    element.textContent = itemCount;
  });
};

//Se till att ikonen uppdateras när sidan uppdateras och jag lägger alla mina andra DOMContedLoaded här nu, även om andra har
//annan kod som har så
document.addEventListener("DOMContentLoaded", () => {
  updateCartItemCount();

  // Lägg lyssnare på plus-knappar
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("plus")) {
      const productId = event.target
        .closest(".cart-product")
        .getAttribute("data-id");
      console.log("Produkt ID:", productId); // Kontrollera att produktens ID hämtas korrekt
      increaseQuantity(productId);
    }
  });

  //Funkar inte:
  // document.querySelectorAll(".plus").forEach((button) => {
  //   console.log("plus innan"); //kommer hit
  //   button.addEventListener("click", () => {
  //     console.log("plus");
  //     const productId = button.closest(".cart-product").getAttribute("data-id");
  //     console.log("plus efter");
  //     increaseQuantity(productId);
  //   });
  // });

  // Lägg lyssnare på minus-knappar
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("minus")) {
      const productId = event.target
        .closest(".cart-product")
        .getAttribute("data-id");
      console.log("Produkt ID:", productId); // Kontrollera att produktens ID hämtas korrekt
      decreaseQuantity(productId);
    }
  });

  const clearCartButton = document.querySelector(".clear-cart-button");
  clearCartButton.addEventListener("click", function () {
    localStorage.clear();
    //Uppdatera varukorgen så den blir tom
    showCartProducts();
    //Uppdatera ikonen som visar antal produkter
    updateCartItemCount();
    //Ta bort totalsumman också, den är ju ful
    const ts = document.querySelector(".total-sum");
    ts.textContent = "";
  });
});

//Se till att produkter kan målas upp
function showCartProducts() {
  //Hämta alla produkter
  const products = JSON.parse(localStorage.getItem("products")) || [];
  //"Hämta" behållaren
  const cart = document.querySelector(".cart-products");
  //Rensa varukorgen så det inte blir mer och mer
  cart.innerHTML = "";
  //Variabel för totalsumma
  let totalSumCount = 0;
  //Loopa produkterna för att skapa upp alla
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("cart-product");
    //Lagra id för att kunna ändra kvantitet
    productDiv.setAttribute("data-id", product.id);
    //Skapa upp image
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("cart-product-image");
    const productImage = document.createElement("img");
    productImage.src = product.image;
    imageDiv.appendChild(productImage);
    // Skapa elementen för produktnamn, kvantitet, totalpris
    const productNameDiv = document.createElement("div");
    productNameDiv.classList.add("product-name");
    productNameDiv.textContent = product.name;
    //Skapa kvantitet
    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantity");
    quantityDiv.innerHTML = `
            <span class="minus">-</span>
            <span class="quantity-display">${product.quantity}</span>
            <span class="plus">+</span>
        `;
    //Totalpris
    const totalPriceDiv = document.createElement("div");
    totalPriceDiv.classList.add("total-price");
    // Beräkna totalpris för produkten
    const totalPrice = product.price * product.quantity;
    totalPriceDiv.textContent = totalPrice.toFixed(2);
    //HÄR VILL JAG HA DELETE

    const removeDiv = document.createElement("div");
    removeDiv.classList.add(".remove");
    //Inner-HTML är chill men vet inte om det funkar lika bra
    removeDiv.innerHTML = `
     <i>
       <img src="images/delete.png">
     </i>
        `;
        console.log(removeDiv);
    //Uppdatera totalsumman
    totalSumCount = totalSumCount + totalPrice;
    const totalSum = document.querySelector(".total-sum");
    totalSum.textContent = "Total Price: $" + totalSumCount.toFixed(2);

    // Lägg till skapade element till det yttre div-elementet för produkten
    productDiv.appendChild(imageDiv);
    productDiv.appendChild(productNameDiv);
    productDiv.appendChild(quantityDiv);
    productDiv.appendChild(totalPriceDiv);
    productDiv.appendChild(removeDiv);

    // Lägg till det yttre div-elementet för produkten till varukorgens container-element
    cart.appendChild(productDiv);
  });
}

//Se till att kvantiteten kan ökas i varukorgen - denna måste kunna ta in ett id. Egentligen skulle denna metod kunna
//ersätta tidigare metod. Och att selected skickas in. Men endast om produkten redan finns, så det blir ändå strul.
const increaseQuantity = (productId) => {
  //Hämta produkterna
  let cart = JSON.parse(localStorage.getItem("products")) || [];
  //Kolla om produkten finns - vilket den kanske inte gör ändå, för om du backar ner till noll uppdateras inte
  //sidan innan du öppnar varukorgen på nytt. Däremot har produkten ev plockats bort i localstorage
  //Detta är med flit, så att du kan öka från noll om du klickat fel.
  const index = cart.findIndex((product) => product.id == productId);
  if (index !== -1) {
    cart[index].quantity++;
    localStorage.setItem("products", JSON.stringify(cart));
    updateCartItemCount();
    // Uppdatera gränssnittet för att visa den nya kvantiteten
    showCartProducts();
  }
  //om den int finns dvs du har minskat till noll asså jag måste kolla mer på detta sen.
};

//Minska kvantiteten av en produkt - exakt samma sak som innan. Typ copy/paste men minus istället.
const decreaseQuantity = (productId) => {
  let cart = JSON.parse(localStorage.getItem("products")) || [];
  const index = cart.findIndex((product) => product.id == productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      localStorage.setItem("products", JSON.stringify(cart));
      updateCartItemCount();
      // Uppdatera gränssnittet för att visa den nya kvantiteten
      showCartProducts();
    }
  }
};

//Ta bort en produkt helt
const removeProduct = (productId) => {
  let cart = JSON.parse(localStorage.getItem("products")) || [];
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("products", JSON.stringify(cart));
};

//Se till att produkter målas upp på kassasidan

//Se till att produkter målas upp på bekräftelsesidan

//Se till att knappen ändras
//Se till att produkter kan tas bort

class Products {
  async getProducts(category) {
    try {
      let response;
      switch (category) {
        case "women":
          response = await fetch(
            "https://fakestoreapi.com/products/category/women's%20clothing"
          );
          break;
        case "men":
          response = await fetch(
            "https://fakestoreapi.com/products/category/men's%20clothing"
          );
          break;
        case "jewelery":
          response = await fetch(
            "https://fakestoreapi.com/products/category/jewelery"
          );
          break;
        case "electronics":
          response = await fetch(
            "https://fakestoreapi.com/products/category/electronics"
          );
          break;

        default:
          response = await fetch("https://fakestoreapi.com/products");
          break;
      }

      if (!response.ok) {
        throw new Error("Could not fetch resource");
      }

      const data = await response.json();

      let products = data.map((item) => {
        const { id, title, description, price, category, image } = item;
        const rating = { rate: item.rating.rate, count: item.rating.count };
        return { id, title, description, price, category, image, rating };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    this.clear();
    const items = products.map((item) => {
      const col = document.createElement("div");
      col.className = "col-lg-3 col-sm-6 p-3 best";

      const card = document.createElement("div");
      card.className = "card h-100 mb-4";

      card.setAttribute("data-id", item.id); // Set the product ID as a data attribute
      card.setAttribute("data-bs-toggle", "modal");
      card.setAttribute("data-bs-target", "#productModal");
      card.onclick = () => addContentToModal(item);

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = item.image;

      const cardBody = document.createElement("div");
      cardBody.className = "card-body border-top";

      const title = document.createElement("h5");
      title.className = "card-title align-self-end";
      title.innerHTML = item.title;

      const price = document.createElement("p");
      price.className = "card-text align-self-end";
      price.innerHTML = "$" + item.price;

      cardBody.appendChild(title);
      cardBody.appendChild(price);
      card.appendChild(img);
      card.appendChild(cardBody);
      col.appendChild(card);

      return col;
    });

    const container = document.createElement("div");
    container.className = "container-xl p-5";

    const row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-md-3 g-2";

    items.forEach((item) => {
      row.appendChild(item);
    });
    container.appendChild(row);
    document.querySelector(".products-layout").appendChild(container);
  }

  clear() {
    const container = document.querySelector(".products-layout");
    if (container) {
      container.innerHTML = "";
    }
  }
}

const addContentToModal = (item) => {
  const modal = document.getElementById("productModal");
  if (modal) {
    localStorage.setItem("selectedProductId", item.id);
    document.querySelector(".modal-title").innerHTML = item.title;
    document.querySelector(".rounded").src = item.image;
    document.querySelector(".description").innerHTML = item.description;
    document.querySelector(".rating-count").innerHTML =
      item.rating.count + " (reviews)";
    document.querySelector(".modal-price").innerHTML = "$" + item.price;

    const stars = document.querySelector(".stars");
    stars.setAttribute("title", item.rating.rate);

    const rate = Math.round(item.rating.rate);

    const arr = Object.keys(stars.children).map((key, i) =>
      i < rate ? filledStar() : emptyStar()
    );
    stars.replaceChildren(...arr);
    var tooltip = new bootstrap.Tooltip(stars);
  }
};

const filledStar = () => {
  const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const starPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  starSvg.setAttribute("fill", "currentColor");
  starSvg.setAttribute("class", "bi bi-star-fill");
  starSvg.setAttribute("viewBox", "0 0 16 16");

  starPath.setAttribute(
    "d",
    "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  );

  starSvg.appendChild(starPath);

  return starSvg;
};

const emptyStar = () => {
  const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const starPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  starSvg.setAttribute("fill", "currentColor");
  starSvg.setAttribute("class", "bi bi-star");
  starSvg.setAttribute("viewBox", "0 0 16 16");

  starPath.setAttribute(
    "d",
    "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"
  );

  starSvg.appendChild(starPath);

  return starSvg;
};

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  const categories = new Map([
    ["Women's Clothing", "women"],
    ["Men's Clothing", "men"],
    ["Jewellery", "jewelery"],
    ["Electronics", "electronics"],
  ]);
  let category = "product";

  products
    .getProducts(category)
    .then((products) => ui.displayProducts(products));

  let collection = document.getElementsByClassName("nav-link-secondary");
  Array.from(collection).forEach((element) => {
    element.addEventListener("click", (event) => {
      let current = document.getElementsByClassName("active");
      if (current) {
        current[0].classList.remove("active");
      }
      event.currentTarget.classList.add("active");
      category = categories.get(element.innerHTML);
      products.getProducts(category).then((products) => {
        ui.displayProducts(products);
      });
    });
  });

  document
    .getElementById("purchase-button")
    .addEventListener("click", function (event) {
      const productId = localStorage.getItem("selectedProductId");
      if (productId) {
        let cartItems = localStorage.getItem("cartItems");
        if (!cartItems) {
          cartItems = [];
        } else {
          cartItems = JSON.parse(cartItems);
        }
        cartItems.push(productId);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        console.log("Product ID saved to cart: " + productId);
      } else {
        console.log("No product ID selected.");
      }
    });

  document.getElementById("navbarLinks").addEventListener("click", (e) => {
    const toggle = document.getElementById("navbar-secondary");
    const collapse = new bootstrap.Collapse(toggle, {
      toggle: false,
    });
    collapse.hide();
  });
});

const collapseNavs = () => {
  const links = document.getElementById("navbar-collapse");
  if (links) {
    const collapseLinks = new bootstrap.Collapse(links, {
      toggle: false,
    });
    collapseLinks.hide();
  }

  const categories = document.getElementById("navbar-secondary");
  if (categories) {
    const collapseCategories = new bootstrap.Collapse(categories, {
      toggle: false,
    });
    collapseCategories.hide();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const productNameElement = document.getElementById("product-name-pf");

  if (productNameElement) {
    // Retrieve the selected product ID from localStorage
    const selectedProductId = localStorage.getItem("selectedProductId");
    console.log(selectedProductId);

    if (selectedProductId) {
      // Fetch the product details using the saved product ID
      await fetch(`https://fakestoreapi.com/products/${selectedProductId}`)
        .then(async (response) => {
          console.log(response);
          // Check if the response is ok
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          console.log("fetched from ID " + selectedProductId);
          const data = await response.json();
          console.log(data);
          return data;
        })
        .then((product) => {
          // Function for updating the product details in HTML
          displayProductDetails(product);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          // Optionally, update the UI to indicate that an error occurred
        });
    }
  }
});

function displayProductDetails(product) {
  // Get the elements by ID
  // const productImgElement = document.getElementById("product-img-pf");
  // const productNameElement = document.getElementById("product-name-pf");
  // const productDescElement = document.getElementById("product-desc-pf");
  // const productPriceElement = document.getElementById("product-price-pf");
  // Update the elements with the product details
  // productImgElement.src = product.image;
  // productNameElement.textContent = product.title;
  // productDescElement.textContent = product.description;
  // productPriceElement.textContent = "Price: $" + product.price;
}
