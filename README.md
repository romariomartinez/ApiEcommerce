# 📦 Ecommerce Backend API

Backend profesional para un **e-commerce completo**, desarrollado con **Node.js, TypeScript, Express y Prisma**, enfocado en **seguridad, consistencia de datos y buenas prácticas de arquitectura**.

Este proyecto implementa **autenticación, gestión de productos, inventario transaccional, pedidos, pagos, direcciones y hardening básico**, listo para integrarse con un frontend moderno (React, Angular, etc.).

---

## 🚀 Stack Tecnológico

- Node.js + Express  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- JWT (Auth & Roles)  
- Stripe (Pagos)  
- Cloudinary (Imágenes)  
- Swagger / OpenAPI  
- Pino (Logs)  
- Rate Limit  
- Cache (Redis / Memory fallback)  

---

## 🧠 Arquitectura

```
src/
├── config/          # Configuración (db, stripe, cloudinary, cache, logger)
├── controllers/     # Lógica de negocio
├── middlewares/     # Auth, roles, rate limit, upload, logs
├── routes/          # Rutas HTTP
├── schemas/         # Validaciones (Zod)
├── services/        # Servicios (emails, cache, etc.)
├── prisma/          # Prisma schema
├── app.ts           # App Express
└── server.ts        # Bootstrap
```

Arquitectura **modular, desacoplada y escalable**.

---

## 🔐 Autenticación y Autorización

- Registro y login con **JWT**
- Roles:
  - ADMIN
  - CUSTOMER
- Protección por middleware
- Seguridad aplicada por endpoint

Header de autenticación:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📦 Funcionalidades Principales

### Productos
- CRUD de productos (ADMIN)
- Categorías
- Inventario 1-a-1
- Soft delete
- Subida de imágenes (Cloudinary)

### Inventario
- Stock transaccional
- Control de concurrencia
- Rollback automático en cancelaciones

### Pedidos
- Crear pedido
- Listar pedidos del usuario
- Ver detalle de pedido
- Cancelar pedido (CUSTOMER)
- Cambiar estado (ADMIN)

Estados soportados:
```
PENDING → PAID → SHIPPED → DELIVERED
CANCELLED
```

---

## 💰 Pagos (Stripe)

- Creación de Payment Intent
- Confirmación **exclusiva por webhook**
- Backend como única fuente de verdad
- Sin confiar en el frontend

---

## 📍 Direcciones de Envío

- CRUD de direcciones por usuario
- Dirección por defecto
- Preparado para flujos reales de logística

---

## 📧 Emails Transaccionales

Proveedor: **Resend**

Eventos implementados:
- Pedido creado
- Pedido cancelado
- Pago confirmado
- Pedido enviado

---

## 🛡️ Hardening Implementado

### Logs
- Logs estructurados con **Pino**
- Redacción de datos sensibles
- Observabilidad real

### Rate Limit
- Protección de login
- Protección de pedidos
- Prevención de abuso

### Cache
- Cacheo de productos
- Cacheo de dashboard administrativo
- Redis en producción / Memory en desarrollo
- Invalidación explícita

---

## 📘 Swagger / OpenAPI

Documentación interactiva disponible en:

```
http://localhost:3000/docs
```

Incluye:
- Auth
- Products
- Orders
- Payments
- Admin
- Addresses

---

## 🧪 Requisitos

- Node.js ≥ 18
- PostgreSQL ≥ 14
- Cuenta Stripe
- Cuenta Cloudinary

---

## ⚙️ Variables de Entorno

Ejemplo `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/ecommerce_db
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

RESEND_API_KEY=re_xxx
EMAIL_FROM=onboarding@resend.dev

REDIS_URL=redis://localhost:6379
```

---

## ▶️ Instalación y Ejecución

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## 📌 Estado del Proyecto

✔ Backend funcional  
✔ Seguridad aplicada  
✔ Pagos reales  
✔ Documentación lista  
✔ Preparado para frontend o despliegue  

---

## 🧩 Alcance Deliberado

Este proyecto **NO incluye**:
- Auditoría avanzada
- Colas / background jobs
- Multi-tenant

Decisión consciente para mantener **simplicidad, foco y mantenibilidad**.

---

## 📄 Licencia

MIT
