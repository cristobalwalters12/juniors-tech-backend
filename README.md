# Juniors.tech - Proyecto final
## Bootcamp FullStack con JavaScript - Academia Desafío Latam

## Guía de ejecución

### Variables de entorno

Completar la configuración de variables de entorno, usando como guía [esta plantilla](./.env.example)

### Base de datos (PostgreSQL)

Desde la shell de PostgreSQL, ejecutar los scripts SQL DDL y DML que se encuentran en [este directorio](./src/database/) para configurar la base de datos del proyecto.

Para poblar los datos de solo una de las tablas usar el respectivo script DML del directorio [DML-each-table](./src/database/DML-each-table/)

### Servidor

Este proyecto usa dos ambientes (desarrollo y testing) que se configuran por medio de variables de entorno, desde los scripts del [package.json](./package.json). De ahí que **para los usuarios de Windows, los scripts son diferentes.**

Abrir la terminal en la carpeta raíz y ejecutar:

#### Windows
```bash
  npm run i
  npm run dev:win
```

#### Otros sistemas operativos
```bash
  npm run i
  npm run dev
```

Para instalar las dependencias y levantar el proyecto completo, usando la base de datos de desarrollo.

### Testing

Este proyecto usa dos ambientes (desarrollo y testing) que se configuran por medio de variables de entorno, desde los scripts del [package.json](./package.json). De ahí que **para los usuarios de Windows, los scripts son diferentes.**

Abrir la terminal en la carpeta raíz y ejecutar:

#### Windows

```bash
  npm run test:win
```

#### Otros sistemas operativos

```bash
  npm run i
  npm run test
```

Para ejecutar los tests, usando la base de datos de pruebas.