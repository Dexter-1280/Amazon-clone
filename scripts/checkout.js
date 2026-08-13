import { cart, removeFromCart, calculateCartQuantity, updateQuantity} from "../data/cart.js";
import { products } from "../data/products.js";
import { fixCurrency } from "./utils/money.js";

let checkoutCartHTML = ''

cart.forEach((cartItem) => {
  let matchingItem;
  products.forEach((product) => {
    if (cartItem.productId === product.id) {
      matchingItem = product
    }
  })

  checkoutCartHTML += `
  <div class="cart-item-container js-cart-container-${matchingItem.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingItem.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingItem.name}
        </div>
        <div class="product-price">
          $${fixCurrency(matchingItem.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}
            </span>
          </span>
          <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = ${matchingItem.id} >
            Update
          </span>
          
          <input class="quantity-input  js-quantity-input-${matchingItem.id}">
          
          <span class="save-quantity-link link-primary js-save-quantity-link"
          data-product-id = ${matchingItem.id}>
          Save
          </span>
          
          <span class="delete-quantity-link link-primary js-delete-quantity-link"
          data-product-id = ${matchingItem.id}>
            Delete
          </span>
        </div>
        <span class = "validation-text js-validation-text-${matchingItem.id}"></span>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`
})

document.querySelector('.js-order-summary')
  .innerHTML = checkoutCartHTML

document.querySelectorAll('.js-delete-quantity-link')
  .forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId
        removeFromCart(productId)
        
        const container = document.querySelector(`.js-cart-container-${productId}`)
        container.remove()
        updateCartQuantity()
    })
  })

function updateCartQuantity() {
  document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`
}


document.querySelectorAll('.js-update-quantity-link')
  .forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId
      console.log(productId)
      document.querySelector(`.js-cart-container-${productId}`).classList.add('is-editing-quantity')

      let inputBoxQuantity;
      cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          inputBoxQuantity = cartItem.quantity
        }
      })
      const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`) 
      quantityInputElement.value = inputBoxQuantity

      quantityInputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          saveNewQuantity(updateLink)
        }
      })
    })
  })

document.querySelectorAll('.js-save-quantity-link')
  .forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      saveNewQuantity(saveLink)
    })
  })
  
function saveNewQuantity(saveLink) {
  const productId = saveLink.dataset.productId
  document.querySelector(`.js-cart-container-${productId}`).classList.remove('is-editing-quantity')
  const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value)
  
  if (newQuantity>=0 && newQuantity < 1000) {
    document.querySelector(`.js-validation-text-${productId}`).innerHTML = ""
    updateQuantity(productId, newQuantity)
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity
    updateCartQuantity()
  } else {
    document.querySelector(`.js-validation-text-${productId}`).innerHTML = "Enter a valid quantity"
  }
}

  updateCartQuantity()