import { promises as fs } from 'fs';

export const index = async (_, res, next) => {
  try {
    const data = await loadGrades();
    res.send(data.grades);
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error('Student, subject, type e value são obrigatórios');
    }
    const data = await loadGrades();
    grade = {
      id: data.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      value: parseInt(grade.value),
      timestamp: new Date(),
    };
    data.grades.push(grade);
    await saveGrades(data);
    res.send(grade);
    logger.info(`POST /grade ${JSON.stringify(grade, null, 2)}`);
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      !grade.id ||
      !grade.student ||
      !grade.subject ||
      !grade.value ||
      !grade.type
    ) {
      throw new Error('Id, student, subject, type e value são obrigatórios');
    }
    const data = await loadGrades();

    if (!data || !data.grades.length) {
      throw new Error('Não há registros disponíveis.');
    }

    const index = data.grades.findIndex((g) => g.id === grade.id);
    if (index === -1) {
      throw new Error('O registro solicitado para modificação não existe.');
    }
    data.grades[index].studente = grade.student;
    data.grades[index].subject = grade.subject;
    data.grades[index].type = grade.type;
    data.grades[index].value = parseInt(grade.value);
    await saveGrades(data);
    res.send(grade);
    logger.info(`PUT /grade ${JSON.stringify(data.grades[index], null, 2)}`);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error('É necessário informar um ID.');
    }
    const id = parseInt(req.params.id);
    const data = await loadGrades();
    if (!data || !data.grades.length) {
      throw new Error('Não há registros disponíveis.');
    }

    const hasData = data.grades.some((g) => g.id === id);
    if (!hasData) {
      throw new Error('O registro solicitado para exclusão não existe.');
    }
    data.grades = data.grades.filter((g) => g.id !== id);
    await saveGrades(data);
    res.send(data);
    logger.info(`DELETE /grade/:id ${req.params.id}`);
  } catch (err) {
    next(err);
  }
};
export const get = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error('É necessário informar um ID.');
    }
    const id = parseInt(req.params.id);
    const data = await loadGrades();
    if (!data || !data.grades.length) {
      throw new Error('Não há registros disponíveis.');
    }
    const grade = data.grades.find((g) => g.id === id);
    if (!grade) {
      throw new Error('Não há registro com o ID consultado.');
    }
    res.send(grade);
    logger.info(`GET /grade/:id ${JSON.stringify(grade, null, 2)}`);
  } catch (err) {
    next(err);
  }
};
export const totalGrade = async (req, res, next) => {
  try {
    const { student, subject } = req.query;
    if (!student || !subject) {
      throw new Error('Student e subject são obrigatórios');
    }
    const data = await loadGrades();
    if (!data || !data.grades.length) {
      throw new Error('Não há registros disponíveis.');
    }
    const total = data.grades.reduce((acc, grade) => {
      if (grade.student === student && grade.subject === subject) {
        return grade.value + acc;
      }
      return acc;
    }, 0);
    const result = {
      student,
      subject,
      total,
    };
    res.send(result);
    logger.info(`GET /grade/total-value ${JSON.stringify(result, null, 2)}`);
  } catch (err) {
    next(err);
  }
};

export const meanGradeBySubjectAndType = async (req, res, next) => {
  try {
    const { type, subject } = req.query;
    if (!type || !subject) {
      throw new Error('type e subject são obrigatórios');
    }
    const data = await loadGrades();
    if (!data || !data.grades.length) {
      throw new Error('Não há registros disponíveis.');
    }
    let qt = 0;
    const total = data.grades.reduce((acc, grade) => {
      if (grade.type === type && grade.subject === subject) {
        qt++;
        console.log(grade.student, ' - ', grade.value);
        return grade.value + acc;
      }
      return acc;
    }, 0);
    const result = {
      subject,
      type,
      mean: total / qt,
    };
    res.send(result);
    logger.info(`GET /grade/mean-value ${JSON.stringify(result, null, 2)}`);
  } catch (err) {
    next(err);
  }
};
export const betterGradesBySubjectAndType = async (req, res, next) => {
  try {
    const { subject, type } = req.query;
    if (!subject || !type) {
      throw new Error('subject e type são obrigatórios');
    }

    const data = await loadGrades();
    data.grades = data.grades
      .filter((g) => g.subject === subject && g.type === type)
      .sort((a, b) => b.value - a.value);
    const result = data.grades.slice(0, 3);

    res.send(result);
    logger.info(`GET /grade/better-grades ${JSON.stringify(result, null, 2)}`);
  } catch (err) {
    next(err);
  }
};

export async function loadGrades() {
  const data = JSON.parse(await fs.readFile('grades.json'));
  return data;
}

async function saveGrades(data) {
  await fs.writeFile('grades.json', JSON.stringify(data, null, 2));
}
