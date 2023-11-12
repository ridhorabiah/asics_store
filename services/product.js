import pool from "../utils/db.js";
import { handleErrorResponse, handleSuccessResponse } from "../utils/response.js";


export const getProducts = async (request, response, next) => {
    try {
        const query = "SELECT * FROM products";
        const [rows] = await pool.query(query);
    
        if (rows.length > 0) {
            const msg = "Products data retrieved successfully";
            handleSuccessResponse(response, 200, msg, rows);
        } else {
            response.status(204).end();
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        next(error);
    }
}

export const createProduct = async (request, response, next) => {
    try {
        const { name, description, category, price } = request.body;
        let createdAt = new Date();
        const values = [name, description, category, price, createdAt];
        
        const query = "INSERT INTO products (name, description, category, price, created_at) VALUES (?, ?, ?, ?, ?)";
        const [rows] = await pool.query(query, values);

        if (rows.insertId > 0) {
            const createdProduct = {
                id: rows.insertId,
                name,
                description,
                price,
                category,
                created_at: createdAt
            };
            const msg = "Product data created successfully";
            handleSuccessResponse(response, 201, msg, createdProduct, `localhost:8080/products/${createdProduct.id}`);
        } else {
            handleErrorResponse(response, 400, "Failed to create product data");
        }
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
}

export const getProduct = async (request, response, next) => {
    try {
        let id = request.params.id;
        const query = "SELECT * FROM products WHERE id=?";
        const values = [id];
        const [rows] = await pool.query(query, values);

        if (rows.length > 0) {
            const product = rows[0];
            const msg = "Product data retrieved successfully";
            handleSuccessResponse(response, 200, msg, product);
        } else {
            handleErrorResponse(response, 404, "Product not found");
        }
    } catch {
        console.error("Error fetching product:", error);
        next(error);
    }
}

export const updateProduct = async (request, response, next) => {
    try {
        let id = request.params.id;
        const { name, description, category, price } = request.body;
        let updatedAt = new Date();
        
        const query = "UPDATE products SET name=?, description=?, category=?, price=?, updated_at=? WHERE id=?";
        const values = [name, description, category, price, updatedAt, id];
        const [rows] = await pool.query(query, values);

        if (rows.affectedRows > 0) {
            const query = "SELECT * FROM products WHERE id=?";
            const [updatedProduct] = await pool.query(query, id);
            handleSuccessResponse(response, 200, "Product data updated successfully", updatedProduct[0]);
        }  else {
            handleErrorResponse(response, 400, "Failed to update product data");
        }
    } catch (error) {
        console.error("Error updating product:", error);
        next(error);
    }
}

export const deleteProduct = async (request, response, next) => {
    try {
        let id = request.params.id;
        const query = "DELETE FROM products WHERE id=?";
        const values = [id];
        const [rows] = await pool.query(query, values);

        if (rows.affectedRows > 0) {
            response.status(204).end();
        } else {
            handleErrorResponse(response, 400, "Failed to delete the product.");
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        next(error);
    }
}
