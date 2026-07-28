import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fileconverter',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
})

// Auto-initialize schema on load
let schemaInitPromise = null

async function initSchema() {
  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.warn('Schema file not found at:', schemaPath)
      return
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    
    // Split SQL by semicolons at the end of statements
    // We filter out comments and empty statements
    const statements = schemaSql
      .split(/;\s*(?:\r?\n|$)/)
      .map(statement => statement.trim())
      .filter(statement => {
        if (!statement) return false
        // Remove SQL comment lines
        const lines = statement.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('--'))
        return lines.length > 0
      })

    const connection = await pool.getConnection()
    try {
      for (const statement of statements) {
        // Strip out inline/block comments within the statement
        const cleanStatement = statement
          .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
          .split('\n')
          .filter(line => !line.trim().startsWith('--')) // remove single-line comments
          .join('\n')
          .trim()

        if (cleanStatement) {
          await connection.query(cleanStatement)
        }
      }
      console.log('Database schema verified/created successfully.')
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Failed to auto-initialize database schema:', error)
  }
}

// Function to ensure schema is initialized before executing queries
async function ensureSchema() {
  if (!schemaInitPromise) {
    schemaInitPromise = initSchema()
  }
  return schemaInitPromise
}

// Start schema initialization in the background on module load
ensureSchema()

export default pool

export async function query(sql, params = []) {
  await ensureSchema()
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params)
  return rows[0] || null
}

export async function insert(sql, params = []) {
  await ensureSchema()
  const [result] = await pool.execute(sql, params)
  return { insertId: result.insertId, affectedRows: result.affectedRows }
}

export async function update(sql, params = []) {
  await ensureSchema()
  const [result] = await pool.execute(sql, params)
  return { affectedRows: result.affectedRows, changedRows: result.changedRows }
}

export async function transaction(callback) {
  await ensureSchema()
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
