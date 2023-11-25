import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface ChildNodeProps {
  id: string;
  label: string;
  description?: string;
  highlighted?: boolean;
  onMove: (id: string, direction: 'up' | 'down') => void;
  updateNodeLabel: (id: string, newLabel: string) => void;
  onDelete: (id: string) => void;
}

const ChildNode: React.FC<ChildNodeProps> = ({
  id,
  label,
  highlighted,
  onMove,
  updateNodeLabel,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  const highlightClass = highlighted
    ? 'border-green-500 bg-green-100'
    : 'border-gray-300';

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditLabel(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    updateNodeLabel(id, editLabel);
  };

  return (
    <div
      className={`child-node border-l-4 ${highlightClass} p- m-2 flex items-center justify-between p-2`}
    >
      <div className='flex flex-grow items-center'>
        {isEditing ? (
          <input
            ref={inputRef}
            value={editLabel}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className='nodrag flex-grow text-black'
          />
        ) : (
          <div
            onClick={handleLabelClick}
            className='flex-grow cursor-pointer text-sm font-bold'
          >
            {label}
          </div>
        )}
      </div>

      <div className='ml-4 flex items-center align-middle'>
        <button
          onClick={() => onMove(id, 'up')}
          className='mx-1 align-middle focus:outline-none'
        >
          &#x25B2;
        </button>
        <button
          onClick={() => onMove(id, 'down')}
          className='mx-1focus:outline-none'
        >
          &#x25BC;
        </button>
        <button
          onClick={() => onDelete(id)}
          className='mx-1 ml-5 focus:outline-none'
        >
          <Image
            loading='lazy'
            src='/svg/TrashIcon.svg'
            alt='Delete'
            width={15}
            height={15}
          />
        </button>
      </div>
    </div>
  );
};

export default ChildNode;
