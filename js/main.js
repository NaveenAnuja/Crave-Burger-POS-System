document.addEventListener('DOMContentLoaded', function () {

    const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
    if (currentCustomer && currentCustomer.firstName) {
        const navName = document.getElementById('username');
        navName.innerText = currentCustomer.firstName + ' ' + currentCustomer.lastName;
    } else {
        console.log('No customer is currently logged in.');
    }

    const menuContainer = document.getElementById('menu-items');
    const cartIcon = document.getElementById('cart-icon');
    const cartWindow = document.getElementById('cart-window');
    const cartContent = document.getElementById('cart-content');
    const cartCount = document.getElementById('cart-count');
    const subTotalElement = document.getElementById('sub-total');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    document.getElementById('checkout-button').addEventListener('click', loadOrderPage);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    displayMenu(menuItems);

    function displayMenu(items) {
        menuContainer.innerHTML = '';
        items.forEach(item => {
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-4');

            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = item.image;
            img.classList.add('card-img-top');
            img.alt = item.name;

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const itemName = document.createElement('h5');
            itemName.textContent = item.name;
            itemName.classList.add('card-title');

            const itemPrice = document.createElement('p');
            itemPrice.textContent = `LKR ${item.price}`;
            itemPrice.classList.add('card-text');

            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Cart';
            addButton.classList.add('btn', 'btn-primary');
            addButton.addEventListener('click', function () {
                addToCart(item);
            });

            cardBody.appendChild(itemName);
            cardBody.appendChild(itemPrice);
            cardBody.appendChild(addButton);

            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);

            menuContainer.appendChild(col);
        });
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.code === item.code);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
    }

    function removeFromCart(itemCode) {
        cart = cart.filter(cartItem => cartItem.code !== itemCode);
        updateCart();
    }

    function decreaseQuantity(itemCode) {
        const cartItem = cart.find(cartItem => cartItem.code === itemCode);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(itemCode);
        }
        updateCart();
    }

    function increaseQuantity(itemCode) {
        const cartItem = cart.find(cartItem => cartItem.code === itemCode);
        cartItem.quantity += 1;
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartIcon();
    }

    function renderCart() {
        cartContent.innerHTML = '';

        let subTotal = 0;
        let discount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subTotal += itemTotal;

            const itemDiscount = item.discount ? (itemTotal * item.discount) / 100 : 0;
            discount += itemDiscount;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');

            const itemName = document.createElement('span');
            itemName.textContent = `${item.name} (${item.quantity})`;

            const itemActions = document.createElement('div');
            itemActions.classList.add('item-actions', 'd-flex', 'align-items-center');

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('btn', 'btn-sm', 'btn-success', 'me-2');
            decreaseButton.addEventListener('click', () => decreaseQuantity(item.code));

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
            increaseButton.addEventListener('click', () => increaseQuantity(item.code));

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('btn', 'btn-sm', 'btn-danger');
            removeButton.addEventListener('click', () => removeFromCart(item.code));

            itemActions.appendChild(decreaseButton);
            itemActions.appendChild(increaseButton);
            itemActions.appendChild(removeButton);

            cartItem.appendChild(itemName);
            cartItem.appendChild(itemActions);

            cartContent.appendChild(cartItem);
        });

        subTotalElement.textContent = subTotal.toFixed(2);
        discountElement.textContent = discount.toFixed(2);
        totalElement.textContent = (subTotal - discount).toFixed(2);
    }


    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartIcon.classList.remove('d-none');
        } else {
            cartIcon.classList.add('d-none');
        }
    }

    cartIcon.addEventListener('click', function () {
        cartWindow.classList.toggle('d-none');
    });

    document.getElementById('close-cart').addEventListener('click', function () {
        cartWindow.classList.add('d-none');
    });

    function filterItems(category) {
        let filteredItems = [];
        if (category === 'all') {
            filteredItems = menuItems;
        } else {
            filteredItems = menuItems.filter(item => item.category === category);
        }
        displayMenu(filteredItems);
    }

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterItems(category);
        });
    });

    function loadOrderPage() {
        window.location.href = 'orders.html';
    }

    updateCart();
});


