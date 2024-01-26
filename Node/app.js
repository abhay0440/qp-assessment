const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
// const { User, Role, sequelize } = require('./models')
const app = express();
const db = require('./db')
const routerPublic = express.Router()
const routerPrivate = express.Router()
const port = 8000
const SECRET_KEY = "secret"
app.use('/app', routerPublic)
app.use('/app', routerPrivate)
routerPublic.use(bodyParser.json());
db.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully!');
        // You can add more initialization code here if needed
    }
});
routerPublic.post('/login', async (req, res) => {
    try {

        let role = await db.query(
            'SELECT role FROM users.users u INNER JOIN "role".userroles r ON u.id = r.userid WHERE r.username = $1 AND r.password = $2',
            [req.body.username, req.body.password]
        );
        role = role.rows[0].role

        if (!role) res.statusCode(401).send("Invalid User/Not Authorised user")
        const data = {
            username: req.body.username,
            password: req.body.password,
            role: role
        }
        const options = {
            expiresIn: '30m'
        }
        let accessToken = jwt.sign(data, SECRET_KEY, options)
        res.status(200).send({
            accessToken: accessToken
        })
    }
    catch (err) {
        res.send(err)
    }
})

routerPublic.get('/inventory/view', verifyuser, async(req, res) => {
    if(!req.userrole) res.send('Not Authorized')
    //'Admin' and normal user both are authorized to use this service
    let view = await db.query(
        'SELECT * FROM inventory.inventorymaster',
    );
    res.status(200).send(view.rows)
})

routerPublic.post('/inventory/add', verifyuser, async (req, res) => {
    try {
      // Check if the user has 'Admin' role
      if (req.userrole !== 'Admin') {
        return res.status(403).send('Not Authorized');
      }
  
      // Extract product details from the request body
      const { productName, quantity, price } = req.body;
  
      // Perform the database call to add product details to inventory table
      const result = await db.query(
        'INSERT INTO inventory.inventorymaster (productid,productname, quantity, price) VALUES (DEFAULT,$1, $2, $3) RETURNING *',
        [productName, quantity, price]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding product to inventory:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  routerPublic.post('/inventory/modify', verifyuser, async (req, res) => {
    try {
      // Check if the user has 'Admin' role
      if (req.userrole !== 'Admin') {
        return res.status(403).send('Not Authorized');
      }
  
      // Extract product details from the request body
      const { productId, quantity, productname } = req.body;

      const result = await db.query(
        'UPDATE inventory.inventorymaster SET quantity = $1, productname = $2 WHERE productid = $3 RETURNING *',
        [quantity, productname, productId]
      );
      
  
      if (result.rows.length === 0) {
        return res.status(404).send('Product not found');
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error modifying product in inventory:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  routerPublic.post('/inventory/delete', verifyuser, async (req, res) => {
    try {
      // Check if the user has 'Admin' role
      if (req.userrole !== 'Admin') {
        return res.status(403).send('Not Authorized');
      }
  
      // Extract product ID from the request body
      const { productId } = req.body;

      const result = await db.query(
        'DELETE FROM inventory.inventorymaster WHERE productid = $1 RETURNING *',
        [productId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('Product not found');
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product from inventory:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  routerPublic.post('/order/create', verifyuser, async(req, res) => {
     if(!req.userrole) res.send('Not Authorized')
     let rejectedOrder=[]  
    
    for(let ele of req.body.orderitems){

        let quantity = await db.query(
            `SELECT quantity FROM inventory.inventorymaster where productid = $1 `, [ele.productid]
        );
        quantity = quantity.rows.length && quantity.rows[0].quantity ? quantity.rows[0].quantity : 0;
        if(quantity < ele.quantity){
            rejectedOrder.push({
                productid : ele.productid,
                rejectreason : "insufficient stock"
            })
        }else{
            let newquantity = quantity - ele.quantity;

            const result = await db.query(
                'UPDATE inventory.inventorymaster SET quantity = $1 WHERE productid = $2 RETURNING *',
                [newquantity, ele.productid]
            );
             
            if (result.rows.length > 0) {
                let createorder = await db.query(
                    'INSERT INTO orders.ordermaster (orderid, "user") VALUES (DEFAULT, $1) RETURNING *',
                    [req.username]
                  );
                  
                let orderid = createorder.rows[0].orderid
                let createorderDetails = await db.query(
                    'INSERT INTO orders.orderdetails (orderid,productid, quantity) VALUES ($1, $2, $3) RETURNING *',
                   [orderid,ele.productid, ele.quantity]
                );

                if(createorderDetails.rows.length == 0){
                    rejectedOrder.push({
                        productid : ele.productid,
                        rejectreason : "Order Creation Failed"
                    })
                }
            }else{
                rejectedOrder.push({
                    productid : ele.productid,
                    rejectreason : "Order Creation Failed, Failed to update stock"
                })
            }
 
        }
     
    }
     if(rejectedOrder.length == 0){
        res.status(201).send("Order created successfully")
     }else{
        res.status(200).send({
            rejected_Orders:rejectedOrder
        })
     }
})
  
function verifyuser(req, res, next) {
    try {
        let validateUser = jwt.verify(req.headers.authorization, SECRET_KEY)
        req.userrole = validateUser.role
        req.username = validateUser.username
        next()
    } catch (err) {
        res.send(err)
    }
}
app.listen(port, () => {
    console.log(`server started at port ${port}`)
})