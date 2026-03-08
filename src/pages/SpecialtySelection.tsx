import { useNavigate } from 'react-router';
import { ArrowLeft, Stethoscope, Heart, Brain, Bone, Eye, Activity, Baby, Microscope, Pill, Syringe, Thermometer, HeartPulse } from 'lucide-react';

const specialties = [
  { name: 'Cardiology', icon: Heart, color: 'red' },
  { name: 'Neurology', icon: Brain, color: 'purple' },
  { name: 'Orthopedics', icon: Bone, color: 'blue' },
  { name: 'Ophthalmology', icon: Eye, color: 'green' },
  { name: 'General Medicine', icon: Stethoscope, color: 'blue' },
  { name: 'Pediatrics', icon: Baby, color: 'pink' },
  { name: 'Dermatology', icon: Activity, color: 'orange' },
  { name: 'ENT', icon: HeartPulse, color: 'teal' },
  { name: 'Gastroenterology', icon: Activity, color: 'yellow' },
  { name: 'Oncology', icon: Microscope, color: 'red' },
  { name: 'Psychiatry', icon: Brain, color: 'indigo' },
  { name: 'Gynecology', icon: HeartPulse, color: 'pink' },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-200' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-200' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-200' },
};

export function SpecialtySelection() {
  const navigate = useNavigate();
  
  const handleSpecialtyClick = (specialtyName: string) => {
    navigate(`/specialty/${specialtyName}/doctors`);
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl">Select Specialty</h1>
        </div>
      </header>
      
      {/* Specialties Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gray-600 mb-8">
          Choose a medical specialty to find the right doctor for your needs
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specialties.map((specialty) => {
            const Icon = specialty.icon;
            const colors = colorClasses[specialty.color];
            
            return (
              <button
                key={specialty.name}
                onClick={() => handleSpecialtyClick(specialty.name)}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 hover:shadow-md transition-all text-center`}
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4 border ${colors.border}`}>
                  <Icon className={`w-8 h-8 ${colors.icon}`} />
                </div>
                <h3 className="font-medium">{specialty.name}</h3>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}