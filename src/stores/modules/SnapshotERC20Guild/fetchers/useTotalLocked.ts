import { BigNumber } from 'ethers';
import { useMatch } from 'react-router';
import { useHookStoreProvider } from 'stores';
import useTotalLockedAt from 'Modules/Guilds/Hooks/useTotalLockedAt';

const useTotalLocked = (guildAddress: string, snapshotId?: string) => {
  // TODO: make useTypedMatch
  // TODO: remove snapshotId optional param, since it's fetched the same way inside the hook
  // Hooks call
  const {
    hooks: {
      fetchers: { useSnapshotId },
    },
  } = useHookStoreProvider();

  const urlParams = useMatch('/:chainName/:guildId/proposal/:proposalId/*');
  const proposalId = urlParams?.params.proposalId as `0x${string}`; // TODO: remove type coercion

  const { data: _snapshotId } = useSnapshotId({
    contractAddress: guildAddress,
    proposalId,
  });

  const SNAPSHOT_ID = snapshotId ?? _snapshotId?.toString() ?? null;

  const { data: totalLockedAtProposalSnapshotResponse } = useTotalLockedAt({
    contractAddress: guildAddress,
    snapshotId: SNAPSHOT_ID,
  });

  return {
    data: totalLockedAtProposalSnapshotResponse
      ? BigNumber.from(totalLockedAtProposalSnapshotResponse)
      : undefined,
  };
};

export default useTotalLocked;
