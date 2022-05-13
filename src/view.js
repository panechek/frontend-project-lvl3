import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import validate from './validator.js';
import ru from './ru.js';

import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const state = {
    status: 'empty',
    feeds: [],
    posts: [],
  };

  const elements = {
    inputSearchForm: document.querySelector('#url-input'),
    feedbackSearch: document.querySelector('.feedback'),
    formSearch: document.querySelector('form'),
    feed: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };
  const parser = new DOMParser();

  const watchedState = onChange(state, (path, value) => {
    const n = () => {
      watchedState.status = 'loaded';
    };

    switch (value) {
      case 'validate':
        const validateResult = validate(elements.inputSearchForm.value, state.feeds, i18nInstance);
        if (validateResult === 'ok') {
          watchedState.status = 'loading';
        } else {
          elements.feedbackSearch.textContent = validateResult;
          elements.inputSearchForm.classList.add('is-invalid');
          elements.feedbackSearch.classList.add('text-danger');
        }
        break;

      case 'loading':
        axios.get(`https://allorigins.hexlet.app/get?url=${elements.inputSearchForm.value}&disableCache=true`)
          .then((response) => {
            const document = parser.parseFromString(response.data.contents, 'application/xml');
            state.feeds.push({
              id: uniqueId(),
              path: elements.inputSearchForm.value,
              title: document.querySelector('title').textContent,
              description: document.querySelector('description').textContent,
            });
            elements.feedbackSearch.textContent = i18nInstance.t('sucsess');
            elements.inputSearchForm.classList.remove('is-invalid');
            elements.feedbackSearch.classList.remove('text-danger');
            elements.feedbackSearch.classList.add('text-success');
            elements.inputSearchForm.value = '';
            elements.inputSearchForm.focus();
          })
          .then(() => {
            const feedList = renderFeeds(state.feeds);
            elements.feed.innerHTML = '';
            elements.feed.append(feedList);
            watchedState.status = 'loaded';
          })
          .catch((e) => {
            console.log(e);
            elements.feedbackSearch.textContent = i18nInstance.t('invalidRss');
            elements.inputSearchForm.classList.add('is-invalid');
            elements.feedbackSearch.classList.add('text-danger');
          });
        break;

      case 'loaded':
        elements.posts.innerHTML = '';
        renderPosts(state.feeds, elements);
        state.status = 'pause';
        setTimeout(n, 5000);
        break;
      default:
        break;
    }
  });
  elements.formSearch.addEventListener('submit', (e) => {
    watchedState.status = 'validate';
    e.preventDefault();
  });
};
