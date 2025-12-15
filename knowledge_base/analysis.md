# Análisis del Proyecto y Hoja de Ruta

## 1. Estado Actual del Código

### Tecnología
- **Backend**: Node.js con Express.
- **Base de Datos**: PostgreSQL gestionada con Prisma ORM.
- **Autenticación**: Estructura preparada para JWT y roles.

### Estructura de Base de Datos (Schema)
El esquema actual (`prisma/schema.prisma`) cubre las entidades fundamentales para el inventario:
- **Usuarios y Roles**: Gestión de acceso (`User`, `Role`, `Plan`).
- **Inventario**: `Product`, `Category`, `Supplier`.
- **Movimientos**: `StockMovement` para rastrear entradas, salidas y ajustes.

### Hallazgos Principales
1.  **Gestión de Stock**: La tabla `StockMovement` es un excelente punto de partida. Permite rastrear el historial, precios de compra/venta históricos y calcular beneficios (`totalProfit`).
2.  **Lógica de Negocio (Services)**: El directorio `src/services` está actualmente vacío. La lógica para actualizar el stock automáticamente al crear un movimiento aún debe implementarse.
3.  **Carrito de Compras**: **No existe** actualmente una estructura para manejar un "Carrito de Compras" o "Pedidos" (Orders). `StockMovement` registra el cambio de inventario, pero no el proceso de venta temporal (carrito) o la orden de un cliente antes de confirmarse.

## 2. Puntos a Abordar (Gap Analysis)

Para cumplir con los requerimientos (Carrito, Stock dinámico, Reportería), necesitamos:

### A. Carrito de Compras
- Crear modelos `Cart` y `CartItem` (para persistencia temporal) o `Order` y `OrderItem` (para la transacción final).
- **Recomendación**: Implementar un flujo de Ventas/Ordenes que, al completarse, genere automáticamente los `StockMovement` de salida.

### B. Gestión de Stock (Subida y Bajada)
- Implementar un servicio que centralice **toda** modificación de stock.
- Al crear un `StockMovement`, debe actualizarse el campo `stock` en el modelo `Product` atómicamente.

### C. Reportería
- **Lo más vendido**: Consulta de agregación sobre `StockMovement` (tipo 'OUT') agrupando por `productId`.
- **Ganancias**: Sumatoria de `totalProfit` en un rango de fechas.
- **Comparativa Precios**: Los datos existen en `StockMovement` (`unitPurchasePrice` vs `unitSalePrice`). Solo faltan los queries.

## 3. Próximos Pasos (Roadmap Tecnico)

1.  **Definición de Nuevos Modelos**:
    - Agregar `Order` y `OrderItem` al esquema de Prisma.
2.  **Lógica Core (Backend)**:
    - Crear `InventoryService` para manejar entradas/salidas de forma segura.
    - Crear `ReportingService` para las consultas complejas.
3.  **API Endpoints**:
    - Endpoints para realizar una venta (que descuente stock).
    - Endpoints para obtener reportes dashboard.

Este documento servirá como base de conocimiento para las siguientes iteraciones.
