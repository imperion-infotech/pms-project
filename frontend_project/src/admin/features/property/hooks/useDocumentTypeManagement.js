import { useState, useCallback } from 'react'

/**
 * useDocumentTypeManagement - Centralized hook for Document Type CRUD operations.
 */
export const useDocumentTypeManagement = ({ addDocumentType, updateDocumentType, toggleModal }) => {
  const [newDocumentType, setNewDocumentType] = useState({
    id: 0,
    documentTypeShortName: '',
    documentTypeName: '',
    documentTypeCategory: '',
    documentTypeDescription: '',
    documentTypeDefault: false,
  })
  const [editDocumentType, setEditDocumentType] = useState({
    id: null,
    documentTypeShortName: '',
    documentTypeName: '',
    documentTypeCategory: '',
    documentTypeDescription: '',
    documentTypeDefault: false,
  })

  const handleAddDocumentType = useCallback(async () => {
    if (!newDocumentType.documentTypeName.trim()) return
    try {
      await addDocumentType(newDocumentType)
      setNewDocumentType({
        id: 0,
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
  }, [newDocumentType, addDocumentType, toggleModal])

  const handleUpdateDocumentType = useCallback(async () => {
    if (editDocumentType.id === null || !editDocumentType.documentTypeName?.trim()) return
    try {
      await updateDocumentType(editDocumentType.id, editDocumentType)
      setEditDocumentType({
        id: null,
        documentTypeShortName: '',
        documentTypeName: '',
        documentTypeCategory: '',
        documentTypeDescription: '',
        documentTypeDefault: false,
      })
      toggleModal('documentTypeEdit', false)
    } catch (err) {
      console.error('Failed to update document type:', err)
    }
  }, [editDocumentType, updateDocumentType, toggleModal])

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
