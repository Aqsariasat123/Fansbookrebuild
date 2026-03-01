import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

type Row = Record<string, unknown>;

export function useMasterCrud(apiPath: string) {
  const [items, setItems] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Row | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) p.set('search', search);
    api
      .get(`${apiPath}?${p}`)
      .then(({ data: r }) => {
        const d = r.data;
        setItems(Array.isArray(d) ? d : d.items || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, apiPath]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`${apiPath}/${editItem.id}`, data);
      } else {
        await api.post(apiPath, data);
      }
      setEditItem(null);
      setShowAdd(false);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setSaving(true);
    try {
      await api.delete(`${apiPath}/${deleteItem.id}`);
      setDeleteItem(null);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const initialData = editItem
    ? Object.fromEntries(Object.entries(editItem).map(([k, v]) => [k, String(v ?? '')]))
    : undefined;

  return {
    items,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
    editItem,
    setEditItem,
    showAdd,
    setShowAdd,
    deleteItem,
    setDeleteItem,
    saving,
    handleSave,
    handleDelete,
    initialData,
  };
}
