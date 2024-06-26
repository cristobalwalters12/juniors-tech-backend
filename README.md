# Juniors.tech - Proyecto final
## Bootcamp FullStack con JavaScript - Academia Desafío Latam

### Tabla de contenido

- [Integrantes](#integrantes)
- [Guía de ejecución](#guía-de-ejecución)
  - [Variables de entorno](#variables-de-entorno)
  - [Base de datos (PostgreSQL)](#base-de-datos-postgresql)
  - [Usuarios de prueba](#usuarios-de-prueba)
    - [Usuario](#usuario)
    - [Moderador](#moderador)
    - [Administrador](#administrador)
  - [Servidor de desarrollo](#servidor-de-desarrollo)
    - [Windows](#windows)
    - [Otros sistemas operativos](#otros-sistemas-operativos)
  - [Testing](#testing)
    - [Windows](#windows-1)
    - [Otros sistemas operativos](#otros-sistemas-operativos-1)
  - [Documentación](#documentación)

### Integrantes

- [Ayxa Chaverra R.](https://github.com/achaverrar)
- [Cristóbal Walters](https://github.com/cristobalwalters12)
- [Jonathan Araos](https://github.com/jonaisenberg)
- [Nicolás Contreras Uribe](https://github.com/lukitas0606)

### Guía de ejecución

#### Variables de entorno

Completar la configuración de variables de entorno, usando como guía [esta plantilla](./.env.example). **Para usar el entorno de testing es necesario proporcionar el valor de `DB_TEST_NAME`.**

#### Base de datos (PostgreSQL)

Desde la shell de PostgreSQL, ejecutar los scripts DDL.sql y DML.sql que se encuentran en [este directorio](./src/database/) para configurar la base de datos del proyecto.

Los datos precargados de cada tabla por separado se encuentran en el directorio [DML-each-table](./src/database/DML-each-table/)

#### Usuarios de prueba

Con el script de [DML](./src/database/DML.sql) o el de [DML-users](./src/database/DML-each-table/DML-users.sql) se crean 3 usuarios, con roles diferentes, para probar las funcionalidades de la API. Sus credenciales son las siguientes:

##### Usuario

```json
{
  "email": "user1234@correo.com",
  "password": "User1234"
}
```

##### Moderador

```json
{
  "email": "mod1234@correo.com",
  "password": "Moderator1234"
}
```

##### Administrador

```json
{
  "email": "admin1234@correo.com",
  "password": "Admin1234"
}
```

#### Servidor de desarrollo

Este proyecto usa dos ambientes (desarrollo y testing) que se configuran por medio de variables de entorno, desde los scripts del [package.json](./package.json). De ahí que **para los usuarios de Windows, los scripts son diferentes.**

Abrir la terminal en la carpeta raíz y ejecutar:

##### Windows
```bash
  npm run i
  npm run dev:win
```

##### Otros sistemas operativos
```bash
  npm run i
  npm run dev
```

Para instalar las dependencias y levantar el proyecto completo, usando la base de datos de desarrollo.

#### Testing

Este proyecto usa dos ambientes (desarrollo y testing) que se configuran por medio de variables de entorno, desde los scripts del [package.json](./package.json). De ahí que **para los usuarios de Windows, los scripts son diferentes.**

**En el entorno de testing es necesario comentar las líneas 3 y 20 de [app.js](./src/api/v1/app.js)**, que corresponden al logger de desarrollo, así:

```javascript
import cors from 'cors'
// import { logger } from 'logger-express' <--- Línea 3
import swagger from '../../config/swagger.js'

// ...
swagger(app)
// app.use(logger()) <--- Línea 20
app.use(express.json())
```

Abrir la terminal en la carpeta raíz y ejecutar:

##### Windows

```bash
  npm run i
  npm run test:win
```

##### Otros sistemas operativos

```bash
  npm run i
  npm run test
```

Para ejecutar los tests, usando la base de datos de pruebas.

#### Documentación

Esta API cuenta con una documentación en Swagger, configurada para ejecutarse localmente en:

- [Documentación API Rest](http://localhost:3000/api/v1/docs)