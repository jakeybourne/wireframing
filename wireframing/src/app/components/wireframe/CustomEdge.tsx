import React from 'react';
import { EdgeProps, getBezierPath, Position } from 'reactflow';

// Custom edge component
const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Top,
  targetPosition = Position.Bottom,
}) => {
  // Extract the path string from the getBezierPath function
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Define the stroke widths
  const visibleStrokeWidth = 12;
  const invisibleStrokeWidth = 20;

  return (
    <>
      {/* Invisible clickable path */}
      <path
        id={`clickable-${id}`}
        className='react-flow__edge-path'
        d={edgePath}
        stroke='transparent'
        strokeWidth={invisibleStrokeWidth}
        onMouseDown={() => {
          // console.log(`Clicked on edge ${id}`);
        }}
      />
      {/* Visible edge path */}
      <path
        id={id}
        className='react-flow__edge-path'
        d={edgePath}
        stroke='#b1b1b7'
        strokeWidth={visibleStrokeWidth}
      />
    </>
  );
};

export default CustomEdge;
