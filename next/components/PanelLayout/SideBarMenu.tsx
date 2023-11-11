import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApiIcon from '@mui/icons-material/Api';

import lang from '../../lib/lang';
import { useAppSelector } from '../../store/hooks';
import SideBarMenuItem from './SideBarMenuItem';
import { ROUTES } from '../../lib/constants';
import useRights from '../../hooks/useRights';

const SideBarMenu: React.FC = () => {
  const userLang = useAppSelector(store => store.app.userLang);
  const profileRights = useRights(ROUTES.api.auth.profile);
  const usersRights = useRights(ROUTES.api.users);
  const rolesRights = useRights(ROUTES.api.roles);
  const resourcesRights = useRights(ROUTES.api.resources);

  return (
    <React.Fragment>
      <SideBarMenuItem
        link={ROUTES.panel.home}
        name={String(lang.get(userLang)?.home)}
        icon={<HomeIcon />}
      />
      <SideBarMenuItem
        link={ROUTES.panel.profile}
        name={String(lang.get(userLang)?.profile)}
        icon={<AccountBoxIcon />}
        disabled={!profileRights.reading}
      />
      <SideBarMenuItem
        name={String(lang.get(userLang)?.main)}
        icon={<WidgetsIcon />}
        childs={[
          {
            link: ROUTES.panel.users,
            icon: <GroupIcon />,
            name: String(lang.get(userLang)?.users),
            disabled: !usersRights.reading,
          },
          {
            link: ROUTES.panel.roles,
            icon: <SupervisedUserCircleIcon />,
            name: String(lang.get(userLang)?.roles),
            disabled: !rolesRights.reading,
          },
          {
            link: ROUTES.panel.resources,
            icon: <ApiIcon />,
            name: String(lang.get(userLang)?.resources),
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
