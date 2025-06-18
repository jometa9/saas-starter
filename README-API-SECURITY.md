# API Security Improvements for Subscription Validation

## Implemented Changes

1. **Request Origin Verification**:

- A system has been added that verifies the origin of HTTP requests through the `origin` headers.
- Only requests from authorized domains, defined in the `ALLOWED_ORIGINS` environment variable, are allowed.

2. **Stripe Synchronization**:

- The endpoint now verifies the current subscription status directly with Stripe before responding.
- If it detects discrepancies between the status stored in the database and the status in Stripe, it automatically updates the database.
- This solves possible desynchronizations when the database was inaccessible during subscription updates.

3. **Support for Electron Applications**:

- A special parameter `clientType` has been added to identify desktop applications.
- Electron applications can bypass origin verification using this parameter.

## Required Configuration

Add the following environment variable to your `.env` or `.env.local` file:

```
# List of allowed domains separated by commas
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

If `ALLOWED_ORIGINS` is empty or not defined, origin verification will be disabled. For maximum security, always define the allowed domains.

## API Behavior

- If a request comes from an unauthorized origin, it will receive a 403 (Forbidden) error.
- If Stripe cannot be contacted during subscription verification, the system will continue to function with data from the local database.
- The response includes all the previous information, but now with subscription data always updated and synchronized with Stripe.

## Usage Examples

### For web applications:

```javascript
// Example of how to consume this API from an authorized client
async function checkSubscription(apiKey) {
  const response = await fetch(
    "https://tudominio.com/api/validate-subscription?apiKey=" + apiKey
  );
  if (!response.ok) {
    throw new Error("Error de validación: " + response.statusText);
  }
  return await response.json();
}
```

### For Electron applications:

```javascript
// Example of how to consume this API from an Electron application
async function checkSubscriptionFromElectron(apiKey) {
  const response = await fetch(
    "https://tudominio.com/api/validate-subscription?apiKey=" +
      apiKey +
      "&clientType=electron"
  );
  if (!response.ok) {
    throw new Error("Error de validación: " + response.statusText);
  }
  return await response.json();
}
```
