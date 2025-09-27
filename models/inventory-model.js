const pool = require("../database/")

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await pool.query(sql);
    return result.rows; // Asegúrate de retornar result.rows, no result
  } catch (error) {
    console.error("Error in getClassifications:", error);
    return []; // Retornar array vacío en caso de error
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
/* ***************************
 *  Get inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE classification_id = $1 ORDER BY inv_make, inv_model"
    const result = await pool.query(sql, [classification_id])
    console.log(`getInventoryByClassificationId: Found ${result.rows.length} vehicles for classification ${classification_id}`)
    return result.rows
  } catch (error) {
    console.error("Error in getInventoryByClassificationId:", error)
    return []
  }
}


/* ***************************
 *  Get vehicle by inventory id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0] // single vehicle
  } catch (error) {
    console.error("getVehicleById error " + error)
  }
}

/* ***************************
 *  Add new classification 
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // Retorna el registro insertado
  } catch (error) {
    console.error("Database error in addClassification:", error);
    return "error: " + error.message;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `INSERT INTO inventory (
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    console.log("Ejecutando SQL:", sql)
    console.log("Con datos:", invData)
    
    const result = await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id
    ])
    
    console.log("✅ Inserción exitosa. Filas afectadas:", result.rowCount)
    console.log("📊 Vehículo insertado:", result.rows[0])
    
    return result.rows[0]
    
  } catch (error) {
    console.error("❌ Error en addInventory modelo:", error)
    return "error: " + error.message
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById, 
  addClassification,
  addInventory  
}
