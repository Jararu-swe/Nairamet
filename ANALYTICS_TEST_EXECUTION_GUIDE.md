# Analytics Tracking Tests - Execution Guide

## Quick Start

### Run All Analytics Tests

```bash
npm test -- analytics
```

### Run Specific Test Suite

```bash
# API endpoint tests
npm test -- route.test.ts

# ShareButton component tests
npm test -- share-button.test.tsx

# ShareModal component tests
npm test -- share-modal.test.tsx

# Integration tests
npm test -- integration.test.ts
```

### Run with Coverage Report

```bash
npm test -- --coverage analytics
```

### Watch Mode (Development)

```bash
npm test -- --watch analytics
```

---

## Test Files Overview

### 1. Route Tests: `app/api/analytics/share/route.test.ts`

**Focus**: Analytics API endpoint validation

**Key Test Categories**:

- ✅ Valid event acceptance (29 tests)
- ✅ Invalid data rejection (11 tests)
- ✅ Platform accuracy (3 tests)
- ✅ Error handling (3 tests)
- ✅ Response formats (3 tests)
- ✅ Non-blocking behavior (1 test)

**Example Test Run**:

```bash
npm test -- route.test.ts --reporter=verbose
```

**Expected Output**:

```
✓ POST /api/analytics/share (50 tests)
  ✓ Valid event data (8)
  ✓ Invalid event data (11)
  ✓ Platform data accuracy (3)
  ✓ Error handling (3)
  ✓ Response format (3)
  ✓ Non-blocking behavior (1)
```

---

### 2. ShareButton Tests: `components/share-button.test.tsx`

**Focus**: ShareButton component analytics firing

**Key Test Categories**:

- ✅ share_initiated events (5 tests)
- ✅ share_completed events (2 tests)
- ✅ Edge case handling (2 tests)
- ✅ Non-blocking behavior (3 tests)
- ✅ Network failures (3 tests)
- ✅ Multiple events (2 tests)
- ✅ Edge cases (3 tests)

**Example Test Run**:

```bash
npm test -- share-button.test.tsx --reporter=verbose
```

**Prerequisites**:

- Mock fetch must be configured
- Mock canShare must return false by default
- Mock navigator.share for native share tests

---

### 3. ShareModal Tests: `components/share-modal.test.tsx`

**Focus**: ShareModal component analytics firing

**Key Test Categories**:

- ✅ Social media share events (5 tests)
- ✅ Copy link events (3 tests)
- ✅ Event accuracy (3 tests)
- ✅ Non-blocking behavior (3 tests)
- ✅ Network failures (5 tests)
- ✅ Multiple events (2 tests)
- ✅ Edge cases (3 tests)

**Example Test Run**:

```bash
npm test -- share-modal.test.tsx --reporter=verbose
```

---

### 4. Integration Tests: `app/api/analytics/share/integration.test.ts`

**Focus**: End-to-end analytics flow

**Key Test Categories**:

- ✅ Complete user flows (3 tests)
- ✅ Multiple shares in session (2 tests)
- ✅ Network resilience (3 tests)
- ✅ Data consistency (2 tests)
- ✅ Performance (2 tests)

**Example Test Run**:

```bash
npm test -- integration.test.ts --reporter=verbose
```

---

## Test Data Specifications

### Valid Event Examples

#### share_initiated

```json
{
  "eventType": "share_initiated",
  "widgetType": "rates",
  "currency": "NGN",
  "rate": 1550.5,
  "timestamp": "2024-01-21T10:30:00.000Z"
}
```

#### share_completed (Native)

```json
{
  "eventType": "share_completed",
  "widgetType": "rates",
  "currency": "NGN",
  "rate": 1550.5,
  "platform": "native",
  "timestamp": "2024-01-21T10:30:01.000Z"
}
```

#### share_completed (Social)

```json
{
  "eventType": "share_completed",
  "widgetType": "converter",
  "currency": "USD",
  "rate": 500.25,
  "platform": "twitter",
  "timestamp": "2024-01-21T10:30:02.000Z"
}
```

#### link_copied

```json
{
  "eventType": "link_copied",
  "widgetType": "chart",
  "currency": "EUR",
  "rate": 750.5,
  "platform": "copy",
  "timestamp": "2024-01-21T10:30:03.000Z"
}
```

---

## Coverage Validation

### Verify All Requirements Met

```bash
# Run tests and check coverage
npm test -- --coverage analytics

# Generate coverage report
npm test -- --coverage analytics --coverage-reporters=html
```

