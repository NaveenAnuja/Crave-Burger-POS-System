
# Crave Burgers 🍔

Crave Burgers is a responsive web-based application designed to offer an intuitive online ordering experience for users. The application allows users to browse the Crave Burgers menu, add items to their cart, and proceed to checkout after signing up or logging in. It also provides options to manage profiles, view order history, and more.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [License](#license)

---

### Features

- **User Authentication**: Users can log in or create an account to access features.
- **Navigation**: Access various tabs, including Home, Menu, Orders, and Profile.
- **Menu Browsing**: View items from Crave Burgers' menu with descriptions and prices.
- **Add to Cart**: Easily add items to the cart using the "Add to Cart" button.
- **Cart Management**: A cart summary button appears at the bottom right, showing net total, discounts, and cart contents.
- **Order Checkout**: Users can proceed to the order page or confirm directly from the cart. 
- **Payment Processing**: Users need to enter card details to confirm and place orders.
- **Logout**: A simple button in the header allows users to securely log out.

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/Crave-burgers.git
   cd Crave-burgers
   ```

2. **Open in Browser**:
   Open the `index.html` file in your browser to run the application locally.

---

### Usage

1. **Sign Up / Log In**: 
   - Access the app by logging in or creating a new account.

2. **Navigating Tabs**: 
   - Use the navigation bar to explore the **Home**, **Menu**, **Orders**, and **Profile** sections.

3. **Adding Items to Cart**:
   - Browse the **Menu** tab and click **Add to Cart** on items you'd like to order.
   - A floating cart summary button will appear on the bottom right with details on total cost, discounts, etc.

4. **Managing Cart**:
   - Click the floating cart button to view or adjust items in the cart.
   - You can proceed to checkout by confirming the items directly from this cart window.

5. **Checkout and Payment**:
   - Access the **Order** tab to review and finalize your cart.
   - Enter card details to complete the order.

6. **Logout**:
   - Use the logout button in the header to exit your account.

---

### Project Structure

```
Crave-burgers/
│
├── html/
│   ├── index.html            # Main HTML file (home page)
│   ├── login.html            # Login page
│   ├── signup.html           # Sign-up page
│   ├── menu.html             # Menu page
│   ├── orders.html           # Orders page
│   └── profile.html          # Profile page
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   ├── login.css         # Styles for login page
│   │   ├── signup.css        # Styles for signup page
│   │   ├── menu.css          # Styles for menu page
│   │   ├── orders.css        # Styles for orders page
│   │   └── profile.css       # Styles for profile page
│   └── images/               # Images for menu items and other assets
│
└── js/
    ├── app.js                # JavaScript for main interactions
    ├── login.js              # JavaScript for login page
    ├── signup.js             # JavaScript for signup page
    ├── menu.js               # JavaScript for menu page
    ├── orders.js             # JavaScript for orders page
    └── profile.js            # JavaScript for profile page
```

---

### Technologies

- **HTML5**
- **CSS3**
- **JavaScript**

---

### License

This project is open-source and available under the MIT License.
