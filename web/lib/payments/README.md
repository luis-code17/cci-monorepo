Guía breve: configuración segura de Redsys

Resumen
- Este módulo de pagos espera que las variables de entorno necesarias estén configuradas en el entorno del servidor.
- **NUNCA** almacenar claves reales en el repositorio.

Variables necesarias (poner en `.env.local` en desarrollo o en el gestor de secretos en producción):

- `REDSYS_MERCHANT_CODE` — Código del comercio proporcionado por Redsys.
- `REDSYS_SECRET_KEY` — Clave secreta del comercio SHA-256 tal como te la entrega Redsys (el código la usa para derivar la firma).
- `REDSYS_TERMINAL` — Terminal (por defecto `1`).
- `REDSYS_CURRENCY` — Código de moneda (ej. `978` para EUR).
- `REDSYS_NOTIFY_URL` — URL pública para recibir webhooks: `https://<tu-dominio>/api/payments/webhook/redsys`.
- `NEXT_PUBLIC_SITE_URL` — URL pública de la web (usada para return URLs de ejemplo).

Cómo convertir la clave a base64 (local, sin subir la clave al repo)

Pega la clave directamente en `REDSYS_SECRET_KEY` de tu `.env.local`.

Notas técnicas
- El código del proyecto deriva la firma HMAC-SHA256 a partir de `REDSYS_SECRET_KEY` y del número de pedido.
- Los endpoints sensibles (firma/validación) funcionan **solo** en servidor (Next.js route handlers). La lógica de firma nunca se expone al cliente.

Despliegue
- En producción, guarda estas variables en tu proveedor de secretos (Vercel Secret, AWS Secrets Manager, Azure Key Vault, etc.).
- Asegúrate de que `REDSYS_NOTIFY_URL` sea accesible públicamente y que Redsys pueda llegar a ella.

Verificación local
- Para pruebas locales con Redsys en entorno de pruebas, usa los endpoints de Redsys de pruebas y las credenciales de pruebas proporcionadas por Redsys.

Si quieres, puedo:
- Añadir un pequeño script de validación que verifique las variables en `process.env` (ya hay validación con zod en `infrastructure/config.ts`).
- Añadir instrucciones para crear `./.env.local` seguro con ejemplo (no incluir claves reales).

---
Archivo de referencia: `web/lib/payments/infrastructure/config.ts`
