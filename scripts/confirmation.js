document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("firstNameCon").textContent =
    localStorage.getItem("first-name");
  document.getElementById("lastNameCon").textContent =
    localStorage.getItem("last-name");
  document.getElementById("emailCon").textContent =
    localStorage.getItem("email");
  document.getElementById("phoneCon").textContent =
    localStorage.getItem("phone");
  document.getElementById("addressCon").textContent =
    localStorage.getItem("address");
  document.getElementById("zipCon").textContent = localStorage.getItem("zip");
  document.getElementById("cityCon").textContent = localStorage.getItem("city");

  showCartProducts();
});

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});

function showCartProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const cart = document.querySelector(".cart-prod");
  cart.innerHTML = "";
  let totalSumCount = 0;
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("cart-product");
    productDiv.setAttribute("data-id", product.id);
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("cart-product-image");
    const productImage = document.createElement("img");
    productImage.src = product.image;
    imageDiv.appendChild(productImage);
    const productNameDiv = document.createElement("div");
    productNameDiv.classList.add("product-name");
    productNameDiv.textContent = product.name;
    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantity");
    quantityDiv.innerHTML = `
            <span class="quantity-display">${product.quantity}</span>
        `;
    const totalPriceDiv = document.createElement("div");
    totalPriceDiv.classList.add("total-price");
    const totalProductPrice = product.price * product.quantity;
    totalPriceDiv.textContent = "$" + totalProductPrice.toFixed(2);
    totalSumCount = totalSumCount + totalProductPrice;

    productDiv.appendChild(imageDiv);
    productDiv.appendChild(productNameDiv);
    productDiv.appendChild(quantityDiv);
    productDiv.appendChild(totalPriceDiv);

    cart.appendChild(productDiv);
  });
  const totalSum = document.querySelector(".total-sum");
  totalSum.textContent = "Total Price: $" + totalSumCount.toFixed(2);
}
