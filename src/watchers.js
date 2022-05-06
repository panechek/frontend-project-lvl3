import onChange from 'on-change';

 const watchedState = onChange(state, (path,value) => {
    const validateResult = validate(value);
    if (validateResult == 'ok') {
        console.log('validate ok')
    } else {
        state.searchForm.errors.push(validateResult);
        inputSearchForm.classList.add('is-invalid');
    }
});

export default watchedState;
