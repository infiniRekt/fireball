import { useContext, useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { TheGraphApi } from 'api';

import { Gotchi } from 'components/Gotchi/Gotchi';
import { GotchisLazy } from 'components/Lazy/GotchisLazy';

import { GuildsContext } from '../GuildsContext';
import { guildContentStyles } from '../styles';

export function GuildLendings() {
  const classes = guildContentStyles();

  const { guildId, guilds, guildLendings, setGuildLendings } = useContext<CustomAny>(GuildsContext);

  const [isLendingsLoading, setIsLendingsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (guildId === null) {
      return;
    }

    setIsLendingsLoading(true);

    const promises: CustomAny[] = guilds[guildId].members.map((address) => TheGraphApi.getLendingsByAddress(address));

    Promise.all(promises)
      .then((responses: CustomAny[]) => {
        if (mounted) {
          const lendings: CustomAny = responses.reduce((result, current) => result.concat(current), []);

          setGuildLendings(lendings);
        }
      })
      .finally(() => setIsLendingsLoading(false));

    return () => {
      mounted = false;
    };
  }, [guilds, guildId, setGuildLendings]);

  return (
    <div className={classes.guildGotchis}>
      {isLendingsLoading ? (
        <CircularProgress className={classes.loading} />
      ) : guildLendings?.length > 0 ? (
        <GotchisLazy
          items={guildLendings}
          renderItem={(id) => <Gotchi gotchi={guildLendings[id]} className='narrowed' render={['svg', 'name']} />}
        />
      ) : (
        <div className={classes.noData}>No Gotchi Lendings :(</div>
      )}
    </div>
  );
}
