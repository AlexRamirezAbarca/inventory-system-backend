# Estándares de Arquitectura y Desarrollo

Este documento define los patrones y estructuras que deben seguir todos los módulos del proyecto para garantizar consistencia, mantenibilidad y robustez.

## 1. Estructura de Módulos

Cada feature funcional (e.g., Authentication, Products, Cart) debe residir en `src/modules/{feature_name}` y seguir esta estructura:

-   `controllers/`: Manejo de requests/responses HTTP. **No debe contener lógica de negocio**.
-   `services/`: Lógica de negocio pura, acceso a DB (Prisma). Lanza errores `AppError` si algo falla.
-   `routes/`: Definición de endpoints. Usa middlewares de validación y autenticación.
-   `middlewares/`: Validadores específicos del módulo (`{feature}.validators.js`).

## 2. Manejo de Respuestas (API Response)

Todas las respuestas exitosas deben usar el helper `successResponse` para mantener un formato consistente.

**Formato JSON:**
```json
{
  "code": 200,
  "data": { ... }, // Objeto, Array o null
  "message": "Operación exitosa"
}
```

**Uso en Controllers:**
```javascript
import { successResponse } from "../../../utils/response.util.js";

return successResponse(res, 200, user, "User registered successfully");
```

## 3. Manejo de Errores

Se utiliza un enfoque centralizado para el manejo de errores. No se deben usar `try/catch` para capturar errores y responder manualmente en cada controlador, sino delegar al middleware global.

### Clase `AppError`
Para errores operacionales (conocidos), usar `AppError` con un mensaje y código HTTP.

```javascript
import { AppError } from "../../../utils/AppError.js";

// En un Service
if (!user) {
  throw new AppError("Usuario no encontrado", 404);
}
```

### Middleware Global
Ubicado en `src/middlewares/error.middleware.js`. Captura cualquier error lanzado (o pasado via `next(err)`) y responde con el formato estándar:

```json
{
  "code": 404,
  "data": null,
  "message": "Usuario no encontrado"
}
```

## 4. Validación de Datos

La validación de entrada es **obligatoria** para cualquier endpoint que reciba datos (`POST`, `PUT`, `PATCH`).

-   **Herramienta**: `express-validator`.
-   **Ubicación**: `src/modules/{feature}/middlewares/{feature}.validators.js`.
-   **Middleware**: `validateRequest` (en `src/middlewares/validate.middleware.js`) debe ir después de los esquemas de validación en la ruta.

**Ejemplo de Ruta:**
```javascript
router.post(
  "/register",
  registerSchema,   // Reglas de express-validator
  validateRequest,  // Verifica si hubo errores y responde 400
  AuthController.register
);
```

---
*Este documento debe actualizarse si se introducen nuevos patrones globales.*
