import express from 'express';
import * as ProductService from './services/product.js';
import * as UserService from './services/user.js';
import * as OrderService from './services/order.js';


const app = express();
const port = 8080;
const host = 'localhost';
app.use(express.json());

app.get('/shoes', ProductService.getProducts);
app.post('/shoes', ProductService.createProduct);
app.get('/shoes/:id', ProductService.getProduct);
app.put('/shoes/:id', ProductService.updateProduct);
app.delete('/shoes/:id', ProductService.deleteProduct);

app.get('/users', UserService.getUsers);
app.post('/users', UserService.createUser);
app.get('/users/:id', UserService.getUser);
app.put('/users/:id', UserService.updateUser);
app.delete('/users/:id', UserService.deleteUser);

app.get('/orders', OrderService.getOrders);
app.post('/orders', OrderService.createOrder);

app.listen(port, host, () => {
    console.log(`Server berjalan di http://${host}:${port}`);
});
