import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { studentAction } from '@/lib/workspaceApi';

const WorkspaceContext = createContext(null);
export function useWorkspace() { return useContext(WorkspaceContext); }

export default function WorkspaceProvider({ children }) {
  const { isAuthenticated, authChecked, logout } = useAuth();
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const adopt = useCallback((data) => {
    setStudent(data?.student || null);
    setRecords(Array.isArray(data?.records) ? data.records : []);
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      adopt(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError('');
    try {
      const data = await studentAction('me');
      adopt(data);
      return data;
    } catch (err) {
      adopt(null);
      setError(err.message || 'Could not restore your saved workspace.');
      return null;
    } finally { setLoading(false); }
  }, [isAuthenticated, adopt]);

  useEffect(() => {
    if (authChecked) refresh();
  }, [authChecked, refresh]);

  const createProfile = async (payload) => {
    setLoading(true); setError('');
    try {
      const data = await studentAction('create', payload);
      adopt(data);
      return data.student;
    } finally { setLoading(false); }
  };

  const resumeProfile = async (oldCode) => {
    setLoading(true); setError('');
    try {
      const data = await studentAction('resume', { code: oldCode });
      adopt(data);
      return data.student;
    } finally { setLoading(false); }
  };

  const mergeRecord = (record) => {
    if (!record) return;
    setRecords(prev => {
      const i = prev.findIndex(r => r.id === record.id);
      if (i < 0) return [...prev, record];
      const next = [...prev]; next[i] = record; return next;
    });
  };

  const saveRecord = async (payload) => {
    const data = await studentAction('save', payload);
    mergeRecord(data.record);
    return data;
  };
  const submitProject = async (payload) => {
    const data = await studentAction('submitProject', payload);
    mergeRecord(data.record);
    return data;
  };
  const saveGeometry = async (geometry) => {
    const data = await studentAction('saveGeometry', { geometry });
    mergeRecord(data.record);
    return data;
  };
  const requestCertificate = async () => {
    const data = await studentAction('requestCertificate');
    if (data.student) setStudent(data.student);
    return data;
  };

  return <WorkspaceContext.Provider value={{
    student, records, loading, error, setError, refresh, createProfile,
    resumeProfile, saveRecord, submitProject, saveGeometry, requestCertificate,
    leave: () => logout(true),
  }}>{children}</WorkspaceContext.Provider>;
}
