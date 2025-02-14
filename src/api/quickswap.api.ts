import * as quickSwap from 'quickswap-sdk';

import { EthersApi } from './ethers.api';

import { POLYGON_CHAIN_ID } from 'shared/constants';
import { QuickswapToken } from 'shared/models';

export class QuickswapApi {
  public static getTokenData(address: string): Promise<QuickswapToken> {
    return quickSwap.Fetcher.fetchTokenData(POLYGON_CHAIN_ID, address, EthersApi.getProvider());
  }

  public static getPairData(token0: CustomAny, token1: CustomAny): CustomAny {
    return quickSwap.Fetcher.fetchPairData(token0, token1, EthersApi.getProvider());
  }

  public static getTokenRouteByPair(token: QuickswapToken, pair: CustomAny): CustomAny {
    return new quickSwap.Route([pair], token);
  }
}
