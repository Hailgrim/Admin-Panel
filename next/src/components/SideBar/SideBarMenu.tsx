import { FC, useMemo } from 'react';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApiIcon from '@mui/icons-material/Api';

import useT from '@/hooks/useT';
import { IMenuItem } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import useRights from '@/hooks/useRights';
import SideBarMenuItem from './SideBarMenuItem';

const SideBarMenu: FC = () => {
  const t = useT();
  const profileRights = useRights(ROUTES.api.auth.profile);
  const usersRights = useRights(ROUTES.api.users);
  const rolesRights = useRights(ROUTES.api.roles);
  const resourcesRights = useRights(ROUTES.api.resources);

  const menu = useMemo(() => {
    const root: IMenuItem[] = [
      {
        text: t.home,
        icon: <HomeIcon />,
        href: ROUTES.panel.home,
      },
    ];

    if (profileRights.reading) {
      root.push({
        text: t.profile,
        icon: <AccountBoxIcon />,
        href: ROUTES.panel.profile,
      });
    }

    const mainMenu: IMenuItem = {
      text: t.main,
      icon: <WidgetsIcon />,
      childs: [],
    };

    if (usersRights.reading) {
      mainMenu.childs!.push({
        text: t.users,
        icon: <GroupIcon />,
        href: ROUTES.panel.users,
      });
    }

    if (rolesRights.reading) {
      mainMenu.childs!.push({
        text: t.roles,
        icon: <SupervisedUserCircleIcon />,
        href: ROUTES.panel.roles,
      });
    }

    if (resourcesRights.reading) {
      mainMenu.childs!.push({
        text: t.resources,
        icon: <ApiIcon />,
        href: ROUTES.panel.resources,
      });
    }

    if (mainMenu.childs!.length > 0) root.push(mainMenu);

    return root;
  }, [t, profileRights, usersRights, rolesRights, resourcesRights]);

  return (
    <List disablePadding component="nav">
      {menu.map((item, index) => (
        <SideBarMenuItem
          key={`sbmi:${index}:${item.text}:${item.href || ''}`}
          {...item}
        />
      ))}
    </List>
  );
};
export default SideBarMenu;
