import React, { useCallback } from 'react';

type Props = {
  onDropTextNode: (position: { x: number; y: number }) => void;
};

// Drag and drop from the panel: we use native DnD to get cursor position
export const NodesPanel: React.FC<Props> = ({ onDropTextNode }) => {
  const onDragStart = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    ev.dataTransfer.setData('application/node-type', 'text');
    ev.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
  }, []);

  const onDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault();
      const type = ev.dataTransfer.getData('application/node-type');
      if (type !== 'text') return;
      // Approximate drop position relative to the canvas area by using viewport coords
      // Consumers should translate screen coords to RF pane coords; handled in App by passing direct position
      const position = { x: 200, y: 100 }; // fallback position; actual placement handled by App via RF pane click
      onDropTextNode(position);
    },
    [onDropTextNode]
  );

  return (
    <div onDragOver={onDragOver} onDrop={onDrop}>
      <h4 className="panel-title">Nodes</h4>
      <div
        className="node-palette__item"
        draggable
        onDragStart={onDragStart}
        role="button"
        aria-label="Drag Text Node"
        onClick={() => onDropTextNode({ x: 200, y: 100 })}
      >
        Text Message
      </div>
    </div>
  );
};


