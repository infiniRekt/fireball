import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import qs from 'query-string';

// store
import * as fromClientStore from '../store';
import { useAppDispatch, useAppSelector } from 'core/store/hooks';

import { CustomParsedQuery, GotchiLending, SortingItem, SortingListItem } from 'shared/models';

import { ContentInner } from 'components/Content/ContentInner';
import { Gotchi } from 'components/Gotchi/Gotchi';
import { GotchiIcon } from 'components/Icons/Icons';
import { GotchisLazy } from 'components/Lazy/GotchisLazy';
import { SortFilterPanel } from 'components/SortFilterPanel/SortFilterPanel';

import { CommonUtils, FilterUtils } from 'utils';

import { filtersData } from 'data/filters.data';

const sortings: SortingListItem[] = [
  {
    name: 'kin',
    key: 'kinship',
    paramKey: 'kin',
    tooltip: 'kinship',
    icon: <FavoriteBorderIcon fontSize='small' />
  }
];

const initialFilters: CustomAny = {
  hauntId: { ...filtersData.hauntId, divider: true },
  whitelistId: { ...filtersData.whitelistId, divider: true },
  borrower: { ...filtersData.borrower, divider: true },
  search: { ...filtersData.search }
};
const queryParamsOrder: string[] = ['haunt', 'whitelistId', 'borrower', 'search', 'sort', 'dir'];

