# 🍽️ Restaurant API - Sistema de Gestión POS (Point of Sale)

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/Audit-MongoDB-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?style=flat&logo=swagger)](http://localhost:3000/docs)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Restaurant API** es un sistema backend robusto de nivel empresarial diseñado para la gestión integral de restaurantes. Esta solución permite el control de inventarios, procesamiento de pedidos, facturación y auditoría transaccional en tiempo real bajo una arquitectura de alto rendimiento.

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una **Arquitectura Híbrida de Persistencia**, optimizando el almacenamiento según la naturaleza del dato:

* **Módulos Relacionales (PostgreSQL):** Garantizan la integridad referencial y transaccional (ACID) para el flujo de caja, gestión de usuarios y pedidos.
* **Módulo de Auditoría (MongoDB):** Los logs de actividad se capturan mediante un **Interceptor Global**. Esto permite registrar cada acción administrativa sin impactar la latencia de la base de datos transaccional principal.



---

## 🚀 Tecnologías Utilizadas

* **Framework:** [NestJS](https://nestjs.com/) (Node.js) con TypeScript.
* **Bases de Datos:** * **PostgreSQL:** Gestión de datos estructurados.
    * **MongoDB:** Almacenamiento NoSQL para auditoría.
* **ORM/ODM:** TypeORM & Mongoose.
* **Seguridad:** Passport.js, JWT (JSON Web Tokens) y Hashing con BCrypt.
* **Documentación:** Swagger UI (OpenAPI).

---

## 🔐 Seguridad y Roles (RBAC)

El sistema utiliza **Control de Acceso Basado en Roles** mediante decoradores y guards personalizados para segmentar las responsabilidades:

| Rol | Permisos y Alcance |
| :--- | :--- |
| **ADMIN** | Control total: gestión de usuarios, inventarios avanzados y acceso a logs de auditoría. |
| **MESERO** | Operación en sala: creación de pedidos, gestión de mesas y facturación. |
| **COCINERO** | Gestión operativa: visualización de comandas y actualización de estados de platillos. |
| **CLIENTE** | Consulta: acceso al catálogo de productos y seguimiento de pedidos propios. |

---

## 🛠️ Características Principales

-   ✅ **Paginación Avanzada:** Implementada mediante `nestjs-typeorm-paginate` para optimizar el consumo de recursos en el frontend.
-   ✅ **Filtros Dinámicos:** Búsqueda, filtrado y ordenamiento flexible a través de `QueryBuilder`.
-   ✅ **Gestión de Archivos:** Integración con Multer para la carga de imágenes de productos y perfiles.
-   ✅ **Seeder Automático:** Generación de roles y configuraciones iniciales automáticas al arrancar el sistema.
-   ✅ **Manejo de Errores (Global Exception Filter):** Sistema de Try-Catch global para respuestas de error estandarizadas.

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
* **Node.js** (v18 o superior)
* **PostgreSQL** & **MongoDB** instalados y en ejecución.

---

# Pasos de Instalación

## 1. Obtención de dependencias y fuentes
git clone [https://github.com/tu-usuario/restaurante-api.git](https://github.com/tu-usuario/restaurante-api.git)
cd restaurante-api
npm install

## 2. Aprovisionamiento de variables de entorno (.env)
## Configure las credenciales siguiendo este esquema:
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_clave_segura
DB_NAME=restaurante_db
MONGO_URI=mongodb://localhost:27017/audit_db
JWT_SECRET=identity_provider_secret_key
JWT_EXPIRES_IN=24h

## 3. Inicialización del Servicio
### El sistema incluye un Seeder automático para la creación de roles base
npm run start:dev

## 📖 Documentación de la API (Swagger)

El proyecto utiliza **Swagger (OpenAPI)** para proporcionar una interfaz interactiva donde se pueden probar los endpoints, revisar los esquemas de datos y validar los requerimientos de autenticación.

Una vez que el servidor esté en ejecución, puedes acceder a la documentación en:
`http://localhost:3000/docs`

---

## ⚠️ Estado del Proyecto

> [!IMPORTANT]
> **Nota:** El sistema se encuentra actualmente **en fase de desarrollo**. Algunas funcionalidades avanzadas están en proceso de implementación y la API puede sufrir cambios estructurales antes de su versión estable 1.0.