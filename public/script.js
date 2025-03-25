document.addEventListener("DOMContentLoaded", fetchProducts);

document
  .getElementById("product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (response.ok) {
      fetchProducts(); // Refresh the product list
      document.getElementById("product-form").reset();
    }
  });

async function fetchProducts() {
  const response = await fetch("http://localhost:3000/products");
  const products = await response.json();

  const productList = document.getElementById("product-list");

  // Create a new container to avoid flickering
  const newProductList = document.createElement("div");
  newProductList.className = "d-flex flex-wrap justify-content-center";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card m-2 p-3";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">Price: ₹${product.price}</p>
        <button class="delete-btn btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">❌ Delete</button>
      </div>
    `;
    newProductList.appendChild(card); // Append new product cards at the bottom
  });

  // Replace old product list with the new one
  productList.replaceWith(newProductList);
  newProductList.id = "product-list"; // Maintain the ID for future updates
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchProducts(); // Refresh the UI after deletion
    } else {
      console.error("Failed to delete product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
