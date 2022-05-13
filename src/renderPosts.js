import axios from 'axios';
import { uniqueId } from 'lodash';

export default (feeds, elements) => {
  const parser = new DOMParser();
  const data = [];
  const promises = feeds.map((feed) => axios.get(`https://allorigins.hexlet.app/get?url=${feed.path}&disableCache=true`)
    .then((v) => ({ value: v, id: feed.id }))
    .catch(() => ({ value: 'mistake', name: feed.title })));
  const promise = Promise.all(promises);
  promise.then((response) => {
    response.forEach((feedData) => {
      const document = parser.parseFromString(feedData.value.data.contents, 'application/xml');
      const posts = document.querySelectorAll('item');
      posts.forEach((post) => {
        if (feedData.value === 'mistake') {
          data.push({
            path: feedData.name,
            text: ' на данный момент не доступен',
          });
        } else {
          data.push({
            id: uniqueId(),
            feedsId: feedData.id,
            title: post.querySelector('title').textContent,
            description: post.querySelector('description').textContent,
            link: post.querySelector('link').textContent,
          });
        }
      });
    });
  })
    .then(() => {
      const cardPosts = document.createElement('div');
      cardPosts.classList.add('card', 'border-0');

      const cardPostsBody = document.createElement('div');
      cardPostsBody.classList.add('card-body');
      cardPosts.append(cardPostsBody);

      const cardPostsTitle = document.createElement('h2');
      cardPostsTitle.classList.add('card-title', 'h4');
      cardPostsTitle.textContent = 'Посты';
      cardPostsBody.append(cardPostsTitle);

      const ulPosts = document.createElement('ul');
      ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
      data.forEach((item) => {
        if ('name' in item) {
          const liPost = document.createElement('li');
          liPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
          liPost.textContent = `${item.name}${item.text}`;
        } else {
          const liPost = document.createElement('li');
          liPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
          const titlePost = document.createElement('a');
          titlePost.classList.add('fw-bold');
          titlePost.setAttribute('href', item.link);
          titlePost.setAttribute('data-id', item.id);
          titlePost.setAttribute('target', '_blank');
          titlePost.setAttribute('rel', 'noopener noreferrer');

          titlePost.textContent = item.title;
          liPost.append(titlePost);
          const buttonPost = document.createElement('button');
          buttonPost.textContent = 'Просмотр';
          buttonPost.classList.add('btn', 'btn-online-primary', 'btn-sm');
          buttonPost.setAttribute('type', 'button');
          buttonPost.setAttribute('data-id', item.id);
          buttonPost.setAttribute('data-bs-toggle', 'modal');
          buttonPost.setAttribute('data-bs-target', '#modal');
          liPost.append(buttonPost);
          ulPosts.append(liPost);
        }
      });
      cardPostsBody.append(ulPosts);
      elements.posts.append(cardPosts);
    });
};
