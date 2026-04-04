import { propertyService } from '../services/propertyService'
import { useApiCRUD } from './useApiCRUD'

export const usePmsStayDetails = () => {
  const { data, isLoading, fetchData, add, update, remove } = useApiCRUD(
    propertyService.getStayDetails,
    {
      create: propertyService.createStayDetail,
      update: propertyService.updateStayDetail,
      delete: propertyService.deleteStayDetail,
    },
    'Stay Details',
    false
  )
  return {
    stayDetails: data,
    isLoading,
    fetchStayDetails: fetchData,
    addStayDetail: add,
    updateStayDetail: update,
    deleteStayDetail: remove,
  }
}
