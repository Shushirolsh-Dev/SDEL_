import React, { useEffect } from 'react';

interface AppToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const AppToast: React.FC<AppToastProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-emerald-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${bgColor} animate-slide-in`}
    >
      {message}
    </div>
  );
};

export default AppToast;