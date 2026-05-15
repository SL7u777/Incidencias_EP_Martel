# Sistema de Registro de Incidencias Viales

Sistema web para el registro y seguimiento de incidencias en la vía pública (baches, alumbrado, basura, seguridad ciudadana y emergencias).

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Node.js + **Fastify** |
| Base de datos | MongoDB Atlas (Mongoose) |
| API Docs | Swagger UI (`/api-docs`) |
| Archivos | Multipart/form-data — imágenes, video, audio |
| Orquestación | Docker Compose |

## Arquitectura

Cliente-Servidor de 3 capas:

```
[NAVEGADOR]
    |  HTTP
    v
[FRONTEND — React + Vite :5173]
    |  Axios REST calls
    v
[BACKEND — Fastify :5000]
    ├── routes/        → endpoints y schema Swagger
    ├── middleware/    → autenticación (requireOperator)
    ├── controllers/   → lógica de negocio
    ├── repositories/  → acceso a datos (Repository Pattern)
    ├── factories/     → creación de objetos (Factory Pattern)
    └── models/        → esquemas Mongoose (MVC)
    |  Mongoose ODM
    v
[MONGODB ATLAS — incidencias_db]
    ├── incidents
    └── users
```

## Patrones de Diseño

- **Repository Pattern** — `incidentRepository.js`, `userRepository.js`: capa de acceso a datos desacoplada del controlador
- **Factory Pattern** — `incidentFactory.js`: centraliza la creación de incidencias con prioridad automática según categoría
- **MVC** — separación clara de `models/`, `controllers/`, `routes/`

## Casos de Uso

| ID | Nombre | Descripción |
|----|--------|-------------|
| US-001 | Reportar Incidencia | El ciudadano registra una incidencia con categoría, descripción, ubicación y archivo multimedia opcional |
| US-002 | Consultar Incidencias | Cualquier usuario puede ver la lista de incidencias con filtros por categoría y estado, y ver el detalle |
| US-003 | Actualizar Estado | El operador cambia el estado de una incidencia (pendiente → en proceso → resuelto → cerrado) con comentario |

## Requisitos

- Docker y Docker Compose instalados
- Puerto 5000 y 5173 disponibles

## Instrucciones de uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/SL7u777/Incidencias_EP_Martel.git
cd Incidencias_EP_Martel
```

### 2. Configurar variables de entorno

Crear `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/incidencias_db?appName=ClusterParcial
PORT=5000
```

### 3. Levantar con Docker Compose

```bash
docker compose up --build -d
```

### 4. Acceder a la aplicación

| Servicio | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Swagger UI | http://localhost:5000/api-docs |

## Autenticación

La aplicación es de uso **público**: cualquier ciudadano puede reportar y consultar incidencias sin cuenta.

La ruta `/manage` está **protegida**: requiere login con rol `operador` o `admin`.

### Login (`POST /api/auth/login`)

```json
{ "email": "operador1@incidencias.pe", "password": "operador123" }
```

### Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Operador | operador1@incidencias.pe | operador123 |
| Admin | admin@incidencias.pe | admin123 |
| Ciudadano (sin acceso al panel) | juan@gmail.com | ciudadano123 |

## Endpoints API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login con email + contraseña |
| GET | `/api/incidents` | No | Listar incidencias (filtros: category, status, priority) |
| POST | `/api/incidents` | No | **Crear incidencia** — multipart/form-data (soporta imagen, video, audio) |
| GET | `/api/incidents/stats` | No | Estadísticas por categoría y estado |
| GET | `/api/incidents/:id` | No | Detalle de incidencia |
| PATCH | `/api/incidents/:id/status` | **Sí** (header `x-user-email`) | Actualizar estado |
| POST | `/api/incidents/:id/media` | No | Adjuntar archivo a incidencia existente |
| DELETE | `/api/incidents/:id` | No | Eliminar incidencia |
| GET | `/api/users` | No | Listar usuarios |
| POST | `/api/users` | No | Registrar usuario |
| GET | `/api/users/operators` | No | Listar operadores |

## Workflow GitFlow

```
main ←── develop
```

| Rama | Descripción |
|------|-------------|
| `main` | Código estable de producción |
| `develop` | Integración de funcionalidades — auth, UI y casos de uso |

## Estructura del proyecto

```
Incidencias_EP_Martel/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── models/          # Mongoose schemas
│       ├── repositories/    # Repository Pattern
│       ├── factories/       # Factory Pattern
│       ├── middleware/      # authMiddleware.js — preHandler requireOperator
│       ├── controllers/     # Lógica de negocio
│       ├── routes/          # Fastify routes + Swagger
│       └── seed/            # Datos iniciales
└── frontend/
    ├── Dockerfile
    └── src/
        ├── services/        # api.js — Axios client
        ├── context/         # AuthContext.jsx — estado de sesión en localStorage
        ├── components/      # Navbar, IncidentCard, ProtectedRoute
        └── pages/           # Dashboard, Report, Detail, Manage, Login
```

## Detener el sistema

```bash
docker compose down
```
