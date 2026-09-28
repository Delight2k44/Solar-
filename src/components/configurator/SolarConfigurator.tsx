import React from 'react';
import { TeslaSolarDesignPage } from '../../pages/TeslaSolarDesignPage';

interface SolarConfiguratorProps {
  onQuoteRequested?: (data: any) => void;
  isStandalone?: boolean;
  setCurrentRoute?: (route: string) => void;
}

export const SolarConfigurator: React.FC<SolarConfiguratorProps> = ({
  setCurrentRoute = () => {}
}) => {
  return (
    <div className="w-full">
      <TeslaSolarDesignPage 
        setCurrentRoute={setCurrentRoute}
      />
    </div>
  );
};
