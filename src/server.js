const { app } = require('./app');
const server = require('http').createServer(app);
require('dotenv').config();
const connectDB = require("./config/db");
const { logger } = require('./helpers/logger');
const { getIpAddress } = require('./utils/getIpAddress');
connectDB();

process.on('uncaughtException', (error) => {
    console.log(error);
    process.exit(1);
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(` App is running at http://localhost:%d in %s mode`, PORT, app.get('env'));
    console.log(` Server is running at:
        - Local: http://localhost:${Number(PORT)}
        - Network: http://${getIpAddress()}:${Number(PORT)} `)
    
    console.log(` Press CTRL-C to stop\n`);
    
    logger.info('Server is running successfully')
});

process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated!');
    });
});