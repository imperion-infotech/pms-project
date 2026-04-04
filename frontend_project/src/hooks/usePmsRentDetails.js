import { propertyService } from '../services/propertyService'
import { useApiCRUD } from './useApiCRUD'

export const usePmsRentDetails = () => {
  const { data, isLoading, fetchData, add, update, remove } = useApiCRUD(
    propertyService.getRentDetails,
    {
      create: propertyService.createRentDetail,
      update: propertyService.updateRentDetail,
      delete: propertyService.deleteRentDetail,
    },
    'Rent Details',
    false
  )
  return {
    rentDetails: data,
    isLoading,
    fetchRentDetails: fetchData,
    addRentDetail: add,
    updateRentDetail: update,
    deleteRentDetail: remove,
  }
}
