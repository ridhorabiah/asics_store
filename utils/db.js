import mysql from 'mysql2/promise';


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "asics_store",
    port: 3306
});

export default pool;
