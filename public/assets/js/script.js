M.AutoInit();

const tabs = document.querySelector('.tabs');
var instance = M.Tabs.getInstance(tabs);
const studentInput = document.querySelector('#student');
const subjectInput = document.querySelector('#subject');
const typeInput = document.querySelector('#type');
const valueInput = document.querySelector('#value');
const searchInput = document.querySelector('#searchId');
const saveButton = document.querySelector('#save');
const clearButton = document.querySelector('#clear');
const searchButton = document.querySelector('#searchButton');
const msgResult = document.querySelector('#msgResult');
const msgTopList = document.querySelector('#msgTopList');
const tbody = document.querySelector('tbody');
const titleForm = document.querySelector('.card-title');
const newButton = document.querySelector('#new');
const calculateButton = document.querySelector('#totalCalculate');
const meanCalculateButton = document.querySelector('#meanCalculate');
const listBetterGradesButton = document.querySelector('#listBetterGrades');
const subjectSelector = document.querySelector('#subjectSelector');
const studentSearchInput = document.querySelector('#studentSearch');
const spanTotal = document.querySelector('#total');
const spanMean = document.querySelector('#mean');
const spanList = document.querySelector('#list');
const subjectSelectorMean = document.querySelector('#subjectSelectorMean');
const typeSelectorMean = document.querySelector('#typeSelectorMean');
const subjectSelectorBetter = document.querySelector('#subjectSelectorBetter');
const typeSelectorBetter = document.querySelector('#typeSelectorBetter');
const betterGradesTbody = document.querySelector('#betterGradesTbody');

let currentGradeEdit = null;
var selector = null;

window.addEventListener('DOMContentLoaded', async () => {
  const grades = await fetchGrades();
  const subjects = await fetchSubjects();
  const types = await fetchTypes();
  handleClearButton();
  handleSaveButton();
  handleNewButton();
  handleSearchIdButton();
  handleCalculateButton();
  handleMeanCalculateButton();
  handleListBetterGradesButton();
  handleSearchByEnterPressKeyUp();
  renderTable(grades);
  renderSubjects(subjects);
  renderSubjectsMean(subjects);
  renderTypesMean(types);
  renderSubjectsBetter(subjects);
  renderTypesBetter(types);
});

async function fetchTypes() {
  const res = await fetch('http://localhost:3000/type');
  const json = await res.json();
  return json;
}

async function fetchSubjects() {
  const res = await fetch('http://localhost:3000/subject');
  const json = await res.json();
  return json;
}

async function fetchGrades() {
  const res = await fetch('http://localhost:3000/grade');
  const json = await res.json();
  return json;
}

function renderSubjects(subjects) {
  subjcts = subjects.sort((a, b) => a.localeCompare(b));
  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelector.appendChild(option);
  });
  M.FormSelect.init(subjectSelector);
}

function renderSubjectsMean(subjects) {
  subjcts = subjects.sort((a, b) => a.localeCompare(b));
  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelectorMean.appendChild(option);
  });
  M.FormSelect.init(subjectSelectorMean);
}

function renderSubjectsBetter(subjects) {
  subjcts = subjects.sort((a, b) => a.localeCompare(b));
  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectSelectorBetter.appendChild(option);
  });
  M.FormSelect.init(subjectSelectorBetter);
}

function renderTypesMean(types) {
  types.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelectorMean.appendChild(option);
  });
  M.FormSelect.init(typeSelectorMean);
}
function renderTypesBetter(types) {
  types.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelectorBetter.appendChild(option);
  });
  M.FormSelect.init(typeSelectorBetter);
}

function renderTable(grades, msg) {
  if (msg) {
    msgTopList.textContent = msg;
    setTimeout(() => {
      msgTopList.textContent = '';
    }, 4500);
  }
  tbody.innerHTML = '';
  grades.forEach((grade) => {
    const tr = document.createElement('tr');
    const tdId = document.createElement('td');
    const tdStudent = document.createElement('td');
    const tdSubject = document.createElement('td');
    const tdType = document.createElement('td');
    const tdValue = document.createElement('td');
    const tdAction = document.createElement('td');
    const editIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');

    tdId.textContent = grade.id;
    tdStudent.textContent = grade.student;
    tdSubject.textContent = grade.subject;
    tdType.textContent = grade.type;
    tdValue.textContent = grade.value;

    editIcon.classList.add('material-icons');
    editIcon.textContent = 'edit';
    editIcon.id = grade.id;
    editIcon.addEventListener('click', editGrade);

    deleteIcon.classList.add('material-icons');
    deleteIcon.textContent = 'delete';
    deleteIcon.id = grade.id;
    deleteIcon.addEventListener('click', deleteGrade);

    tdAction.appendChild(deleteIcon);
    tdAction.appendChild(editIcon);

    tr.appendChild(tdId);
    tr.appendChild(tdStudent);
    tr.appendChild(tdSubject);
    tr.appendChild(tdType);
    tr.appendChild(tdValue);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });
}

function handleSaveButton() {
  saveButton.addEventListener('click', saveOrUpdate);
}

function handleClearButton() {
  clearButton.addEventListener('click', clear);
}

function handleNewButton() {
  newButton.addEventListener('click', newGrade);
}

