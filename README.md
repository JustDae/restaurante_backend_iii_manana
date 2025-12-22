**Guía de Instalación y Configuración**
**1. Requisitos del Sistema**
-Node.js (v18+)
-PostgreSQL (Base de datos relacional)
-MongoDB (Base de datos de auditoría)

**2. Instalación de Dependencias**
Ejecute los siguientes comandos en su terminal:

-git clone https://github.com/tu-usuario/restaurante-api.git
-cd restaurante-api
-npm install

**3. Librerías Principales**
El sistema utiliza las siguientes dependencias clave:

-NestJS & TypeScript 
-TypeORM & pg (Conectividad PostgreSQL)
-Mongoose (Conectividad MongoDB)
-Passport & JWT (Seguridad)
-Bcrypt (Cifrado)
-Multer (Carga de archivos)
-Swagger (Documentación)

**4. Configuración del Entorno (.env)**
Cree un archivo .env y configure los siguientes campos:

Campos ejemplo:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASS=contraseña
DB_NAME=restaurante_db
MONGO_URI=mongodb://localhost:27017/audit_db
JWT_SECRET=secreto_seguro
JWT_EXPIRES_IN=24h

**5. Comandos de Ejecución**
-**Desarrollo**: npm run start:dev
-**Construcción**: npm run build
-**Producción**: npm run start:prod


**6.Flujo de Trabajo en Swagger**
Acceda a http://localhost:3000/docs.
Diríjase al endpoint POST /auth/login.
Copie el access_token recibido.
Haga clic en el botón Authorize en la parte superior e inserte el token.