import { FC, ReactNode, useMemo } from 'react';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApiIcon from '@mui/icons-material/Api';

import useTranslate from '@/shared/hooks/useTranslate';
import useRights from '@/shared/hooks/useRights';
import SideBarMenuItem from './SideBarMenuItem';
import { ROUTES } from '@ap/shared/src/libs';
import { IMenuItem } from '@ap/shared/src/types';

const SideBarMenu: FC = () => {
  const t = useTranslate();
  const profileRights = useRights(ROUTES.api.profile);
  const usersRights = useRights(ROUTES.api.users);
  const rolesRights = useRights(ROUTES.api.roles);
  const resourcesRights = useRights(ROUTES.api.resources);

  const menu = useMemo(() => {
    const root: IMenuItem<ReactNode>[] = [
      {
        title: t.home,
        icon: <HomeIcon />,
        href: ROUTES.ui.home,
      },
    ];

    if (profileRights.reading) {
      root.push({
        title: t.profile,
        icon: <AccountBoxIcon />,
        href: ROUTES.ui.profile,
      });
    }

    const mainMenu: IMenuItem<ReactNode> = {
      title: t.main,
      icon: <WidgetsIcon />,
      childs: [],
    };

    if (usersRights.reading) {
      mainMenu.childs!.push({
        title: t.users,
        icon: <GroupIcon />,
        href: ROUTES.ui.users,
      });
    }

    if (rolesRights.reading) {
      mainMenu.childs!.push({
        title: t.roles,
        icon: <SupervisedUserCircleIcon />,
        href: ROUTES.ui.roles,
      });
    }

    if (resourcesRights.reading) {
      mainMenu.childs!.push({
        title: t.resources,
        icon: <ApiIcon />,
        href: ROUTES.ui.resources,
      });
    }

    if (mainMenu.childs!.length > 0) {
      root.push(mainMenu);
    }

    return root;
  }, [t, profileRights, usersRights, rolesRights, resourcesRights]);

  return (
    <List disablePadding component="nav">
      {menu.map((item, index) => (
        <SideBarMenuItem
          key={`sbmi:${index}:${item.title}:${item.href}`}
          {...item}
        />
      ))}
    </List>
  );
};
export default SideBarMenu;
