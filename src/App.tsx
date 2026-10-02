import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { BrandLoader } from './components/shell/BrandLoader';
import { useSimulate } from './store/useSimulate';
import { BRAND } from './config/brand';

export const App: React.FC = () => {
  const [loaderDone, setLoaderDone] = useState(false);
  const { setLinkState } = useSimulate();

  useEffect(() => {
    // Check URL parameters for secret QR token ?k=...
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('k');

    if (token) {
      if (token === BRAND.validToken) {
        setLinkState('valid');
      } else {
        setLinkState('expired');
      }
    }
  }, [setLinkState]);

  return (
    <>
      {!loaderDone && <BrandLoader onComplete={() => setLoaderDone(true)} />}
      <RouterProvider router={router} />
    </>
  );
};
export default App;
