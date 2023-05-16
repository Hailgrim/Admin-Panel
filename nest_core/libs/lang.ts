export type LangList = 'en' | 'ru';

const en = {
  adminPanel: 'Admin Panel',
  adminPanelAPIDescription: 'The Admin Panel API description',
  entityCreation: 'Creating an entity',
  getEntity: 'Get entity',
  getEntities: 'Get entities',
  updateEntity: 'Update entity',
  deleteEntity: 'Delete entity',
  users: 'Users',
  email: 'Email',
  password: 'Password',
  rememberMe: 'Remember me',
  name: 'Name',
  description: 'Description',
  path: 'Path',
  status: 'Status',
  default: 'Default',
  searchQuery: 'Search query',
  roles: 'Roles',
  adminStatus: 'Admin status',
  defaultAdminRole: 'Default admin role',
  defaultUserRole: 'Default user role',
  resources: 'Resources',
  userId: 'User ID',
  roleId: 'Role ID',
  resourceId: 'Resource ID',
  creating: 'Creating',
  listing: 'Listing',
  reading: 'Reading',
  updating: 'Updating',
  deleting: 'Deleting',
  incorrect: (fieldName?: string) => `[${fieldName}] Incorrect`,
  defaultResource: (name: string) => `Default ${name} resource`,
  fieldLength: (
    fieldName: string | undefined,
    from: string | number,
    to: string | number,
  ) => `[${fieldName}] Not less than ${from} and not more than ${to}`,
  mustBeAString: (fieldName?: string) => `[${fieldName}] Must be a string`,
  mustBeABoolean: (fieldName?: string) => `[${fieldName}] Must be a boolean`,
  mustBeANumber: (fieldName?: string) => `[${fieldName}] Must be a number`,
  mustBeAStrong: (fieldName?: string) => `[${fieldName}] Too simple`,
  authorization: 'Authorization',
  refreshToken: 'Refresh token',
  signUp: 'Sign up',
  signIn: 'Sign in',
  signOut: 'Sign out',
  verified: 'Verification status',
  verificationCode: 'Verification code',
  forgotPassword: 'Forgot password',
  resetPasswordCode: 'Reset password code',
  refresh: 'Refresh',
  page: 'Page',
  quantity: 'Quantity',
  isCountingNecessary: 'Is counting necessary',
  confirmRegistration: 'Confirm registration',
  resetPassword: 'Reset password',
  profile: 'Profile',
  updateProfile: 'Update profile',
};

export type LangDictionary = typeof en;
const lang = new Map<LangList, LangDictionary>();
lang.set('en', en);

const ru: LangDictionary = {
  ...en,
};
lang.set('ru', ru);

export default lang;
