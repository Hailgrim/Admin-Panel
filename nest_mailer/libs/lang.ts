export type LangList = 'en' | 'ru';

const en = {
  email: 'Email',
  incorrect: (fieldName?: string) => `[${fieldName}] Incorrect`,
  mustBeAString: (fieldName?: string) => `[${fieldName}] Must be a string`,
  verificationCode: 'Verification code',
  resetPasswordCode: 'Reset password code',
  subjectRegistration: 'Registration',
  subjectForgotPassword: 'Forgot password',
};

export type LangDictionary = typeof en;
const lang = new Map<LangList, LangDictionary>();
lang.set('en', en);

const ru: LangDictionary = {
  ...en,
};
lang.set('ru', ru);

export default lang;
