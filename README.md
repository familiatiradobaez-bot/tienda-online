# 🛍️ TiendaOnline — E-commerce en Cloudflare Workers

Plataforma e-commerce completa construida con **React Router v8 + Cloudflare Workers + D1**.

## ✅ Recursos ya creados en tu cuenta

- **D1 Database**: `tienda-db` (ID: `0f2ad4be-848e-4347-9ddb-fe55634b112a`)
- **KV SESSIONS**: `d55e906be9bf4fe88641ff58505adfc9`
- **KV CACHE**: `d507b543e92a436db2550dd78d1eda61`
- **R2 Bucket**: `tienda-product-images`
- **Base de datos inicializada** con tablas + datos de ejemplo

## 🚀 Puesta en marcha

```bash
npm install
npm run dev    # desarrollo local
npm run deploy  # producción
```

## 👥 Roles

| Rol | Nivel | Acceso |
|-----|-------|--------|
| super_admin | 100 | Todo |
| admin | 80 | Productos, pedidos, usuarios |
| supervisor | 60 | Pedidos, reseñas |
| mod | 40 | Reseñas |
| user | 10 | Cliente |

## 🔐 Auth

- Email/contraseña (SHA-256 + salt)
- Google OAuth 2.0
- Sesiones en KV (TTL 7 días)

## 📁 Estructura

Ver `app/` — cada archivo tiene una responsabilidad única para fácil modificación.
