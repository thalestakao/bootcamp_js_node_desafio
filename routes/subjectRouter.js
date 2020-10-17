import express from 'express';
import * as subjectController from '../controller/subjectController.js';
const router = express.Router();

router.get('/', subjectController.index);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
