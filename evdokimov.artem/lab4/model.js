export class BlogPost {
  constructor(id, title, tags = [], comments = [], content = '') {
    this.id = id;
    this.title = title;
    this.content = content;
    this.tags = [...tags];
    this.comments = comments.map((comment) => ({...comment}));
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((item) => item !== tag);
  }

  addComment(comment) {
    this.comments.push({...comment});
  }

  get commentCount() {
    return this.comments.length;
  }
}

export function groupPostsByTag(posts) {
  const groups = new Map();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      groups.get(tag).push(post);
    }
  }
  return groups;
}

export function getUniqueTags(posts) {
  return new Set(posts.flatMap((post) => post.tags));
}

export function groupPostsByCommentCount(posts) {
  const groups = new Map();
  for (const post of posts) {
    const count = post.comments.length;
    if (!groups.has(count)) {
      groups.set(count, []);
    }
    groups.get(count).push(post);
  }
  return groups;
}

export function findPostsByTag(posts, tag) {
  return posts.filter((post) => post.tags.includes(tag));
}

export function getCommentAuthors(posts) {
  return posts.flatMap((post) =>
    post.comments.map((comment) => comment.author),
  );
}
