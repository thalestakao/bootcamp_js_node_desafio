import { loadGrades } from './gradeController.js';
export const index = async (_, res, next) => {
  try {
    const data = await loadGrades();
    if (!data || !data.grades) {
      throw new Error('Não há registros disponíveis');
    }
    const subjects = data.grades.map((grade) => grade.subject);
    if (!subjects) {
      throw new Error('Não há registros disponíveis');
    }
    const uniqueSubjects = subjects.filter(
      (subject, index, self) => index === self.findIndex((t) => t === subject)
    );
    res.send(uniqueSubjects);
    logger.info(`GET /subject ${uniqueSubjects}`);
  } catch (err) {
    next(err);
  }
};
