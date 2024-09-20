# E-Commerce API

This is a fully-featured e-commerce backend API built using Node.js and Express.js, with MongoDB as the database. The API provides comprehensive functionalities for user management, product categorization, order processing, and payment integration using Stripe. It also includes secure JWT authentication and stores product images on Cloudinary.


## Features
- **User Management**: Handles user registration, login, order history, wishlist, and shipping addresses. Passwords are securely encrypted using bcrypt.
- **Product Management**: Supports product categorization, brands, colors, and customer reviews. Images are stored securely on Cloudinary.
- **Order Processing**: Facilitates order creation and management, with integrated Stripe payment processing and webhook support for payment confirmation.
- **Authentication**: Secure JWT-based authentication for protected API endpoints.
- **Additional Features**: Includes models for handling discount coupons, reviews, brands, and color options.


## Dependencies
* **Node.js & Express**: Server-side application framework.
* **MongoDB & Mongoose**: Database and ODM for data storage and management.
* **Cloudinary**: For secure image storage.
* **Stripe API**: For payment processing.
* **JWT & Bcrypt**: For user authentication and password hashing.
* **Multer & Multer-Storage-Cloudinary**: For handling file uploads and storing images on Cloudinary.
* **Express-Async-Handler**: For handling asynchronous operations in Express routes.
* **Dotenv**: For managing environment variables.

## Installation
To run this project locally, follow these steps:
1. **Clone the repository:**
   ```bash
   https://github.com/Bhargav-kargatiya/E-commerce-API.git
   ```

2. **Install dependencies:**
   ```bash
   npm install   
   ```
3. **Environment Variables:**
Create a `.env` file in the root of the backend and frontend directories and add the following variables:
     ```bash
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
      ```  
4. **Start the server:**
   ```bash
   npm run server  
   ```
5. **Stripe Webhook Configuration:**
If you are running the API locally and want to test Stripe webhook events, you need to listen to Stripe's webhooks using the following command.This will forward Stripe events to your local server.
    ```bash
        stripe listen --forward-to localhost:<PORT>/webhook 
      ```
      
## API Documentation

For detailed API documentation, including available endpoints and request/response examples, please refer to the [Postman Documentation](https://documenter.getpostman.com/view/36171887/2sA3s3GWBc).


