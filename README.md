Restaurante API - Sistema de Gestión POS
Funcionamiento Integral del Ecosistema

El sistema Restaurante-API es una solución de backend de alto rendimiento diseñada bajo una arquitectura de micro-módulos en NestJS. Su funcionamiento se basa en la especialización de tareas para garantizar que el restaurante nunca se detenga y que cada acción sea rastreable.

1. El Cerebro: NestJS y Configuración Dinámica
El núcleo del sistema organiza la lógica de negocio de forma modular. Para garantizar la seguridad desde el segundo cero, el programa utiliza un sistema de variables de entorno; esto significa que las "llaves" del sistema (claves de bases de datos y secretos JWT) nunca están expuestas en el código, permitiendo un despliegue seguro en cualquier servidor.

2. El Corazón: Persistencia Híbrida (SQL + NoSQL)
A diferencia de sistemas convencionales, este backend utiliza lo mejor de dos mundos para manejar los datos:

PostgreSQL (Manejo Crítico): Utiliza un motor relacional para asegurar que los pedidos, las finanzas y el inventario sean exactos y consistentes. Aquí no hay margen de error: un producto vendido se descuenta del stock mediante transacciones seguras gestionadas por TypeORM.

MongoDB (Auditoría Invisible): Mientras PostgreSQL procesa la venta, un Interceptor Global captura silenciosamente los detalles de quién, cuándo y qué se hizo, guardándolo en MongoDB. Esto crea un historial de auditoría masivo que no ralentiza la operación principal del restaurante.

3. El Escudo: Seguridad y Control de Calidad
El acceso está blindado por tres niveles de control:

Autenticación: Solo usuarios con un token JWT válido pueden cruzar la puerta.

Autorización (RBAC): El sistema reconoce si eres Admin, Mesero, Cocinero o Cliente, limitando tus acciones mediante Guards personalizados.

Integridad: Antes de procesar cualquier dato, los Validation Pipes verifican que la información sea correcta (por ejemplo, que un precio no sea negativo), rechazando cualquier intento de introducir datos basura.

4. La Operación: Automatización y Experiencia
El sistema está optimizado para la eficiencia diaria. Incluye paginación y filtros dinámicos para que el personal encuentre productos al instante, y soporta la gestión de imágenes mediante Multer. Además, al ser desarrollado en TypeScript, el código cuenta con un sistema de "autodiagnóstico" que previene errores lógicos, asegurando que el sistema sea estable incluso en las horas pico de mayor demanda.

En conclusión: Es una infraestructura diseñada no solo para registrar datos, sino para actuar como un motor de auditoría y gestión inteligente, escalable y, sobre todo, altamente seguro.