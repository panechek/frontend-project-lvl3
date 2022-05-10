import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import validate from './validator.js';
import ru from './ru.js';

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
    searchForm: {
      state: 'valid',
      feedback: '',
    },
    fss: [],
  };

  const inputSearchForm = document.querySelector('#url-input');
  const feedbackSearch = document.querySelector('.feedback');
  const formSearch = document.querySelector('form');
  // const feed = document.querySelector('.posts');
  const watchedState = onChange(state, (path, value) => {
    feedbackSearch.textContent = value.feedback;

    if (value.state === 'invalid') {
      inputSearchForm.classList.add('is-invalid');
      feedbackSearch.classList.add('text-danger');
    } else {
      inputSearchForm.classList.remove('is-invalid');
      feedbackSearch.classList.remove('text-danger');
      feedbackSearch.classList.add('text-success');
      inputSearchForm.value = '';
      inputSearchForm.focus();
    }
  });

  formSearch.addEventListener('submit', (e) => {
    const validateResult = validate(inputSearchForm.value, state.fss, i18nInstance);
    console.log(validateResult);
    if (validateResult === 'ok') {
      state.fss.push(inputSearchForm.value);
      axios.get(state.fss[0])
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      watchedState.searchForm = {
        state: 'valid',
        feedback: i18nInstance.t('sucsess'),
      };
    } else if (validateResult === 'this must be a valid URL') {
      watchedState.searchForm = {
        state: 'invalid',
        feedback: validateResult,
      };
    } else {
      watchedState.searchForm = {
        state: 'invalid',
        feedback: validateResult,
      };
    }
    e.preventDefault();
  });
};
