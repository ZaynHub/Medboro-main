import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { mockDoctors, mockTimeSlots } from '../lib/mockData';

export function SlotSelection() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = mockDoctors.find(d => d.id === doctorId);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const days = getNext7Days();
  
  const handleBooking = () => {
    if (!selectedSlot || !doctor) return;
    
    const slot = mockTimeSlots.find(s => s.id === selectedSlot);
    const bookingData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalName: doctor.hospitalName,
      date: selectedDate.toLocaleDateString(),
      time: slot?.time || '',
      fee: doctor.fee
    };
    
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    navigate('/payment');
  };
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Doctor not found</h2>
          <Button onClick={() => navigate('/hospital-search')}>Back to Search</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl mb-1">{doctor.name}</h1>
            <p className="text-gray-600">{doctor.specialty} - {doctor.hospitalName}</p>
          </div>
        </div>
      </header>
      
      {/* Slot Selection */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Date Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl">Select Date</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const isSelected = day.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm text-gray-600">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg mt-1 ${isSelected ? 'text-blue-600' : ''}`}>
                      {day.getDate()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Time Slot Selection */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Select Time Slot</h2>
            
            <div className="mb-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-blue-600 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-600 rounded"></div>
                <span>Limited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded"></div>
                <span>Full</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mockTimeSlots.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                const isFull = slot.status === 'full';
                const isLimited = slot.status === 'limited';
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => !isFull && setSelectedSlot(slot.id)}
                    disabled={isFull}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isFull
                        ? 'bg-gray-100 border-gray-400 cursor-not-allowed opacity-50'
                        : isLimited
                        ? isSelected
                          ? 'border-yellow-600 bg-yellow-50'
                          : 'border-yellow-600 bg-yellow-50/50 hover:bg-yellow-50'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={isSelected ? 'text-blue-600' : ''}>
                      {slot.time}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Summary */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">Consultation Fee</p>
                <p className="text-2xl">${doctor.fee}</p>
              </div>
              {selectedSlot && (
                <div className="text-right">
                  <p className="text-gray-600">Selected Slot</p>
                  <p className="text-lg">
                    {selectedDate.toLocaleDateString()} at{' '}
                    {mockTimeSlots.find(s => s.id === selectedSlot)?.time}
                  </p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleBooking}
              disabled={!selectedSlot}
              className="w-full"
              size="lg"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}