import { memo, useEffect, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface InitialProps {
  loc: string;
}

const InitialComponent: FC<InitialProps> = ({ loc }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Navigate to the initial route when the app starts
    if (location.pathname === '/') {
      navigate(loc);
    }
  }, [navigate, location.pathname, loc]);

  return null; // No UI, just redirecting
};

export const Initial = memo(InitialComponent);
