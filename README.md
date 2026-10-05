# K-Bites Online Food Ordering System 🥢

K-Bites is a full-stack e-commerce web application designed to act as the digital storefront for a local Korean food cloud kitchen. Built for a Web Development performance task, this system upgrades a manual, chat-based ordering process into a fully automated platform with dynamic delivery calculations and secure online checkouts.

## 🚀 Core Features

The system is divided into two main environments to separate the shopping experience from store management:

### Customer Portal
* **Menu Browsing & Smart Cart:** Users can browse categorized Korean dishes, add items to their cart, and track their total in real-time.
* **User Authentication:** Secure registration and login system. Customers must create an account to access the checkout flow.
* **Order Tracking:** Users can view their current order status (Pending, Paid, Preparing, Out for Delivery).

### Admin Dashboard
* **Menu Management:** A private portal where the store owner can easily add new menu items, update prices, and mark dishes as "sold out."
* **Order Fulfillment:** Admins can view incoming paid orders and update their statuses for the customers to see.

## 🧩 Technical Integrations (Rubric Requirements)

This project successfully implements the three core technical requirements:

1. **Secure Authentication (`bcrypt`)**
   * All user passwords are encrypted using `bcrypt` hashing before being saved to the database.
   * Session control ensures that only authenticated users can access protected routes like the checkout page or admin dashboard.
2. **External Mapping API (Mapbox)**
   * Integrates the Mapbox Matrix API to calculate the exact driving distance between the cloud kitchen and the customer's delivery address.
   * Dynamically generates a fair, per-kilometer delivery fee without reloading the page.
3. **Online Payments (PayMongo)**
   * Utilizes the PayMongo Test API to process simulated e-commerce transactions.
   * Generates secure checkout sessions and accepts test credit cards and GCash payments.
   * Automatically updates database order statuses from "Pending" to "Paid" upon a successful webhook response.

## 💻 Tech Stack

* **Frontend:** HTML, CSS, JavaScript (React / Bootstrap)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (or MySQL)
* **Security:** dotenv (for environment variables), input sanitization

## 🛠️ Getting Started (Local Development)

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Sungjoon011/K-Bites.git](https://github.com/Sungjoon011/K-Bites.git)
   cd K-Bites