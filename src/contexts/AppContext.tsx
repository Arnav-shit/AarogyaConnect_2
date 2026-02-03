import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, push, set, remove, update, DataSnapshot } from 'firebase/database';

export interface Domain {
  id: string;
  name: string;
  icon: string;
  description: string;
  detailedInfo: string;
  commonConditions: string[];
  whenToVisit: string[];
  image: string;
}

export interface Doctor {
  name: string;
  gender: 'Male' | 'Female';
  specialization: string;
  qualification?: string;
}

export interface Camp {
  id: string;
  type: 'camp';
  name: string;
  domainIds: string[];
  location: string;
  village: string;
  district: string;
  date: string;
  time: string;
  doctors: Doctor[];
  services: string[];
  maxSlots: number;
  bookedSlots: number;
  description: string;
  status: 'upcoming' | 'full' | 'completed';
  isFree: boolean;
}

export interface Hospital {
  id: string;
  type: 'hospital';
  name: string;
  domainIds: string[];
  location: string;
  address: string;
  district: string;
  contactNumber: string;
  email?: string;
  doctors: Doctor[];
  services: string[];
  timings: string;
  daysOpen: string;
  description: string;
  isPermanent: boolean;
  hasEmergency: boolean;
  consultationFee: string;
}

export type ServiceProvider = Camp | Hospital;

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerType: 'camp' | 'hospital';
  userName: string;
  mobile: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bookingDate: string;
  appointmentDate?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  domain: string;
}

