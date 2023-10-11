/** Name validation regex */
export const NAME_REGEX = /^([A-Za-z0-9\s]){1,100}$/
/** Email validation regex */
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
/** Password validation regex */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,100}$/

export enum Rights {
  Creating = 'creating',
  Listing = 'listing',
  Reading = 'reading',
  Updating = 'updating',
  Deleting = 'deleting',
}
