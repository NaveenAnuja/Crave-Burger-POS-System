class CustomerProfile {
    constructor() {
        this.customerDetails = JSON.parse(localStorage.getItem('customers')) || [];
        this.cardDetails = JSON.parse(localStorage.getItem('cards')) || [];
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];

        this.loggedInCustomer = JSON.parse(localStorage.getItem('currentCustomer'));

        if (!this.loggedInCustomer) {
            Swal.fire("Oops!", "No logged-in customer found.", "error");
            return;
        }

        this.initElements();
        this.loadAllData();
        this.addEventListeners();
    }

    initElements() {
        this.firstNameSpan = document.getElementById('firstName');
        this.lastNameSpan = document.getElementById('lastName');
        this.emailSpan = document.getElementById('email');
        this.citySpan = document.getElementById('city');
        this.streetSpan = document.getElementById('street');
        this.postalCodeSpan = document.getElementById('postalCode');
        this.cardDetailsSection = document.getElementById('card-details-section');
        this.boughtItemsDiv = document.getElementById('bought-items');
        this.itemSelect = document.getElementById('itemSelect');
        this.reviewText = document.getElementById('reviewText');
        this.reviewForm = document.getElementById('reviewForm');
        this.editDetailsBtn = document.getElementById('editDetailsBtn');
        this.addCardDetailsBtn = document.getElementById('addCardDetailsBtn');
        this.logoutButton = document.getElementById('logoutButton');
    }

    loadAllData() {
        this.displayCustomerDetails();
        this.displayCardDetails();
        this.displayBoughtItems();
        this.loadCartItemsToDropdown();
    }

    displayCustomerDetails() {
        const c = this.loggedInCustomer;
        this.firstNameSpan.textContent = c.firstName || '';
        this.lastNameSpan.textContent = c.lastName || '';
        this.emailSpan.textContent = c.email || '';
        this.citySpan.textContent = c.city || '';
        this.streetSpan.textContent = c.street || '';
        this.postalCodeSpan.textContent = c.postalCode || '';
    }

    displayCardDetails() {
        this.cardDetailsSection.innerHTML = '';
        const customerCards = this.cardDetails.filter(card => card.customerId === this.loggedInCustomer.id);

        if (customerCards.length === 0) {
            this.cardDetailsSection.innerHTML = "<p>No card details saved.</p>";
            return;
        }

        customerCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('mb-3', 'p-3', 'bg-secondary', 'rounded', 'text-white');
            cardElement.innerHTML = `
        <p><strong>Card Name:</strong> ${card.cardName}</p>
        <p><strong>Card Number:</strong> ${card.cardNumber}</p>
        <p><strong>Expiry Date:</strong> ${card.expiryDate}</p>
        <button class="btn btn-danger btn-sm">Remove Card</button>
      `;
            // Add remove event
            cardElement.querySelector('button').addEventListener('click', () => this.removeCard(card.id));
            this.cardDetailsSection.appendChild(cardElement);
        });
    }

    displayBoughtItems() {
        const customerOrders = this.orders.filter(order => order.customerId === this.loggedInCustomer.id);
        this.boughtItemsDiv.innerHTML = '';

        if (customerOrders.length === 0) {
            this.boughtItemsDiv.innerHTML = "<p>You haven't purchased anything yet.</p>";
            return;
        }

        customerOrders.forEach(order => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<h5>Item: ${order.itemName}</h5><p>Price: ${order.price} LKR</p>`;
            this.boughtItemsDiv.appendChild(itemDiv);
        });
    }

    loadCartItemsToDropdown() {
        this.itemSelect.innerHTML = '<option value="" disabled selected hidden>Select a cart item</option>';

        if (this.cart.length === 0) {
            return;
        }

        this.itemSelect.style.color = 'gray';

        this.cart.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            this.itemSelect.appendChild(option);
        });

        this.itemSelect.addEventListener('change', function () {
            if (this.value === "") {
                this.style.color = 'gray';
            } else {
                this.style.color = 'black';
            }
        });

        this.cart.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = `${item.name} (x${item.quantity || 1})`;
            this.itemSelect.appendChild(option);
        });
    }

    addEventListeners() {
        this.editDetailsBtn.addEventListener('click', () => this.editDetails());
        this.addCardDetailsBtn.addEventListener('click', () => this.addCardDetails());
        this.reviewForm.addEventListener('submit', e => this.handleReviewSubmit(e));
        this.logoutButton.addEventListener('click', e => this.logout(e));
    }

    editDetails() {
        const updatedFirstName = prompt("Edit First Name:", this.loggedInCustomer.firstName);
        const updatedLastName = prompt("Edit Last Name:", this.loggedInCustomer.lastName);
        const updatedCity = prompt("Edit City:", this.loggedInCustomer.city);
        const updatedStreet = prompt("Edit Street:", this.loggedInCustomer.street);
        const updatedPostalCode = prompt("Edit Postal Code:", this.loggedInCustomer.postalCode);

        if (updatedFirstName) this.loggedInCustomer.firstName = updatedFirstName;
        if (updatedLastName) this.loggedInCustomer.lastName = updatedLastName;
        if (updatedCity) this.loggedInCustomer.city = updatedCity;
        if (updatedStreet) this.loggedInCustomer.street = updatedStreet;
        if (updatedPostalCode) this.loggedInCustomer.postalCode = updatedPostalCode;

        const index = this.customerDetails.findIndex(c => c.id === this.loggedInCustomer.id);
        if (index !== -1) {
            this.customerDetails[index] = this.loggedInCustomer;
            localStorage.setItem('customers', JSON.stringify(this.customerDetails));
            localStorage.setItem('currentCustomer', JSON.stringify(this.loggedInCustomer));
            Swal.fire("Success!", "Your details were updated.", "success");
        }

        this.displayCustomerDetails();
    }

    addCardDetails() {
        const cardName = prompt("Enter Card Name:");
        const cardNumber = prompt("Enter Card Number:");
        const expiryDate = prompt("Enter Expiry Date (MM/YY):");
        const cvc = prompt("Enter CVC:");

        if (!cardName || !cardNumber || !expiryDate || !cvc) {
            Swal.fire("Error", "All card details are required!", "error");
            return;
        }

        if (cardNumber.length < 12 || cardNumber.length > 19) {
            Swal.fire("Error", "Card number seems invalid!", "error");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            Swal.fire("Error", "Expiry Date must be in MM/YY format!", "error");
            return;
        }

        const [monthStr, yearStr] = expiryDate.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            Swal.fire("Error", "Expiry date cannot be in the past!", "error");
            return;
        }

        const newCard = {
            id: Date.now(),
            customerId: this.loggedInCustomer.id,
            cardName,
            cardNumber,
            expiryDate,
            cvc
        };

        this.cardDetails.push(newCard);
        localStorage.setItem('cards', JSON.stringify(this.cardDetails));
        Swal.fire("Success!", "Card added successfully.", "success");
        this.displayCardDetails();
    }


    removeCard(cardId) {
        if (confirm("Are you sure you want to remove this card?")) {
            this.cardDetails = this.cardDetails.filter(card => card.id !== cardId);
            localStorage.setItem('cards', JSON.stringify(this.cardDetails));
            Swal.fire("Deleted!", "Your card has been removed.", "success");
            this.displayCardDetails();
        }
    }

    handleReviewSubmit(e) {
        e.preventDefault();

        const selectedItem = this.itemSelect.value;
        const review = this.reviewText.value.trim();

        if (!selectedItem) {
            Swal.fire("Error", "Please select a cart item to review.", "error");
            return;
        }

        if (!review) {
            Swal.fire("Error", "Please write your review.", "error");
            return;
        }

        this.reviews.push({
            customerId: this.loggedInCustomer.id,
            itemName: selectedItem,
            review
        });

        localStorage.setItem('reviews', JSON.stringify(this.reviews));
        Swal.fire("Thank you!", "Your review was submitted successfully!", "success");
        this.reviewForm.reset();
    }

    logout(e) {
        e.preventDefault();
        localStorage.removeItem('currentCustomer');
        Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = 'index.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CustomerProfile();
});
