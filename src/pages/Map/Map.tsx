import { useContext, useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import _ from 'lodash';

import { useAppSelector } from 'core/store/hooks';
import { getActiveAddress } from 'core/store/login';
import { DataReloadType } from 'shared/constants';
import { DataReloadContextState } from 'shared/models';
import { DataReloadContext } from 'contexts/DataReloadContext';
import { Citadel } from 'components/Citadel/Citadel';
import { TheGraphApi } from 'api/thegraph.api';

import { styles } from './styles';

export function Map() {
  const classes = styles();

  const activeAddress = useAppSelector(getActiveAddress);

  const { lastManuallyUpdated, setLastUpdated, setActiveReloadType, setIsReloadDisabled } = useContext<
    DataReloadContextState
  >(DataReloadContext);

  const [isListedLoaded, setIsListedLoaded] = useState<boolean>(false);
  const [isOwnerLoaded, setIsOwnerLoaded] = useState<boolean>(false);
  const [realmGroups, setRealmGroups] = useState<any[]>([]);
  const [canBeUpdated, setCanBeUpdated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    onLoadListedParcels(isMounted, true);

    setActiveReloadType(DataReloadType.Map);

    return () => {
      isMounted = false;

      setActiveReloadType(null);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    onLoadOwnerParcels(mounted, true);

    return () => {
      mounted = false;
    };
  }, [activeAddress]);

  useEffect(() => {
    if (lastManuallyUpdated !== 0 && canBeUpdated) {
      let isMounted = true;

      onLoadListedParcels(isMounted);
      onLoadOwnerParcels(isMounted);

      return () => {
        isMounted = false;
      };
    }
  }, [lastManuallyUpdated]);

  const onLoadListedParcels = (isMounted: boolean, shouldUpdateIsLoading: boolean = false): void => {
    setIsReloadDisabled(true);
    setIsListedLoaded(!shouldUpdateIsLoading);

    Promise.all([
      TheGraphApi.getParcelPriceByDirection({ size: 0, direction: 'asc' }),
      TheGraphApi.getParcelPriceByDirection({ size: 1, direction: 'asc' }),
      TheGraphApi.getParcelPriceByDirection({ size: 2, direction: 'asc' }),
      TheGraphApi.getParcelPriceByDirection({ size: 3, direction: 'asc' }),
      TheGraphApi.getAllListedParcels()
    ])
      .then(([humbleAsc, reasonableAsc, vSpaciousAsc, hSpaciousAsc, listedParcels]: [any, any, any, any, any]) => {
        if (isMounted) {
          const combinedParcels: any = getCombinedParcels(listedParcels);

          const listedRealmGroup: any = {
            parcels: combinedParcels,
            type: 'listed',
            active: false,
            /* eslint-disable-next-line react/jsx-key */
            icon: <AttachMoneyIcon />,
            tooltip: 'Listed realm',
            range: {
              humble: { min: humbleAsc, max: 500 },
              reasonable: { min: reasonableAsc, max: 700 },
              spacious: { min: Math.min(vSpaciousAsc, hSpaciousAsc), max: 5000 }
            }
          };

          setRealmGroups((groupsCache: any) => {
            const groupsCacheCopy: any = _.cloneDeep(groupsCache);

            groupsCacheCopy[0] = listedRealmGroup;

            return groupsCacheCopy;
          });
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        if (isMounted) {
          setIsListedLoaded(true);
          setIsReloadDisabled(false);
          setLastUpdated(Date.now());
          setCanBeUpdated(true);
        }
      });
  };

  const onLoadOwnerParcels = (isMounted: boolean, shouldUpdateIsLoading: boolean = false): void => {
    setIsOwnerLoaded(!shouldUpdateIsLoading);

    if (activeAddress) {
      TheGraphApi.getRealmByAddress(activeAddress)
        .then((ownerRealm: any) => {
          if (isMounted) {
            const ownerRealmGroup = {
              parcels: ownerRealm,
              type: 'owner',
              active: false,
              animate: true,
              /* eslint-disable-next-line react/jsx-key */
              icon: <VisibilityIcon />,
              tooltip: 'Owner realm'
            };

            setRealmGroups((groupsCache: any) => {
              const groupsCacheCopy: any = _.cloneDeep(groupsCache);

              groupsCacheCopy[1] = ownerRealmGroup;

              return groupsCacheCopy;
            });
          }
        })
        .catch(error => console.log(error))
        .finally(() => {
          if (isMounted) {
            setIsOwnerLoaded(true);
          }
        });
    } else {
      setIsOwnerLoaded(true);
    }
  };

  const getCombinedParcels = (listedParcels: any[]): any => {
    return listedParcels.map((parcel: any) => {
      return {
        ...parcel.parcel,
        priceInWei: parcel.priceInWei,
        tokenId: parcel.tokenId,
        baazaarId: parcel.id,
        listings: [
          {
            id: parcel.tokenId,
            priceInWei: parcel.priceInWei,
            __typename: 'ERC721Listing'
          }
        ],
        historicalPrices: parcel.parcel.historicalPrices ? parcel.parcel.historicalPrices : []
      };
    });
  };

  return (
    <div className={classes.mapWrapper}>
      <Citadel className={classes.citadel} realmGroups={realmGroups} isLoaded={isOwnerLoaded && isListedLoaded} />
    </div>
  );
}
