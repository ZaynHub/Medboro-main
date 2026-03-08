export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  specialties: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  hospitalId: string;
  hospitalName: string;
  image: string;
  fee: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'limited' | 'full';
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  date: string;
  time: string;
  fee: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Medical Plaza, New York, NY',
    distance: '1.2 km',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1761881917053-a48d16611196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaG9zcGl0YWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3Njk1OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine']
  },
  {
    id: '2',
    name: 'Metropolitan Medical Center',
    address: '456 Health Avenue, New York, NY',
    distance: '2.5 km',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1720180244339-95e56d52e182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGludGVyaW9yfGVufDF8fHx8MTc2OTQ5MjI2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    specialties: ['Oncology', 'Dermatology', 'ENT', 'Gastroenterology']
  },
  {
    id: '3',
    name: 'Health Plus Clinic',
    address: '789 Wellness Street, New York, NY',
    distance: '3.8 km',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1761881917053-a48d16611196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaG9zcGl0YWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3Njk1OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    specialties: ['General Medicine', 'Pediatrics', 'Gynecology']
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.9,
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 150
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    experience: 12,
    rating: 4.8,
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 180
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    experience: 10,
    rating: 4.7,
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 120
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.9,
    hospitalId: '1',
    hospitalName: 'City General Hospital',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 200
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    specialty: 'Dermatology',
    experience: 14,
    rating: 4.8,
    hospitalId: '2',
    hospitalName: 'Metropolitan Medical Center',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 160
  },
  {
    id: '6',
    name: 'Dr. Robert Martinez',
    specialty: 'ENT',
    experience: 16,
    rating: 4.7,
    hospitalId: '2',
    hospitalName: 'Metropolitan Medical Center',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 140
  },
  {
    id: '7',
    name: 'Dr. Amanda Foster',
    specialty: 'Oncology',
    experience: 20,
    rating: 4.9,
    hospitalId: '2',
    hospitalName: 'Metropolitan Medical Center',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 250
  },
  {
    id: '8',
    name: 'Dr. David Kim',
    specialty: 'General Medicine',
    experience: 8,
    rating: 4.6,
    hospitalId: '3',
    hospitalName: 'Health Plus Clinic',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 100
  },
  {
    id: '9',
    name: 'Dr. Jennifer Lee',
    specialty: 'Gynecology',
    experience: 13,
    rating: 4.8,
    hospitalId: '3',
    hospitalName: 'Health Plus Clinic',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 130
  },
  {
    id: '10',
    name: 'Dr. Christopher Brown',
    specialty: 'Gastroenterology',
    experience: 17,
    rating: 4.7,
    hospitalId: '2',
    hospitalName: 'Metropolitan Medical Center',
    image: 'https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2OTUxMTA3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fee: 170
  }
];

export const mockTimeSlots: TimeSlot[] = [
  { id: '1', time: '09:00 AM', status: 'available' },
  { id: '2', time: '09:30 AM', status: 'available' },
  { id: '3', time: '10:00 AM', status: 'limited' },
  { id: '4', time: '10:30 AM', status: 'available' },
  { id: '5', time: '11:00 AM', status: 'limited' },
  { id: '6', time: '11:30 AM', status: 'full' },
  { id: '7', time: '02:00 PM', status: 'available' },
  { id: '8', time: '02:30 PM', status: 'available' },
  { id: '9', time: '03:00 PM', status: 'limited' },
  { id: '10', time: '03:30 PM', status: 'available' },
  { id: '11', time: '04:00 PM', status: 'available' },
  { id: '12', time: '04:30 PM', status: 'full' },
];