'use client';
import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  NodeProps,
  NodeChange,
  EdgeChange,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

import CustomEdge from '@/app/components/wireframe/CustomEdge';
import CustomNodeComponent from '@/app/components/wireframe/CustomNodeComponent';
import Sidebar from '@/app/components/wireframe/Sidebar';
import TextUpdaterNode from '@/app/components/wireframe/TextUpdaterNode';
import { UpdateNodeDataContext } from '@/app/components/wireframe/UpdateNodeDataContext';
import { toast } from 'react-toastify';


// interface NodeData {
//   label: string;
// }

interface ExtendedNodeProps extends NodeProps {
  updateNodeData?: (nodeId: string, newLabel: string) => void;
  nodeId?: string; // Optionally include nodeId if it's not always present
}

let nodeIdCounter = 0;
const generateNodeId = () => `node-${nodeIdCounter++}`;

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode', // This type should match the type you register below
    position: { x: 0, y: 0 },
    data: {
      label: 'Home',
      children: [
        { id: generateNodeId(), label: 'Navbar' },
        { id: generateNodeId(), label: 'Hero Header Section' },
        { id: generateNodeId(), label: 'Hero Header Section 2' },
        // ... more children
      ],
    },
  },
  // ... other parent nodes
];

const initialEdges: Edge[] = [
  // Define your initial edges here, and for each edge include the style property:
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { strokeWidth: 4 }, // Adjust the stroke width as needed
    // ... other edge properties
  },
  // ... other edges
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds));
    },
    [setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // Cast the node to any to update its data since NodeProps does not directly support 'data' property updates
            return { ...node, data: { ...node.data, label: newLabel } } as any;
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const addNewNode = useCallback(() => {
    const newNode = {
      id: generateNodeId(),
      type: 'customNode', // Use your custom node type here
      position: {
        x: (Math.random() * window.innerWidth) / 2,
        y: (Math.random() * window.innerHeight) / 2,
      },
      data: { label: `Page ${nodes.length}`, children: [] },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  // Define the nodeTypes using NodeProps
  const nodeTypes = useMemo<
    Record<string, React.ComponentType<ExtendedNodeProps>>
  >(
    () => ({
      customNode: CustomNodeComponent,
      textUpdater: TextUpdaterNode,
    }),
    []
  );

  // Save function uses the latest state
  const saveSitemapToFirebase = async () => {
    const sitemapId = 'your_sitemap_id';

    try {
      toast.success('Sitemap saved/updated in Firestore successfully');
      console.log('Current nodes:', nodes);
      console.log('Current edges:', edges);
    } catch (error) {
      const typedError = error as Error;
      toast.error(
        `Error saving/updating sitemap in Firestore: ${typedError.message}`
      );
    }
  };

  // Make sure these are being triggered upon node changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Make sure these are being triggered upon edge changes
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const updateNodeChildren = useCallback(
    (nodeId: string, newChildren: ChildNodeProps[]) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, children: newChildren } }
            : node
        )
      );
    },
    [setNodes]
  );

  return (
    <UpdateNodeDataContext.Provider
      value={{ updateNodeData, updateNodeChildren }}
    >
      <div className='save-button-container'>
        <button onClick={saveSitemapToFirebase} className='save-button'>
          Save Sitemap
        </button>
      </div>
      <div
        ref={reactFlowWrapper}
        className='reactflow-wrapper relative h-screen'
      >
        <ReactFlow
          nodes={nodes as Node[]} // Cast nodes to any to satisfy the nodes prop requirement
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={{
            customNode: (nodeProps: ExtendedNodeProps) => (
              <CustomNodeComponent {...nodeProps} nodeId={nodeProps.id} />
            ),
          }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <div className='absolute right-0 top-1/2 z-10 -translate-y-1/2 transform'>
            <Sidebar onAddNode={addNewNode} />
          </div>
        </ReactFlow>
      </div>

      {/* Sidebar Container */}
      <div className='w-20 md:w-40 lg:w-64'>
        {/* Sidebar contents */}
        <Sidebar onAddNode={addNewNode} />
      </div>
    </UpdateNodeDataContext.Provider>
  );
}
