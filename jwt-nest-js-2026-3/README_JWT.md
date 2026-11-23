# Implementación JWT + Roles

Implementación de la guía JWT + Roles sobre el proyecto NestJS.

## 1. Instalar dependencias

Desde la raíz del proyecto:

```powershell
pnpm install
```

Las dependencias `@nestjs/jwt` y `bcryptjs` ya están declaradas en `package.json`.

## 2. Configurar variables de entorno

Copia `.env_example` como `.env` y completa los valores reales:

```powershell
Copy-Item .env_example .env
```

Configura la conexión a MySQL y una clave JWT aleatoria y privada. No compartas ni subas `.env` a Git.

## 3. Crear la base de datos

Abre MySQL y ejecuta el contenido de `DATABASE_SETUP.sql`. El script crea `jwt_nestjs`, las tablas `usuario`, `rol`, `usuario_rol` y los roles `USER` y `ADMIN`.

La sincronización automática de TypeORM está desactivada (`synchronize: false`) porque las tablas se crean mediante SQL.

## 4. Ejecutar la aplicación

```powershell
pnpm run build
pnpm run start:dev
```

La API escucha en `http://localhost:3000` (o en el puerto definido por `PORT`).

## 5. Endpoints de autenticación

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| GET | `/auth/profile` | Token JWT válido |

El registro asigna automáticamente el rol `USER`. La contraseña se almacena como hash bcrypt; nunca se devuelve en la respuesta.

### Ejemplo de registro

```json
{
  "username": "ana",
  "password": "123456"
}
```

### Ejemplo de login

```json
{
  "username": "ana",
  "password": "123456"
}
```

La respuesta de login contiene `accessToken`, `tokenType` y `expiresIn`. Para rutas protegidas, envía:

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

## 6. Permisos del módulo People

| Método | Ruta | Permiso |
|---|---|---|
| POST | `/people` | Solo `ADMIN` |
| GET | `/people` | `USER` o `ADMIN` |
| GET | `/people/:id` | Público |
| PUT | `/people/:id` | Cualquier usuario autenticado |
| DELETE | `/people/:id` | Solo `ADMIN` |

`401 Unauthorized`: falta un token válido. `403 Forbidden`: el usuario está autenticado, pero no tiene el rol requerido.

## 7. Probar

Abre `requests.http` con la extensión REST Client de VS Code. Ejecuta primero el registro y el login. Copia el `accessToken` de la respuesta del login y reemplaza `PEGAR_TOKEN_AQUI` en la variable `@token`.

## 8. Dar rol ADMIN a un usuario para probar

El registro público crea usuarios con rol `USER`. Para probar las rutas administrativas, registra primero el usuario y luego ejecuta en MySQL, sustituyendo `ana` por el username registrado:

```sql
INSERT IGNORE INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
JOIN rol r ON r.nombre = 'ADMIN'
WHERE u.username = 'ana';
```

Cierra sesión y vuelve a iniciar sesión para obtener un JWT que ya contenga el rol `ADMIN`. Los roles se incluyen en el token al hacer login.

## 9. Seguridad y archivos

- `.env` no se incluye en este ZIP: crea tu archivo local desde `.env_example`.
- No publiques claves JWT ni contraseñas de MySQL.
- `dist/` y `node_modules/` se regeneran y no se incluyen en el ZIP.
