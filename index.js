import express from 'express';
import winston from 'winston';
import gradeRouter from './routes/gradeRouter.js';
import subjectRouter from './routes/subjectRouter.js';
import typeRouter from './routes/typeRouter.js';

const app = express();

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grade-api.log' }),
  ],
  format: combine(label({ label: 'grade-api' }), timestamp(), myFormat),
});

app.use(express.json());

app.use(express.static('public'));

app.use('/grade', gradeRouter);

app.use('/subject', subjectRouter);

app.use('/type', typeRouter);

app.listen(3000, () => {
  logger.info('Chanlange API Started');
});
