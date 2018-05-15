const config = {
    port: 3000,
    key: process.env.DB_KEY,
    sql: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,

        pool: {
            acquireTimeoutMillis: 15000
        }
    }
};

module.exports = config;