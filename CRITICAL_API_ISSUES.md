# Critical API Integration Issues - Action Items

## Priority: CRITICAL - Must Fix Before Production

### Issue 1: Missing Booking Technician Assignment Endpoint
**File**: `/backend/src/modules/booking/booking.controller.ts`
**Missing Endpoint**: `PATCH /bookings/:id/assign`

**Current Status**: Not implemented
**Dashboard Expects**: 
```typescript
async assignTechnician(id: string, technicianId: string) {
  return this.request(`/bookings/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ technicianId }),
  });
}
```

**Action Required**:
1. Add method to BookingController:
```typescript
@Patch(':id/assign')
@UseGuards(AdminOrKeyGuard)
async assignTechnician(
  @Param('id') id: string,
  @Body() assignDto: { technicianId: string }
) {
  return this.bookingService.assignTechnician(id, assignDto.technicianId);
}
```

2. Implement in BookingService

**Impact**: Dashboard cannot assign technicians to bookings

---

### Issue 2: Missing Notification Creation Endpoint
**File**: `/backend/src/modules/notifications/notifications.controller.ts`
**Missing Endpoint**: `POST /notifications`

**Current Status**: Only GET endpoint exists
**Dashboard Cannot**: Create new notifications

**Action Required**:
1. Add method to NotificationsController:
```typescript
@Post()
async create(@Body() createNotificationDto: {
  userId: string;
  type: string;
  message: string;
  data?: any;
}) {
  return this.notificationService.create(createNotificationDto);
}
```

2. Implement in NotificationService

**Impact**: Notification system is read-only

---

## Priority: HIGH - Should Fix (HTTP Method Inconsistencies)

### Issue 3: Booking Update - HTTP Method Mismatch
**File**: `/backend/src/modules/booking/booking.controller.ts`
**Current**: `@Put(':id')`  
**Expected**: `@Patch(':id')`

**Lines 39-42**:
```typescript
@Put(':id')  // <- Should be @Patch
async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
  return this.bookingService.update(id, updateBookingDto);
}
```

**Why**: REST convention: PATCH for partial updates, PUT for full replacement

---

### Issue 4: Booking Status Update - HTTP Method Mismatch
**File**: `/backend/src/modules/booking/booking.controller.ts`
**Current**: `@Put(':id/status')`  
**Expected**: `@Patch(':id/status')`

**Lines 49-52**:
```typescript
@Put(':id/status')  // <- Should be @Patch
async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateBookingStatusDto) {
  return this.bookingService.updateStatus(id, updateStatusDto.status);
}
```

**Error This Causes**: 405 Method Not Allowed when dashboard tries PATCH

---

### Issue 5: Technician Update - HTTP Method Mismatch
**File**: `/backend/src/modules/technicians/technicians.controller.ts`
**Current**: `@Put(':id')`  
**Expected**: `@Patch(':id')`

**Lines 84-96**:
```typescript
@Put(':id')  // <- Should be @Patch
async updateTechnician(
  @Param('id') id: string,
  @Body() updateTechnicianDto: {...}
) {
  return this.techniciansService.updateTechnician(id, updateTechnicianDto);
}
```

---

### Issue 6: Service Update - HTTP Method Mismatch
**File**: `/backend/src/modules/services/services.controller.ts`
**Current**: `@Put(':id')`  
**Expected**: `@Patch(':id')`

**Lines 101-107**:
```typescript
@Put(':id')  // <- Should be @Patch
async updateService(
  @Param('id') id: string,
  @Body() updateServiceDto: UpdateServiceDto
) {
  return this.servicesService.updateService(id, updateServiceDto);
}
```

---

### Issue 7: Technician Availability Endpoint Path Mismatch
**File**: `/backend/src/modules/technicians/technicians.controller.ts`
**Current**: `GET /technicians/available?date=...&time=...`  
**Expected**: `GET /technicians/:id/availability?date=...`

**Dashboard Client Code** (line 996-998):
```typescript
async getTechnicianAvailability(id: string, date: string) {
  return this.request(`/technicians/${id}/availability?date=${date}`);
}
```

**Current Backend** (line 45-58):
```typescript
@Get('available')  // <- Wrong path
async getAvailableTechnicians(@Query() query: {...}) {
  // Returns all available technicians instead of single technician's availability
}
```

**Action**: Add dedicated endpoint for single technician availability

---

## Implementation Priority Timeline

### Week 1 (CRITICAL)
1. [ ] Implement `PATCH /bookings/:id/assign` endpoint
2. [ ] Implement `POST /notifications` endpoint
3. [ ] Change all PUT to PATCH for partial updates
4. [ ] Test all changed endpoints

### Week 2 (IMPORTANT)
1. [ ] Fix technician availability endpoint path
2. [ ] Update dashboard client if needed
3. [ ] Integration testing across booking flow
4. [ ] Performance testing with new endpoints

---

## Testing Verification Steps

### For Each Fix:

1. **Endpoint Accessibility**:
   ```bash
   curl -X PATCH http://localhost:3010/api/v1/bookings/123/assign \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"technicianId":"456"}'
   ```

2. **HTTP Status Codes**:
   - 200/201 for successful operations
   - 400 for bad requests
   - 401 for auth failures
   - 404 for not found
   - 405 for wrong method (should NOT occur)

3. **Error Handling**:
   - Non-existent IDs return 404
   - Invalid data returns 400
   - Missing auth returns 401

4. **Dashboard Integration**:
   - Verify dashboard client calls work
   - No more 405 errors
   - Response format matches expectations

---

## Files to Modify

1. `/Users/macbook/Desktop/audiotailoc/backend/src/modules/booking/booking.controller.ts`
   - Lines 39: @Put → @Patch
   - Lines 49: @Put → @Patch
   - Add new method: @Patch(':id/assign')

2. `/Users/macbook/Desktop/audiotailoc/backend/src/modules/technicians/technicians.controller.ts`
   - Lines 84: @Put → @Patch
   - Lines 45: Refactor availability endpoint

3. `/Users/macbook/Desktop/audiotailoc/backend/src/modules/services/services.controller.ts`
   - Lines 101: @Put → @Patch

4. `/Users/macbook/Desktop/audiotailoc/backend/src/modules/notifications/notifications.controller.ts`
   - Add new @Post() method

---

## Risk Assessment

| Issue | Severity | Impact | Risk | Mitigation |
|-------|----------|--------|------|-----------|
| Missing assign endpoint | CRITICAL | Cannot manage bookings | HIGH | Implement immediately |
| Missing notification creation | CRITICAL | System non-functional | HIGH | Implement immediately |
| PUT vs PATCH mismatch | HIGH | 405 errors in dashboard | MEDIUM | Fix all at once, test thoroughly |
| Availability path mismatch | MEDIUM | Wrong data returned | MEDIUM | Refactor endpoint properly |

---

## Verification Checklist

- [ ] All PATCH operations return correct HTTP status
- [ ] All 405 errors eliminated
- [ ] Dashboard can assign technicians to bookings
- [ ] Dashboard can create notifications
- [ ] Rate limiting still works
- [ ] Auth guards still enforce
- [ ] No regression in existing functionality
- [ ] Integration tests pass

