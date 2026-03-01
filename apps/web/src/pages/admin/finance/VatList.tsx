import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { AdminTable } from '../../../components/admin/AdminTable';
import {
  AdminSearchBar,
  AdminFilter,
  AdminDateRange,
} from '../../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../../components/admin/AdminPagination';

interface Vat {
  id: string;
  userName: string;
  country: string;
  vatStatus: string;
  vatType: string;
  amount: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function VatList() {
  const [items, setItems] = useState<Vat[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const fetch = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) p.set('search', search);
    if (countryFilter) p.set('country', countryFilter);
    if (statusFilter) p.set('vatStatus', statusFilter);
    if (dateFrom) p.set('from', dateFrom);
    if (dateTo) p.set('to', dateTo);
    api
      .get(`/admin/finance/vat?${p}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, countryFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const selectAll = () =>
    setSelected(items.length === selected.length ? [] : items.map((i) => i.id));

  const columns = [
    {
      key: 'select',
      header: '',
      render: (v: Vat) => (
        <input
          type="checkbox"
          checked={selected.includes(v.id)}
          onChange={() => toggleSelect(v.id)}
        />
      ),
    },
    { key: 'userName', header: 'User' },
    { key: 'country', header: 'Country' },
    {
      key: 'vatStatus',
      header: 'VAT Status',
      render: (v: Vat) => (
        <span
          className={`text-[12px] ${v.vatStatus === 'Paid' ? 'text-[#28a745]' : 'text-[#ff9800]'}`}
        >
          {v.vatStatus}
        </span>
      ),
    },
    { key: 'vatType', header: 'VAT Type' },
    { key: 'amount', header: 'Amount', render: (v: Vat) => `$${Number(v.amount || 0).toFixed(2)}` },
    {
      key: 'createdAt',
      header: 'Date',
      render: (v: Vat) => new Date(v.createdAt).toLocaleDateString(),
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Finance {'>'} VAT List
      </p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="Country"
          value={countryFilter}
          onChange={setCountryFilter}
          options={[
            { value: 'US', label: 'US' },
            { value: 'UK', label: 'UK' },
            { value: 'EU', label: 'EU' },
          ]}
        />
        <AdminFilter
          label="VAT Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'Paid', label: 'Paid' },
            { value: 'Unpaid', label: 'Unpaid' },
          ]}
        />
        <AdminDateRange
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
          onClear={() => {
            setDateFrom('');
            setDateTo('');
          }}
        />
        <button
          onClick={selectAll}
          className="rounded-[6px] border border-[#15191c] px-[12px] py-[6px] font-outfit text-[14px] text-[#15191c]"
        >
          Select All
        </button>
        <button className="rounded-[6px] bg-[#28a745] px-[12px] py-[6px] font-outfit text-[14px] text-white">
          Mark Paid
        </button>
        <button className="rounded-[6px] border border-[#15191c] px-[12px] py-[6px] font-outfit text-[14px] text-[#15191c]">
          Download CSV
        </button>
      </AdminSearchBar>
      <AdminTable columns={columns} data={items} />
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
