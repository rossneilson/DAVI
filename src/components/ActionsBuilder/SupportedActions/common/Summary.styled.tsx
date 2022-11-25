import { Box } from 'components/primitives/Layout/Box';
import styled from 'styled-components';

export const DetailRow = styled(Box)`
  display: flex;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

export const DetailHeader = styled(DetailRow)`
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0;
  white-space: pre-wrap;
`;

export const DetailBody = styled(DetailRow)`
  color: ${({ theme }) => theme.colors.grey};
  margin: 0;
`;

export const RedHighlight = styled.span`
  color: ${({ theme }) => theme.colors.red};
`;
