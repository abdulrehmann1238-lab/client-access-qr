import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulate } from '../store/useSimulate';
import { useSession } from '../store/useSession';
import { InactiveLink } from './InactiveLink';
import { Gate } from './Gate';

export const Entry: React.FC = () => {
  const navigate = useNavigate();
  const { linkState } = useSimulate();
  const { isAuthenticated, isLocked } = useSession();

  // If already authenticated and not locked, proceed directly to Menu
  useEffect(() => {
    if (isAuthenticated && !isLocked && linkState === 'valid') {
      navigate('/menu', { replace: true });
    }
  }, [isAuthenticated, isLocked, linkState, navigate]);

  if (linkState !== 'valid') {
    return <InactiveLink />;
  }

  return <Gate />;
};
