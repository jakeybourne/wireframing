// Sidebar.tsx
import Image from 'next/image';
import React from 'react';

// Define the props type
interface SidebarProps {
  onAddNode: () => void; // Change this type based on the actual function signature
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
  return (
    <div className='sidebar p-42 rounded-lg bg-white shadow'>
      <button
        className='flex w-full items-center justify-center rounded bg-white p-2 text-white'
        onClick={onAddNode}
      >
        <Image src='/svg/AddIcon.svg' alt='Add Node' width={24} height={24} />
      </button>
    </div>
  );
};

export default Sidebar;
