PR Checklist: Idempotency & Inventory Changes

Pre-merge checks (Developer)
- [ ] Code compiles and lints (npm run typecheck, npm run lint)
- [ ] Unit tests pass locally
- [ ] Integration/e2e tests pass locally (npm test)
- [ ] PR description includes migration notes and runbook
- [ ] Add reviewers: backend owners / payment owners

Staging checks (QA/DevOps)
- [ ] Apply migration on staging: `npx prisma migrate deploy` and verify column exists
- [ ] Run integration & e2e tests on staging
- [ ] Run k6 benchmark:
  - Script (example):
    {
      "config": { "target": "https://staging-api.example.com", "vus": 200, "duration": "30s" },
      "scenarios": [
        { "name": "concurrent-checkout", "executor": "constant-vus", "vus": 200, "duration": "30s", "exec": "checkout" }
      ]
    }
  - k6 command: `k6 run --vus 200 --duration 30s k6-checkout.js`
  - Success criteria: no oversell, P95 latency < 2s, error rate < 1%
- [ ] Verify Redis is healthy and connection stable
- [ ] Smoke test key flows: create-order, payment redirect, webhook

Manual test cases (QA)
- Scenario 1: Idempotent retries
  - Send 2 POST /checkout/create-order with same Idempotency-Key within short interval
  - Expect: same orderId returned; no duplicate orders
  - Command: `curl -X POST /checkout/create-order -H "Idempotency-Key: KEY123" -d '{"cartId":"...","customerEmail":"a@b.com"}'`
- Scenario 2: Concurrent checkouts (oversell)
  - Use k6 or scripts to trigger N concurrent checkouts on product with stock S (N > S)
  - Expect: number of successful orders <= S; inventory not negative
- Scenario 3: Webhook replay
  - Send same VNPAY webhook twice (valid signature) for an intent already SUCCEEDED
  - Expect: second webhook returns success but does not create duplicate payment/order

Rollback plan
- If critical issue after deploy:
  1. Revert PR and redeploy previous release.
  2. If migration introduced issue, restore DB from snapshot or run `ALTER TABLE "orders" DROP COLUMN "idempotencyKey"` (only if safe).
  3. Notify stakeholders and open incident runbook.

Runbook summary
- Monitor: error rate, order creation rate, inventory inconsistencies, webhook failures
- On anomaly: rollback feature, investigate logs (security log for webhook failures first), restore DB snapshot if data corruption
