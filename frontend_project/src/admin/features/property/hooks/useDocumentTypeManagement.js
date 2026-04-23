import { useState, useCallback } from 'react'
import { usePmsDocumentTypes } from '../../../../hooks/usePmsDocumentTypes'

/**
 * useDocumentTypeManagement - Centralized hook for Document Type CRUD operations.
 * Ported to TanStack Query for industrial stability.
 */
export const useDocumentTypeManagement = ({ toggleModal }) => {
  const { addDocumentType, updateDocumentType } = usePmsDocumentTypes()

  // Context: Get IDs from localStorage
  const activeHotelId = Number(localStorage.getItem('activeHotelId')) || 0
  const currentUserId = Number(localStorage.getItem('userId')) || 0

  const [newDocumentType, setNewDocumentType] = useState({
    documentTypeShortName: '',
    documentTypeName: '',
    documentTypeCategory: '',
    documentTypeDescription: '',
    documentTypeDefault: false,
  })

  const [editDocumentType, setEditDocumentType] = useState(null)

  const handleAddDocumentType = useCallback(async () => {
    if (!newDocumentType.documentTypeName.trim()) return
    try {
      const timestamp = new Date().toISOString()

      const payload = {
        hotelId: activeHotelId,
        isDeleted: false,
        isActive: true,
        createdBy: currentUserId,
        createdOn: timestamp,
        updatedBy: currentUserId,
        updatedOn: timestamp,
        deletedBy: 0,
        deletedOn: timestamp,
        id: 0,
        documentTypeShortName: newDocumentType.documentTypeShortName,
        documentTypeName: newDocumentType.documentTypeName,
        documentTypeDescription: newDocumentType.documentTypeDescription,
        documentTypeCategory: newDocumentType.documentTypeCategory,
        documentTypeDefault: Boolean(newDocumentType.documentTypeDefault),
      }

      console.log('Document Type Create Payload:', payload)
      await addDocumentType(payload)

      setNewDocumentType({
        documentTypeShortName: '',
        documentTypeName: '',
        documentTypeCategory: '',
        documentTypeDescription: '',
        documentTypeDefault: false,
      })
      toggleModal('documentType', false)
    } catch (err) {
      console.error('Failed to create document type:', err)
    }
  }, [newDocumentType, addDocumentType, toggleModal, activeHotelId, currentUserId])

  const handleUpdateDocumentType = useCallback(async () => {
    if (!editDocumentType || !editDocumentType.id || !editDocumentType.documentTypeName?.trim())
      return
    try {
      const payload = {
        ...editDocumentType,
        documentTypeDefault: Boolean(editDocumentType.documentTypeDefault),
        updatedBy: currentUserId,
        updatedOn: new Date().toISOString(),
      }

      console.log('Document Type Update Payload:', payload)
      await updateDocumentType(editDocumentType.id, payload)
      setEditDocumentType(null)
      toggleModal('documentTypeEdit', false)
    } catch (err) {
      console.error('Failed to update document type:', err)
    }
  }, [editDocumentType, updateDocumentType, toggleModal, currentUserId])

  const handleEditDocumentType = useCallback(
    (doc) => {
      setEditDocumentType({ ...doc })
      toggleModal('documentTypeEdit', true)
    },
    [toggleModal],
  )

  return {
    newDocumentType,
    setNewDocumentType,
    editDocumentType,
    setEditDocumentType,
    handleAddDocumentType,
    handleUpdateDocumentType,
    handleEditDocumentType,
  }
}
