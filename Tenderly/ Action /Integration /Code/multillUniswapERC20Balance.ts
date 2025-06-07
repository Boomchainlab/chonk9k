import { ethers } from 'ethers';
import { ActionFn, Context, Event, ExtensionEvent } from '@tenderly/actions';

const FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // Uniswap V2 factory

const BATCH_CONTRACT_ADDRESS = '0xYourDeployedBatchStaticReturnAddress'; // Replace after deployment

const iface = new ethers.utils.Interface([
  'function getBalances(uint256 offset, uint256 step, address factory) external view returns (uint256[])',
]);

export const multicallUniswapERC20Balance: ActionFn = async (context: Context, event: Event) => {
  const params: ExtensionEvent = event as ExtensionEvent;
  const [offsetHex, limitHex] = params;
  const offset = parseInt(offsetHex);
  const limit = parseInt(limitHex);

  if (limit > 1000) throw new Error('Limit exceeds maximum value of 1000.');

  const provider = new ethers.providers.JsonRpcProvider(context.gateways.getGateway());

  const step = 200;
  const values: string[] = [];

  for (let i = offset; i < offset + limit; i += step) {
    const data = iface.encodeFunctionData('getBalances', [i, step, FACTORY]);

    const returnedData = await provider.call({
      to: BATCH_CONTRACT_ADDRESS,
      data,
    });

    const [decoded] = iface.decodeFunctionResult('getBalances', returnedData);
    decoded.forEach((val: ethers.BigNumber) => values.push(val.toString()));
  }

  return values;
};