function handleSearchIdButton() {
  searchButton.addEventListener('click', searchById);
}

function handleSearchByEnterPressKeyUp() {
  searchInput.addEventListener('keyup', searchById);
}

function handleCalculateButton() {
  calculateButton.addEventListener(
    'click',
    calculateTotalGradeBySubjectAndStudent
  );
}

function handleMeanCalculateButton() {
  meanCalculateButton.addEventListener(
    'click',
    calculateMeanGradeBySubjectAndType
  );
}

function handleListBetterGradesButton() {
  listBetterGradesButton.addEventListener('click', listBetterGrades);
}

async function listBetterGrades(event) {
  event.preventDefault();
  const subject = subjectSelectorBetter.value;
  const type = typeSelectorBetter.value;
  const data = await fetch(
    `http://localhost:3000/grade/better-grades?type=${type}&subject=${subject}`
  );
  const result = await data.json();
  result.forEach((grade) => {
    const tr = document.createElement('tr');
    const tdId = document.createElement('td');
    const tdStudent = document.createElement('td');
    const tdSubject = document.createElement('td');
    const tdType = document.createElement('td');
    const tdValue = document.createElement('td');

    tdId.textContent = grade.id;
    tdStudent.textContent = grade.student;
    tdSubject.textContent = grade.subject;
    tdType.textContent = grade.type;
    tdValue.textContent = grade.value;

    tr.appendChild(tdId);
    tr.appendChild(tdStudent);
    tr.appendChild(tdSubject);
    tr.appendChild(tdType);
    tr.appendChild(tdValue);

    betterGradesTbody.appendChild(tr);
  });
}
async function calculateMeanGradeBySubjectAndType(event) {
  event.preventDefault();
  const subject = subjectSelectorMean.value;
  const type = typeSelectorMean.value;
  const data = await fetch(
    `http://localhost:3000/grade/mean-value?type=${type}&subject=${subject}`
  );
  const result = await data.json();
  console.log('RESULTADO: ', result);
  spanMean.textContent = result.mean;
}

async function calculateTotalGradeBySubjectAndStudent(event) {
  event.preventDefault();
  const subject = subjectSelector.value;
  const student = studentSearchInput.value;
  const data = await fetch(
    `http://localhost:3000/grade/total-value?student=${student}&subject=${subject}`
  );
  const result = await data.json();
  spanTotal.textContent = result.total;
}

async function searchById(event) {
  const id = searchInput.value;
  console.log(event.key);

  if (event.key !== 'Enter') {
    return;
  }

  if (id) {
    const data = await fetch('http://localhost:3000/grade/' + id);
    const json = await data.json();
    if (json.error) {
      renderTable([], json.error);
      return;
    }
    renderTable([json]);
    return;
  } else {
    const grades = await fetchGrades();
    renderTable(grades);
    return;
  }
}

function newGrade(event) {
  event.preventDefault();
  currentGradeEdit = null;
  titleForm.textContent = 'Inserir Nota';
  clear(event);
}

function clear(event) {
  event.preventDefault();
  const inputs = document.querySelectorAll('input[type=text]');
  inputs.forEach((e) => {
    e.value = '';
  });
}

async function saveOrUpdate(event) {
  event.preventDefault();
  const grade = {
    student: studentInput.value,
    subject: subjectInput.value,
    type: typeInput.value,
    value: valueInput.value,
  };
  let json = null;
  if (!currentGradeEdit) {
    json = await save(grade);
  } else {
    grade.id = currentGradeEdit.id;
    json = await update(grade);
    currentGradeEdit = null;
  }

  if (json.error) {
    msgResult.textContent = json.error;
  } else {
    msgResult.textContent = 'Registro salvo com sucesso!';
    const refreshedGrade = await fetchGrades();
    renderTable(refreshedGrade);
    clear(event);
    titleForm.textContent = 'Inserir Nota';
  }
}

async function deleteGrade(event) {
  const id = +event.target.id;
  console.log(id);
  const res = await fetch('http://localhost:3000/grade/' + id, {
    method: 'DELETE',
  });
  const json = await res.json;
  console.log(json);
  let msg = null;
  if (json.error) {
    msg = json.error;
  } else {
    msg = 'Registro removido com sucesso!';
  }
  const refreshedGrade = await fetchGrades();
  renderTable(refreshedGrade, msg);
}
async function editGrade(event) {
  const id = +event.target.id;
  const data = await fetch('http://localhost:3000/grade/' + id);
  const json = await data.json();
  if (json.error) {
    msg = json.error;
    const refreshedGrade = await fetchGrades();
    renderTable(refreshedGrade);
  }
  currentGradeEdit = json;
  instance.select('test1');
  loadDataForm(currentGradeEdit);
}

function loadDataForm(data) {
  titleForm.textContent = `Editando nota de id: ${data.id}`;
  studentInput.value = data.student;
  subjectInput.value = data.subject;
  typeInput.value = data.type;
  valueInput.value = data.value;
  M.updateTextFields();
}

async function save(grade) {
  const res = await fetch('http://localhost:3000/grade', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grade),
  });

  const json = await res.json();

  return json;
}

async function update(grade) {
  const res = await fetch('http://localhost:3000/grade', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grade),
  });

  const json = await res.json();

  return json;
}
