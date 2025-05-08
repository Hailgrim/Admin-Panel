import { FC, MouseEventHandler, ReactNode, useMemo, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { usePathname, useRouter } from 'next/navigation';

import { checkActiveLink, IMenuItem } from '@ap/shared';

const SideBarMenuItem: FC<IMenuItem<ReactNode>> = ({
  href,
  title,
  icon,
  childs,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(() =>
    checkActiveLink(pathname, { href, childs })
  );

  const linkHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (href) {
      router.push(href);
    }

    if (childs) {
      setOpen(!open);
    }
  };

  const selected = useMemo(() => {
    let result = Boolean(href);
    const pathArr = pathname.split('/');
    const linkArr = href?.split('/') || [];

    linkArr.forEach((value, index) => {
      if (value != pathArr[index]) {
        result = false;
      }
    });

    return result;
  }, [pathname, href]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          {...(href && { href })}
          selected={selected}
          onClick={linkHandler}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={title} />
          {childs && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {childs && (
        <Collapse in={open} timeout="auto">
          <Divider />
          {childs.map((item, index) => (
            <SideBarMenuItem
              key={`sbmi:${index}:${item.title}:${item.href}`}
              {...item}
            />
          ))}
        </Collapse>
      )}
    </>
  );
};
export default SideBarMenuItem;
