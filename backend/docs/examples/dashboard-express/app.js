const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and parsing
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: true })); // allow all origins in the example

// Correlation ID middleware
app.use((req, res, next) => {
  const cid = req.header('X-Correlation-Id') || uuidv4();
  req.correlationId = cid;
  res.setHeader('X-Correlation-Id', cid);
  // mirror as a header for morgan token access
  req.headers['x-correlation-id'] = cid;
  next();
});

// Logging
morgan.token('cid', (req) => req.headers['x-correlation-id'] || '-');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - cid=:cid'));

// Rate limiting (60 requests per minute)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

// Mount routes
app.use('/api/v1/dashboard', dashboardRouter);

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const code = err.code || (status === 400 ? 'INVALID_INPUT' : 'INTERNAL_ERROR');
  const payload = { code, message: err.message || 'Internal server error' };
  if (err.details) payload.details = err.details;
  // simple console logging for example
  console.error(`[${req.correlationId}]`, err);
  res.status(status).json(payload);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Dashboard example server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
