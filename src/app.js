import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import routes from './api';
import logger from './services/logger';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// health end-points
app.get('/status', (req, res) => {
    res.status(200).end();
})
app.head('/status', (req, res) => {
    res.status(200).end();
})

// routes setup
app.use(config.api.prefix, routes());

// mongo setup
mongoose.connect(config.databaseURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

app.listen(config.port, err => {
    if (err) {
        process.exit(1);
        
        return;
    }

    logger.info(`
        ==========================================
                Server listening on port: ${config.port}
        ==========================================
    `)
});

export default app;
