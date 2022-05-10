import * as yup from 'yup';

const validate = (value, fs, i18next) => {
  yup.setLocale({
    string: {
      url: () => ({ key: i18next.t('url') }),
    },
    mixed: {
      notOneOf: () => ({ key: i18next.t('notOneOf') }),
    },
  });

  const schema = yup.string().url().notOneOf(fs);
  try {
    schema.validateSync(value);
    return 'ok';
  } catch (err) {
    return err.message.key;
  }
};

export default validate;
