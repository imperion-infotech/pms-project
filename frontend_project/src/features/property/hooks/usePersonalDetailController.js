import { useMemo, useState } from 'react';

/**
 * Controller: usePersonalDetailController
 */
const usePersonalDetailController = ({ details, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const stats = useMemo(() => {
    return [
      { label: 'Total Records', value: details.length, color: 'emerald' },
      { label: 'With Photos', value: details.filter(d => d.profilePhoto).length, color: 'blue' },
      { label: 'With Signatures', value: details.filter(d => d.signature).length, color: 'purple' },
      { label: 'Corporate Accounts', value: details.filter(d => d.companyName).length, color: 'orange' },
    ];
  }, [details]);

  const cleanImageUrl = (path) => {
    if (!path || path === 'photo' || path === 'sign') return null;
    let cleanPath = String(path);
    if (cleanPath.includes(': ')) {
      cleanPath = cleanPath.split(': ')[1].trim();
    }
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
