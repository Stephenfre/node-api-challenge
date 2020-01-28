const express = require('express')
const helmet = require('helmet');
const server = express();
const morgan = require('morgan')
const actionRouter = require('./routers/actionRouters.js')
const projectRouter = require('./routers/projectRouters.js')


const middleware = [express.json(), helmet(), morgan('dev'), logger];
server.use(middleware);

server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)



server.get('/', (req, res, next) => {
    res.send(`
    <p>Welcome Stephen to the Sprint1 API</p>
    `);
});

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from {req.get('Origin')}`);
    next();
}

module.exports = server;