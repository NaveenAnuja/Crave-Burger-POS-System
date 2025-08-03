document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const subTotalElement = document.getElementById('sub-total');
        const discountElement = document.getElementById('discount-amount');
        const totalElement = document.getElementById('total-price');

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Your cart is empty.';
            emptyMessage.classList.add('text-center', 'text-muted');
            cartItemsContainer.appendChild(emptyMessage);

            subTotalElement.textContent = '0';
            discountElement.textContent = '0';
            totalElement.textContent = '0';
            return;
        }

        let subTotal = 0;
        let discountTotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subTotal += itemTotal;

            const itemDiscount = item.discount ? (itemTotal * item.discount) / 100 : 0;
            discountTotal += itemDiscount;

            const cartItem = document.createElement('div');
            cartItem.classList.add('col-md-12', 'mb-3', 'd-flex', 'justify-content-between', 'align-items-center');

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('d-flex', 'align-items-center');

            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.classList.add('cart-item-image', 'me-3');
            itemImage.style.width = '80px';

            const itemInfo = document.createElement('div');
            const itemName = document.createElement('h5');
            itemName.textContent = item.name;

            const itemPrice = document.createElement('p');
            itemPrice.textContent = `LKR ${item.price} x ${item.quantity} = LKR ${itemTotal.toFixed(2)}`;

            itemInfo.appendChild(itemName);
            itemInfo.appendChild(itemPrice);
            itemDetails.appendChild(itemImage);
            itemDetails.appendChild(itemInfo);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('btn', 'btn-danger');
            removeButton.addEventListener('click', () => removeFromCart(item.code));

            cartItem.appendChild(itemDetails);
            cartItem.appendChild(removeButton);
            cartItemsContainer.appendChild(cartItem);
        });

        const total = subTotal - discountTotal;

        subTotalElement.textContent = subTotal.toFixed(2);
        discountElement.textContent = discountTotal.toFixed(2);
        totalElement.textContent = total.toFixed(2);
    }

    function removeFromCart(itemCode) {
        cart = cart.filter(item => item.code !== itemCode);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    window.completeOrder = function () {
        if (cart.length === 0) {
            Swal.fire({
                title: 'Empty Cart',
                text: 'Your cart is empty. Please add items before checking out.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        window.location.href = 'payments.html';
    };

    displayCartItems();

    document.getElementById('logoutButton').addEventListener('click', function (e) {
        e.preventDefault();

        localStorage.clear();

        Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {

            window.location.href = 'index.html';
        });
    });
});