interface AppContextType {
  domains: Domain[];
  camps: Camp[];
  hospitals: Hospital[];
  bookings: Booking[];
  addDomain: (domain: Omit<Domain, 'id'>) => void;
  updateDomain: (id: string, domain: Partial<Domain>) => void;
  deleteDomain: (id: string) => void;
  addCamp: (camp: Omit<Camp, 'id'>) => void;
  updateCamp: (id: string, camp: Partial<Camp>) => void;
  deleteCamp: (id: string) => void;
  addHospital: (hospital: Omit<Hospital, 'id'>) => void;
  updateHospital: (id: string, hospital: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => string;
  getDomainById: (id: string) => Domain | undefined;
  getCampById: (id: string) => Camp | undefined;
  getHospitalById: (id: string) => Hospital | undefined;
  getProvidersByDomain: (domainId: string) => ServiceProvider[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data - Domains
const initialDomains: Domain[] = [
  {
    id: 'general-health',
    name: 'General Health',
    icon: 'stethoscope',
    description: 'Complete health checkup and general medical consultation',
    detailedInfo: 'General health checkups are essential for maintaining overall wellness. Our qualified doctors provide comprehensive examinations including blood pressure monitoring, blood sugar testing, and general physical assessments. Regular checkups help in early detection of potential health issues.',
    commonConditions: ['Fever', 'Cold & Cough', 'Body Pain', 'Fatigue', 'Headache', 'Digestive Issues'],
    whenToVisit: [
      'Annual health checkup',
      'Persistent fever or cold',
      'Unexplained weight changes',
      'Chronic fatigue',
      'General wellness consultation'
    ],
    image: 'general-health'
  },
  {
    id: 'eye-care',
    name: 'Eye Care',
    icon: 'eye',
    description: 'Eye examination, vision testing, and eye disease screening',
    detailedInfo: 'Eye health is crucial for quality of life. Our ophthalmologists provide comprehensive eye examinations, vision testing, and screening for common eye conditions. We offer free reading glasses for those in need and guidance on maintaining good eye health.',
    commonConditions: ['Blurred Vision', 'Eye Strain', 'Cataract', 'Redness', 'Watering', 'Night Blindness'],
    whenToVisit: [
      'Difficulty in reading or seeing distant objects',
      'Eye pain or redness',
      'Regular eye checkup (yearly)',
      'Diabetes or high blood pressure patients',
      'Age above 40 years'
    ],
    image: 'eye-care'
  },
  {
    id: 'dental-care',
    name: 'Dental Care',
    icon: 'smile',
    description: 'Dental examination, cavity treatment, and oral health education',
    detailedInfo: 'Maintaining good oral health is vital for overall health. Our dental experts provide thorough dental examinations, cavity treatment, tooth extraction if needed, and education on proper oral hygiene. We also distribute free dental care kits.',
    commonConditions: ['Tooth Decay', 'Gum Disease', 'Tooth Pain', 'Bad Breath', 'Sensitivity', 'Bleeding Gums'],
    whenToVisit: [
      'Tooth pain or sensitivity',
      'Bleeding or swollen gums',
      'Bad breath persisting',
      'Loose teeth',
      'Regular dental checkup (6 months)'
    ],
    image: 'dental-care'
  },
  {
    id: 'women-child-health',
    name: 'Women & Child Health',
    icon: 'baby',
    description: 'Maternal care, child health, vaccination, and nutrition counseling',
    detailedInfo: 'Specialized care for women and children including antenatal checkups, child vaccination, growth monitoring, and nutritional counseling. Our female doctors ensure comfortable and comprehensive care for all stages of pregnancy and child development.',
    commonConditions: ['Pregnancy Care', 'Child Vaccination', 'Malnutrition', 'Growth Issues', 'Menstrual Problems', 'Anemia'],
    whenToVisit: [
      'Pregnancy confirmation and regular checkups',
      'Child vaccination schedule',
      'Poor growth in children',
      'Menstrual irregularities',
      'Nutritional guidance needed'
    ],
    image: 'women-child'
  },
  {
    id: 'bones-muscles',
  name: 'Bones & Muscles',
  icon: 'bone',
  description: 'Care for joint pain, muscle injuries, fractures, and mobility issues',
  detailedInfo: 'Comprehensive bone and muscle care focusing on pain relief, injury recovery, and long-term mobility improvement. Our services include diagnosis and management of joint disorders, muscle strains, fractures, arthritis, and posture-related issues, helping patients regain strength and movement safely.',
  commonConditions: [
    'Joint Pain',
    'Back Pain',
    'Neck Pain',
    'Muscle Strain',
    'Fractures',
    'Arthritis',
    'Posture Problems'
  ],
  whenToVisit: [
    'Persistent joint or muscle pain',
    'Difficulty in movement or stiffness',
    'Sports or work-related injuries',
    'Back or neck pain affecting daily life',
    'Post-fracture rehabilitation',
    'Age-related bone weakness'
  ],
  image: 'bones-muscles'
  },
  {
    id: 'skin-care',
    name: 'Skin Care',
    icon: 'droplet',
    description: 'Skin examination, allergy treatment, and dermatology consultation',
    detailedInfo: 'Our dermatologists provide expert care for various skin conditions, allergies, and infections. We offer diagnosis and treatment for common skin problems and guidance on maintaining healthy skin in different weather conditions.',
    commonConditions: ['Skin Rashes', 'Allergies', 'Fungal Infections', 'Acne', 'Pigmentation', 'Itching'],
    whenToVisit: [
      'Persistent skin rashes or itching',
      'New skin growths or moles',
      'Allergic reactions',
      'Skin infections',
      'Chronic skin conditions'
    ],
    image: 'skin-care'
  }
];

// Mock data - Camps
const initialCamps: Camp[] = [
  {
    id: 'camp-1',
    type: 'camp',
    name: 'Free General Health Camp',
    domainIds: ['general-health', 'elderly-care'],
    location: 'Rampur Village',
    village: 'Rampur',
    district: 'Varanasi',
    date: '2026-02-10',
    time: '09:00 AM - 02:00 PM',
    doctors: [
      { name: 'Dr. Priya Sharma', gender: 'Female', specialization: 'General Medicine', qualification: 'MBBS, MD' },
      { name: 'Dr. Rajesh Kumar', gender: 'Male', specialization: 'Internal Medicine', qualification: 'MBBS' },
    ],
    services: ['Blood Pressure Check', 'Blood Sugar Test', 'General Consultation', 'Free Medicines', 'ECG'],
    maxSlots: 100,
    bookedSlots: 45,
    description: 'Free general health checkup camp organized for rural communities. All services including medicines are completely free.',
    status: 'upcoming',
    isFree: true,
  },
  {
    id: 'camp-2',
    type: 'camp',
    name: 'Eye Care & Vision Camp',
    domainIds: ['eye-care'],
    location: 'Shivpur Community Center',
    village: 'Shivpur',
    district: 'Varanasi',
    date: '2026-02-15',
    time: '10:00 AM - 04:00 PM',
    doctors: [
      { name: 'Dr. Anita Verma', gender: 'Female', specialization: 'Ophthalmology', qualification: 'MBBS, MS (Ophth)' },
    ],
    services: ['Eye Examination', 'Free Reading Glasses', 'Cataract Screening', 'Vision Test'],
    maxSlots: 80,
    bookedSlots: 80,
    description: 'Free eye checkup and distribution of reading glasses for elderly and those in need.',
    status: 'full',
    isFree: true,
  },
  {
    id: 'camp-3',
    type: 'camp',
    name: 'Women & Child Health Camp',
    domainIds: ['women-child-health'],
    location: 'Gopinathpur Primary School',
    village: 'Gopinathpur',
    district: 'Varanasi',
    date: '2026-02-20',
    time: '09:00 AM - 01:00 PM',
    doctors: [
      { name: 'Dr. Meena Singh', gender: 'Female', specialization: 'Gynecology', qualification: 'MBBS, MD (Gyn)' },
      { name: 'Dr. Sunita Rao', gender: 'Female', specialization: 'Pediatrics', qualification: 'MBBS, DCH' },
    ],
    services: ['Antenatal Checkup', 'Child Vaccination', 'Nutritional Counseling', 'Free Vitamins', 'Growth Monitoring'],
    maxSlots: 60,
    bookedSlots: 25,
    description: 'Special camp for women and children health checkup and awareness. Female doctors available.',
    status: 'upcoming',
    isFree: true,
  },
  {
    id: 'camp-4',
    type: 'camp',
    name: 'Dental Health Awareness Camp',
    domainIds: ['dental-care'],
    location: 'Chandpur Village Hall',
    village: 'Chandpur',
    district: 'Varanasi',
    date: '2026-02-25',
    time: '10:00 AM - 03:00 PM',
    doctors: [
      { name: 'Dr. Amit Patel', gender: 'Male', specialization: 'Dentistry', qualification: 'BDS, MDS' },
    ],
    services: ['Dental Examination', 'Tooth Extraction', 'Dental Hygiene Education', 'Free Toothpaste & Brush'],
    maxSlots: 50,
    bookedSlots: 12,
    description: 'Free dental checkup and basic dental treatment with oral hygiene education.',
    status: 'upcoming',
    isFree: true,
  },
];

// Mock data - Hospitals
const initialHospitals: Hospital[] = [
  {
    id: 'hosp-1',
    type: 'hospital',
    name: 'Jan Kalyan Hospital',
    domainIds: ['general-health', 'elderly-care', 'women-child-health'],
    location: 'Varanasi City',
    address: 'Main Road, Near Bus Stand, Varanasi',
    district: 'Varanasi',
    contactNumber: '0542-1234567',
    email: 'info@jankalyan.org',
    doctors: [
      { name: 'Dr. Ramesh Gupta', gender: 'Male', specialization: 'General Medicine', qualification: 'MBBS, MD' },
      { name: 'Dr. Kavita Sharma', gender: 'Female', specialization: 'Pediatrics', qualification: 'MBBS, MD' },
      { name: 'Dr. Suresh Yadav', gender: 'Male', specialization: 'Internal Medicine', qualification: 'MBBS' },
    ],
    services: ['OPD Consultation', 'Emergency Care', 'Laboratory Tests', 'Pharmacy', 'X-Ray', 'ECG'],
    timings: '24/7 Emergency, OPD: 9 AM - 5 PM',
    daysOpen: 'All Days',
    description: 'Multi-specialty hospital providing affordable healthcare to rural and urban communities. 24/7 emergency services available.',
    isPermanent: true,
    hasEmergency: true,
    consultationFee: '₹50 (General), Free for BPL card holders',
  },
  {
    id: 'hosp-2',
    type: 'hospital',
    name: 'Drishti Eye Center',
    domainIds: ['eye-care'],
    location: 'Varanasi',
    address: 'Sigra, Behind Railway Station, Varanasi',
    district: 'Varanasi',
    contactNumber: '0542-2345678',
    email: 'contact@drishtieye.com',
    doctors: [
      { name: 'Dr. Neha Agarwal', gender: 'Female', specialization: 'Ophthalmology', qualification: 'MBBS, MS (Ophth)' },
      { name: 'Dr. Vikram Singh', gender: 'Male', specialization: 'Ophthalmology', qualification: 'MBBS, DNB (Ophth)' },
    ],
    services: ['Eye Checkup', 'Cataract Surgery', 'Glaucoma Treatment', 'Retina Care', 'Contact Lenses', 'Optical Shop'],
    timings: '9:00 AM - 7:00 PM',
    daysOpen: 'Monday to Saturday',
    description: 'Specialized eye care center with modern equipment. Cataract surgeries at subsidized rates for economically weaker sections.',
    isPermanent: true,
    hasEmergency: false,
    consultationFee: '₹100 (Free for senior citizens above 70)',
  },
  {
    id: 'hosp-3',
    type: 'hospital',
    name: 'Smile Dental Clinic',
    domainIds: ['dental-care'],
    location: 'Varanasi',
    address: 'Lanka, Near BHU Gate, Varanasi',
    district: 'Varanasi',
    contactNumber: '0542-3456789',
    doctors: [
      { name: 'Dr. Priyanka Mishra', gender: 'Female', specialization: 'Dentistry', qualification: 'BDS, MDS' },
    ],
    services: ['Dental Checkup', 'Tooth Filling', 'Root Canal', 'Tooth Extraction', 'Cleaning & Scaling', 'Dentures'],
    timings: '10:00 AM - 6:00 PM',
    daysOpen: 'Monday to Saturday',
    description: 'Modern dental clinic offering complete dental care. Special discounts for students and senior citizens.',
    isPermanent: true,
    hasEmergency: false,
    consultationFee: '₹150',
  },
  {
    id: 'hosp-4',
    type: 'hospital',
    name: 'Maa Seva Mother & Child Care',
    domainIds: ['women-child-health'],
    location: 'Varanasi',
    address: 'Susuwahi, Varanasi Cantt Area',
    district: 'Varanasi',
    contactNumber: '0542-4567890',
    doctors: [
      { name: 'Dr. Anjali Verma', gender: 'Female', specialization: 'Gynecology', qualification: 'MBBS, DGO' },
      { name: 'Dr. Rekha Pandey', gender: 'Female', specialization: 'Pediatrics', qualification: 'MBBS, MD' },
    ],
    services: ['Antenatal Care', 'Normal Delivery', 'C-Section', 'Child Vaccination', 'Newborn Care', 'Family Planning'],
    timings: '24/7 Maternity, OPD: 10 AM - 4 PM',
    daysOpen: 'All Days',
    description: 'Dedicated mother and child care hospital with experienced female doctors. Safe delivery services with 24/7 availability.',
    isPermanent: true,
    hasEmergency: true,
    consultationFee: '₹100',
  },
];

const initialBookings: Booking[] = [
  {
    id: 'BK001',
    providerId: 'camp-1',
    providerName: 'Free General Health Camp',
    providerType: 'camp',
    userName: 'Ramesh Kumar',
    mobile: '9876543210',
    age: 45,
    gender: 'Male',
    bookingDate: '2026-01-28',
    appointmentDate: '2026-02-10',
    status: 'confirmed',
    domain: 'General Health',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [camps, setCamps] = useState<Camp[]>(initialCamps);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Firebase Real-time listeners
  useEffect(() => {
    if (!database) {
      // Firebase DB not configured — skip realtime listeners and use local data
      // eslint-disable-next-line no-console
      console.log('Firebase Realtime Database not configured; using local mock data.');
      return;
    }
    // Listen to camps from Firebase
    const campsRef = ref(database, 'camps');
    const unsubscribeCamps = onValue(campsRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const firebaseCamps = Object.values(snapshot.val()) as Camp[];
        setCamps(firebaseCamps);
        console.log('✓ Loaded camps from Firebase:', firebaseCamps.length);
      } else {
        console.log('⚠ /camps is empty in Firebase, seeding with initial data...');
        // Seed Firebase with local initial data if empty
        if (initialCamps && initialCamps.length > 0) {
          const map: Record<string, Camp> = {};
          initialCamps.forEach(c => (map[c.id] = c));
          set(campsRef, map).then(() => {
            console.log('✓ Seeded Firebase /camps with', initialCamps.length, 'camps');
            setCamps(initialCamps);
          }).catch((err: any) => console.log('✗ Failed to seed camps:', err));
        }
      }
    }, (error: Error) => {
      console.log('✗ Camps listener error:', error.message);
    });

    // Listen to hospitals from Firebase
    const hospitalsRef = ref(database, 'hospitals');
    const unsubscribeHospitals = onValue(hospitalsRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const firebaseHospitals = Object.values(snapshot.val()) as Hospital[];
        setHospitals(firebaseHospitals);
        console.log('✓ Loaded hospitals from Firebase:', firebaseHospitals.length);
      } else {
        console.log('⚠ /hospitals is empty in Firebase, seeding with initial data...');
        if (initialHospitals && initialHospitals.length > 0) {
          const map: Record<string, Hospital> = {};
          initialHospitals.forEach(h => (map[h.id] = h));
          set(hospitalsRef, map).then(() => {
            console.log('✓ Seeded Firebase /hospitals with', initialHospitals.length, 'hospitals');
            setHospitals(initialHospitals);
          }).catch((err: any) => console.log('✗ Failed to seed hospitals:', err));
        }
      }
    }, (error: Error) => {
      console.log('✗ Hospitals listener error:', error.message);
    });

    // Listen to bookings from Firebase
    const bookingsRef = ref(database, 'bookings');
    const unsubscribeBookings = onValue(bookingsRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const firebaseBookings = Object.values(snapshot.val()) as Booking[];
        setBookings(firebaseBookings);
        console.log('✓ Loaded bookings from Firebase:', firebaseBookings.length);
      } else {
        console.log('⚠ /bookings is empty in Firebase, seeding with initial data...');
        if (initialBookings && initialBookings.length > 0) {
          const map: Record<string, Booking> = {};
          initialBookings.forEach(b => (map[b.id] = b));
          set(bookingsRef, map).then(() => {
            console.log('✓ Seeded Firebase /bookings with', initialBookings.length, 'bookings');
            setBookings(initialBookings);
          }).catch((err: any) => console.log('✗ Failed to seed bookings:', err));
        }
      }
    }, (error: Error) => {
      console.log('✗ Bookings listener error:', error.message);
    });

