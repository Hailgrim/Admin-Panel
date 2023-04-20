import { RESOURCES_REPOSITORY } from 'libs/constants';
import { Resource } from './resource.entity';

export const resourcesProviders = [
  {
    provide: RESOURCES_REPOSITORY,
    useValue: Resource,
  },
];
