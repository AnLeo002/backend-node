const mysql = require("mysql2/promise");
const config = require("../config");

const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0,
  //Para que las fechas y los acentos(ñ,á) viajen correctamente
  charset: "utf8mb4"
}
let conexion;

const pool = mysql.createPool(dbConfig);

// Verificación inicial de conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("[db err] Error al conectar a MySQL:", err.message);
  } else {
    console.log("BD conectada exitosamente mediante Pool");
    connection.release(); // Libera la conexión de prueba
  }
});
async function todos(tabla) {
  try {
    // mysql2 devuelve un arreglo donde la posición [0] contiene los resultados (rows)
    const [rows] = await pool.query(`SELECT * FROM ${tabla}`);
    return rows;
  } catch (error) {
    console.error(`Error al consultar la tabla ${tabla}:`, error.message);
    throw error;
  }
} 
async function uno(tabla,id){
    try {
    // Usamos el signo '?' para parametrizar el id de forma segura
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
    // Retornamos solo el objeto encontrado (o null si no existe)
    return rows[0] || null;
  } catch (error) {
    console.error(`Error al consultar la tabla ${tabla}:`, error.message);
    throw error;
  }
}
async function agregar(tabla,data){
    try {
    // Usamos el signo '?' para parametrizar el id de forma segura
    const [result] = await pool.query(
      `INSERT INTO ${tabla} (nombre, apellido, correo) VALUES (?, ?, ?)`,
      [data.nombre, data.apellido, data.correo]
    );
    return result;
  } catch (error) {
    console.error(`Error al consultar la tabla ${tabla}:`, error.message);
    throw error;
  }
}
async function eliminar(tabla,id){
  try {
    // Usamos el signo '?' para parametrizar el id de forma segura
    const [result] = await pool.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    // Retornamos solo el objeto encontrado (o null si no existe)
    return result;
  } catch (error) {
    console.error(`Error al consultar la tabla ${tabla}:`, error.message);
    throw error;
  }
}

module.exports ={
  todos,
  uno,
  agregar,
  eliminar
}