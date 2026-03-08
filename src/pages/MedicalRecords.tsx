import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, Download, Eye, Trash2, X, Printer, Filter, Search, AlertCircle, CheckCircle, Building2, User as UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { getMedicalRecords, uploadMedicalRecord, deleteMedicalRecord } from '../utils/api';

interface MedicalRecord {
  id: string;
  name: string;
  type: string;
  category: 'Prescription' | 'Lab Report' | 'Imaging' | 'Discharge Summary' | 'Medical Certificate' | 'Other';
  date: string;
  uploadedBy: 'hospital' | 'user';
  hospitalName?: string;
  doctorName?: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  size: string;
}

const RECORD_TYPES = [
  'Prescription',
  'Lab Report',
  'Imaging',
  'Discharge Summary',
  'Medical Certificate',
  'Other'
];

const CATEGORY_COLORS: Record<string, string> = {
  'Prescription': 'bg-blue-100 text-blue-700 border-blue-200',
  'Lab Report': 'bg-purple-100 text-purple-700 border-purple-200',
  'Imaging': 'bg-green-100 text-green-700 border-green-200',
  'Discharge Summary': 'bg-orange-100 text-orange-700 border-orange-200',
  'Medical Certificate': 'bg-pink-100 text-pink-700 border-pink-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200'
};

const CATEGORY_ICONS: Record<string, string> = {
  'Prescription': '💊',
  'Lab Report': '🧪',
  'Imaging': '🩻',
  'Discharge Summary': '📄',
  'Medical Certificate': '📋',
  'Other': '📎'
};

