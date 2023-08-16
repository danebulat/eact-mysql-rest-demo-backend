import express from 'express';
import path from 'path';
import { validationResult, matchedData } from 'express-validator';
import { fileURLToPath } from 'url';
import { bookValidate }  from '../validation/books.js';
import * as db           from '../services/db.js';
import { emptyOrRows }   from '../helper.js';
import config            from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const router     = express.Router();

/* route requests for static files to appropriate directory */
router.use(express.static(
  path.resolve(path.join(__dirname, `../${config.builddir}`)))
);

/* -------------------------------------------------- */
/* GET /books */
/* -------------------------------------------------- */

router.get('/books', async (_req, res, next) => {
  try {
    const sql = 'SELECT * FROM books';
    const rows = await db.query(sql);
    const data = emptyOrRows(rows);

    res.json(data);
  }
  catch (err) {
    console.error(`Error while getting books ${err.message}`);
    next(err);
  }
});

/* -------------------------------------------------- */
/* POST /books */
/* -------------------------------------------------- */

router.post('/books', bookValidate, async (req, res, next) => {

  // validate input
  const vResult = validationResult(req);
  if (!vResult.isEmpty()) {
    return res.json({ errors: vResult.array() });
  }

  try {
    // check total book count
    const bookCount = await db.getBooksCount();

    if (bookCount >= Number(config.bookLimit)) {
      const errors = {errors: [{msg: 'Book limit reached'}]};
      return res.json(errors);
    }

    const data = matchedData(req);
    const sql = `
      INSERT INTO books (
          \`title\`, \`desc\`, \`price\`, \`cover\`
        )
      VALUES (
        '${data.title}',
        '${data.desc}',
         ${data.price},
        '${data.cover}'
    )`;

    const result = await db.query(sql);

    if (result.affectedRows) {
      const q2 = `
        SELECT * FROM books 
        ORDER BY id DESC 
        LIMIT 1
      `;

      const row = await db.query(q2);
      const newBook = emptyOrRows(row);

      res.json(newBook);
    }
    else {
      throw new Error("Error adding book");
    }
  }
  catch (err) {
    console.error(`Error while creating book ${err.message}`);
    next(err);
  }
});

/* -------------------------------------------------- */
/* DELETE /books/:id */
/* -------------------------------------------------- */

router.delete('/books/:id', async (req, res, next) => {
  try {
    const sql = `DELETE FROM books WHERE id = ${req.params.id}`;
    const result  = await db.query(sql);
    const message = result.affectedRows 
      ? 'Book deleted successfully'
      : 'Error when deleting user';

    res.json({ message });
  }
  catch (err) {
    console.error(`Error while deleting book ${err.message}`);
    next(err);
  }
});

/* -------------------------------------------------- */
/* PUT /books/:id */
/* -------------------------------------------------- */

router.put('/books/:id', bookValidate, async (req, res, next) => {

  const vResult = validationResult(req);

  if (!vResult.isEmpty()) {
    return res.json({ errors: vResult.array() });
  }

  try {
    const data = matchedData(req);
    const sql = `
      UPDATE books
      SET \`title\` = '${data.title}',
          \`desc\`  = '${data.desc}',
          \`price\` =  ${data.price},
          \`cover\` = '${data.cover}'
      WHERE id = ${req.params.id}
    `;

    const result = db.query(sql);
    const message = result.affectedRows
      ? 'Book updated successfully'
      : 'Error when updating book';

    res.json({ message });
  }
  catch (err) {
    console.error(`Error when updating book ${err.message}`);
    next(err);
  }
});

/* -------------------------------------------------- */
/* Catch-all route to index.html                      */
/* -------------------------------------------------- */

router.get('/*', (_req, res) => {
  res.sendFile(path.resolve(__dirname + `/../${config.builddir}/index.html`));
});

export {
  router
};
