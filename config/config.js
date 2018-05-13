const config = {
    port: 3000,
    key: 'A7AE7964C08320310421D3629C84C49373FDCF241BED60B9B5466FB6FBE6179F',
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