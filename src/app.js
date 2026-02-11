import express from 'express';
import routes from '#routes/index.js';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import securityMiddleware from '#middlewares/security.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(securityMiddleware)

app.get('/', (req, res) => {
  logger.info('Welcome to the Acquisitions API');
  res.status(200).json({ message: 'Acquisitions API is running' });
});

app.get('/health', (req, res) => {
  logger.info('hello');
  res.status(200).json({ status: 'ok', timestamp: new Date() , uptime : process.uptime()});
});


// Routes
app.use('/api', routes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error Handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
