import React, { createContext, useContext, useState } from 'react';

type SpinnerContextType = {
  showSpinner: () => void;
  hideSpinner: () => void;
  isLoading: boolean;
};

const SpinnerContext = createContext<SpinnerContextType>({} as SpinnerContextType);

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showSpinner = () => setIsLoading(true);
  const hideSpinner = () => setIsLoading(false);

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner, isLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => useContext(SpinnerContext);