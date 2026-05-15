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

## Arquitectura y Patrones de Diseño

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

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/incidents` | Listar incidencias (filtros: category, status, priority) |
| POST | `/api/incidents` | **Crear incidencia** — multipart/form-data (soporta imagen, video, audio) |
| GET | `/api/incidents/stats` | Estadísticas por categoría y estado |
| GET | `/api/incidents/:id` | Detalle de incidencia |
| PATCH | `/api/incidents/:id/status` | Actualizar estado |
| POST | `/api/incidents/:id/media` | Adjuntar archivo a incidencia existente |
| DELETE | `/api/incidents/:id` | Eliminar incidencia |
| GET | `/api/users` | Listar usuarios |
| POST | `/api/users` | Registrar usuario |
| GET | `/api/users/operators` | Listar operadores |

## Workflow GitFlow

```
main ←── release ←── develop ←── feature/us-001-reporte
                              ←── feature/us-002-consulta
                              ←── feature/us-003-gestion-estado
```

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
│       ├── controllers/     # Lógica de negocio
│       ├── routes/          # Fastify routes + Swagger
│       └── seed/            # Datos iniciales
└── frontend/
    ├── Dockerfile
    └── src/
        ├── services/api.js  # Axios client
        ├── components/      # Navbar, IncidentCard
        └── pages/           # Dashboard, Report, Detail, Manage
```

## Detener el sistema

```bash
docker compose down
```
