import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';
import { createFinancialDocument } from '../lib/financial';
import { DocumentItem } from '../types/financial';

interface NewDocumentProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function NewDocument({ projectId, onClose, onSuccess }: NewDocumentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'invoice',
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    companyName: '',
    companyAddress: '',
    description: '',
    notes: ''
  });

  const [items, setItems] = useState<Omit<DocumentItem, 'id' | 'documentId'>[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 20 }
  ]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      const tax = subtotal * (item.taxRate / 100);
      return sum + subtotal + tax;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const total = calculateTotal();
      const result = await createFinancialDocument(
        {
          projectId,
          type: formData.type as 'invoice' | 'quote' | 'contract',
          number: formData.number,
          date: formData.date,
          dueDate: formData.dueDate || undefined,
          amount: total,
          currency: 'EUR',
          status: 'draft',
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          description: formData.description,
          notes: formData.notes,
          items: []
        },
        items
      );

      if (!result) throw new Error('Failed to create document');

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, taxRate: 20 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof DocumentItem, value: any) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">New Financial Document</h2>
          <p className="text-gray-400 mt-1">Create a new financial document</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Document Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              >
                <option value="invoice">Invoice</option>
                <option value="quote">Quote</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Document Number
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter document number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Company Address
              </label>
              <input
                type="text"
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter company address"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-monaco-bronze hover:text-monaco-bronze-light"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                      className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      placeholder="Unit Price"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value))}
                      className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                      placeholder="Tax %"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <p className="text-lg font-bold text-white">
                Total: {new Intl.NumberFormat('en-EU', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(calculateTotal())}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-800 border-gray-700 rounded-lg focus:ring-monaco-bronze focus:border-monaco-bronze text-white"
                placeholder="Enter notes"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-monaco-bronze text-white rounded-lg hover:bg-monaco-bronze-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDocument;