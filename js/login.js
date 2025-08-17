document.getElementById('showSignup').addEventListener('click', function () {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
});

document.getElementById('showLogin').addEventListener('click', function () {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
});

document.getElementById('dob').addEventListener('change', function () {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    document.getElementById('age').value = age > 0 ? age : '';
});

function generateCustomerId() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const lastCustomer = customers[customers.length - 1];
    if (lastCustomer && typeof lastCustomer.id === 'string') {
        const lastIdNumber = parseInt(lastCustomer.id.slice(1));
        return 'C' + (lastIdNumber + 1).toString().padStart(4, '0');
    } else {
        return 'C0001';
    }
}

document.getElementById('btnSignup').addEventListener('click', function () {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value;
    const age = parseInt(document.getElementById('age').value);
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!firstName || !lastName || !dob || !age || !city || !postalCode || !email || !password || !confirmPassword) {
        swal("Error", "Please fill all the fields!", "error");
        return;
    }

    if (age <= 0) {
        swal("Invalid Age", "Age must be greater than 0!", "error");
        return;
    }

    if (password !== confirmPassword) {
        swal("Password Mismatch", "Passwords do not match!", "warning");
        return;
    }

    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const isEmailTaken = customers.some(cust => cust.email === email);

    if (isEmailTaken) {
        swal("Email Taken", "This email is already registered.", "error");
        return;
    }

    const customer = {
        id: generateCustomerId(),
        firstName,
        lastName,
        dob,
        age,
        city,
        postalCode,
        email,
        password
    };

    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));

    swal("Success", "Signup successful! You can now login.", "success").then(() => {
        document.getElementById('formSignup').reset();
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    });
});

document.getElementById('btnLogin').addEventListener('click', function () {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        swal("Error", "Please enter email and password!", "error");
        return;
    }

    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customer = customers.find(cust => cust.email === email && cust.password === password);

    if (customer) {
        localStorage.setItem('currentCustomer', JSON.stringify(customer));
        swal("Welcome", `Welcome back, ${customer.firstName}!`, "success").then(() => {
            window.location.href = 'menu.html';
        });
    } else {
        swal("Login Failed", "Invalid email or password!", "error");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const eyeIcons = document.querySelectorAll('.eye-icon');

    eyeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = icon.previousElementSibling;

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.innerHTML = '<i class="fa-solid fa-eye"></i>'; 
            } else {
                passwordInput.type = 'password';
                icon.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'; 
            }
        });
    });
});

const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});
