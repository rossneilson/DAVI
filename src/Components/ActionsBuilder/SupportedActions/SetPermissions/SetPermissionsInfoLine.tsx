import { useMemo } from 'react';
import { ActionViewProps } from '..';
import { Segment } from '../common/infoLine';
import Avatar from 'old-components/Guilds/Avatar';
import { FiArrowRight } from 'react-icons/fi';
import { BiCheckShield } from 'react-icons/bi';
import useENSAvatar from 'hooks/Guilds/ether-swr/ens/useENSAvatar';
import { MAINNET_ID, shortenAddress } from 'utils';
import { ParsedDataInterface } from './types';
import { useTranslation } from 'react-i18next';

// TODO: What is the most logical way to present the information? Is more information needed?

const SetPermissionsInfoLine: React.FC<ActionViewProps> = ({
  decodedCall,
  compact,
  noAvatar,
}) => {
  const { t } = useTranslation();

  const parsedData = useMemo<ParsedDataInterface>(() => {
    if (!decodedCall) return null;

    const { functionName } = decodedCall;
    const { asset, to, functionSignature, valueAllowed, allowance } =
      decodedCall.args;
    return {
      asset,
      to,
      functionSignature,
      valueAllowed,
      allowance,
      functionName,
    };
  }, [decodedCall]);

  const { ensName, imageUrl } = useENSAvatar(parsedData?.to[0], MAINNET_ID);

  return (
    <>
      <Segment>
        <BiCheckShield size={16} />
      </Segment>
      <Segment>{!compact ? t('permission') : ''}</Segment>
      <Segment>
        <FiArrowRight />
      </Segment>
      {noAvatar ? null : (
        <Segment>
          <Avatar defaultSeed={parsedData?.to[0]} src={imageUrl} size={24} />
        </Segment>
      )}
      <Segment>
        {ensName || parsedData?.to[0] ? shortenAddress(parsedData?.to[0]) : ''}
      </Segment>
    </>
  );
};

export default SetPermissionsInfoLine;
