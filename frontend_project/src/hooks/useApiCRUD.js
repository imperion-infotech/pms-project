import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../context/NotificationContext';

const extractData = (res) => res?.data?.content || (Array.isArray(res?.data) ? res.data : []);

/**
 * useApiCRUD - Generic React hook for handling RESTful API logic.
 * @param {Function} fetchFn - Function to fetch the main list of data.
 * @param {Object} crudFns - Object containing create, update, delete functions.
 * @param {string} entityName - Name of the entity for notification messages.
 * @param {boolean} autoFetch - Whether to fetch data automatically on mount.
 */
export const useApiCRUD = (fetchFn, crudFns, entityName = 'Item', autoFetch = true) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    if (!fetchFn) return;
    setIsLoading(true);
    try {
      const res = await fetchFn();
      setData(extractData(res));
      return res;
    } catch (err) {
      console.error(`Failed to fetch ${entityName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, entityName]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const add = useCallback(async (payload) => {
    if (!crudFns?.create) return;
    setIsLoading(true);
    try {
      const res = await crudFns.create(payload);
      toast.success(`${entityName} created successfully`);
      await fetchData();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to create ${entityName}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [crudFns, entityName, fetchData, toast]);

  const update = useCallback(async (id, payload) => {
    if (!crudFns?.update) return;
    setIsLoading(true);
    try {
      const res = await crudFns.update(id, payload);
      toast.success(`${entityName} updated successfully`);
      await fetchData();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update ${entityName}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [crudFns, entityName, fetchData, toast]);

  const remove = useCallback(async (id) => {
    if (!crudFns?.delete) return;
    setIsLoading(true);
    try {
      const res = await crudFns.delete(id);
      toast.success(`${entityName} deleted successfully`);
      await fetchData();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to delete ${entityName}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [crudFns, entityName, fetchData, toast]);

  return {
    data,
    setData,
    isLoading,
    fetchData,
    add,
    update,
    remove,
  };
};
