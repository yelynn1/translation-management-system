const logger = require("../utils/logger");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const connectionString = process.env.DB_CONNECTION_STRING || "";
const dbName = process.env.DB_NAME || "";

const client = new MongoClient(connectionString);
let db;

async function connectToDatabase() {
  logger.debug(`Connection string: ${connectionString}`)

  if (db) {
    return db;
  }

  logger.debug("Existing connection not found. Creating a new one...");
  let conn;
  try {
    conn = await client.connect();
  } catch (e) {
    logger.error(e);
  }

  db = conn.db(dbName);
  logger.debug("Database connection established");
  return db;
}

module.exports = {
  connectToDatabase
};

