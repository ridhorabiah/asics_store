import pool from "../utils/db.js";
import { handleErrorResponse, handleSuccessResponse } from "../utils/response.js";


export const getOrders = async (request, response, next) => {
    try {
        const query = "SELECT * FROM orders";
        const [rows] = await pool.query(query);
    
        if (rows.length > 0) {
            const msg = "Orders data retrieved successfully";
            handleSuccessResponse(response, 200, msg, rows);
        } else {
            response.status(204).end();
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        next(error);
    }
};

export const createOrder = async (request, response, next) => {
    const connection = await pool.getConnection();

    try {
        const { user_id, status, items } = request.body;
        await connection.beginTransaction();

        const orderQuery = "INSERT INTO orders (user_id, status) VALUES (?, ?)";
        const orderValues = [user_id, status];
        const [orderResult] = await pool.query(orderQuery, orderValues);
        const orderId = orderResult.insertId;

        // Masukkan item pesanan ke tabel order_items
        const itemInsertPromises = items.map(async (item) => {
            const { product_id, quantity } = item;

            // Ambil harga dari produk
            const getPriceQuery = "SELECT price FROM products WHERE id=?";
            const [priceResult] = await pool.query(getPriceQuery, [product_id]);
            const price_per_unit = priceResult[0].price;

            // Insert ke tabel order_items dengan nilai harga dari produk
            const itemQuery = "INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)";
            const itemValues = [orderId, product_id, quantity, price_per_unit];
            await pool.query(itemQuery, itemValues);

            // Hitung subtotal untuk setiap item
            const subtotal = quantity * price_per_unit;

            // Return nilai subtotal untuk dihitung total_price
            return subtotal;
        });

        // Tunggu hingga semua item diinsert sebelum menghitung total_price
        const subtotals = await Promise.all(itemInsertPromises);

        // Hitung total_price
        const total_price = subtotals.reduce((acc, subtotal) => acc + subtotal, 0);

        // Update total_price di tabel orders
        const updateTotalPriceQuery = "UPDATE orders SET total_price=? WHERE id=?";
        await pool.query(updateTotalPriceQuery, [total_price, orderId]);

        await connection.commit();

        const responseData = {
            order_id: orderId,
            user_id: user_id,
            status: status,
            total_price: total_price,
            items: items
        };

        handleSuccessResponse(response, 201, "Order created successfully", responseData);
    } catch (error) {
        // Rollback transaksi jika ada kesalahan
        await connection.rollback();

        console.error("Error creating order:", error);
        next(error);
    } finally {
        connection.release();
    }
};
