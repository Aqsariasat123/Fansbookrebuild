import { useState, useEffect } from 'react';
import { api, inputClass, labelClass, saveButtonClass, extractError } from './shared';

export function MessagePricingTab({
  onToast,
}: {
  onToast: (type: 'success' | 'error', msg: string) => void;
}) {
  const [price, setPrice] = useState('0');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/creator/profile/message-price')
      .then(({ data: r }) => {
        if (r.success) setPrice(String(r.data.messagePrice || 0));
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    const num = parseFloat(price);
    if (isNaN(num) || num < 0) {
      onToast('error', 'Price must be 0 or a positive number');
      return;
    }
    setSaving(true);
    try {
      await api.put('/creator/profile/message-price', { price: num });
      onToast('success', 'Message price updated');
    } catch (err) {
      onToast('error', extractError(err));
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <p className="text-[14px] text-muted-foreground">
        Set a price that fans must pay to unlock a conversation with you. Set to 0 for free
        messaging.
      </p>
      <div>
        <label className={labelClass}>Message Price (coins)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass + ' mt-[8px]'}
          placeholder="0"
        />
      </div>
      <div className="flex justify-center">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
