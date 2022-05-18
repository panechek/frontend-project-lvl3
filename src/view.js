import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import validate from './validator.js';
import ru from './ru.js';
import parserData from './parserData.js';
import renderFeeds from './renderFeeds.js';

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
    paths: [],
    feeds: [],
    posts: [],
    error: '',
  };

  const elements = {
    body: document.querySelector('body'),
    inputSearchForm: document.querySelector('#url-input'),
    feedbackSearch: document.querySelector('.feedback'),
    formSearch: document.querySelector('form'),
    feed: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modal-footer a'),
  };
  const parser = new DOMParser();
  const watchedState = onChange(state, (path, value) => {
    const n = (errorMoment) => {
      watchedState.status = errorMoment;
    };
    if (path === 'status') {
      switch (value) {
        case 'validate':
          const validateResult = validate(elements.inputSearchForm.value, state.feeds, i18nInstance);
          if (validateResult !== 'ok') {
            watchedState.error = validateResult;
          } else {
            axios.get(`https://allorigins.hexlet.app/get?url=${elements.inputSearchForm.value}&disableCache=true`)
              .then((response) => {
                if (parser.parseFromString(response.data.contents, 'application/xml').querySelector('rss') === null) {
                  watchedState.error = 'invalidRSS';
                } else {
                  state.paths.push(elements.inputSearchForm.value);
                  watchedState.status = 'loading';
                }
              })
              .catch((e) => {
                watchedState.error = e.message;
              });
          }
          break;

        case 'loading':
          axios.get(`https://allorigins.hexlet.app/get?url=${state.paths[state.paths.length - 1]}&disableCache=true`)
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
              elements.modal.setAttribute('wfd-invisible', 'true');
              watchedState.status = 'loaded';
            })
            .catch((e) => {
              watchedState.error = e.message;
            });
          break;

        case 'loaded':
          parserData(state, elements, i18nInstance);
          state.status = 'pause';
          setTimeout(() => n('loaded'), 5000);
          break;
        default:
          break;
      }
    }

    if (path === 'error') {
      elements.inputSearchForm.classList.add('is-invalid');
      elements.feedbackSearch.classList.add('text-danger');
      switch (value) {
        case 'Network Error':
          elements.feedbackSearch.textContent = i18nInstance.t('netMistake');
          const errorMoment = state.status;
          state.status = 'pause';
          state.error = '';
          setTimeout(() => n(errorMoment), 5000);
          break;
        case 'invalidRSS':
          elements.feedbackSearch.textContent = i18nInstance.t('invalidRss');
          state.status = 'start';
          state.error = '';
          break;
        default:
          elements.feedbackSearch.textContent = state.error;
          state.status = 'start';
          state.error = '';
          break;
      }
    }
  });

  elements.modal.addEventListener('show.bs.modal', (e) => {
    const id = e.relatedTarget.getAttribute('data-id');
    const post = state.posts.filter((item) => item.id === id);
    post[0].viewed = true;
    elements.modalTitle.textContent = post[0].title;
    elements.modalBody.textContent = post[0].description;
    elements.modalLink.setAttribute('href', post[0].link);
    parserData(state, elements, i18nInstance);
  });

  elements.formSearch.addEventListener('submit', (e) => {
    watchedState.status = 'validate';
    e.preventDefault();
  });
};
