require('dotenv').config();

module.exports = {
  "migrationsDirectory": "Migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL
}
