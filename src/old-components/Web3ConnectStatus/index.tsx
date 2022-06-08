import { useContext } from '../../contexts';
import { toCamelCaseString } from '../../utils';
import { Box } from '../Guilds/common/Box';
import BlockchainLink from '../Guilds/common/BlockchainLink';
// import { observer } from 'mobx-react';
import NetworkModal from 'old-components/NetworkModal';
import WalletModal from 'old-components/WalletModal';
import { getChains, injected, isChainIdSupported } from 'provider/connectors';
import { useRpcUrls } from 'provider/providerHooks';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const WrongNetworkButton = styled(Box)`
  color: var(--dark-text-gray);
  padding: 5px 10px;
  font-weight: 500;
  font-size: 16px;
  height: 28px;
  border-radius: 6px;
  background: var(--wrong-network);
  color: var(--white);
  cursor: pointer;
`;

const AccountButton = styled(Box)`
  color: var(--dark-text-gray);
  padding: 5px 10px;
  font-weight: 500;
  font-size: 16px;
  margin-right: 10px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
`;

const ConnectButton = styled(Box)`
  color: var(--dark-text-gray);
  padding: 5px 10px;
  font-weight: 500;
  font-size: 16px;
  height: 28px;
  border-radius: 6px;
  background: var(--blue-text);
  color: var(--white);
  cursor: pointer;
`;

const ChainButton = styled(AccountButton)`
  font-size: 14px;
`;

const Web3ConnectStatus = props => {
  const {
    context: { modalStore, providerStore, configStore },
  } = useContext();
  const [injectedWalletAuthorized, setInjectedWalletAuthorized] =
    useState(false);
  const rpcUrls = useRpcUrls();

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      setInjectedWalletAuthorized(isAuthorized);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injected]);

  const { chainId, account, error } = providerStore.getActiveWeb3React();

  const toggleWalletModal = () => {
    modalStore.toggleWalletModal();
  };

  const toggleNetworkModal = () => {
    modalStore.toggleNetworkModal();
  };

  const switchNetwork = async chain => {
    const chainIdHex = `0x${chain.id.toString(16)}`;
    try {
      await window.ethereum?.send('wallet_switchEthereumChain', [
        { chainId: chainIdHex },
      ]);
    } catch (e: any) {
      if (e?.code === 4902) {
        window.ethereum?.send('wallet_addEthereumChain', [
          {
            chainId: chainIdHex,
            chainName: chain.displayName,
            nativeCurrency: chain.nativeAsset,
            rpcUrls: [chain.rpcUrl, chain.defaultRpc],
            blockExplorerUrls: [chain.blockExplorer],
          },
        ]);
      }
    }
  };

  function getWalletStatus() {
    if (injectedWalletAuthorized && !account) {
      const chains = getChains(rpcUrls);
      const activeChain =
        chains.find(chain => chain.id === chainId) || chains[0];
      const isMetamask = window.ethereum && window.ethereum.isMetaMask;
      return (
        <ConnectButton onClick={() => switchNetwork(activeChain)}>
          Switch {isMetamask ? 'MetaMask' : 'Wallet'} to{' '}
          {activeChain.displayName}
        </ConnectButton>
      );
    } else if (account) {
      return (
        <AccountButton onClick={toggleWalletModal}>
          <BlockchainLink text={account} onlyText />
        </AccountButton>
      );
    } else {
      return (
        <ConnectButton onClick={toggleWalletModal}>{props.text}</ConnectButton>
      );
    }
  }

  function getNetworkStatus() {
    // Wrong network
    if ((chainId && !isChainIdSupported(chainId)) || error) {
      return (
        <WrongNetworkButton onClick={toggleNetworkModal}>
          Wrong Network
        </WrongNetworkButton>
      );
    } else if (chainId) {
      return (
        <div style={{ display: 'flex' }}>
          <ChainButton onClick={toggleNetworkModal}>
            {toCamelCaseString(configStore.getActiveChainDisplayName())}
          </ChainButton>
        </div>
      );
    } else {
      return (
        <ConnectButton onClick={toggleNetworkModal}>
          Not Connected
        </ConnectButton>
      );
    }
  }

  return (
    <>
      {getNetworkStatus()}
      {getWalletStatus()}
      <WalletModal />
      <NetworkModal />
    </>
  );
};

export default Web3ConnectStatus;
