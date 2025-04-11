import { constants, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  transactionType,
} from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isEthAddressArray,
} from '../commons/validators/paramValidators';
import { I0xLendingIncentivesControllerV2 } from './typechain/I0xLendingIncentivesControllerV2';
import { I0xLendingIncentivesControllerV2__factory } from './typechain/I0xLendingIncentivesControllerV2__factory';

export type ClaimRewardsV2MethodType = {
  user: string;
  assets: string[];
  reward: string;
  to?: string;
  incentivesControllerAddress: string;
};

export type ClaimAllRewardsV2MethodType = {
  user: string;
  assets: string[];
  to?: string;
  incentivesControllerAddress: string;
};

export interface IncentivesControllerV2Interface {
  claimRewards: (
    args: ClaimRewardsV2MethodType,
  ) => EthereumTransactionTypeExtended[];
  claimAllRewards: (
    args: ClaimAllRewardsV2MethodType,
  ) => EthereumTransactionTypeExtended[];
}

export class IncentivesControllerV2
  extends BaseService<I0xLendingIncentivesControllerV2>
  implements IncentivesControllerV2Interface
{
  constructor(provider: providers.Provider) {
    super(provider, I0xLendingIncentivesControllerV2__factory);
  }

  @IncentivesValidator
  public claimRewards(
    @isEthAddress('user')
    @isEthAddress('incentivesControllerAddress')
    @isEthAddress('to')
    @isEthAddress('reward')
    @isEthAddressArray('assets')
    {
      user,
      assets,
      to,
      incentivesControllerAddress,
      reward,
    }: ClaimRewardsV2MethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: I0xLendingIncentivesControllerV2 =
      this.getContractInstance(incentivesControllerAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        incentivesContract.populateTransaction.claimRewards(
          assets,
          constants.MaxUint256.toString(),
          to ?? user,
          reward,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.REWARD_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @IncentivesValidator
  public claimAllRewards(
    @isEthAddress('user')
    @isEthAddress('incentivesControllerAddress')
    @isEthAddress('to')
    @isEthAddressArray('assets')
    {
      user,
      assets,
      to,
      incentivesControllerAddress,
    }: ClaimAllRewardsV2MethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: I0xLendingIncentivesControllerV2 =
      this.getContractInstance(incentivesControllerAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        incentivesContract.populateTransaction.claimAllRewards(
          assets,
          to ?? user,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.REWARD_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}
