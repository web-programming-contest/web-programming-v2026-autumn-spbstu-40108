import {Student} from './model.js';

const STORAGE_KEY = 'lab4-students';

/** @type {Student[]} */
let students = [];

/**
 * Loads students from localStorage.
 */
function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return;
    }
    students = parsed.map((item) => {
      const student = new Student(item.id, item.name);
      student.grades = item.grades || {};
      return student;
    });
  } catch {
    students = [];
  }
}

/**
 * Saves students to localStorage.
 */
function saveToStorage() {
  const plain = students.map((s) => ({
    id: s.id,
    name: s.name,
    grades: s.grades,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
}

/**
 * Simulates an async operation using Promise + setTimeout.
 * @param {() => void} action
 * @returns {Promise<void>}
 */
function asyncAction(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, 300);
  });
}

/**
 * Renders the list of students.
 */
function renderStudents() {
  const list = document.querySelector('[data-testid="entity-list"]');
  if (!list) {
    return;
  }
  list.innerHTML = '';

  students.forEach((student) => {
    const card = document.createElement('article');
    card.className = 'student-card';
    card.setAttribute('data-testid', 'entity-card');

    const title = document.createElement('h2');
    title.textContent = `${student.name} (ID: ${student.id})`;
    card.appendChild(title);

    const avg = document.createElement('p');
    avg.textContent = `Средний балл: ${student.getAverageGrade().toFixed(2)}`;
    card.appendChild(avg);

    const subjectsList = document.createElement('ul');
    subjectsList.className = 'student-card-subjects';
    Object.entries(student.grades).forEach(([subject, grade]) => {
      const li = document.createElement('li');
      li.textContent = `${subject}: ${grade}`;
      subjectsList.appendChild(li);
    });
    card.appendChild(subjectsList);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.setAttribute('data-testid', 'delete-entity');
    deleteButton.addEventListener('click', () => {
      asyncAction(() => {
        students = students.filter((s) => s.id !== student.id);
        saveToStorage();
        renderStudents();
      });
    });
    card.appendChild(deleteButton);

    list.appendChild(card);
  });

  updateStudentSelect();
}

/**
 * Updates the student select options in the grade form.
 */
function updateStudentSelect() {
  const select = document.querySelector(
    'form[data-testid="grade-form"] select[name="studentId"]',
  );
  if (!select) {
    return;
  }
  const currentValue = select.value;
  select.innerHTML = '<option value="">— выберите —</option>';
  students.forEach((student) => {
    const option = document.createElement('option');
    option.value = String(student.id);
    option.textContent = `${student.name} (ID: ${student.id})`;
    select.appendChild(option);
  });
  select.value = currentValue;
}

/**
 * Initializes the UI event handlers.
 */
function initUI() {
  const form = document.querySelector('form[data-testid="entity-form"]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const idInput = form.elements.id;
      const nameInput = form.elements.name;
      const id = idInput ? idInput.value.trim() : '';
      const name = nameInput ? nameInput.value.trim() : '';
      if (!id || !name) {
        return;
      }
      asyncAction(() => {
        const student = new Student(Number(id) || id, name);
        students.push(student);
        saveToStorage();
        renderStudents();
        form.reset();
      });
    });
  }

  const gradeForm = document.querySelector('form[data-testid="grade-form"]');
  if (gradeForm) {
    gradeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const studentId = gradeForm.elements.studentId?.value;
      const subject = gradeForm.elements.subject?.value.trim();
      const grade = Number(gradeForm.elements.grade?.value);
      if (!studentId || !subject || Number.isNaN(grade)) {
        return;
      }
      const student = students.find((s) => String(s.id) === String(studentId));
      if (!student) {
        return;
      }
      asyncAction(() => {
        student.addGrade(subject, grade);
        saveToStorage();
        renderStudents();
        gradeForm.reset();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  initUI();
  renderStudents();
});
