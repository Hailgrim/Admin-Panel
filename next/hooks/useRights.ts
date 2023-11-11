import { useEffect, useState } from 'react';

import { useAppSelector } from '../store/hooks';

const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
}

const useRights = (path: string) => {
  const route = path.startsWith('/') ? path.slice(1) : path;
  const [rights, setRights] = useState(defaultRights);
  const profile = useAppSelector(store => store.app.profile);

  useEffect(() => {
    setRights(oldRights => {
      if (profile?.roles) {
        const roles = Array.isArray(profile.roles)
          ? profile.roles
          : [profile.roles];

        const newRights = { ...defaultRights };

        for (const role of roles) {
          if (role.admin) {
            newRights.creating = true;
            newRights.reading = true;
            newRights.updating = true;
            newRights.deleting = true;
            break;
          }

          if (role.resources) {
            for (const resource of role.resources) {
              if (resource.path !== route || resource.RolesResources === undefined) continue;
              newRights.creating = resource.RolesResources.creating;
              newRights.reading = resource.RolesResources.reading;
              newRights.updating = resource.RolesResources.updating;
              newRights.deleting = resource.RolesResources.deleting;
            }
          }
        }

        if (
          oldRights.creating !== newRights.creating ||
          oldRights.reading !== newRights.reading ||
          oldRights.updating !== newRights.updating ||
          oldRights.deleting !== newRights.deleting
        ) return newRights;
      } else {
        return defaultRights;
      }
      return oldRights;
    });
  }, [profile, route]);

  return rights;
}
export default useRights;
