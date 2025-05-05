import { useEffect, useState } from 'react';

import { useAppSelector } from '../store/hooks';

const defaultRights = {
  creating: false,
  reading: false,
  updating: false,
  deleting: false,
};

const useRights = (path: string) => {
  const route = path.startsWith('/') ? path.slice(1) : path;
  const [rights, setRights] = useState(defaultRights);
  const profile = useAppSelector((store) => store.main.profile);

  useEffect(() => {
    setRights((prev) => {
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
              if (resource.path !== route || resource.RightsModel === undefined)
                continue;

              newRights.creating = resource.RightsModel.creating;
              newRights.reading = resource.RightsModel.reading;
              newRights.updating = resource.RightsModel.updating;
              newRights.deleting = resource.RightsModel.deleting;
            }
          }
        }

        if (
          prev.creating !== newRights.creating ||
          prev.reading !== newRights.reading ||
          prev.updating !== newRights.updating ||
          prev.deleting !== newRights.deleting
        )
          return newRights;
      } else {
        return defaultRights;
      }
      return prev;
    });
  }, [profile, route]);

  return rights;
};
export default useRights;
