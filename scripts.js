// 全局数组存储当前过滤后的产品
var currentFilteredProducts = [];

// 存储购物车中的产品列表
var cart = [];

// 确保你的DOM已经加载完毕
document.addEventListener('DOMContentLoaded', function () {
  // 找到你的按钮并添加点击事件
  document.querySelector('.about-us-btn').addEventListener('click', function() {
    // 显示一个包含静态文本的alert弹窗
    alert("We are students from TEAM 20 in COMP208. Our website is used to obtain the lowest product prices from major UK supermarket online shopping platforms.");
  });
});

// 使用AJAX从后端获取产品数据，并在前端进行展示
function searchProducts() {
  var query = document.getElementById('searchQuery').value.toLowerCase();
  var mode = document.getElementById('searchMode').value; 
  var searchResults = document.getElementById('searchResults');

  searchResults.innerHTML = '';
  searchResults.style.display = 'none';

  if (query.trim() === '') {
    return;
  }

  // 基于选定的模式构建对应的URL
  var modePath = '';
  switch (mode) {
    case 'solid':
      modePath = 'fetch_products_solid.php';
      break;
    case 'liquid':
      modePath = 'fetch_products.php';
      break;
    case 'item':
      modePath = 'fetch_products_item.php';
      break;
    default:
        modePath = 'fetch_products.php';
  }


  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      currentFilteredProducts = JSON.parse(xhr.responseText);
      var filteredProducts = currentFilteredProducts.filter(product => product.name.toLowerCase().includes(query));
      filteredProducts.sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
      var topProducts = filteredProducts.slice(0, 4);

      searchResults.innerHTML = topProducts.map(product => {
        return `<div class="product-container">
                  <span class="product-name">${product.name}</span>
                  - <span class="product-price">£${parseFloat(product.price).toFixed(2)}</span>,
                  <span class="product-marketname">${product.marketname}</span>
                  <button class="add-button" data-name="${product.name}" data-price="${product.price}" data-marketname="${product.marketname}" onclick="addToCart(this)">Add</button>
                </div>`;
      }).join('');
      searchResults.style.display = 'block';
    } else {
      searchResults.innerHTML = "<p>No products found that match your search criteria.</p>";
      searchResults.style.display = 'block';
    }
  };
  xhr.open('GET', modePath + '?keyword=' + encodeURIComponent(query), true);
  xhr.send();
}

// 添加产品到购物车的函数
function addToCart(button) {
  var name = button.getAttribute('data-name');
  var price = parseFloat(button.getAttribute('data-price'));
  var marketname = button.getAttribute('data-marketname');

  // 创建商品唯一标识符，例如商品名和市场名的组合
  var productKey = `${name}-${marketname}`;

  // 检查该商品是否已在购物车中
  if (cart[productKey]) {
    // 如果已存在，则增加其数量
    cart[productKey].quantity += 1;
  } else {
    // 如果不存在，则添加到购物车
    cart[productKey] = {
      name: name,
      price: price,
      marketname: marketname,
      quantity: 1 // 新商品的初始数量为1
    };
  }
  updateCart();
}

// 从购物车中移除产品的函数
function removeFromCart(productKey) {
  // 减少商品的数量或从购物车中完全移除
  if (cart[productKey].quantity > 1) {
    cart[productKey].quantity -= 1;
  } else {
    delete cart[productKey];
  }
  updateCart();
}

// 切换购物车显示状态的函数
function toggleCart() {
  var cartItems = document.getElementById('cartItems');
  cartItems.classList.toggle('cart-items-hidden');
}

// 清空购物车的函数
function removeAllItems(event) {
  event.stopPropagation();
  cart = {};
  updateCart();
}

// 更新购物车显示的函数
function updateCart() {
  var cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = Object.values(cart).map((item, index) => {
    // 商品的唯一标识符
    var productKey = `${item.name}-${item.marketname}`;
    return `<li>
              ${item.name} - £${parseFloat(item.price).toFixed(2)}, ${item.marketname}
              (Quantity: ${item.quantity}) <!-- 显示数量 -->
              <button class='remove-button' onclick='removeFromCart("${productKey}")'>remove</button>
            </li>`;
  }).join('');

  // 计算总价格
  var totalPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('totalPrice').textContent = `£${totalPrice.toFixed(2)}`;
}   