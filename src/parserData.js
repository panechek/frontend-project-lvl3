import axios from 'axios';
import _ from 'lodash';
import render from './render.js';

export default (state, elements, i18nInstance) => {
  const links = state.posts.map((post) => post.link);
  const parser = new DOMParser();
  const promises = state.feeds.map((feed) => axios.get(`https://allorigins.hexlet.app/get?url=${feed.path}&disableCache=true`)
    .then((v) => ({ value: v, id: feed.id }))
    .catch(() => ({ value: 'mistake', name: feed.title })));
  const promise = Promise.all(promises);
  promise.then((response) => {
    response.forEach((feedData) => {
      const document = parser.parseFromString(feedData.value.data.contents, 'application/xml');
      const posts = document.querySelectorAll('item');

      posts.forEach((post) => {
        const postLink = post.querySelector('link').textContent;
        if (!links.includes(postLink)) {
          state.posts.unshift({
            id: _.uniqueId(),
            feedsId: feedData.id,
            title: post.querySelector('title').textContent,
            description: post.querySelector('description').textContent,
            link: post.querySelector('link').textContent,
            time: post.querySelector('pubDate').textContent,
            viewed: false,
          });
        }
      });
    });
  }).then(() => {
    render('post', state, i18nInstance, elements);
  })
    .catch(() => {
      state.error = 'netMistake';
      render('feedback', state, i18nInstance, elements);
    });
};
