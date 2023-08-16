import 'dotenv/config';
import express    from 'express';
import cors       from 'cors';
import { router } from './routes/books.js';
import { config } from './config.js';

const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

console.log(`subdir: ${String(config.subdir)}`);

/* url subdir */
app.use(config.subdir, router);

/* error handler middleware */
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});
 
/* listen */
app.listen(config.port, () => {
  console.log(`server listening on port: ${config.port}`);
});
