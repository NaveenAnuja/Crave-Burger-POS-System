document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const subTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalDiscount = cart.reduce((total, item) => {
        const discountAmount = (item.price * item.quantity) * (item.discount / 100 || 0);
        return total + discountAmount;
    }, 0);
    const finalTotal = subTotal - totalDiscount;

    document.getElementById('sub-total').textContent = subTotal.toFixed(2);
    document.getElementById('discount').textContent = totalDiscount.toFixed(2);
    document.getElementById('total-price').textContent = finalTotal.toFixed(2);

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];

        const nextId = paymentHistory.length > 0 ? Math.max(...paymentHistory.map(p => p.id)) + 1 : 1;
        const nextOrderNumber = paymentHistory.length + 1;
        const orderId = `ORD-${String(nextOrderNumber).padStart(4, '0')}`;

        const paymentDate = new Date().toISOString().split('T')[0];

        const paymentRecord = {
            id: nextId,
            date: paymentDate,
            timestamp: new Date().toISOString(),
            orderId: orderId,
            total: finalTotal,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            customer: {
                name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                email: document.getElementById('email').value
            }
        };

        // Save to localStorage
        paymentHistory.push(paymentRecord);
        localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));

        localStorage.removeItem('cart');

        Swal.fire({
            title: 'Payment Successful!',
            html: `
                <p>Your order #${orderId} has been placed successfully.</p>
                <p>Total: LKR ${finalTotal.toFixed(2)}</p>
                <p>You can view your order history in the Reports section.</p>
            `,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = "menu.html";
        });
    });

    const cardNumberInput = document.getElementById('cardNumber');
    const cardIcon = document.getElementById('card-icon');

    const detectCardType = (number) => {
        const cardNumber = number.replace(/\D/g, '');

        if (/^4/.test(cardNumber)) return 'visa';
        if (/^5[1-5]/.test(cardNumber)) return 'master';
        if (/^3[47]/.test(cardNumber)) return 'american-express';
        return 'default';
    };

    if (cardNumberInput && cardIcon) {
        cardNumberInput.addEventListener('input', (e) => {
            const cardType = detectCardType(e.target.value);

            switch (cardType) {
                case 'visa':
                    cardIcon.src = 'images/cards/visa.png';
                    break;
                case 'master':
                    cardIcon.src = 'images/cards/master.png';
                    break;
                case 'american-express':
                    cardIcon.src = 'images/cards/american-express.png';
                    break;
                default:
                    cardIcon.src = 'images/cards/default.png';
            }
        });
    }

    const expiryDateInput = document.getElementById('expiryDate');

    expiryDateInput.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            const month = value.substring(0, 2);
            const year = value.substring(2, 4);

            if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Month',
                    text: 'Please enter a valid month between 01 and 12.'
                });
                e.target.value = '';
                return;
            }

            if (value.length > 2) {
                e.target.value = `${month}/${year}`;
            } else {
                e.target.value = month;
            }
        }
    });

    expiryDateInput.addEventListener('blur', (e) => {
        const [month, year] = e.target.value.split('/');

        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Month',
                text: 'Please enter a valid month between 01 and 12.'
            });
            e.target.value = '';
        }

        const currentYear = new Date().getFullYear() % 100;
        if (year && parseInt(year, 10) < currentYear) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Year',
                text: 'The expiry year cannot be in the past.'
            });
            e.target.value = '';
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function (e) {
        e.preventDefault();

        localStorage.clear();

        Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {

            window.location.href = 'login.html';
        });
    });
});