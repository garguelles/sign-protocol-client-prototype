'use client';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import type { Address, ContractFunctionParameters } from 'viem';
import {
  BASE_SEPOLIA_CHAIN_ID,
  mintABI,
  mintContractAddress,
} from '../constants';
import { EvmChains, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import { useWalletClient } from 'wagmi';

export default function TransactionWrapper({ address }: { address: Address }) {
  const walletClient = useWalletClient();
  const contracts = [
    {
      address: mintContractAddress,
      abi: mintABI,
      functionName: 'mint',
      args: [address],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  console.log('address', address);

  const attest = async () => {
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      walletClient: walletClient.data,
      rpcUrl:
        'https://api.developer.coinbase.com/rpc/v1/base-sepolia/OaygFcDgI9xCmmKdSdnQ5f4CJBtzdzqo',
    });
    const recipient = '0x8244c1645C1a7890Ef1F0E79AcCf817905Dbcba2';
    // const attester = address;
    const res = await client.createAttestation({
      schemaId: '0x40c',
      // linkedAttestationId: '0xb64',
      // recipients: [recipient],
      data: {
        event: 'AWE2024',
        reaction: 'Positive',
        review: 'test review',
      },
      indexingValue: address.toLowerCase(),
    });

    console.log('res', res);
  };

  return (
    <div className="flex w-[450px]">
      <Transaction
        contracts={contracts}
        className="w-[450px]"
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
      <button onClick={attest}>Attest</button>
    </div>
  );
}
