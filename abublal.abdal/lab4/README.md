# Лабораторная работа 4

## Задание

Вариант 2. Реализовать модель студентов с оценками и интерактивный интерфейс.

Модель (`model.js`):

- класс `Student` с полями `id`, `name`, `grades`;
- методы `addGrade(subject, grade)`, `removeGrade(subject)`,
  `getAverageGrade()`;
- геттер `summary`;
- функции коллекций: `groupStudentsByAverageGrade`, `getUniqueSubjects`,
  `groupStudentsBySubject`, `getTopStudents`, `findStudentsBySubject`.

Интерфейс (`main.js`):

- добавление и удаление студентов;
- добавление оценок;
- асинхронные операции через `Promise` + `setTimeout`;
- сохранение в `localStorage` и восстановление при перезагрузке;
- публичный DOM-контракт: `entity-list`, `entity-form`, `entity-card`,
  `delete-entity`.

## Реализация

`model.js` экспортирует класс `Student` и пять функций для работы с коллекцией.
Средний балл вычисляется по объекту `grades`; геттер `summary` возвращает строку
с именем, ID и средним баллом.

`main.js` загружает данные из `localStorage`, отрисовывает карточки студентов и
обрабатывает формы. Все изменения (добавление/удаление студента, добавление
оценки) выполняются асинхронно через `Promise` и `setTimeout`, после чего
состояние сохраняется и список перерисовывается без перезагрузки страницы.

## Запуск

Откройте `index.html` в браузере. Для работы `localStorage` и ES-модулей
рекомендуется использовать локальный сервер (например, Live Server в VS Code).
