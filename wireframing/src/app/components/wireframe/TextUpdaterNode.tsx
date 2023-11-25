import React from 'react';
import { Handle, Position } from 'reactflow';

import { useUpdateNodeData } from './UpdateNodeDataContext'; // adjust the import path

interface TextUpdaterNodeData {
  label: string;
}

interface TextUpdaterNodeProps {
  data: TextUpdaterNodeData;
  id: string;
  selected: boolean;
  updateNodeData?: (id: string, newLabel: string) => void;
}

const handleStyle = { left: 10 };

const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, id }) => {
  const updateNodeData = useUpdateNodeData();

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, evt.target.value);
  };

  return (
    <>
      <Handle type='target' position={Position.Top} />
      <div>
        <input
          value={data.label}
          onChange={onChange}
          className='nodrag text-black'
          style={{ width: '100%' }}
        />
      </div>
      <Handle type='source' position={Position.Bottom} id='a' />
      <Handle
        type='source'
        position={Position.Bottom}
        id='b'
        style={handleStyle}
      />
    </>
  );
};

export default TextUpdaterNode;
