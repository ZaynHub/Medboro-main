import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Users, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../components/Button';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Total Appointments Today', value: '47', change: '+12%', icon: Calendar, color: 'blue' },
    { label: 'Active Patients', value: '1,234', change: '+8%', icon: Users, color: 'green' },
    { label: 'Emergency Requests', value: '3', change: '-25%', icon: AlertCircle, color: 'red' },
    { label: 'Slot Utilization', value: '78%', change: '+5%', icon: TrendingUp, color: 'purple' },
  ];
  
  const recentAppointments = [
    { id: '1', patient: 'John Doe', doctor: 'Dr. Sarah Johnson', time: '10:00 AM', status: 'In Progress' },
    { id: '2', patient: 'Jane Smith', doctor: 'Dr. Michael Chen', time: '10:30 AM', status: 'Waiting' },
    { id: '3', patient: 'Bob Wilson', doctor: 'Dr. Emily Rodriguez', time: '11:00 AM', status: 'Scheduled' },
  ];
  
  const emergencyAlerts = [
    { id: '1', patient: 'Emergency Patient #1247', location: '123 Main St', time: '5 mins ago', status: 'Dispatched' },
    { id: '2', patient: 'Emergency Patient #1248', location: '456 Oak Ave', time: '12 mins ago', status: 'En Route' },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl">Admin Dashboard</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              red: 'bg-red-100 text-red-600',
              purple: 'bg-purple-100 text-purple-600',
            }[stat.color];
            
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl mb-6">Recent Appointments</h2>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium mb-1">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.doctor}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        appointment.status === 'Waiting' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Emergency Alerts
              </h2>
              <div className="space-y-3">
                {emergencyAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-sm mb-1">{alert.patient}</p>
                    <p className="text-xs text-gray-600 mb-2">{alert.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{alert.time}</span>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* QR Scanner */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl mb-4">QR Check-in</h2>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500 text-center">QR Scanner<br/>Placeholder</p>
              </div>
              <Button className="w-full">Scan QR Code</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}