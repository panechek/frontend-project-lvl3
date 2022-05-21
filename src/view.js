import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import validate from './validator.js';
import ru from './ru.js';
import parserData from './parserData.js';
import render from './render.js';

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

    switch (value) {
      case 'validate':
        state.error = validate(elements.inputSearchForm.value, state.feeds, i18nInstance);
        if (state.error !== 'ok') {
          render('feedback', state, i18nInstance, elements);
          state.status = 'empty';
        } else {
          axios.get(`https://allorigins.hexlet.app/get?url=${elements.inputSearchForm.value}&disableCache=true`)
            .then((response) => {
              if (parser.parseFromString(response.data.contents, 'application/xml').querySelector('rss') === null) {
                state.error = i18nInstance.t('invalidRss');
                render('feedback', state, i18nInstance, elements);
                state.status = 'empty';
              } else {
                state.paths.push(elements.inputSearchForm.value);
                watchedState.status = 'loading';
              }
            })
            .catch(() => {
              state.status = 'empty';
              state.error = 'netMistake';
              render('feedback', state, i18nInstance, elements);
            });
        }
        break;

      case 'loading':
        axios.get(`https://allorigins.hexlet.app/get?url=${state.paths[state.paths.length - 1]}&disableCache=true`)
          .then((response) => {
            if (response.status === 404) {
              throw new Error('netMistake');
            } else {
              const document = parser.parseFromString(response.data.contents, 'application/xml');
              state.feeds.push({
                id: uniqueId(),
                path: elements.inputSearchForm.value,
                title: document.querySelector('title').textContent,
                description: document.querySelector('description').textContent,
              });
              state.error = 'sucsess';
              render('feedback', state, i18nInstance, elements);
              elements.inputSearchForm.value = '';
              elements.inputSearchForm.focus();
            }
          })
          .then(() => {
            render('feed', state, i18nInstance, elements);
            watchedState.status = 'loaded';
          })
          .catch(() => {
            state.error = 'netMistake';
            render('feedback', state, i18nInstance, elements);
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
