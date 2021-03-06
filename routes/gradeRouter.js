import express from 'express';
import * as gradeController from '../controller/gradeController.js';
const router = express.Router();

router.get('/', gradeController.index);
// /grades?student=Thales Baliero Takáo&subject=01 - Javascript --> Query Params
router.get('/total-value', gradeController.totalGrade);

router.get('/mean-value', gradeController.meanGradeBySubjectAndType);

router.get('/better-grades', gradeController.betterGradesBySubjectAndType);

// /grades/1/01-Javascript -> Path/URI/URL Variable
router.get('/:id', gradeController.get);

router.post('/', gradeController.create);

router.put('/', gradeController.update);

router.delete('/:id', gradeController.remove);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});
export default router;
