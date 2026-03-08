import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, Users, Clock, Heart } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl mb-6">
              Book Healthcare Appointments with Ease
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with the best doctors and hospitals near you. Schedule appointments, 
              manage medical records, and access healthcare services all in one place.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthcare Professional"
                className="rounded-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Why Choose HealthCare?</h2>
            <p className="text-xl text-gray-600">Everything you need for better healthcare management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments with your preferred doctors in just a few clicks
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Verified Doctors</h3>
              <p className="text-gray-600">
                Access to a network of verified and experienced healthcare professionals
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Real-time Slots</h3>
              <p className="text-gray-600">
                View real-time availability and book slots that work for your schedule
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl mb-3">Emergency Care</h3>
              <p className="text-gray-600">
                Quick access to emergency services and ambulance dispatch when you need it
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl mb-3">Search</h3>
              <p className="text-gray-600">
                Find doctors by hospital, specialty, or symptoms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl mb-3">Book</h3>
              <p className="text-gray-600">
                Select a convenient time slot and make payment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl mb-3">Visit</h3>
              <p className="text-gray-600">
                Get your appointment confirmation and visit the doctor
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted Hospitals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Trusted by Leading Hospitals</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['City Hospital', 'Medical Center', 'Health Plus', 'Care Hospital'].map((name) => (
              <div key={name} className="bg-white p-6 rounded-lg text-center">
                <p className="font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of patients who trust HealthCare for their medical needs
          </p>
          <Link to="/signup">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}