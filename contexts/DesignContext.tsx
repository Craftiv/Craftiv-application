import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface DesignData {
  id: string;
  label: string;
  image: string;
  createdAt: Date;
  isCompleted: boolean;
  content?: string;
}

interface DesignContextType {
  recentDesigns: DesignData[];
  getDesignById: (id: string) => DesignData | undefined;
  addDesign: (design: Omit<DesignData, 'id' | 'createdAt'>) => void;
  updateDesign: (id: string, updates: Partial<DesignData>) => void;
  deleteDesign: (id: string) => void;
  clearDesigns: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const useDesigns = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesigns must be used within a DesignProvider');
  }
  return context;
};

interface DesignProviderProps {
  children: ReactNode;
}

export const DesignProvider: React.FC<DesignProviderProps> = ({ children }) => {
  const [recentDesigns, setRecentDesigns] = useState<DesignData[]>([]);

  // Load designs from AsyncStorage on app start
  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const storedDesigns = await AsyncStorage.getItem('recentDesigns');
      if (storedDesigns) {
        const designs = JSON.parse(storedDesigns);
        // Convert string dates back to Date objects
        const designsWithDates = designs.map((design: any) => ({
          ...design,
          createdAt: new Date(design.createdAt),
        }));
        setRecentDesigns(designsWithDates);
      }
    } catch (error) {
      console.error('Error loading designs:', error);
    }
  };

  const saveDesigns = async (designs: DesignData[]) => {
    try {
      await AsyncStorage.setItem('recentDesigns', JSON.stringify(designs));
    } catch (error) {
      console.error('Error saving designs:', error);
    }
  };

  const getDesignById = (id: string) => {
    return recentDesigns.find(design => design.id === id);
  };

  const addDesign = (designData: Omit<DesignData, 'id' | 'createdAt'>) => {
    const newDesign: DesignData = {
      ...designData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedDesigns = [newDesign, ...recentDesigns].slice(0, 10); // Keep only 10 most recent
    setRecentDesigns(updatedDesigns);
    saveDesigns(updatedDesigns);
  };

  const updateDesign = (id: string, updates: Partial<DesignData>) => {
    const updatedDesigns = recentDesigns.map(design =>
      design.id === id ? { ...design, ...updates } : design
    );
    setRecentDesigns(updatedDesigns);
    saveDesigns(updatedDesigns);
  };

  const deleteDesign = (id: string) => {
    const updatedDesigns = recentDesigns.filter(design => design.id !== id);
    setRecentDesigns(updatedDesigns);
    saveDesigns(updatedDesigns);
  };

  const clearDesigns = () => {
    setRecentDesigns([]);
    saveDesigns([]);
  };

  const value: DesignContextType = {
    recentDesigns,
    getDesignById,
    addDesign,
    updateDesign,
    deleteDesign,
    clearDesigns,
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}; 