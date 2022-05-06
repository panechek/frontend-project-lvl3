import * as yup from 'yup';
import watchedState from './watchers';
// import axios from 'axios';

export default () => {
    const state = {
        searchForm: {
            // state: 'invalid',
            data: '',
            errors: [],
        },
    };
    const schema = yup.object().shape({
        website: yup.string().url().nullable(),
      });

    const validate = (value) => {
        try {
          schema.validateSync(value, { abortEarly: false });
          return 'ok';
        } catch (e) {
          return {value};
        }
      };

    const inputSearchForm = document.querySelector('#url-input');
    const feedbackSearch =  document.querySelector('.feedback');
    const formSearch = document.querySelector('form');
    
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.searchForm.data = inputSearchForm.value
        console.log(state.searchForm.data)
    })
}