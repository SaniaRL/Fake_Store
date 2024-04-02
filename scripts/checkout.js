document.addEventListener("DOMContentLoaded", () => {
    // console.log("Start");
    // const container = document.querySelector(".cart-product");
    // console.log(container);
    // const productDiv = document.createElement("div");
    // console.log(productDiv);
    // productDiv.classList.add("product");
    // console.log(productDiv);
    // productDiv.innerText = "Hej";
    // console.log(productDiv);
    // container.appendChild(productDiv);
    showCartProducts();
});

//Se till att produkter kan målas upp
function showCartProducts() {
    //Hämta alla produkter
    const products = JSON.parse(localStorage.getItem("products")) || [];
    //"Hämta" behållaren
    const cart = document.querySelector(".cart-prod");
    //Rensa varukorgen så det inte blir mer och mer
    cart.innerHTML = "";
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
          quantityDiv.addEventListener("click", (e) => {
            console.log(e);
          });
      //Totalpris
      const totalPriceDiv = document.createElement("div");
      totalPriceDiv.classList.add("total-price");
      // Beräkna totalpris för produkten
      totalPriceDiv.textContent = product.price * product.quantity;
  
      // Lägg till skapade element till det yttre div-elementet för produkten
      productDiv.appendChild(imageDiv);
      productDiv.appendChild(productNameDiv);
      productDiv.appendChild(quantityDiv);
      productDiv.appendChild(totalPriceDiv);
  
      // Lägg till det yttre div-elementet för produkten till varukorgens container-element
      cart.appendChild(productDiv);
    });
  }

  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    let firstName = document.getElementById("fname").value;
    let lastName = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let zip = document.getElementById("zip").value;
    let city = document.getElementById("city").value;
  
    resetErrors();
  
    let isValid = true;
    if (!validInputSize(firstName)) {
      document.getElementById("fnameError").innerText =
        "Input must be between 2 and 50 characters long.";
      isValid = false;
    }
    if (!validInputSize(lastName)) {
      document.getElementById("lnameError").innerText =
        "Input must be between 2 and 50 characters long.";
      isValid = false;
    }
    if (!validEmail(email)) {
      document.getElementById("emailError").innerText =
        "Please enter a valid email.";
      isValid = false;
    }
    if (!validPhoneNumber(phone)) {
      document.getElementById("phoneError").innerText =
        "Please enter a valid phone number.";
      isValid = false;
    }
    if (!validInputSize(address)) {
      document.getElementById("addressError").innerText =
        "Input must be between 2 and 50 characters long.";
      isValid = false;
    }
    if (!validZip(zip)) {
      document.getElementById("zipError").innerText =
        "Please enter a valid ZIP code.";
      isValid = false;
    }
    if (!validInputSize(city)) {
      document.getElementById("cityError").innerText =
        "Input must be between 2 and 50 characters long.";
      isValid = false;
    }
    if (isValid) {
      localStorage.setItem("first-name", firstName);
      localStorage.setItem("last-name", lastName);
      localStorage.setItem("email", email);
      localStorage.setItem("phone", phone);
      localStorage.setItem("address", address);
      localStorage.setItem("zip", zip);
      localStorage.setItem("city", city);
  
      window.location.href = "confirmation.html";
    }
  });
  
  function validInputSize(input) {
    return /^.{2,50}$/.test(input);
  }
  function validEmail(input) {
    return /^(?=.{1,50}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }
  function validZip(input) {
    return /^\d{3}\s*\d{2}$/.test(input);
  }
  function validPhoneNumber(input) {
    return /^07[0236]-?\d{7}$/.test(input);
  }
  
  function resetErrors() {
    document.getElementById("fnameError").innerHTML = "&nbsp;";
    document.getElementById("lnameError").innerHTML = "&nbsp;";
    document.getElementById("emailError").innerHTML = "&nbsp;";
    document.getElementById("phoneError").innerHTML = "&nbsp;";
    document.getElementById("addressError").innerHTML = "&nbsp;";
    document.getElementById("zipError").innerHTML = "&nbsp;";
    document.getElementById("cityError").innerHTML = "&nbsp;";
  }
  


