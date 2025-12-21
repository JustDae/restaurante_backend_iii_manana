Restaurante API - Sistema de Gestión POS
Funcionamiento Integral del Ecosistema

El sistema opera como un ecosistema digital coordinado donde el núcleo es NestJS, un framework que organiza la lógica de negocio de manera modular y escalable. Todo comienza con un entorno configurado de forma segura; el programa extrae dinámicamente las credenciales (como las de PostgreSQL y MongoDB) desde un archivo de variables de entorno al arrancar, garantizando que la conexión con los servicios de datos sea hermética y privada.

Arquitectura de Doble Persistencia
Una vez en marcha, el backend utiliza una arquitectura híbrida diseñada para maximizar la eficiencia:

PostgreSQL (vía TypeORM): Gestiona la estructura formal y crítica del restaurante. Aquí reside la integridad de los productos, usuarios, pedidos y el flujo de caja, donde cada transacción requiere precisión absoluta.

MongoDB (vía Mongoose): Se encarga exclusivamente de la Auditoría en Tiempo Real. Mediante un Interceptor Global, el sistema captura cada acción importante y la almacena en formato NoSQL. Esto permite tener un historial detallado sin sobrecargar ni ralentizar la base de datos relacional principal.

 Seguridad y Flujo de Datos
Cuando un usuario interactúa con la API, se activan múltiples capas de protección:

Interceptación y Autenticación: El sistema valida el token digital (JWT). Gracias a Passport.js, si el token es inválido o ha expirado, la petición se detiene de inmediato.

Control de Acceso (RBAC): Mediante decoradores y Guards personalizados, el sistema verifica el rol del usuario (ADMIN, MESERO, COCINERO o CLIENTE), otorgando acceso estrictamente a las funciones autorizadas.

Validación Rigurosa: Una vez superada la seguridad, los datos pasan por Validation Pipes. Esto asegura que cualquier información entrante cumpla con el formato correcto antes de tocar la lógica de negocio.

Capacidades Avanzadas
El programa no solo procesa datos, sino que los optimiza para el mundo real:

Gestión de Recursos: Incluye un sistema de subida de archivos con Multer para las imágenes de productos y perfiles.

Navegación Fluida: Implementa paginación avanzada y filtros dinámicos mediante QueryBuilder, permitiendo búsquedas rápidas en inventarios extensos.

Autodiagnóstico: Al estar escrito en TypeScript, el sistema detecta errores de lógica durante el desarrollo. Además, cuenta con un Try-Catch Global que garantiza que, ante cualquier fallo, el servidor responda de manera controlada sin interrumpir el servicio.

En resumen, es una arquitectura robusta, diseñada para ser el motor invisible que gestiona desde la toma de un pedido hasta la auditoría final de una factura.