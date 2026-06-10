// Simple localStorage-based cart service
const CART_KEY = "shopmart_cart_v1";

function normalizeCart(cart) {
  return cart.map((item) => {
    const size = item.size || null
    const key = item.key || (size ? `${item.id}-${size}` : `${item.id}`)
    return {
      ...item,
      key,
      size,
      productId: item.productId || item.id,
    }
  })
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    const cart = raw ? JSON.parse(raw) : []
    return normalizeCart(cart)
  } catch (e) {
    return []
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  } catch (e) {
    // ignore
  }
}

export function addItem(product, quantity = 1, size) {
  const cart = getCart()
  const itemKey = size ? `${product.id}-${size}` : `${product.id}`
  const idx = cart.findIndex((i) => i.key === itemKey)

  if (idx >= 0) {
    cart[idx].quantity = Math.min(99, cart[idx].quantity + quantity)
  } else {
    const cartItem = {
      key: itemKey,
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    }
    if (size) {
      cartItem.size = size
    }
    cart.push(cartItem)
  }

  saveCart(cart)
}

export function updateQuantity(itemKey, quantity) {
  const cart = getCart()
  const idx = cart.findIndex((i) => i.key === itemKey)
  if (idx >= 0) {
    if (quantity <= 0) {
      cart.splice(idx, 1)
    } else {
      cart[idx].quantity = Math.min(99, quantity)
    }
    saveCart(cart)
  }
}

export function removeItem(itemKey) {
  const cart = getCart().filter((i) => i.key !== itemKey)
  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export default { getCart, addItem, updateQuantity, removeItem, clearCart };