    return () => {
      unsubscribeCamps();
      unsubscribeHospitals();
      unsubscribeBookings();
    };
  }, []);

  // Domain operations
  const addDomain = (domain: Omit<Domain, 'id'>) => {
    const newDomain = { ...domain, id: `domain-${Date.now()}` };
    setDomains([...domains, newDomain]);
  };

  const updateDomain = (id: string, domainUpdate: Partial<Domain>) => {
    setDomains(domains.map(d => (d.id === id ? { ...d, ...domainUpdate } : d)));
  };

  const deleteDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  // Camp operations
  const addCamp = (camp: Omit<Camp, 'id'>) => {
    const newCamp = { ...camp, id: `camp-${Date.now()}`, type: 'camp' as const };
    setCamps([...camps, newCamp]);
    // Save to Firebase
    if (database) {
      set(ref(database, `camps/${newCamp.id}`), newCamp).catch((err: any) =>
        console.log('Firebase save error:', err)
      );
    }
  };

  const updateCamp = (id: string, campUpdate: Partial<Camp>) => {
    setCamps(camps.map(c => (c.id === id ? { ...c, ...campUpdate } : c)));
    // Update in Firebase
    if (database) {
      update(ref(database, `camps/${id}`), campUpdate).catch((err: any) =>
        console.log('Firebase update error:', err)
      );
    }
  };

  const deleteCamp = (id: string) => {
    setCamps(camps.filter(c => c.id !== id));
    // Delete from Firebase
    if (database) {
      remove(ref(database, `camps/${id}`)).catch((err: any) =>
        console.log('Firebase delete error:', err)
      );
    }
  };

  // Hospital operations
  const addHospital = (hospital: Omit<Hospital, 'id'>) => {
    const newHospital = { ...hospital, id: `hosp-${Date.now()}`, type: 'hospital' as const };
    setHospitals([...hospitals, newHospital]);
    // Save to Firebase
    if (database) {
      set(ref(database, `hospitals/${newHospital.id}`), newHospital).catch((err: any) =>
        console.log('Firebase save error:', err)
      );
    }
  };

  const updateHospital = (id: string, hospitalUpdate: Partial<Hospital>) => {
    setHospitals(hospitals.map(h => (h.id === id ? { ...h, ...hospitalUpdate } : h)));
    // Update in Firebase
    if (database) {
      update(ref(database, `hospitals/${id}`), hospitalUpdate).catch((err: any) =>
        console.log('Firebase update error:', err)
      );
    }
  };

  const deleteHospital = (id: string) => {
    setHospitals(hospitals.filter(h => h.id !== id));
    // Delete from Firebase
    if (database) {
      remove(ref(database, `hospitals/${id}`)).catch((err: any) =>
        console.log('Firebase delete error:', err)
      );
    }
  };

  // Booking operations
  const addBooking = (booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>): string => {
    const bookingId = `BK${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking: Booking = {
      ...booking,
      id: bookingId,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
    };
    setBookings([...bookings, newBooking]);
    // Save to Firebase
    if (database) {
      set(ref(database, `bookings/${bookingId}`), newBooking).catch((err: any) =>
        console.log('Firebase save error:', err)
      );
    }

    // Update slots for camps
    if (booking.providerType === 'camp') {
      const camp = camps.find(c => c.id === booking.providerId);
      if (camp) {
        updateCamp(camp.id, {
          bookedSlots: camp.bookedSlots + 1,
          status: camp.bookedSlots + 1 >= camp.maxSlots ? 'full' : camp.status,
        });
      }
    }

    return bookingId;
  };

  // Getters
  const getDomainById = (id: string): Domain | undefined => domains.find(d => d.id === id);
  const getCampById = (id: string): Camp | undefined => camps.find(c => c.id === id);
  const getHospitalById = (id: string): Hospital | undefined => hospitals.find(h => h.id === id);

  const getProvidersByDomain = (domainId: string): ServiceProvider[] => {
    const domainCamps = camps.filter(c => c.domainIds.includes(domainId));
    const domainHospitals = hospitals.filter(h => h.domainIds.includes(domainId));
    return [...domainCamps, ...domainHospitals];
  };

  return (
    <AppContext.Provider
      value={{
        domains,
        camps,
        hospitals,
        bookings,
        addDomain,
        updateDomain,
        deleteDomain,
        addCamp,
        updateCamp,
        deleteCamp,
        addHospital,
        updateHospital,
        deleteHospital,
        addBooking,
        getDomainById,
        getCampById,
        getHospitalById,
        getProvidersByDomain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