var menuItems = [
    { code: 'B1001', name: 'Classic Burger (Large)', category: 'burgers', price: 750, image: 'images/items/classic_burger.png' },
    { code: 'B1002', name: 'Classic Burger (Regular)', category: 'burgers', price: 1500, discount: 15, image: 'images/items/classic_burger.png' },
    { code: 'B1003', name: 'Turkey Burger', category: 'burgers', price: 1600, image: 'images/items/turkey_burger.png' },
    { code: 'B1004', name: 'Chicken Burger (Large)', category: 'burgers', price: 1400, image: 'images/items/chicken_burger.png' },
    { code: 'B1005', name: 'Chicken Burger (Regular)', category: 'burgers', price: 800, discount: 20, image: 'images/items/chicken_burger.png' },
    { code: 'B1006', name: 'Cheese Burger (Large)', category: 'burgers', price: 1000, image: 'images/items/cheese_burger.png' },
    { code: 'B1007', name: 'Cheese Burger (Regular)', category: 'burgers', price: 600, image: 'images/items/cheese_burger.png' },
    { code: 'B1008', name: 'Bacon Burger', category: 'burgers', price: 650, discount: 15, image: 'images/items/bacon_burger.png' },
    { code: 'B1009', name: 'Shawarma Burger', category: 'burgers', price: 800, image: 'images/items/shawarma_burger.png' },
    { code: 'B1010', name: 'Olive Burger', category: 'burgers', price: 1800, image: 'images/items/olive_burger.png' },
    { code: 'B1012', name: 'Double-Cheese Burger', category: 'burgers', price: 1250, discount: 20, image: 'images/items/double_cheese_burger.png' },
    { code: 'B1013', name: 'Crispy Chicken Burger (Regular)', category: 'burgers', price: 1200, image: 'images/items/crispy_chicken_burger.png' },
    { code: 'B1014', name: 'Crispy Chicken Burger (Large)', category: 'burgers', price: 1600, discount: 10, image: 'images/items/crispy_chicken_burger.png' },
    { code: 'B1015', name: 'Paneer Burger', category: 'burgers', price: 900, image: 'images/items/paneer_burger.png' },

    { code: 'B1016', name: 'Crispy Chicken Submarine (Large)', category: 'submarines', price: 2000, image: 'images/items/crispy_chicken_submarine.png' },
    { code: 'B1017', name: 'Crispy Chicken Submarine (Regular)', category: 'submarines', price: 1500, image: 'images/items/crispy_chicken_submarine.png' },
    { code: 'B1018', name: 'Chicken Submarine (Large)', category: 'submarines', price: 1800, discount: 3, image: 'images/items/chicken_submarine.png' },
    { code: 'B1019', name: 'Chicken Submarine (Regular)', category: 'submarines', price: 1400, image: 'images/items/chicken_submarine.png' },
    { code: 'B1020', name: 'Grinder Submarine', category: 'submarines', price: 2300, image: 'images/items/grinder_submarine.png' },
    { code: 'B1021', name: 'Cheese Submarine', category: 'submarines', price: 2200, image: 'images/items/cheese_submarine.png' },
    { code: 'B1022', name: 'Double Cheese n Chicken Submarine', category: 'submarines', price: 1900, discount: 16, image: 'images/items/double_cheese_n_chicken_submarine.png' },
    { code: 'B1023', name: 'Special Horgie Submarine', category: 'submarines', price: 2800, image: 'images/items/special_horgie_submarine.png' },
    { code: 'B1024', name: 'MOS Special Submarine', category: 'submarines', price: 3000, image: 'images/items/mos_special_submarine.png' },

    { code: 'B1025', name: 'Steak Fries (Large)', category: 'fries', price: 1200, image: 'images/items/steak_fries.png' },
    { code: 'B1026', name: 'Steak Fries (Medium)', category: 'fries', price: 600, image: 'images/items/steak_fries.png' },
    { code: 'B1027', name: 'French Fries (Large)', category: 'fries', price: 800, image: 'images/items/french_fries.png' },
    { code: 'B1028', name: 'French Fries (Medium)', category: 'fries', price: 650, image: 'images/items/french_fries.png' },
    { code: 'B1029', name: 'French Fries (Small)', category: 'fries', price: 450, image: 'images/items/french_fries.png' },
    { code: 'B1030', name: 'Sweet Potato Fries (Large)', category: 'fries', price: 600, image: 'images/items/sweet_potato_fries.png' },

    { code: 'B1031', name: 'Chicken n Cheese Pasta', category: 'pasta', price: 1600, discount: 15, image: 'images/items/chicken_n_cheese_pasta.png' },
    { code: 'B1032', name: 'Chicken Penne Pasta', category: 'pasta', price: 1700, image: 'images/items/chicken_penne_pasta.png' },
    { code: 'B1033', name: 'Ground Turkey Pasta Bake', category: 'pasta', price: 2900, discount: 10, image: 'images/items/ground_turkey_pasta_bake.png' },
    { code: 'B1034', name: 'Creamy Shrimp Pasta', category: 'pasta', price: 2000, image: 'images/items/creamy_shrimp_pasta.png' },
    { code: 'B1035', name: 'Lemon Butter Pasta', category: 'pasta', price: 1950, image: 'images/items/lemon_butter_pasta.png' },
    { code: 'B1036', name: 'Tagliatelle Pasta', category: 'pasta', price: 2400, discount: 1, image: 'images/items/tagliatelle_pasta.png' },
    { code: 'B1037', name: 'Baked Ravioli', category: 'pasta', price: 2000, discount: 1, image: 'images/items/baked_ravioli.png' },

    { code: 'B1038', name: 'Fried Chicken (Small)', category: 'chicken', price: 1200, image: 'images/items/fried_chicken.png' },
    { code: 'B1039', name: 'Fried Chicken (Regular)', category: 'chicken', price: 2300, discount: 10, image: 'images/items/fried_chicken.png' },
    { code: 'B1040', name: 'Fried Chicken (Large)', category: 'chicken', price: 3100, discount: 5, image: 'images/items/fried_chicken.png' },
    { code: 'B1041', name: 'Hot Wings (Large)', category: 'chicken', price: 2400, image: 'images/items/hot_wings.png' },
    { code: 'B1042', name: 'Devilled Chicken (Large)', category: 'chicken', price: 900, image: 'images/items/devilled_chicken.png' },
    { code: 'B1043', name: 'BBQ Chicken (Regular)', category: 'chicken', price: 2100, image: 'images/items/bbq_chicken.png' },

    { code: 'B1044', name: 'Pepsi (330ml)', category: 'beverages', price: 990, discount: 5, image: 'images/items/pepsi.png' },
    { code: 'B1045', name: 'Coca-Cola (330ml)', category: 'beverages', price: 1230, image: 'images/items/coca_cola.png' },
    { code: 'B1046', name: 'Sprite (330ml)', category: 'beverages', price: 1500, discount: 3, image: 'images/items/sprite.png' },
    { code: 'B1047', name: 'Mirinda (330ml)', category: 'beverages', price: 850, discount: 7, image: 'images/items/mirinda.png' }
];

let customerName = '';

function setCurrentCustomerDetails() {
    const currentCustomer = JSON.parse(localStorage.getItem('currentCustomer'));
    
    if (currentCustomer) {
        customerName = currentCustomer.firstName + ' ' + currentCustomer.lastName;
    } else {
        console.log('No customer is currently logged in.');
    }
}

document.getElementById('logoutButton').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentCustomer');
    window.location.href = 'login.html';
});