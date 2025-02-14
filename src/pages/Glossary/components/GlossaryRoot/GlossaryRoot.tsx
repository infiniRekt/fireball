import * as fromGlossaryStore from '../../store';
import { useAppSelector } from 'core/store/hooks';

import { PageNavLink } from 'shared/models';

import { AnvilIcon, BadgeIcon, ConsumableIcon, WarehouseIcon } from 'components/Icons/Icons';
import { PageNav } from 'components/PageNav/PageNav';

export function GlossaryRoot() {
  const wearablesCount = useAppSelector(fromGlossaryStore.getGlossaryWearablesCount);

  const navData: PageNavLink[] = [
    {
      name: 'wearables',
      path: 'wearables',
      icon: <WarehouseIcon width={24} height={24} />,
      isLoading: false,
      count: wearablesCount
    },
    {
      name: 'consumables',
      path: 'consumables',
      icon: <ConsumableIcon width={24} height={24} />,
      isLoading: false,
      count: 0
    },
    {
      name: 'badges',
      path: 'badges',
      icon: <BadgeIcon width={24} height={24} />,
      isLoading: false,
      count: 0
    },
    {
      name: 'installations',
      path: 'installations',
      icon: <AnvilIcon width={24} height={24} />,
      isLoading: false,
      count: 0
    },
    {
      name: 'sets',
      path: 'sets',
      icon: <WarehouseIcon width={24} height={24} />,
      isLoading: false,
      count: 0
    }
  ];

  return <PageNav links={navData}></PageNav>;
}
