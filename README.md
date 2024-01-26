![image](https://github.com/abhay0440/qp-assessment/assets/52811391/87a7556f-cb0f-4652-9084-89b568f4b8e7)# qp-assessment
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
![login](https://github.com/abhay0440/qp-assessment/assets/52811391/5a644601-d869-4d40-889e-a786c4812e15)

Admin User:

    Username : Abhay
    Password : password
    
Normal User: (Inventory create,modify and delete Access is not given for normal user)

    Username : Akash
    Password : password


Endpoint: POST curl -X POST http://localhost:8000/app/orders/create \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>' \
    -d '{
    "orderItems": [
        {"productId": 4, "quantity": 2},
        {"productId": 2, "quantity": 5}
    ]
}'

![createorder](https://github.com/abhay0440/qp-assessment/assets/52811391/570a40c3-6c48-405e-be31-9e2554eaf78e)

Endpoint: GET /
View Inventory Items:
curl http://localhost:8000/app/inventory/view \
    -H 'Content-Type: application/json' \
    -H 'Authorization: <your_token_here>'

![inventoryview](https://github.com/abhay0440/qp-assessment/assets/52811391/d0b5f115-5b42-47f6-97b8-a04ffde9324b)

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
