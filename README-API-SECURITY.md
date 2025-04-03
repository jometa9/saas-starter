# Mejoras de Seguridad en la API de Validación de Suscripciones

## Cambios implementados

1. **Verificación de origen de solicitudes**: 
   - Se ha añadido un sistema que verifica el origen de las solicitudes HTTP a través de los encabezados `origin`.
   - Solo se permiten solicitudes de dominios autorizados, definidos en la variable de entorno `ALLOWED_ORIGINS`.

2. **Sincronización con Stripe**:
   - Ahora el endpoint verifica el estado actual de la suscripción directamente con Stripe antes de responder.
   - Si detecta discrepancias entre el estado almacenado en la base de datos y el estado en Stripe, actualiza la base de datos automáticamente.
   - Esto soluciona posibles desincronizaciones cuando la base de datos estaba inaccesible durante actualizaciones de suscripción.

3. **Soporte para Aplicaciones Electron**:
   - Se ha añadido un parámetro especial `clientType` para identificar aplicaciones de escritorio.
   - Las aplicaciones Electron pueden evitar la verificación de origen usando este parámetro.

## Configuración necesaria

Añade la siguiente variable de entorno a tu archivo `.env` o `.env.local`:

```
# Lista de dominios permitidos separados por comas
ALLOWED_ORIGINS=https://tudominio.com,https://app.tudominio.com
```

Si `ALLOWED_ORIGINS` está vacío o no definido, la verificación de origen se desactivará. Para máxima seguridad, siempre define los dominios permitidos.

## Comportamiento de la API

- Si una solicitud proviene de un origen no autorizado, recibirá un error 403 (Forbidden).
- Si Stripe no puede ser contactado durante la verificación de suscripción, el sistema seguirá funcionando con los datos de la base de datos local.
- La respuesta incluye toda la información anterior, pero ahora con datos de suscripción siempre actualizados y sincronizados con Stripe.

## Ejemplos de uso

### Para aplicaciones web:
```javascript
// Ejemplo de cómo consumir esta API desde un cliente autorizado
async function checkSubscription(apiKey) {
  const response = await fetch('https://tudominio.com/api/validate-subscription?apiKey=' + apiKey);
  if (!response.ok) {
    throw new Error('Error de validación: ' + response.statusText);
  }
  return await response.json();
}
```

### Para aplicaciones Electron:
```javascript
// Ejemplo de cómo consumir esta API desde una aplicación Electron
async function checkSubscriptionFromElectron(apiKey) {
  const response = await fetch('https://tudominio.com/api/validate-subscription?apiKey=' + apiKey + '&clientType=electron');
  if (!response.ok) {
    throw new Error('Error de validación: ' + response.statusText);
  }
  return await response.json();
}
``` 