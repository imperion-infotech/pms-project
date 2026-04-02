import { useState, useMemo } from 'react';

/**
 * Controller: usePersonalDetailController
 * Logic for managing individual guest profiles.
 */
const usePersonalDetailController = ({ details, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const stats = useMemo(() => [
    { label: 'Total Guests', value: details.length },
    { label: 'Corporate Accounts', value: details.filter(d => d.companyName).length },
    { label: 'Premium Users', value: Math.floor(details.length * 0.4) }, // Placeholder logic
    { label: 'Active Profiles', value: details.length }
  ], [details]);

  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null;
    let cleanPath = String(path);
    if (cleanPath.includes(': ')) cleanPath = cleanPath.split(': ')[1].trim();
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    const parts = cleanPath.split('/');
    return parts[parts.length - 1];
  };

  const handleDeleteClick = (guest) => {
    setDeleteTarget({ id: guest.id, name: `${guest.firstName} ${guest.lastName}` });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.id) {
      onDelete(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return {
    stats,
    cleanImageUrl,
    deleteTarget,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default usePersonalDetailController;
