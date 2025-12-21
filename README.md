Restaurante API - Sistema de Gestión POS
Funcionamiento Integral 

 Restaurante API - Sistema de Gestión POS Sistema backend robusto para la gestión de un restaurante, incluyendo control de inventario, pedidos, facturación y auditoría en tiempo real.
 Tecnologías Utilizadas
Framework: NestJS (Node.js)
Bases de Datos:
PostgreSQL: Gestión de datos relacionales (Usuarios, Productos, Pedidos).
MongoDB: Almacenamiento de logs de auditoría (Arquitectura NoSQL).
ORM: TypeORM & Mongoose.
Seguridad: Passport.js, JWT (JSON Web Tokens) y BCrypt para hashing de contraseñas.
Documentación: Swagger UI.
Arquitectura del Sistema El proyecto utiliza una arquitectura híbrida:
Módulos Relacionales (PostgreSQL): Manejo estricto de integridad para el flujo de caja, productos y usuarios.
Módulo de Auditoría (MongoDB): Los logs se capturan mediante un Interceptor Global que registra cada acción importante (quién, qué y cuándo) sin afectar el rendimiento de la base de datos principal.
Requisitos Previos
Node.js (v18 o superior)
PostgreSQL corriendo
MongoDB corriendo
Archivo .env configurado
Instalación y Configuración
Clonar el repositorio:
Bash
git clone https://github.com/tu-usuario/restaurante-api.git
cd restaurante-api
Instalar dependencias:
Bash
npm install
Configurar variables de entorno: Crea un archivo .env en la raíz y añade:
Plaintext
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_clave
DB_NAME=restaurante_db
MONGO_URI=mongodb://localhost:27017/audit_db
JWT_SECRET=tu_palabra_secreta
JWT_EXPIRES_IN=24h
Levantar el servidor:
Bash
npm run start:dev
 Seguridad y Roles (RBAC) El sistema implementa Control de Acceso Basado en Roles (RBAC) mediante Decoradores y Guards personalizados:
ADMIN: Acceso total (Usuarios, Inventario, Auditoría).
MESERO: Gestión de Pedidos y Facturación.
COCINERO: Visualización de pedidos pendientes.
CLIENTE: Acceso a catálogo de productos.
Documentación de la API Una vez levantado el proyecto, puedes acceder a la documentación interactiva en:
http://localhost:3000/docs
Características Principales
Paginación Avanzada: Implementada con nestjs-typeorm-paginate en todos los listados.
Filtros Dinámicos: Búsqueda y ordenamiento flexible mediante QueryBuilder.
Subida de Archivos: Gestión de imágenes de productos y perfiles de usuario con Multer.
Seeder Automático: Generación de roles y datos iniciales al primer arranque.
Try-Catch Global: Manejo de errores robusto y estandarizado en todos los servicios.