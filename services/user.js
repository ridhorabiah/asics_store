import bcrypt from "bcrypt";

import pool from "../utils/db.js";
import { handleErrorResponse, handleSuccessResponse } from "../utils/response.js";


export const getUsers = async (request, response, next) => {
    try {
        const query = "SELECT * FROM users";
        const [rows] = await pool.query(query);
    
        if (rows.length > 0) {
            const msg = "Users data retrieved successfully";
            handleSuccessResponse(response, 200, msg, rows);
        } else {
            response.status(204).end();
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        next(error);
    }
}

export const createUser = async (request, response, next) => {
    try {
        const { name, email, password } = request.body;
        let createdAt = new Date();
        const saltRound = 10;
        bcrypt.hash(password, saltRound, async (error, hashedPass) => {
            const values = [name, email, hashedPass, createdAt];
            const query = "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)";
            const [rows] = await pool.query(query, values);
    
            if (rows.insertId > 0) {
                const createdUser = {
                    id: rows.insertId,
                    name,
                    email,
                    password: hashedPass,
                    created_at: createdAt
                };
                const msg = "User data created successfully";
                handleSuccessResponse(response, 201, msg, createdUser, `localhost:8080/users/${createdUser.id}`);
            } else {
                handleErrorResponse(response, 400, "Failed to create user data");
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        next(error);
    }
}

export const getUser = async (request, response, next) => {
    try {
        let id = request.params.id;
        const query = "SELECT * FROM users WHERE id=?";
        const values = [id];
        const [rows] = await pool.query(query, values);

        if (rows.length > 0) {
            const user = rows[0];
            const msg = "User data retrieved successfully";
            handleSuccessResponse(response, 200, msg, user);
        } else {
            handleErrorResponse(response, 404, "User not found");
        }
    } catch {
        console.error("Error fetching user:", error);
        next(error);
    }
}

export const updateUser = async (request, response, next) => {
    try {
        let id = request.params.id;
        const { name, email } = request.body;
        let updatedAt = new Date();
        
        const query = "UPDATE users SET name=?, email=?, updated_at=? WHERE id=?";
        const values = [name, email, updatedAt, id];
        const [rows] = await pool.query(query, values);

        if (rows.affectedRows > 0) {
            const query = "SELECT name, email, updated_at FROM users WHERE id=?";
            const [updatedUser] = await pool.query(query, id);
            handleSuccessResponse(response, 200, "User Data updated successfully", updatedUser[0]);
        }  else {
            handleErrorResponse(response, 400, "Failed to update user data");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        next(error);
    }
}

export const deleteUser = async (request, response, next) => {
    try {
        let id = request.params.id;
        const query = "DELETE FROM users WHERE id=?";
        const values = [id];
        const [rows] = await pool.query(query, values);

        if (rows.affectedRows > 0) {
            response.status(204).end();
        } else {
            handleErrorResponse(response, 400, "Failed to delete the user.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        next(error);
    }
}
