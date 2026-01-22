const express = require('express');
const { query, body, validationResult } = require('express-validator');
const router = express.Router();

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.code = 'INVALID_INPUT';
    err.details = errors.array();
    return next(err);
  }
  next();
}

// Simple auth middleware (checks Bearer token present). Replace with real JWT validation.
function authMiddleware(req, res, next) {
  const auth = req.header('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    const err = new Error('Authorization required');
    err.status = 401;
    err.code = 'UNAUTHORIZED';
    return next(err);
  }
  req.user = { id: 'system', role: 'admin' };
  next();
}

router.get('/summary', authMiddleware, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], validateRequest, (req, res) => {
  const { startDate='2026-01-01', endDate='2026-01-31', fields } = req.query;
  // Example static summary
  const summary = { revenue: 12345.67, orders: 123, activeUsers: 456, conversionRate: 0.045 };
  const fieldsSet = fields ? new Set(fields.split(',')) : null;
  const selected = {};
  for (const k of Object.keys(summary)) {
    if (!fieldsSet || fieldsSet.has(k)) selected[k] = summary[k];
  }
  res.json({ startDate, endDate, summary: selected, meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 } });
});

router.get('/metrics', authMiddleware, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], validateRequest, (req, res) => {
  const data = [
    { metric: 'revenue', value: 12345.67, unit: 'USD', timestamp: '2026-01-31T23:59:59Z' }
  ];
  res.json({ data, meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 } });
});

router.get('/charts', authMiddleware, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
], validateRequest, (req, res) => {
  const charts = [
    { id: 'revenue_by_day', type: 'line', labels: ['2026-01-01', '2026-01-02'], series: [{ label: 'revenue', data: [1000, 1100] }] }
  ];
  res.json({ charts, meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 } });
});

router.post('/refresh', authMiddleware, [
  body('scope').optional().isIn(['summary', 'metrics', 'charts', 'all']),
  body('immediate').optional().isBoolean()
], validateRequest, (req, res) => {
  const { scope = 'all', immediate = false } = req.body;
  // enqueue job (simplified)
  const jobId = 'job_' + Math.random().toString(36).slice(2, 9);
  res.status(202).json({ status: immediate ? 'running' : 'queued', jobId, message: immediate ? 'Running now' : 'Refresh scheduled' });
});

module.exports = router;
