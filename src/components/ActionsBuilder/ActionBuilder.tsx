import { Header as CardHeader } from 'components/Card';
import { OptionsList } from './OptionsList';
import { EditButton } from './common';
import { Option } from './types';
import { bulkEncodeCallsFromOptions } from 'hooks/Guilds/contracts/useEncodedCall';
import { AddEditOptionModal } from './AddEditOptionModal';
import { SidebarCard, SidebarCardHeaderSpaced } from 'components/SidebarCard';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetETHPermission } from 'Modules/Guilds/Hooks/useETHPermissions';
import { SupportedAction } from './types';
import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';

interface ActionsBuilderProps {
  options: Option[];
  editable?: boolean;
  onChange?: (options: Option[]) => void;
}

export const ActionsBuilder: React.FC<ActionsBuilderProps> = ({
  editable,
  options,
  onChange,
}) => {
  const { t } = useTranslation();
  const { guildId: guildAddress } = useTypedParams();
  const [isEditable, setIsEditable] = useState(editable);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editableOption, setEditableOption] = useState(null);

  const onEdit = () => setIsEditable(true);

  const onSave = useCallback(() => {
    const decodedActions = options[0]?.decodedActions;
    const permissionParameters = decodedActions.map(action => {
      switch (action.decodedCall.callType) {
        case SupportedAction.ERC20_TRANSFER:
          return {
            from: action.decodedCall.from,
            to: action.decodedCall.to,
            funcSign: action.decodedCall.args.functionSignature,
          };
        case SupportedAction.ENS_UPDATE_CONTENT:
          return {
            from: action.decodedCall.from,
            to: action.decodedCall.to,
            funcSign: action.decodedCall.args.functionSignature,
          };
        case SupportedAction.GENERIC_CALL:
          return {
            from: action.decodedCall.from,
            to: action.decodedCall.to,
            funcSign: action.decodedCall.args.functionSignature,
          };
        case SupportedAction.SET_PERMISSIONS:
          return {
            from: action.decodedCall.from,
            to: action.decodedCall.to,
            funcSign: action.decodedCall.args.functionSignature,
          };
        case SupportedAction.REP_MINT:
          return {
            from: action.decodedCall.from,
            to: action.decodedCall.to,
            funcSign: action.decodedCall.args.functionSignature,
          };
          case SupportedAction.NATIVE_TRANSFER:
            return true
        default:
          throw new Error('Unsupported action type');
      }
    });


    const permissions = permissionParameters.map(params => {
      if(params === true) {
        return true
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ethPermission = useGetETHPermission({
        guildAddress,
        from: params.from,
        to: params.to,
        funcSign: params.funcSign,
      })
      if(ethPermission.data === '0') {
        return false
      } else {
        return true
      }
    }
    );
    console.log({permissions})

    const encodedOptions = bulkEncodeCallsFromOptions(options);
    onChange(encodedOptions);
    setIsEditable(false);
  }, [onChange, options, guildAddress]);

  return (
    <SidebarCard
      header={
        <SidebarCardHeaderSpaced>
          <CardHeader>{t('actions_other')}</CardHeader>
          {editable && (
            <EditButton
              variant="secondary"
              onClick={() => (isEditable ? onSave() : onEdit())}
            >
              {isEditable ? t('save') : t('edit')}
            </EditButton>
          )}
        </SidebarCardHeaderSpaced>
      }
    >
      <OptionsList
        isEditable={isEditable}
        options={options}
        onChange={onChange}
        addOption={() => setShowAddModal(true)}
        editOption={option => {
          setEditableOption(option);
          setShowAddModal(true);
        }}
      />
      {showAddModal && (
        <AddEditOptionModal
          editableOption={editableOption}
          options={options}
          onDismiss={() => {
            setEditableOption(null);
            setShowAddModal(false);
          }}
          onChange={onChange}
        />
      )}
    </SidebarCard>
  );
};
