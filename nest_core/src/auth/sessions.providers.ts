import { SESSION_REPOSITORY } from 'libs/constants';
import { Session } from './session.entity';

export const sessionsProviders = [
  {
    provide: SESSION_REPOSITORY,
    useValue: Session,
  },
];
