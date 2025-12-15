# Sprint 2: Authentication Module Analysis

## 1. Estado Actual (Current State)

El módulo de autenticación se encuentra en una fase funcional básica ("medio implementado").
- **Ubicación**: `src/modules/authentication`
- **Componentes**:
    - `auth.routes.js`: Define endpoints `/register`, `/login`, `/me`.
    - `auth.controller.js`: Maneja la respuesta HTTP.
    - `auth.service.js`: Contiene la lógica de negocio (bcrypt, jwt, prisma).
    - `auth.middleware.js`: Verifica el JWT.

## 2. Defectos y Riesgos Identificados (Gap Analysis)

### A. Validación de Datos (Crítico)
**Problema**: Los controllers reciben `req.body` y lo pasan directamente al servicio sin validación previa.
- **Riesgo**: Se puede enviar cualquier dato basura, campos faltantes o tipos incorrectos, causando errores 500 no controlados o inyecciones de datos no deseados.
- **Ejemplo**: `AuthService.register(req.body)` no garantiza que `email` sea un email válido o que `password` tenga una longitud mínima.

### B. Manejo de Errores (Mantenibilidad)
**Problema**: Cada método en el controlador tiene su propio bloque `try/catch` que devuelve respuestas genéricas.
- **Defecto**: Repetición de código (`res.status(500)...`). Si cambiamos la estructura de respuesta de error, hay que cambiarlo en todos los archivos.
- **Falta**: No existe un **Global Error Interceptor** o Middleware de errores.

### C. Seguridad y Configuración
**Problema**: Fallback de secretos harcodeados.
- En `auth.service.js` y `auth.middleware.js`: `const JWT_SECRET = process.env.JWT_SECRET || "SecretKey";`
- **Riesgo**: Si falla la carga de variables de entorno, se usa una clave débil conocida. El sistema debería fallar al arrancar si no hay secretos configurados.

### D. Interceptores Globales
**Falta**: No hay middlewares globales para:
- Logging de requests (quién llama a qué).
- Sanitización de inputs (nombres con espacios extra, etc.).

## 3. Plan de Mejoras (Sprint 2 Roadmap)

Para robustecer este módulo y establecer el estándar para los siguientes features (`Products`, `Cart`, `Reports`), se realizarán las siguientes tareas:

### 1. Implementar Capa de Validación (DTOs/Schemas)
- Instalar `express-validator` o `zod`.
- Crear `auth.validators.js`.
- Definir esquemas para:
    - `registerSchema`: Email válido, password min 6 chars, nombre requerido.
    - `loginSchema`: Email y password requeridos.
- Implementar un middleware `validateRequest` que verifique estos esquemas antes de llegar al controller.

### 2. Estandarización de Respuestas y Errores
- Crear `src/middlewares/error.middleware.js`.
- Capturar todos los errores y formatearlos en una estructura estándar:
  ```json
  {
    "success": false,
    "error": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": [...]
  }
  ```
- Reemplazar `try/catch` repetitivos por un wrapper `asyncHandler` o usar el middleware global.

### 3. Refactorización de Seguridad
- Eliminar hardcoded strings para JWT_SECRET.
- Asegurar que el servidor falle rápido si faltan variables de entorno críticas.

### 4. Middleware de Protección
- Revisar `verifyToken` para asegurar que maneja correctamente los errores de expiración de token y firmas inválidas con códigos HTTP correctos (401 vs 403).

Este documento define el **Punto de Partida** técnico para el Sprint 2.

## 4. Resultados de la Implementación (Summary)

Se han completado las mejoras planificadas con los siguientes resultados:

1.  **Arquitectura de Errores**: Se implementó `AppError` y `errorMiddleware`. Ahora el manejo de errores es uniforme y seguro (sin stack traces en producción por defecto).
2.  **Validación Robusta**: Se integró `express-validator`. Endpoints como `/register` y `/login` ahora rechazan datos inválidos con un código 400 y detalles específicos antes de tocar el controlador.
3.  **Respuestas Homogéneas**: Se estandarizó la respuesta `{ code, data, message }` mediante `response.util.js`.
4.  **Refactorización Auth**: El controlador y servicio de autenticación han sido limpiados de lógica redundante y ahora siguen los nuevos estándares.

Esta implementación sirve como **referencia (gold standard)** para los futuros módulos (`Products`, `Cart`, `Reports`).
