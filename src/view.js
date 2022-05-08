import onChange from 'on-change';
import * as yup from 'yup';

export default () => {
  const state = {
    searchForm: {
      state: 'valid',
      feedback: '',
    },
    fss: ['https://ru.hexlet.io/lessons.rss'],
  };

  const schema = yup.string().url().nullable().notOneOf(state.fss);

  const validate = (value) => {
    try {
      schema.validateSync(value);
      return 'ok';
    } catch (e) {
      console.log(e);
      return e.message;
    }
  };

  const inputSearchForm = document.querySelector('#url-input');
  const feedbackSearch = document.querySelector('.feedback');
  const formSearch = document.querySelector('form');
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
    const validateResult = validate(inputSearchForm.value);
    console.log(validateResult);
    if (validateResult === 'ok') {
      state.fss.push(inputSearchForm.value);
      watchedState.searchForm = {
        state: 'valid',
        feedback: 'RSS успешно загружен',
      };
    } else if (validateResult === 'this must be a valid URL') {
      watchedState.searchForm = {
        state: 'invalid',
        feedback: 'Ссылка должна быть валидным URL',
      };
    } else {
      watchedState.searchForm = {
        state: 'invalid',
        feedback: 'RSS уже существует',
      };
    }
    console.log(state);
    e.preventDefault();
  });
};
