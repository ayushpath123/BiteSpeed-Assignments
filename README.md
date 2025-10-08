# BiteSpeed Frontend Task: Chatbot Flow Builder

A simple, extensible chatbot flow builder built with React, TypeScript, and React Flow.

## Tech Stack

- React 18 + TypeScript
- Vite (dev/build tooling)
- React Flow (`reactflow`) for the canvas, nodes, edges, and handles

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build & Preview

```bash
npm run build
npm run preview
```

## What You Can Do

- Add Text nodes from the Nodes panel (drag or click)
- Connect nodes with edges on the canvas
- Select a node to open the Settings panel and edit its text
- Save the flow with validation

## Feature Details

### 1) Text Node

- Only one node type is implemented: Text Message
- Multiple Text nodes can exist
- Each Text node has:
  - A target handle (top): can accept multiple incoming edges
  - A source handle (bottom): limited to one outgoing edge (enforced)

### 2) Nodes Panel

- Displays available node types (currently just Text)
- Extensible: adding new node types only requires implementing a node component and listing it in this panel
- Interactions:
  - Drag: start dragging the Text item and drop it to add a node
  - Click: quickly adds a Text node at a sensible position

### 3) Edge

- Connect nodes by dragging from the source handle of one to the target handle of another

### 4) Source Handle Constraint

- Enforced in code: A source handle can have only one outgoing edge
- Attempting to connect a second outgoing edge from the same source handle is ignored

### 5) Target Handle Behavior

- Can accept multiple incoming edges (no limit)

### 6) Settings Panel

- Replaces the Nodes Panel when a node is selected
- Lets you edit the text of the selected Text node via a text input

### 7) Save Button + Validation

- Click Save to validate the flow
- Validation rule implemented per spec:
  - If there are more than one nodes and more than one node has no incoming edge (i.e., more than one “start” node), show an error
  - Otherwise, show a success message

Tip: To pass validation when you have multiple nodes, ensure that only one node is unconnected as a target (has no incoming edge). Example: A → B → C is valid (only A has no incoming). A and B unconnected is invalid (both have no incoming).

## Project Structure

```
src/
  main.tsx                 # App entry
  styles/global.css        # Basic styles & layout
  modules/
    App.tsx                # Canvas, state, panels, save/validation
    nodes/
      TextNode.tsx         # Text node component with handles
    panels/
      NodesPanel.tsx       # Palette for adding nodes (drag/click)
      SettingsPanel.tsx    # Edit selected node text
```

- `App.tsx` wires React Flow (`nodes`, `edges`, connect logic) and swaps the sidebar between the Nodes panel and Settings panel depending on selection
- `TextNode.tsx` renders the visual node and its handles
- `NodesPanel.tsx` exposes a clean API to add specific node types; currently only `Text` is registered
- `SettingsPanel.tsx` binds to the selected node and updates its text

## Key Implementation Notes

- Enforcing single outgoing edge:
  - On connect, we check existing edges for a given `source` and `sourceHandle`. If one exists, we skip adding another
- Validation on Save (spec requirement):
  - Count incoming edges per node. If there are more than one nodes, and more than one have zero incoming edges, show the error
- Extensibility:
  - Add a new node type by creating a node component and registering it in `nodeTypes` in `App.tsx`
  - Add a new palette entry in `NodesPanel.tsx` to support drag/click insertion
  - Extend `SettingsPanel.tsx` to render node-type specific editors

## How Drag & Drop Works Here

- The Nodes panel uses native HTML5 drag-and-drop to signal the node type
- For simplicity, clicking the node also creates it at a default position
- You can then move nodes freely on the React Flow canvas

## Troubleshooting

- Error on Save: “More than one node has empty target handles”
  - This means multiple nodes have no incoming edge; connect them so only one node is the start
- Nothing happens when connecting nodes
  - Ensure you start dragging from a source handle (bottom) and drop onto a target handle (top)
- Dev server unreachable
  - Ensure `npm run dev` is running and visit `http://localhost:5173`

## Possible Improvements

- Pane-coordinate-aware DnD: translate screen drop position into exact canvas coordinates for precise placement
- Multiple node types: Images, Questions, Quick Replies, etc.
- Undo/Redo and autosave
- Persist flows to localStorage or backend API
- Better Save UI: inline highlighting of invalid nodes instead of alert
- Edge types and labels

## Scripts

- `npm run dev`: start dev server on port 5173
- `npm run build`: type-check and build
- `npm run preview`: preview the production build on port 5174

## License

For use in the BiteSpeed assignment context.
