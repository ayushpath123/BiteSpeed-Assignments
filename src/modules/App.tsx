import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TextNode } from './nodes/TextNode';
import { NodesPanel } from './panels/NodesPanel';
import { SettingsPanel } from './panels/SettingsPanel';

type TextData = { label: string };

const nodeTypes: NodeTypes = { text: TextNode };

const initialNodes: Node<TextData>[] = [];
const initialEdges: Edge[] = [];

export const App: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<TextData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source) return;
      // enforce single outgoing edge from a source handle
      const alreadyHasOutgoing = edges.some(
        (e) => e.source === connection.source && e.sourceHandle === connection.sourceHandle
      );
      if (alreadyHasOutgoing) return;
      setEdges((eds) => addEdge({ ...connection, type: 'default' }, eds));
    },
    [edges, setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleDropNewTextNode = useCallback((position: { x: number; y: number }) => {
    const id = `text_${crypto.randomUUID()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'text',
        position,
        data: { label: 'Text message' },
      },
    ]);
  }, [setNodes]);

  // Add convenience: header button to add a node at a simple offset location
  const addQuickTextNode = useCallback(() => {
    const offsetY = 80 + nodes.length * 40;
    handleDropNewTextNode({ x: 250, y: offsetY });
  }, [handleDropNewTextNode, nodes.length]);

  // Enable dropping from Nodes panel directly onto the canvas at cursor position
  const onDragOverCanvas = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropCanvas = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/node-type');
    if (!type) return;
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;
    const position = rfInstance?.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    if (!position) return;
    if (type === 'text') {
      handleDropNewTextNode(position);
    }
  }, [rfInstance, handleDropNewTextNode]);

  // Allow Delete/Backspace to remove the selected node and its connected edges
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNodeId, setNodes, setEdges]);

  const onSave = useCallback(() => {
    // Validation: if there are more than one nodes and more than one node has empty target handles
    if (nodes.length <= 1) return alert('Saved!');
    const nodeIdToIncomingCount = new Map<string, number>();
    nodes.forEach((n) => nodeIdToIncomingCount.set(n.id, 0));
    edges.forEach((e) => {
      if (e.target) nodeIdToIncomingCount.set(e.target, (nodeIdToIncomingCount.get(e.target) ?? 0) + 1);
    });
    const nodesWithNoIncoming = Array.from(nodeIdToIncomingCount.entries())
      .filter(([_, count]) => count === 0)
      .map(([id]) => id);

    if (nodesWithNoIncoming.length > 1) {
      alert('Error: More than one node has empty target handles');
      return;
    }
    alert('Saved!');
  }, [nodes, edges]);

  return (
    <div className="app">
      <header className="app__header">
        <h3 style={{ margin: 0 }}>BiteSpeed Chatbot Flow Builder</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" onClick={addQuickTextNode}>+ Text Node</button>
          <button className="button" onClick={onSave}>Save</button>
        </div>
      </header>
      <aside className="app__sidebar">
        {selectedNode ? (
          <SettingsPanel
            node={selectedNode}
            onChangeLabel={(label) =>
              setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...(n.data as TextData), label } } : n)))
            }
            onDelete={() => {
              const id = selectedNode.id;
              setNodes((nds) => nds.filter((n) => n.id !== id));
              setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
              setSelectedNodeId(null);
            }}
          />
        ) : (
          <NodesPanel onDropTextNode={handleDropNewTextNode} />
        )}
      </aside>
      <main className="app__canvas" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOverCanvas}
          onDrop={onDropCanvas}
          onInit={(instance) => setRfInstance(instance)}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
};


