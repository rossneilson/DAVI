import React from 'react';
import styled from 'styled-components';
import Copy from './Copy';
import { useStores } from '../../contexts/storesContext';

const AddressLink = styled.span`
  display: flex;
  flex-direction: row;
  width: min-content;
  align-items: center;
  a {
    padding: 2px 5px;
    font-family: var(--roboto);
    line-height: 17px;
    letter-spacing: 0.2px;
    text-decoration: none;
    color: inherit;
  }
`;

const BlockchainLink = ({ text, size = 'default', type = 'default', toCopy }) => {
  
    const {
        root: { configStore },
    } = useStores();
    
    const networkName = configStore.getActiveChainName();

    function formarText(toFormat) {
        const start = toFormat.slice(0, 6);
        const end = toFormat.slice(-4);

        switch (size) {
          case "short":
            return `${start}..`;
          case "long":
            return toFormat;
          default:
            return `${start}...${end}`;
        }
    }
    
    function href() {
        switch (type) {
          case "user":
            return `${window.location.pathname}#/user/${text}`;
          case "address":
            if (networkName == 'arbitrum-testnet-v5')
              return `https://explorer5.arbitrum.io/#/address/${text}`
            else if (networkName == 'arbitrum')
              return `https://explorer5.arbitrum.io/#/address/${text}`
            else
              return `https://${networkName}.etherscan.io/address/${text}`
          default:
            if (networkName == 'arbitrum-testnet-v5')
              return `https://explorer5.arbitrum.io/#/tx/${text}`
            else if (networkName == 'arbitrum')
              return `https://explorer5.arbitrum.io/#/tx/${text}`
            else
              return `https://${networkName}.etherscan.io/tx/${text}`
        }
    }

    return (
        <AddressLink>
          <a href={href()}>{formarText(text)}</a>
          {toCopy ? <Copy toCopy={text} /> : <div/> }
        </AddressLink>
    );
};

export default BlockchainLink;
