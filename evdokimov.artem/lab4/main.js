import {BlogPost, findPostsByTag} from './model.js';

const storageKey = 'lab4-blog-posts';
const list = document.querySelector('[data-testid="entity-list"]');
const postForm = document.querySelector('[data-testid="entity-form"]');
const error = document.querySelector('[data-error]');
const count = document.querySelector('[data-count]');
const empty = document.querySelector('[data-empty]');
const tagSearch = document.querySelector('#tag-search');

function loadPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) {
      return [];
    }
    return saved.map(
      (post) =>
        new BlogPost(
          post.id,
          post.title,
          post.tags,
          post.comments,
          post.content,
        ),
    );
  } catch {
    return [];
  }
}

let posts = loadPosts();
let pending = Promise.resolve();

function nextPostId() {
  return posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;
}

function update(action) {
  pending = pending.then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      error.textContent = '';
      action();
      localStorage.setItem(storageKey, JSON.stringify(posts));
      render();
    } catch (problem) {
      error.textContent = problem.message;
    }
  });
}

function makeElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }
  if (className) {
    element.className = className;
  }
  return element;
}

function makeInput(name, labelText) {
  const label = makeElement('label', labelText);
  const input = document.createElement('input');
  input.name = name;
  input.type = 'text';
  input.required = true;
  label.append(input);
  return label;
}

function makeButton(text, action) {
  const button = makeElement('button', text);
  button.type = 'button';
  button.dataset.action = action;
  return button;
}

function render() {
  list.replaceChildren();
  count.textContent = posts.length;
  const searchTag = tagSearch.value.trim().replace(/^#+/, '').trim();
  const visiblePosts = searchTag ? findPostsByTag(posts, searchTag) : posts;
  empty.hidden = visiblePosts.length > 0;
  empty.textContent = searchTag
    ? 'Постов с таким тегом нет.'
    : 'Постов пока нет.';

  for (const post of visiblePosts) {
    const card = makeElement('article');
    card.dataset.testid = 'entity-card';
    card.dataset.id = post.id;
    card.append(
      makeElement('h3', post.title, 'post-title'),
      makeElement(
        'p',
        `№${post.id} · Постов: ${posts.length} · Комментарии: ${post.commentCount}`,
        'post-meta',
      ),
    );
    const content = makeElement('div', '', 'post-content');
    content.append(
      makeElement('p', post.content || 'Текст не добавлен.', 'post-text'),
    );
    card.append(content);

    const discussion = makeElement('div', '', 'comments');
    discussion.append(makeElement('h4', 'Комментарии'));
    const comments = makeElement('ul');
    for (const comment of post.comments) {
      const item = makeElement('li');
      item.append(makeElement('strong', comment.author));
      item.append(makeElement('p', comment.text));
      comments.append(item);
    }
    if (post.comments.length) {
      discussion.append(comments);
    }

    const commentForm = makeElement('form');
    commentForm.dataset.action = 'add-comment';
    commentForm.append(
      makeInput('author', 'Автор'),
      makeInput('text', 'Комментарий'),
    );
    const commentSubmit = makeElement('button', 'Добавить комментарий');
    commentSubmit.type = 'submit';
    commentForm.append(commentSubmit);
    discussion.append(commentForm);
    card.append(discussion);

    const tags = makeElement('ul', '', 'tags');
    for (const tag of post.tags) {
      const item = makeElement('li');
      const removeTag = makeButton('×', 'remove-tag');
      removeTag.dataset.tag = tag;
      removeTag.setAttribute('aria-label', `Удалить тег ${tag}`);
      item.append(`#${tag} `, removeTag);
      tags.append(item);
    }
    const tagForm = makeElement('form');
    tagForm.dataset.action = 'add-tag';
    const tagSubmit = makeElement('button', 'Добавить тег', 'add-tag-button');
    tagSubmit.type = 'submit';
    tagForm.append(makeInput('tag', 'Новый тег'), tagSubmit);
    card.append(tags, tagForm);
    const deleteButton = makeButton('Удалить пост', 'delete-post');
    deleteButton.dataset.testid = 'delete-entity';
    card.append(deleteButton);

    list.append(card);
  }
}

postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(postForm);
  const title = String(data.get('title')).trim();
  const requestedId = String(data.get('id') || '').trim();
  const content = String(data.get('content') || '').trim();
  const tags = [
    ...new Set(
      String(data.get('tags') || '')
        .split(',')
        .map((tag) => tag.trim().replace(/^#+/, '').trim())
        .filter(Boolean),
    ),
  ];
  if (!title) {
    return;
  }
  update(() => {
    const id = requestedId ? Number(requestedId) : nextPostId();
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new Error('Введите положительный целый номер поста.');
    }
    if (posts.some((post) => post.id === id)) {
      throw new Error('Пост с таким номером уже существует.');
    }
    posts.push(new BlogPost(id, title, tags, [], content));
    postForm.reset();
  });
});

list.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const id = Number(form.closest('[data-testid="entity-card"]').dataset.id);
  const data = new FormData(form);
  const action = form.dataset.action;
  const tag = String(data.get('tag') || '')
    .trim()
    .replace(/^#+/, '')
    .trim();
  const author = String(data.get('author') || '').trim();
  const text = String(data.get('text') || '').trim();
  if (
    (action === 'add-tag' && !tag) ||
    (action === 'add-comment' && (!author || !text))
  ) {
    return;
  }
  update(() => {
    const post = posts.find((item) => item.id === id);
    if (!post) {
      return;
    }
    if (action === 'add-tag') {
      post.addTag(tag);
    }
    if (action === 'add-comment') {
      post.addComment({author, text});
    }
  });
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }
  const id = Number(button.closest('[data-testid="entity-card"]').dataset.id);
  const {action, tag} = button.dataset;
  update(() => {
    if (action === 'delete-post') {
      posts = posts.filter((post) => post.id !== id);
    }
    if (action === 'remove-tag') {
      posts.find((post) => post.id === id)?.removeTag(tag);
    }
  });
});

tagSearch.addEventListener('input', render);
render();