export function ClientLendings() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = qs.parse(location.search, { arrayFormat: 'comma' });

  const dispatch = useAppDispatch();

  const lentGotchis: GotchiLending[] = useAppSelector(fromClientStore.getLentGotchis);
  const isInitialLentGotchisLoading: boolean = useAppSelector(fromClientStore.getIsInitialLentGotchisLoading);
  const lentGotchisSorting: SortingItem = useAppSelector(fromClientStore.getLentGotchisSorting);

  const [currentFilters, setCurrentFilters] = useState<CustomAny>({ ...initialFilters });
  const [modifiedLentGotchis, setModifiedLentGotchis] = useState<CustomAny[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  useEffect(() => {
    setCurrentFilters((currentFiltersCache: CustomAny) =>
      FilterUtils.getUpdateFiltersFromQueryParams(queryParams, currentFiltersCache)
    );

    const { sort, dir } = queryParams as CustomParsedQuery;

    if (sort && dir) {
      const key: CustomAny = sortings.find((sorting) => sorting.paramKey === sort)?.key;

      onSortingChange(key, dir);
    }

    return () => {
      onResetFilters();
    };
  }, []);

  useEffect(() => {
    if (lentGotchis.length > 0) {
      const whitelistData: string[] = [];
      const borrowersAddresses: string[] = [];

      for (let i = 0; i < lentGotchis.length; i++) {
        whitelistData.push(lentGotchis[i].whitelistId);
        borrowersAddresses.push(lentGotchis[i].borrower);
      }

      const sortedWhitelist: string[] = CommonUtils.sortByDirection([...new Set(whitelistData)], 'asc');
      const uniqueBorrowers = [...new Set(borrowersAddresses)];

      setCurrentFilters((currentFiltersCache: CustomAny) => {
        const currentFiltersCacheCopy = { ...currentFiltersCache };

        currentFiltersCacheCopy.whitelistId = {
          ...currentFiltersCacheCopy.whitelistId,
          items: sortedWhitelist.map((whitelist: string) => ({
            title: whitelist,
            value: whitelist,
            queryParamValue: whitelist,
            isSelected: false
          }))
        };
        currentFiltersCacheCopy.borrower = {
          ...currentFiltersCacheCopy.borrower,
          items: uniqueBorrowers.map((borrower: string) => ({
            title: CommonUtils.cutAddress(borrower),
            value: borrower,
            queryParamValue: borrower,
            isSelected: false
          }))
        };

        let filtersToReturn: CustomAny;

        if (Object.keys(queryParams).length > 0) {
          filtersToReturn = FilterUtils.getUpdateFiltersFromQueryParams(queryParams, currentFiltersCacheCopy);
        } else {
          filtersToReturn = currentFiltersCacheCopy;
        }

        return filtersToReturn;
      });
    }
  }, [lentGotchis]);

  useEffect(() => {
    FilterUtils.onFiltersUpdate(
      currentFilters,
      FilterUtils.getActiveFiltersCount,
      setActiveFiltersCount,
      updateFilterQueryParams
    );
  }, [currentFilters]);

  useEffect(() => {
    const paramKey: CustomAny = sortings.find((sorting) => sorting.key === lentGotchisSorting.type)?.paramKey;

    updateSortQueryParams(paramKey, lentGotchisSorting.dir);
  }, [lentGotchisSorting]);

  useEffect(() => {
    const modifiedLentGotchis = FilterUtils.getFilteredSortedItems({
      items: lentGotchis,
      filters: currentFilters,
      sorting: lentGotchisSorting,
      getFilteredItems: FilterUtils.getFilteredItems
    });

    setModifiedLentGotchis(modifiedLentGotchis);
  }, [currentFilters, lentGotchis, lentGotchisSorting]);

  const onSortingChange = (type: string, dir: string): void => {
    dispatch(fromClientStore.setLentGotchisSorting({ type, dir }));
  };

  const sorting: CustomAny = {
    sortingList: sortings,
    sortingDefaults: lentGotchisSorting,
    onSortingChange: onSortingChange
  };

  const updateSortQueryParams = useCallback(
    (prop: string, dir: string) => {
      const params = { ...queryParams, sort: prop, dir };

      FilterUtils.updateQueryParams(navigate, location.pathname, qs, params, queryParamsOrder);
    },
    [queryParams, navigate, location.pathname]
  );

  const updateFilterQueryParams = useCallback(
    (filters: CustomAny) => {
      const params = FilterUtils.getUpdatedQueryParams(queryParams, filters);

      FilterUtils.updateQueryParams(navigate, location.pathname, qs, params, queryParamsOrder);
    },
    [queryParams, navigate, location.pathname]
  );

  const onSetSelectedFilters = (key: string, selectedValue: CustomAny) => {
    FilterUtils.setSelectedFilters(setCurrentFilters, key, selectedValue);
  };

  const onResetFilters = useCallback(() => {
    FilterUtils.resetFilters(currentFilters, setCurrentFilters);
  }, [currentFilters]);

  const onExportData = useCallback(() => {
    FilterUtils.exportData(modifiedLentGotchis, 'client_lendings');
  }, [modifiedLentGotchis]);

  return (
    <>
      <SortFilterPanel
        sorting={sorting}
        itemsLength={modifiedLentGotchis.length}
        placeholder={<GotchiIcon width={20} height={20} />}
        isShowFilters={true}
        filters={currentFilters}
        setSelectedFilters={onSetSelectedFilters}
        resetFilters={onResetFilters}
        exportData={onExportData}
        filtersCount={activeFiltersCount}
      />

      <ContentInner dataLoading={isInitialLentGotchisLoading}>
        <GotchisLazy
          items={modifiedLentGotchis}
          renderItem={(id) => (
            <Gotchi
              gotchi={modifiedLentGotchis[id]}
              render={[
                {
                  className: 'gotchiHeader',
                  items: ['collateral', 'kinship', 'level']
                },
                {
                  className: 'imageContainer',
                  items: [
                    'svg',
                    {
                      className: 'rsContainer',
                      items: ['rs']
                    },
                    {
                      className: 'imageFooter',
                      items: ['whitelistId']
                    },
                    'identity'
                  ]
                },
                'name',
                {
                  className: 'gotchiFlipContainer',
                  items: [
                    {
                      className: 'gotchiFlipBack',
                      items: ['traits', 'wearablesLine', 'listing']
                    },
                    {
                      className: 'gotchiFlipFront',
                      items: ['lendingStats', 'channeling']
                    }
                  ]
                },
                'flipButton'
              ]}
            />
          )}
        />
      </ContentInner>
    </>
  );
}