**Expected Coverage**:

- Statements: > 95%
- Branches: > 90%
- Functions: > 95%
- Lines: > 95%

### Requirement Mapping

| Requirement                   | Tests                             | Status |
| ----------------------------- | --------------------------------- | ------ |
| 7.1: share_initiated fires    | route, button                     | ✅     |
| 7.2: share_completed accurate | route, button, modal              | ✅     |
| 7.3: link_copied fires        | route, modal                      | ✅     |
| 7.4: Network failures handled | route, button, modal, integration | ✅     |
| 7.5: Events don't block       | button, modal, integration        | ✅     |

---

## Common Test Scenarios

### Scenario 1: Test Share Initiation

```bash
npm test -- --grep "share_initiated"
```

**Tests Run**: 5

- Fires on button click ✅
- Includes widget type ✅
- Includes currency ✅
- Includes rate ✅
- Includes timestamp ✅

### Scenario 2: Test Network Failures

```bash
npm test -- --grep "network|failure|timeout"
```

**Tests Run**: 8

- Fetch errors handled ✅
- Timeouts handled ✅
- 4xx errors handled ✅
- 5xx errors handled ✅

### Scenario 3: Test Non-Blocking Behavior

```bash
npm test -- --grep "block|immediate"
```

**Tests Run**: 6

- Modal shows immediately ✅
- Copy completes immediately ✅
- Fire-and-forget pattern ✅

---

## Debugging Failed Tests

### Enable Debug Output

```bash
DEBUG=* npm test -- analytics
```

### Run Single Test

```bash
npm test -- share-button.test.tsx -t "should fire share_initiated"
```

### Run Tests Matching Pattern

```bash
npm test -- --grep "share_completed"
```

### Verbose Output

```bash
npm test -- --reporter=verbose analytics
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Analytics Tests
  run: npm test -- analytics

- name: Generate Coverage
  run: npm test -- --coverage analytics

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Pre-commit Hook

```bash
#!/bin/bash
npm test -- analytics
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## Performance Benchmarks

### Expected Performance

- Single event tracking: < 5ms
- 10 concurrent events: < 50ms
- Network timeout handling: < 100ms

### Run Performance Tests

```bash
npm test -- integration.test.ts -t "performance"
```

---

## Mock Configuration Reference

### Global Mocks

```typescript
// Fetch mock
global.fetch = vi.fn();

// Navigator share mock
navigator.share = vi.fn().mockResolvedValue(undefined);

// Clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Window.open mock
window.open = vi.fn().mockReturnValue({ closed: false });
```

### Mock Response Examples

```typescript
// Success
mockFetch.mockResolvedValueOnce(
  new Response(JSON.stringify({ success: true })),
);

// Error
mockFetch.mockRejectedValueOnce(new Error("Network error"));

// Never resolves (timeout)
mockFetch.mockImplementationOnce(() => new Promise(() => {}));
```

---

## Test Maintenance

### Update Tests When Changing

- Event types: Update validation tests
- Platforms: Add new platform tests
- Widget types: Add new widget type tests
- API response: Update response format tests

### Common Updates

```bash
# Add new platform test
# Edit: components/share-modal.test.tsx
# Find: "should accept all valid platforms"
# Update: platforms array with new platform

# Add new event type test
# Edit: app/api/analytics/share/route.test.ts
# Find: "should accept share_initiated event"
# Add similar test for new event type
```

---

## Troubleshooting

### Issue: Tests timeout

**Solution**: Increase timeout in vitest.config.ts

```typescript
test: {
  testTimeout: 10000; // 10 seconds
}
```

### Issue: Mock not working

**Solution**: Clear mocks between tests

```typescript
beforeEach(() => {
  mockFetch.mockClear();
});
```

### Issue: Async tests fail

**Solution**: Use `waitFor` and `act`

```typescript
await waitFor(() => {
  expect(mockFetch).toHaveBeenCalled();
});
```

---

## Next Steps

1. ✅ **Run Tests**: Execute all test suites
2. ✅ **Verify Coverage**: Check > 95% coverage
3. ✅ **Manual Testing**: Test in real browsers
4. ✅ **Production Validation**: Verify events in analytics
5. ✅ **Performance Monitoring**: Track analytics overhead

---

## Support

For issues or questions:

1. Check test output for specific failures
2. Review mock configuration
3. Verify test data format
4. Enable debug output
5. Check Vitest documentation: https://vitest.dev/
