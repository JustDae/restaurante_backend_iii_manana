
# 🍽️ Restaurant API - Sistema de Gestión POS (Point of Sale)

**Restaurant API** es un sistema backend robusto de nivel empresarial diseñado para la gestión integral de restaurantes. Esta solución permite el control de inventarios, procesamiento de pedidos, facturación y auditoría transaccional en tiempo real bajo una arquitectura de alto rendimiento y escalable.

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una **Arquitectura Híbrida de Persistencia**, optimizando el almacenamiento según la naturaleza del dato:

* **Módulos Relacionales (PostgreSQL):** Garantizan la integridad referencial y transaccional (ACID) para el flujo de caja, gestión de usuarios, productos y pedidos.
* **Módulo de Auditoría (MongoDB):** Los logs de actividad se capturan mediante un **Interceptor Global**. Esto permite registrar cada acción administrativa (quién, qué y cuándo) sin impactar la latencia de la base de datos transaccional principal.

---

## 🚀 Tecnologías Utilizadas

* **Framework:** [NestJS](https://nestjs.com/) (Node.js) con TypeScript.
* **Bases de Datos:** * **PostgreSQL:** Gestión de datos estructurados y relacionales.
* **MongoDB:** Almacenamiento NoSQL para registros de auditoría.


* **ORM/ODM:** TypeORM & Mongoose.
* **Seguridad:** Passport.js, JWT (JSON Web Tokens) y Hashing con BCrypt.
* **Documentación:** Swagger UI (OpenAPI).

---

## 🔐 Seguridad y Roles (RBAC)

El sistema utiliza **Control de Acceso Basado en Roles** mediante decoradores y guards personalizados para segmentar las responsabilidades del personal:

| Rol | Permisos y Alcance |
| --- | --- |
| **ADMIN** | **Control total:** gestión de usuarios, inventarios avanzados y acceso exclusivo a logs de auditoría. |
| **MESERO** | **Operación en sala:** creación de pedidos, gestión de mesas y facturación de servicios. |
| **COCINERO** | **Gestión operativa:** visualización de comandas en tiempo real y actualización de estados. |
| **CLIENTE** | **Consulta:** acceso al catálogo de productos y seguimiento del estado de sus pedidos. |

---

## 🛠️ Características Principales

* ✅ **Paginación Avanzada:** Implementada mediante `nestjs-typeorm-paginate` para optimizar el consumo de recursos en el frontend.
* ✅ **Filtros Dinámicos:** Búsqueda, filtrado y ordenamiento flexible a través de `QueryBuilder`.
* ✅ **Gestión de Archivos:** Integración con **Multer** para la carga de imágenes de productos y perfiles de usuario.
* ✅ **Seeder Automático:** Generación de roles y configuraciones iniciales automáticas al arrancar el sistema por primera vez.
* ✅ **Manejo de Errores (Global Exception Filter):** Sistema de Try-Catch global para asegurar respuestas de error estandarizadas y seguras.

## ⚙️ Instalación y Configuración

### Requisitos Previos

* **Node.js** (v18 o superior)
* **PostgreSQL** & **MongoDB** instalados y en ejecución.

### 1. Obtención de dependencias y fuentes

```bash
git clone https://github.com/tu-usuario/restaurante-api.git
cd restaurante-api
npm install

```

### 2. Aprovisionamiento de variables de entorno (.env)

Cree un archivo `.env` en la raíz del proyecto y configure las credenciales siguiendo este esquema:

```env
PORT=3000

# Relational Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_clave_segura
DB_NAME=restaurante_db

# Audit Database
MONGO_URI=mongodb://localhost:27017/audit_db

# Authentication
JWT_SECRET=tu_palabra_secreta_super_segura
JWT_EXPIRES_IN=24h

```

### 3. Inicialización del Servicio

El sistema incluye un **Seeder automático** para la creación de roles base al iniciar.

```bash
npm run start:dev

```

---

## 📖 Documentación

Una vez el servidor esté en ejecución, puede acceder a la documentación interactiva (Swagger) en:
👉 [http://localhost:3000/docs](https://www.google.com/search?q=http://localhost:3000/docs)

