# qp-assessment
This Grocery Booking API is designed to facilitate the interaction between the Admin, who manages the grocery inventory, and Users, who can view the available items and book them. The API is equipped with essential functionalities such as adding, viewing, updating, and removing grocery items, as well as managing inventory levels

API Usage:

    User Login
    Create Order
    View Inventory
    Add Product to Inventory
    Modify Inventory
    Delete Product from Inventory


Roles:
Admin:
Add New Grocery Items:
Login : From this API we get the Access token that we are going to use for Authrization
curl -X POST http://localhost:8000/app/login \
    -H 'Content-Type: application/json' \
    -d '{
    "username":"Akash",
    "password":"password"
}'


Endpoint: POST curl -X POST http://localhost:8000/app/orders/create \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>' \
    -d '{
    "orderItems": [
        {"productId": 4, "quantity": 2},
        {"productId": 2, "quantity": 5}
    ]
}'


Endpoint: GET /
View Inventory Items:
curl http://localhost:8000/app/inventory/view \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>'


Endpoint: DELETE
curl -X POST http://localhost:8000/app/inventory/delete \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>' \


Update Details of Existing Grocery Items: MODIFY
Endpoint: POST
curl -X POST http://localhost:8000/app/inventory/modify \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>' \
    -d '{ "productId": 4, "quantity": 5 }'


Advanced Challenge:
Containerization using Docker:
Dockerfile provided in the repository for building the container.

Relational Database:
Use any relational database of your choice (e.g., MySQL, PostgreSQL).

Tables:

    inventory
    user
    userroles
    ordermaster
    orderdetails
