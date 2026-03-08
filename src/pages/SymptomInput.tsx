import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Chest Pain', 'Stomach Pain',
  'Back Pain', 'Nausea', 'Fatigue', 'Dizziness', 'Shortness of Breath',
  'Sore Throat', 'Joint Pain', 'Skin Rash', 'Eye Pain', 'Ear Pain'
];

export function SymptomInput() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<{ condition: string; description: string; specialty: string } | null>(null);
  const [showDoctorConfirmation, setShowDoctorConfirmation] = useState(false);
  
  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };
  
  const handleReset = () => {
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setAiAnalyzing(false);
    setAiDiagnosis(null);
    setShowDoctorConfirmation(false);
  };
  
  const analyzeWithAI = async () => {
    setAiAnalyzing(true);
    setAiDiagnosis(null);
    setShowDoctorConfirmation(false);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI diagnosis based on symptoms
    const diagnosis = getMockDiagnosis(selectedSymptoms);
    setAiDiagnosis(diagnosis);
    setShowDoctorConfirmation(true);
    setAiAnalyzing(false);
  };
  
  const getMockDiagnosis = (symptoms: string[]): { condition: string; description: string; specialty: string } => {
    const symptomsLower = symptoms.map(s => s.toLowerCase());
    
    // Simple rule-based diagnosis for demo
    if (symptomsLower.some(s => ['fever', 'cough', 'sore throat'].includes(s))) {
      return {
        condition: 'Upper Respiratory Tract Infection',
        description: 'Based on your symptoms, you may have a common cold or flu. This typically includes fever, cough, and sore throat.',
        specialty: 'General Physician'
      };
    } else if (symptomsLower.some(s => ['chest pain', 'shortness of breath'].includes(s))) {
      return {
        condition: 'Possible Respiratory or Cardiac Issue',
        description: 'Chest pain and breathing difficulty require immediate medical attention. Please consult a specialist.',
        specialty: 'Cardiologist'
      };
    } else if (symptomsLower.some(s => ['stomach pain', 'nausea'].includes(s))) {
      return {
        condition: 'Gastrointestinal Distress',
        description: 'Your symptoms suggest a digestive system issue. This could be due to food sensitivity, infection, or other GI conditions.',
        specialty: 'Gastroenterologist'
      };
    } else if (symptomsLower.some(s => ['headache', 'dizziness', 'eye pain'].includes(s))) {
      return {
        condition: 'Neurological Symptoms',
        description: 'Persistent headaches with dizziness may require neurological evaluation to rule out migraines or other conditions.',
        specialty: 'Neurologist'
      };
    } else if (symptomsLower.some(s => ['joint pain', 'back pain'].includes(s))) {
      return {
        condition: 'Musculoskeletal Pain',
        description: 'Your symptoms indicate possible joint or muscle-related issues. This could be due to injury, arthritis, or overuse.',
        specialty: 'Orthopedist'
      };
    } else if (symptomsLower.some(s => ['skin rash'].includes(s))) {
      return {
        condition: 'Dermatological Condition',
        description: 'Skin rashes can have various causes including allergies, infections, or autoimmune conditions.',
        specialty: 'Dermatologist'
      };
    } else {
      return {
        condition: 'General Health Concern',
        description: 'Based on your symptoms, a general health evaluation is recommended to determine the underlying cause.',
        specialty: 'General Physician'
      };
    }
  };
  
  const handleFindDoctorConfirmed = () => {
    if (selectedSymptoms.length > 0 && aiDiagnosis) {
      sessionStorage.setItem('symptoms', JSON.stringify(selectedSymptoms));
      sessionStorage.setItem('aiDiagnosis', JSON.stringify(aiDiagnosis));
      navigate('/symptom-results');
    }
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
          <h1 className="text-2xl">Describe Your Symptoms</h1>
        </div>
      </header>
      
      {/* Symptom Input */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-600 mb-8">
            Select your symptoms or describe them below. Our AI will analyze and recommend the right specialist for you.
          </p>
          
          {/* Common Symptoms */}
          <div className="mb-8">
            <h2 className="text-xl mb-4">Common Symptoms</h2>
            <div className="flex flex-wrap gap-3">
              {commonSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Custom Symptom Input */}
          <div className="mb-8">
            <h2 className="text-xl mb-4">Add Custom Symptom</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                placeholder="Describe your symptom..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleAddCustomSymptom} variant="secondary">
                Add
              </Button>
            </div>
          </div>
          
          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl mb-4">Selected Symptoms ({selectedSymptoms.length})</h2>
              <div className="flex flex-wrap gap-3">
                {selectedSymptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full flex items-center gap-2"
                  >
                    <span>{symptom}</span>
                    <button
                      onClick={() => handleSymptomToggle(symptom)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* AI Analysis Loading */}
          {aiAnalyzing && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                <h2 className="text-xl text-blue-900">AI is Analyzing Your Symptoms...</h2>
              </div>
              <p className="text-gray-600 ml-9">Please wait while our AI examines your symptoms and identifies possible conditions.</p>
            </div>
          )}
          
          {/* AI Diagnosis Result */}
          {aiDiagnosis && !aiAnalyzing && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl text-green-900 mb-2">AI Analysis Complete</h2>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-500 mb-1">Possible Condition:</p>
                    <p className="text-lg text-gray-900 mb-3">{aiDiagnosis.condition}</p>
                    <p className="text-gray-700 mb-3">{aiDiagnosis.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Recommended Specialist:</p>
                      <p className="text-lg text-blue-900">{aiDiagnosis.specialty}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Doctor Recommendation Confirmation */}
              {showDoctorConfirmation && (
                <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                  <p className="text-gray-800 mb-4">
                    Would you like me to find suitable {aiDiagnosis.specialty}s for you to book an appointment?
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={handleFindDoctorConfirmed} className="flex-1">
                      <Search className="w-5 h-5 mr-2" />
                      Yes, Find Doctors
                    </Button>
                    <Button 
                      onClick={() => setShowDoctorConfirmation(false)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Not Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Analyze with AI Button */}
          {!aiDiagnosis && !aiAnalyzing && (
            <div className="space-y-3">
              <Button
                onClick={analyzeWithAI}
                disabled={selectedSymptoms.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze with AI
              </Button>
              
              {/* Reset Button */}
              {selectedSymptoms.length > 0 && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset All
                </Button>
              )}
            </div>
          )}
          
          {/* Reset Button - shown after AI analysis */}
          {(aiDiagnosis || aiAnalyzing) && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full mt-4"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}