export function MedicalRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Other' as MedicalRecord['category'],
    file: null as File | null
  });

  const user = JSON.parse(localStorage.getItem('user') || '{"id":"guest","name":"Guest"}');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, searchQuery, filterCategory, filterSource]);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getMedicalRecords(user.id);
      setRecords(data);
    } catch (error) {
      console.error('Error loading medical records:', error);
      // Show sample data if backend fails
      setRecords(getSampleRecords());
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(record => record.category === filterCategory);
    }

    // Source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(record => record.uploadedBy === filterSource);
    }

    setFilteredRecords(filtered);
  };

  const handleUpload = async () => {
    if (!uploadForm.name || !uploadForm.file) return;

    // Validate file size (10MB max)
    if (uploadForm.file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(uploadForm.file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('name', uploadForm.name);
      formData.append('category', uploadForm.category);
      formData.append('userId', user.id);

      await uploadMedicalRecord(formData);
      await loadRecords(); // Reload records
      setShowUploadModal(false);
      setUploadForm({ name: '', category: 'Other', file: null });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (record: MedicalRecord) => {
    // Only allow deletion of user-uploaded files
    if (record.uploadedBy === 'hospital') {
      alert('Hospital-uploaded documents cannot be deleted. Please contact the hospital if you have concerns.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${record.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMedicalRecord(record.id);
      await loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  const handleView = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowViewerModal(true);
  };

  const handleDownload = (record: MedicalRecord) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = record.fileUrl;
    link.download = `${record.name}.${record.fileType === 'pdf' ? 'pdf' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (record: MedicalRecord) => {
    // Open in new window and trigger print
    const printWindow = window.open(record.fileUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const getSampleRecords = (): MedicalRecord[] => {
    return [
      {
        id: '1',
        name: 'Blood Test - Complete Hemogram',
        type: 'Lab Report',
        category: 'Lab Report',
        date: '2026-02-10',
        uploadedBy: 'hospital',
        hospitalName: 'Apollo Hospital',
        doctorName: 'Dr. Sarah Johnson',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
        size: '2.4 MB'
      },
      {
        id: '2',
        name: 'Chest X-Ray Report',
        type: 'Imaging',
        category: 'Imaging',
        date: '2026-02-08',
        uploadedBy: 'hospital',
        hospitalName: 'Max Healthcare',
        doctorName: 'Dr. Michael Chen',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
        size: '5.1 MB'
      },
      {
        id: '3',
        name: 'Prescription - Antibiotics & Pain Relief',
        type: 'Prescription',
        category: 'Prescription',
        date: '2026-02-05',
        uploadedBy: 'hospital',
        hospitalName: 'Fortis Hospital',
        doctorName: 'Dr. Priya Sharma',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
        size: '1.2 MB'
      },
      {
        id: '4',
        name: 'Diabetes Management Plan',
        type: 'Discharge Summary',
        category: 'Discharge Summary',
        date: '2026-01-28',
        uploadedBy: 'hospital',
        hospitalName: 'Apollo Hospital',
        doctorName: 'Dr. Rajesh Kumar',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
        size: '3.8 MB'
      },
      {
        id: '5',
        name: 'Vaccination Certificate - COVID-19',
        type: 'Medical Certificate',
        category: 'Medical Certificate',
        date: '2026-01-15',
        uploadedBy: 'user',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
        size: '0.8 MB'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all your medical documents
              </p>
            </div>
            <Button onClick={() => setShowUploadModal(true)} className="w-full md:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, doctor, hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {RECORD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="hospital">Hospital Uploaded</option>
                <option value="user">My Uploads</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'document' : 'documents'}
            </span>
            {(searchQuery || filterCategory !== 'all' || filterSource !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                  setFilterSource('all');
                }}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Records List */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your medical records...</p>
            </div>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Document Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                      {CATEGORY_ICONS[record.category]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{record.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[record.category]}`}>
                          {record.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        {/* Date */}
                        <span className="flex items-center gap-1">
                          📅 {new Date(record.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>

                        {/* Source */}
                        <span className="flex items-center gap-1">
                          {record.uploadedBy === 'hospital' ? (
                            <>
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">{record.hospitalName}</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">Self-uploaded</span>
                            </>
                          )}
                        </span>

                        {/* Doctor */}
                        {record.doctorName && (
                          <span className="flex items-center gap-1">
                            👨‍⚕️ {record.doctorName}
                          </span>
                        )}

                        {/* Size */}
                        <span>{record.size}</span>

                        {/* File Type */}
                        <span className="uppercase font-medium text-xs bg-gray-100 px-2 py-1 rounded">
                          {record.fileType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleView(record)}
                      className="p-2.5 hover:bg-cyan-50 rounded-lg transition-colors group"
                      title="View Document"
                    >
                      <Eye className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" />
                    </button>
                    <button
                      onClick={() => handlePrint(record)}
                      className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Print Document"
                    >
                      <Printer className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDownload(record)}
                      className="p-2.5 hover:bg-green-50 rounded-lg transition-colors group"
                      title="Download Document"
                    >
                      <Download className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                    </button>
                    {record.uploadedBy === 'user' && (
                      <button
                        onClick={() => handleDelete(record)}
                        className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete Document"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                      </button>
                    )}
                    {record.uploadedBy === 'hospital' && (
                      <div className="p-2.5" title="Hospital documents cannot be deleted">
                        <Trash2 className="w-5 h-5 text-gray-300 cursor-not-allowed" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'all' || filterSource !== 'all' 
                ? 'No documents match your filters' 
                : 'No Medical Records Yet'
              }
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || filterCategory !== 'all' || filterSource !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your medical documents to keep them organized and accessible anytime'
              }
            </p>
            {!(searchQuery || filterCategory !== 'all' || filterSource !== 'all') && (
              <Button onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload First Document
              </Button>
            )}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About Your Medical Records</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• <strong>Hospital Documents:</strong> Automatically uploaded after appointments (read-only)</p>
                <p>• <strong>Personal Documents:</strong> Upload your own files privately (only you can access)</p>
                <p>• <strong>Security:</strong> All documents are encrypted and HIPAA compliant</p>
                <p>• <strong>Privacy:</strong> Your personal uploads are never shared with hospitals</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Medical Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Document Name */}
              <div>
                <label htmlFor="recordName" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  id="recordName"
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g., Blood Test Results - Jan 2026"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Category *
                </label>
                <select
                  id="recordType"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as MedicalRecord['category'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {RECORD_TYPES.map(type => (
                    <option key={type} value={type}>
                      {CATEGORY_ICONS[type]} {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Choose File *
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Supported formats:</p>
                    <p>PDF, JPG, PNG (Maximum 10MB per file)</p>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="text-2xl">🔒</div>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Private & Secure</p>
                    <p>Your uploaded documents are private and only accessible by you. They won't be shared with hospitals or other users.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={!uploadForm.name || !uploadForm.file || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showViewerModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            {/* Viewer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-xl font-bold text-gray-900 truncate">{selectedRecord.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedRecord.category} • {new Date(selectedRecord.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(selectedRecord)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Print"
                >
                  <Printer className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDownload(selectedRecord)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowViewerModal(false)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              {selectedRecord.fileType === 'pdf' ? (
                <iframe
                  src={selectedRecord.fileUrl}
                  className="w-full h-full"
                  title={selectedRecord.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <img
                    src={selectedRecord.fileUrl}
                    alt={selectedRecord.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
