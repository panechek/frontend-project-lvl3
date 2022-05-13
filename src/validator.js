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
  const fssChanels = fs.map((chanel) => chanel.path);
  const schema = yup.string().url().notOneOf(fssChanels);

  try {
    schema.validateSync(value);
    return 'ok';
  } catch (err) {
    console.log(err);
    return err.message.key;
  }
};

export default validate;
