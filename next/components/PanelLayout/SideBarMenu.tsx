import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApiIcon from '@mui/icons-material/Api';

import { useAppSelector } from '../../store/hooks';
import SideBarMenuItem from './SideBarMenuItem';
import { ROUTES } from '../../lib/constants';
import useRights from '../../hooks/useRights';

const SideBarMenu: React.FC = () => {
  const t = useAppSelector(store => store.app.t);
  const profileRights = useRights(ROUTES.api.auth.profile);
  const usersRights = useRights(ROUTES.api.users);
  const rolesRights = useRights(ROUTES.api.roles);
  const resourcesRights = useRights(ROUTES.api.resources);

  return (
    <React.Fragment>
      <SideBarMenuItem
        href={ROUTES.panel.home}
        name={String(t.home)}
        icon={<HomeIcon />}
      />
      <SideBarMenuItem
        href={ROUTES.panel.profile}
        name={String(t.profile)}
        icon={<AccountBoxIcon />}
        disabled={!profileRights.reading}
      />
      <SideBarMenuItem
        name={String(t.main)}
        icon={<WidgetsIcon />}
        childs={[      {
            href: ROUTES.panel.users,
            icon: <GroupIcon />,
            name: String(t.users),
            disabled: !usersRights.reading,
          },
          {
            href: ROUTES.panel.roles,
            icon: <SupervisedUserCircleIcon />,
            name: String(t.roles),
            disabled: !rolesRights.reading,
          },
          {
            href: ROUTES.panel.resources,
            icon: <ApiIcon />,
            name: String(t.resources),
            disabled: !resourcesRights.reading,
          },
        ]}
        disabled={
          !usersRights.reading &&
          !rolesRights.reading &&
          !resourcesRights.reading
        }
      />
    </React.Fragment>
  );
};
export default SideBarMenu;
