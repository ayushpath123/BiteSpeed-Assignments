import React, { useId } from 'react';
import { Node } from 'reactflow';

type Props = {
  node: Node<{ label: string }>;
  onChangeLabel: (value: string) => void;
  onDelete?: () => void;
};

export const SettingsPanel: React.FC<Props> = ({ node, onChangeLabel, onDelete }) => {
  const inputId = useId();
  return (
    <div>
      <h4 className="panel-title">Settings</h4>
      <div className="settings__field">
        <label htmlFor={inputId}>Text</label>
        <input
          id={inputId}
          className="settings__input"
          value={(node.data as { label: string }).label}
          onChange={(e) => onChangeLabel(e.target.value)}
          placeholder="Enter text"
        />
      </div>
      {onDelete && (
        <button className="button" onClick={onDelete}>Delete Node</button>
      )}
    </div>
  );
};


