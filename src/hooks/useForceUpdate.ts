import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [updateId, setUpdateId] = useState(Math.random());

  const forceUpdate = useCallback(() => {
    setUpdateId(Math.random());
  }, []);

  return {
    updateId,
    forceUpdate,
  };
};
