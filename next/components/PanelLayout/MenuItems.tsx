import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApiIcon from '@mui/icons-material/Api';
// import PermMediaIcon from '@mui/icons-material/PermMedia';

import lang from '../../libs/lang';
import { useAppSelector } from '../../store/hooks';
import SideBarItem from './SideBarItem';
import { Rights, ROUTES } from '../../libs/constants';
import { isAllowed } from '../../libs/functions';

const MenuItems: React.FC = () => {
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);

  return (
    <React.Fragment>
      <SideBarItem
        link={ROUTES.panel.home}
        name={String(lang.get(userLang)?.home)}
        icon={<HomeIcon />}
      />
      <SideBarItem
        link={ROUTES.panel.profile}
        name={String(lang.get(userLang)?.profile)}
        icon={<AccountBoxIcon />}
        disabled={!isAllowed(ROUTES.panel.profile, Rights.Reading, profile?.roles)}
      />
      <SideBarItem
        name={String(lang.get(userLang)?.main)}
        icon={<WidgetsIcon />}
        childs={[
          {
            link: ROUTES.panel.users,
            icon: <GroupIcon />,
            name: String(lang.get(userLang)?.users),
            disabled: !isAllowed(ROUTES.panel.users, Rights.Listing, profile?.roles),
          },
          {
            link: ROUTES.panel.roles,
            icon: <SupervisedUserCircleIcon />,
            name: String(lang.get(userLang)?.roles),
            disabled: !isAllowed(ROUTES.panel.roles, Rights.Listing, profile?.roles),
          },
          {
            link: ROUTES.panel.resources,
            icon: <ApiIcon />,
            name: String(lang.get(userLang)?.resources),
            disabled: !isAllowed(ROUTES.panel.resources, Rights.Listing, profile?.roles),
          },
          // {
          //   link: ROUTES.panel.files,
          //   icon: <PermMediaIcon />,
          //   name: String(lang.get(userLang)?.files),
          //   disabled: !isAllowed(ROUTES.panel.files, Rights.Listing, profile?.roles),
          // },
        ]}
        disabled={
          !isAllowed(ROUTES.panel.users, Rights.Listing, profile?.roles) &&
          !isAllowed(ROUTES.panel.roles, Rights.Listing, profile?.roles) &&
          !isAllowed(ROUTES.panel.resources, Rights.Listing, profile?.roles) &&
          !isAllowed(ROUTES.panel.files, Rights.Listing, profile?.roles)
        }
      />
    </React.Fragment>
  );
};
export default MenuItems;
