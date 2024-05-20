const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'baselibro2'
});

app.use(express.static('/redoc.html')); 

app.use(express.json());
const theme = new SwaggerTheme();

const readmeFile = fs.readFileSync(path.join(__dirname, 'README.md'), { encoding: 'utf8'});

const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.MUTED),
  customSiteTitle: 'API de Libros',
  swaggerOptions: {
    
  },
  customCssUrl: '/custom.css'
};
/**
 * @swagger
 * tags:
 *   - name: Libro
 *     description: Operaciones relacionadas con libros
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       properties:
 *         idLibro:
 *           type: integer
 *           description: Identificador del libro
 *         Nombre:
 *           type: string
 *           description: Nombre del libro
 *         Genero:
 *           type: string
 *           description: Género del libro
 *         SubGenero:
 *           type: string
 *           description: Subgénero del libro
 *         Autor:
 *           type: string
 *           description: Autor del libro
 *         Idioma:
 *           type: string
 *           description: Idioma del libro
 *         Editorial:
 *           type: string
 *           description: Editorial del libro
 *         Año:
 *           type: integer
 *           description: Año de publicación del libro
 */

/**
 * @swagger
 * /libro/{idLibro}:
 *   get:
 *     description: Obtiene un libro por su ID
 *     tags: [Libro]
 *     parameters:
 *       - in: path
 *         name: idLibro
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro a obtener
 *     responses:
 *       200:
 *         description: Datos del libro
 *       404:
 *         description: El libro no fue encontrado
 */
/**
 * @swagger
 * /libro:
 *   post:
 *     description: Inserta un nuevo libro
 *     tags: [Libro]
 *     requestBody:
 *       description: Datos del nuevo libro
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro insertado exitosamente
 *       404:
 *         description: Error al insertar el libro
 */
/**
 * @swagger
 * /libro/{idLibro}:
 *   delete:
 *     description: Elimina un libro por su ID
 *     tags: [Libro]
 *     parameters:
 *       - in: path
 *         name: idLibro
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro a eliminar
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente
 *       404:
 *         description: El libro no fue encontrado
 */
/**
 * @swagger
 * /libro/{idLibro}:
 *   put:
 *     description: Actualiza un libro por su ID
 *     tags: [Libro]
 *     parameters:
 *       - in: path
 *         name: idLibro
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro a actualizar
 *       - in: body
 *         name: libro
 *         description: Datos del libro a actualizar
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 *       404:
 *         description: El libro no fue encontrado
 */





/**
 *
@swagger
 * /libro:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
//CONSULTA
app.get('/libro', async (req, res) =>{
  try {
   if (typeof req.query.idLibro == 'undefined') {
     connection.query('SELECT * FROM libro', (err, rows) => {
       if (err) throw err;
       res.json(rows);
     });
   } else {
     connection.query(`SELECT * FROM libro WHERE idLibro = ${req.query.idLibro}`, (err, rows) => {
       if (err) throw err;
       if (rows.length === 0) {
         res.status(404).json({ error: 'Libro no encontrado' });
       } else {
         res.json(rows);
       }
     });
   }
  } catch (error) {
    res.status(500).json({ error: 'Error en la consulta a la base de datos' });
  }
 });



//INSERTAR
app.post('/libro', async (req, res) => {
  try {
    const { Nombre, Genero, SubGenero, Autor, Idioma, Editorial, Año } = req.body;
    
    connection.query(
      'INSERT INTO libro (Nombre, Genero, SubGenero, Autor, Idioma, Editorial, Año) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Nombre, Genero, SubGenero, Autor, Idioma, Editorial, Año]
    );
    
    res.status(201).json({ message: 'Libro insertado' });
  } catch (error) {
    console.error('Error al insertar:', error);
    res.status(404).json({ error: 'Error al insertar el libro' });
  } finally {
    connection.end();
  }
});



//ELIMINAR
app.delete('/libro/:idLibro', async (req, res) => {
  try {
    const idLibro = req.params.idLibro;
    
    connection.query(
      'DELETE FROM libro WHERE idLibro = ?',
      [idLibro],
      (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Ya esta eliminado' });
        } else {
          res.json({ message: 'Libro eliminado' });
        }
      }
    );
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
});




//ACTUALIZAR
app.put('/libro/:idLibro', async (req, res) => {
  try {
    const idLibro = req.params.idLibro;
    const { Nombre, Genero, SubGenero, Autor, Idioma, Editorial, Año } = req.body;
    
    connection.query(
      'UPDATE libro SET Nombre = ?, Genero = ?, SubGenero = ?, Autor = ?, Idioma = ?, Editorial = ?, Año = ? WHERE idLibro = ?',
      [Nombre, Genero, SubGenero, Autor, Idioma, Editorial, Año, idLibro],
      (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'no se pudo actualizar' });
        } else {
          res.json({ message: 'Libro actualizado' });
        }
      }
    );
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
});



const swaggerOptions = {
  definition: {
  openapi: '3.0.0',
  info: {
  title: 'API Libreria',
  version: '1.0.0',
  description: readmeFile
  },
  servers:[
  {url: "http://localhost:3000"}
  ], 
  },
  apis: [`${path.join(__dirname,"./index.js")}`],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
 // app.use("/api-docs", swaggerUI.serve,swaggerUI.setup(swaggerDocs));
 
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, options));
  app.get('/api-docs-json', (req, res) => {
    res.json(swaggerDocs);
  });

  app.use(express.static(path.join(__dirname, 'redoc.html')));

// Servir redoc.html en la ruta /redoc.html
app.get('/redoc.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});


app.listen(3000, () => {
  console.log('listening on port 3000!');
})
module.exports = app;