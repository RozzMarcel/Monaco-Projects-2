import React, { useState, useEffect } from 'react';
import { FileText, Plus, AlertCircle, Calendar, Building2, Receipt } from 'lucide-react';
import { FinancialDocument } from '../types/financial';
import { getFinancialDocuments } from '../lib/financial';
import { formatCurrency } from '../utils/format';
import NewDocument from './NewDocument';

interface FinancialDocumentsProps {
  projectId: string;
}

function FinancialDocuments({ projectId }: FinancialDocumentsProps) {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewDocument, setShowNewDocument] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await getFinancialDocuments(projectId);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load financial documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <Receipt className="h-5 w-5" />;
      case 'quote':
        return <FileText className="h-5 w-5" />;
      case 'contract':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monaco-bronze"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-lg flex items-center text-red-500 border border-red-500/20">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Document List */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Financial Documents</h2>
          <button
            onClick={() => setShowNewDocument(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-monaco-bronze hover:bg-monaco-bronze-light"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-monaco-bronze/10 text-monaco-bronze">
                        {getTypeIcon(doc.type)}
                      </div>
                      <span className="ml-2 text-white capitalize">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{doc.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-white">{doc.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(doc.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-white">
                    {formatCurrency(doc.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Document Modal */}
      {showNewDocument && (
        <NewDocument
          projectId={projectId}
          onClose={() => setShowNewDocument(false)}
          onSuccess={loadDocuments}
        />
      )}
    </div>
  );
}

export default FinancialDocuments;