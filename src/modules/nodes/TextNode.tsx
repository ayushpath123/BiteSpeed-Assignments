import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const TextNode: React.FC<NodeProps<{ label: string }>> = ({ data }) => {
  return (
    <div className="text-node">
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Text</div>
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};


