// Create a new file: UpdateNodeDataContext.tsx
import React from 'react';

interface ChildNodeProps {
  id: string;
  label: string;
  description?: string;
  highlighted?: boolean;
}

interface UpdateNodeDataContextProps {
  updateNodeData: (nodeId: string, newLabel: string) => void;
  updateNodeChildren: (nodeId: string, newChildren: ChildNodeProps[]) => void;
}

export const UpdateNodeDataContext = React.createContext<
  UpdateNodeDataContextProps | undefined
>(undefined);

export const useUpdateNodeData = () => {
  const context = React.useContext(UpdateNodeDataContext);
  if (!context) {
    throw new Error(
      'useUpdateNodeData must be used within a UpdateNodeDataProvider'
    );
  }
  return context.updateNodeData;
};
