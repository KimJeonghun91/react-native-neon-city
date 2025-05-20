import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [updateId, setUpdateId] = useState(performance.now());

  const forceUpdate = useCallback(() => {
    setUpdateId(performance.now());
  }, []);

  return {
    updateId,
    forceUpdate,
  };
};
