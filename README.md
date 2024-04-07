# Juniors.tech - Proyecto final
## Bootcamp FullStack con JavaScript - Academia Desafío Latam

## Integrantes

- [Ayxa Chaverra R.](https://github.com/achaverrar)
- [Cristóbal Walters](https://github.com/cristobalwalters12)
- [Jonathan Araos](https://github.com/jonaisenberg)
- [Nicolás Contreras Uribe](https://github.com/lukitas0606)

## Guía de ejecución

### Variables de entorno

Completar la configuración de variables de entorno, usando como guía [esta plantilla](./.env.example). **Para usar el entorno de testing es necesario proporcionar el valor de `DB_TEST_NAME`.**

### Base de datos (PostgreSQL)

Desde la shell de PostgreSQL, ejecutar los scripts DDL.sql y DML.sql que se encuentran en [este directorio](./src/database/) para configurar la base de datos del proyecto.

Los datos precargados de cada tabla por separado se encuentran en el directorio [DML-each-table](./src/database/DML-each-table/)

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

**En el entorno de testing es necesario comentar las líneas 13 y 19 de [app.js](./src/api/v1/app.js)**, que corresponden al logger de desarrollo.

Abrir la terminal en la carpeta raíz y ejecutar:

#### Windows

```bash
  npm run i
  npm run test:win
```

#### Otros sistemas operativos

```bash
  npm run i
  npm run test
```

Para ejecutar los tests, usando la base de datos de pruebas.

## API Rest Foro

## Url para Api rest de nuestro foro

- [API Rest](http://localhost:3000/api/v1/docs)