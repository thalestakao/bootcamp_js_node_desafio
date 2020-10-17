import { loadGrades } from './gradeController.js';

export const index = async (_, res, next) => {
  try {
    const data = await loadGrades();
    if (!data || !data.grades) {
      throw new Error('Não há registros disponíveis');
    }
    const types = data.grades.map((grade) => grade.type);
    if (!types) {
      throw new Error('Não há registros disponíveis');
    }
    const uniqueTypes = types
      .filter(
        (grade, index, self) => index === self.findIndex((t) => t === grade)
      )
      .sort((a, b) => a.localeCompare(b));
    res.send(uniqueTypes);
    logger.info(`GET /type ${uniqueTypes}`);
  } catch (err) {
    next(err);
  }
};
