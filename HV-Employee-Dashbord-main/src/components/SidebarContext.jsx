import { createContext, useContext } from 'react';

export const SidebarContext = createContext({
  open: false,
  setOpen: () => {},
  animate: true,
  pinned: false,
  setPinned: () => {},
  togglePinned: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
