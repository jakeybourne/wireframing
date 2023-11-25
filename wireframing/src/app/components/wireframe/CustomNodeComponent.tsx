import Image from 'next/image';
import React, { useContext, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have `uuid` installed

import ChildNode from './ChildNode'; // Assuming ChildNode is in the same directory
import { UpdateNodeDataContext } from '@/app/components/wireframe/UpdateNodeDataContext';

// Define the structure of the data for child nodes
interface ChildNodeProps {
  id: string;
  label: string;
  description?: string;
  highlighted?: boolean;
}

// Define the structure of the data expected by the custom node
interface CustomNodeData {
  label: string;
  children: ChildNodeProps[];
  updateNodeChildren: any;
}

interface CustomNodeComponentProps {
  data: CustomNodeData;
  nodeId: any;
}

const handleStyle = { top: 10 };

const CustomNodeComponent: React.FC<CustomNodeComponentProps> = ({
  data,
  nodeId,
}) => {
  const [children, setChildren] = useState(data.children);
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const context = useContext(UpdateNodeDataContext);

  // Make sure context is not undefined before using it
  if (!context) {
    throw new Error(
      'CustomNodeComponent must be used within a UpdateNodeDataContext Provider'
    );
  }

  const { updateNodeChildren } = context;
  const onChildNodeUpdate = (childId: string, newLabel: string) => {
    const newChildren = data.children.map((child) =>
      child.id === childId ? { ...child, label: newLabel } : child
    );

    updateNodeChildren(nodeId, newChildren);
  };

  // const handleChildChange = (childId, newLabel) => {
  //   // Update the children state
  //   const newChildren = children.map((child) =>
  //     child.id === childId ? { ...child, label: newLabel } : child
  //   );

  //   // Update the children in the parent node's data
  //   updateNodeChildren(newChildren);
  // };

  const moveChildNode = (childId: string, direction: 'up' | 'down') => {
    setChildren((currentChildren) => {
      const index = currentChildren.findIndex((c) => c.id === childId);
      if (index === -1) return currentChildren; // Child not found

      // Calculate new index
      let newIndex = index + (direction === 'up' ? -1 : 1);
      newIndex = Math.max(0, Math.min(currentChildren.length - 1, newIndex)); // Clamp between 0 and array length

      // Create a new array for immutability
      const reorderedChildren = [...currentChildren];
      const [removed] = reorderedChildren.splice(index, 1);
      reorderedChildren.splice(newIndex, 0, removed);

      return reorderedChildren;
    });
  };

  const updateNodeLabel = (childId: string, newLabel: string) => {
    setChildren((currentChildren) => {
      return currentChildren.map((child) =>
        child.id === childId ? { ...child, label: newLabel } : child
      );
    });
  };

  const addChildNode = () => {
    const newChild = {
      id: uuidv4(),
      label: 'New Section',
      highlighted: false,
    };
    setChildren([...children, newChild]);
    updateNodeChildren(nodeId, [...children, newChild]); // Use updated children array
  };

  const deleteChildNode = (childId: string) => {
    const updatedChildren = children.filter((child) => child.id !== childId);
    setChildren(updatedChildren);
    updateNodeChildren(nodeId, updatedChildren);
  };

  const handleNodeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  };

  const handleNodeLabelBlur = () => {
    setIsEditing(false);
    // Here you would update the parent node label state, similar to updateNodeLabel
    // You might need to lift the state up or use a context if this component does not own the state
  };

  const handleNodeLabelClick = () => {
    setIsEditing(true);
  };

  return (
    <div className='custom-node flex-auto overflow-hidden rounded-lg border shadow'>
      <Handle type='target' position={Position.Top} style={handleStyle} />
      <div className='bg-slate-300 p-2'>
        {isEditing ? (
          <input
            ref={inputRef}
            value={nodeName}
            onChange={handleNodeLabelChange}
            onBlur={handleNodeLabelBlur}
            className='nodrag w-full text-black'
          />
        ) : (
          <div
            onClick={handleNodeLabelClick}
            className='cursor-pointer p-2 text-center text-black'
          >
            {nodeName}
          </div>
        )}
      </div>

      {/* Add section or page button */}
      <div className='flex items-center justify-center py-2'>
        <button
          onClick={addChildNode}
          className='flex items-center justify-center'
        >
          {/* Assume Image component is imported correctly */}
          <Image
            loading='lazy'
            src='/svg/AddIcon.svg'
            alt='Add'
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Render child nodes */}
      {children.map((child) => (
        <ChildNode
          key={child.id}
          {...child}
          onMove={moveChildNode}
          updateNodeLabel={updateNodeLabel}
          onDelete={deleteChildNode}
        />
      ))}
      <Handle type='source' position={Position.Bottom} />
    </div>
  );
};

export default CustomNodeComponent;
