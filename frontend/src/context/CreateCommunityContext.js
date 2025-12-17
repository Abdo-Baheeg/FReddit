import React, { createContext, useContext, useState } from 'react';

const CreateCommunityContext = createContext();

export const useCreateCommunity = () => {
  const context = useContext(CreateCommunityContext);
  if (!context) {
    throw new Error('useCreateCommunity must be used within CreateCommunityProvider');
  }
  return context;
};

export const CreateCommunityProvider = ({ children }) => {
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);

  const openCreateCommunityModal = () => {
    setIsCreateCommunityModalOpen(true);
  };

  const closeCreateCommunityModal = () => {
    setIsCreateCommunityModalOpen(false);
  };

  return (
    <CreateCommunityContext.Provider
      value={{
        isCreateCommunityModalOpen,
        openCreateCommunityModal,
        closeCreateCommunityModal,
      }}
    >
      {children}
    </CreateCommunityContext.Provider>
  );
};
