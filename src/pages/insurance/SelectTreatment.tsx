import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, AlertCircle, Building2, BedDouble } from 'lucide-react';
import { Button } from '../../components/Button';
import { getInsurancePolicies, checkCoverage } from '../../utils/api';

const TREATMENT_CATEGORIES = [
  {
    id: 'hospitalization',
    name: 'Hospitalization',
    description: 'In-patient treatment requiring hospital admission',
    icon: '🏥',
    subcategories: ['General Ward', 'ICU', 'Emergency', 'Observation']
  },
  {
    id: 'surgery',
    name: 'Surgery',
    description: 'Surgical procedures (major and minor)',
    icon: '🔬',
    subcategories: ['Cardiac', 'Orthopedic', 'General', 'Neurosurgery', 'Other']
  },
  {
    id: 'daycare',
    name: 'Daycare Procedures',
    description: 'Treatments not requiring overnight stay',
    icon: '⚕️',
    subcategories: ['Cataract', 'Dialysis', 'Chemotherapy', 'Dental Surgery']
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    description: 'Lab tests, scans, and imaging',
    icon: '🔍',
    subcategories: ['Blood Tests', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound']
  },
  {
    id: 'maternity',
    name: 'Maternity',
    description: 'Pregnancy and childbirth expenses',
    icon: '👶',
    subcategories: ['Normal Delivery', 'C-Section', 'Pre-natal', 'Post-natal']
  },
  {
    id: 'critical_illness',
    name: 'Critical Illness',
    description: 'Serious conditions requiring intensive care',
    icon: '🚑',
    subcategories: ['Heart Attack', 'Stroke', 'Cancer', 'Kidney Failure', 'Organ Transplant']
  },
  {
    id: 'opd',
    name: 'OPD (Out-Patient)',
    description: 'Doctor consultations without admission',
    icon: '👨‍⚕️',
    subcategories: ['General Consultation', 'Specialist Consultation', 'Follow-up']
  }
];

const HOSPITAL_TYPES = ['Government', 'Private', 'Network Hospital'];
const ROOM_TYPES = ['General Ward', 'Semi-Private', 'Private', 'Deluxe', 'ICU'];

export function SelectTreatment() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    policyId: '',
    treatmentType: '',
    treatmentName: '',
    estimatedCost: '',
    hospitalType: '',
    roomType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{"id":"guest"}');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await getInsurancePolicies(user.id);
      setPolicies(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, policyId: data[0].id }));
      }
    } catch (error) {
      console.error('Error loading policies:', error);
      setError('Please add an insurance policy first');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    const category = TREATMENT_CATEGORIES.find(c => c.id === categoryId);
    setFormData(prev => ({
      ...prev,
      treatmentType: category?.name || ''
    }));
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setFormData(prev => ({
      ...prev,
      treatmentName: subcategory
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.policyId) {
        setError('Please add an insurance policy first');
        setIsLoading(false);
        return;
      }

      if (!formData.treatmentType || !formData.treatmentName) {
        setError('Please select a treatment category and type');
        setIsLoading(false);
        return;
      }

      // Navigate to processing screen with form data
      const queryParams = new URLSearchParams({
        policyId: formData.policyId,
        treatmentType: formData.treatmentType,
        treatmentName: formData.treatmentName,
        estimatedCost: formData.estimatedCost || '0',
        hospitalType: formData.hospitalType || 'Any',
        roomType: formData.roomType || 'Any'
      });

      navigate(`/insurance/processing?${queryParams.toString()}`);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to process request');
      setIsLoading(false);
    }
  };

  const filteredCategories = TREATMENT_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategoryData = TREATMENT_CATEGORIES.find(c => c.id === selectedCategory);

  if (policies.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-12 text-center max-w-md border border-gray-200">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Insurance Policy Found</h2>
          <p className="text-gray-600 mb-6">
            You need to add an insurance policy before checking coverage
          </p>
          <Button onClick={() => navigate('/insurance/add-policy')}>
            Add Insurance Policy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/insurance')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Insurance
          </button>
          <h1 className="text-3xl font-bold">Check Treatment Coverage</h1>
          <p className="text-blue-100 mt-1">Select the treatment to check insurance eligibility</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          {/* Policy Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Select Insurance Policy
            </label>
            <select
              value={formData.policyId}
              onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {policies.map(policy => (
                <option key={policy.id} value={policy.id}>
                  {policy.provider} - {policy.policyNumber} (₹{policy.sumInsured.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Treatment Category Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Treatment Category</h2>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search treatment categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Selection */}
          {selectedCategoryData && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Specific Treatment ({selectedCategoryData.name})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedCategoryData.subcategories.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubcategorySelect(sub)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedSubcategory === sub
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Inputs */}
          {selectedSubcategory && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Details (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Estimated Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Hospital Type
                  </label>
                  <select
                    value={formData.hospitalType}
                    onChange={(e) => setFormData({ ...formData, hospitalType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    {HOSPITAL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Room Type
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    {ROOM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/insurance')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !selectedSubcategory}
            >
              {isLoading ? 'Processing...' : 'Check Coverage'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
