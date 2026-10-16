/**
 * Represents a student with a unique ID, name and grades per subject.
 */
export class Student {
  /**
   * @param {number} id - Unique identifier.
   * @param {string} name - Student name.
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.grades = {};
  }

  /**
   * Adds or updates a grade for the given subject.
   * @param {string} subject
   * @param {number} grade
   */
  addGrade(subject, grade) {
    this.grades[subject] = grade;
  }

  /**
   * Removes a grade by subject.
   * @param {string} subject
   */
  removeGrade(subject) {
    delete this.grades[subject];
  }

  /**
   * Returns the average grade across all subjects (0 if no grades).
   * @returns {number}
   */
  getAverageGrade() {
    const values = Object.values(this.grades);
    if (values.length === 0) {
      return 0;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }

  /**
   * Human-readable summary of the student.
   * @returns {string}
   */
  get summary() {
    return `Студент ${this.name} (id: ${this.id}) — средний балл: ${this.getAverageGrade().toFixed(2)}`;
  }
}

/**
 * Groups students by their average grade (rounded down).
 * @param {Student[]} students
 * @returns {Map<number, Student[]>}
 */
export function groupStudentsByAverageGrade(students) {
  const map = new Map();
  students.forEach((student) => {
    const key = Math.floor(student.getAverageGrade());
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(student);
  });
  return map;
}

/**
 * Returns a unique list of all subjects across the given students.
 * @param {Student[]} students
 * @returns {string[]}
 */
export function getUniqueSubjects(students) {
  const set = new Set();
  students.forEach((student) => {
    Object.keys(student.grades).forEach((subject) => set.add(subject));
  });
  return [...set];
}

/**
 * Groups students by subject: Map<subject, Student[]>.
 * @param {Student[]} students
 * @returns {Map<string, Student[]>}
 */
export function groupStudentsBySubject(students) {
  const map = new Map();
  students.forEach((student) => {
    Object.keys(student.grades).forEach((subject) => {
      if (!map.has(subject)) {
        map.set(subject, []);
      }
      map.get(subject).push(student);
    });
  });
  return map;
}

/**
 * Returns students with the highest average grade.
 * @param {Student[]} students
 * @returns {Student[]}
 */
export function getTopStudents(students) {
  if (students.length === 0) {
    return [];
  }
  const maxAverage = Math.max(...students.map((s) => s.getAverageGrade()));
  return students.filter((s) => s.getAverageGrade() === maxAverage);
}

/**
 * Returns students who have a grade in the given subject (>= 3).
 * @param {Student[]} students
 * @param {string} subject
 * @returns {Student[]}
 */
export function findStudentsBySubject(students, subject) {
  return students.filter(
    (student) =>
      student.grades[subject] !== undefined && student.grades[subject] >= 3,
  );
}
