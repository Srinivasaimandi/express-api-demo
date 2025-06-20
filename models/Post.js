/**
 * @author: srinivasaimandi
 */

class Post {
  constructor({ id, userId, title, content }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
  }
}
module.exports = Post;