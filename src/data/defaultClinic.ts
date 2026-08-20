import { 
  ClinicConfig, 
  EmergencyGuide, 
  AdminUser, 
  Lead, 
  Conversation, 
  AppointmentBooking, 
  AuditLogEntry 
} from '../types';

export const defaultAdminUsers: (AdminUser & { passwordHash: string })[] = [
  {
    id: 'user-super-1',
    email: 'superadmin@auraplatform.com',
    fullName: 'Dr. Sarah Sterling (Platform Director)',
    role: 'super_admin',
    createdAt: '2026-01-01T08:00:00.000Z',
    lastLoginAt: '2026-08-20T02:00:00.000Z',
    passwordHash: 'superAdmin2026!' // In real app, standard salted hash
  },
  {
    id: 'user-admin-sf',
    email: 'admin@auradental.com',
    fullName: 'Melissa Ross (Practice Manager - SF)',
    role: 'clinic_admin',
    clinicId: 'clinic-sf',
    createdAt: '2026-01-10T09:00:00.000Z',
    lastLoginAt: '2026-08-19T16:30:00.000Z',
    passwordHash: 'auraAdmin2026!'
  },
  {
    id: 'user-admin-pa',
    email: 'admin.pa@auradental.com',
    fullName: 'David K. Liu (Clinic Director - Palo Alto)',
    role: 'clinic_admin',
    clinicId: 'clinic-pa',
    createdAt: '2026-02-01T09:00:00.000Z',
    lastLoginAt: '2026-08-18T14:15:00.000Z',
    passwordHash: 'auraAdminPA2026!'
  },
  {
    id: 'user-staff-sf',
    email: 'staff@auradental.com',
    fullName: 'Chloe Bennett (Lead Patient Coordinator)',
    role: 'staff',
    clinicId: 'clinic-sf',
    createdAt: '2026-02-15T10:00:00.000Z',
    lastLoginAt: '2026-08-20T01:45:00.000Z',
    passwordHash: 'staffPass2026!'
  }
];

export const initialClinicSF: ClinicConfig = {
  id: 'clinic-sf',
  slug: 'san-francisco',
  clinicName: "Aura Dental & Aesthetic Studio",
  tagline: "Bespoke Cosmetic Dentistry & Modern Restorative Care",
  logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=120&h=120&q=80",
  address: "450 Sutter St, Suite 1420",
  cityStateZip: "San Francisco, CA 94108",
  phone: "+1 (415) 555-0198",
  emergencyPhone: "+1 (415) 555-9911",
  email: "concierge@auradentalstudio.com",
  website: "https://auradentalstudio.com",
  googleMapsUrl: "https://maps.google.com/?q=450+Sutter+St+San+Francisco+CA",
  about: "Aura Dental & Aesthetic Studio is San Francisco's premier destination for high-precision cosmetic enhancement, minimally invasive restorative therapies, and 24/7 dental trauma triage. Powered by cutting-edge iTero® 3D digital impressions, painless laser whitening, and guided implantology.",
  workingHours: {
    weekdays: "Monday – Friday: 8:00 AM – 6:00 PM",
    saturday: "Saturday: 9:00 AM – 2:00 PM",
    sunday: "Sunday: Closed (24/7 On-Call Emergency Triage Only)",
  },
  businessHours: {
    schedule: [
      { day: 'monday', dayLabel: 'Monday', isOpen: true, openTime: '08:00', closeTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
      { day: 'tuesday', dayLabel: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
      { day: 'wednesday', dayLabel: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
      { day: 'thursday', dayLabel: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
      { day: 'friday', dayLabel: 'Friday', isOpen: true, openTime: '08:00', closeTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
      { day: 'saturday', dayLabel: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '14:00', hasBreak: false },
      { day: 'sunday', dayLabel: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '13:00', hasBreak: false }
    ],
    holidayClosures: [
      { id: 'hol-1', name: 'Labor Day', startDate: '2026-09-07', endDate: '2026-09-07', note: 'Emergency on-call triage active.' },
      { id: 'hol-2', name: 'Thanksgiving Break', startDate: '2026-11-26', endDate: '2026-11-27', note: 'Special holiday on-call hours.' }
    ],
    temporaryClosures: [],
    afterHoursMessage: "Our front desk is currently closed. However, our AI Coordinator is active 24/7 to answer questions, record consultation requests, and dispatch immediate first-aid instructions for dental emergencies."
  },
  emergencyPolicy: "We prioritize emergency patients with same-day emergency slots during clinic hours. For severe dental trauma, broken teeth, acute swelling, or unbearable toothache outside operating hours, our 24/7 on-call coordinator dispatches urgent triage instructions and schedules early priority slots.",
  services: [
    {
      id: "teeth-whitening",
      name: "Teeth Whitening",
      category: "cosmetic",
      startingPrice: "$350",
      price: "$350",
      priceRange: "$350 – $480",
      duration: "45 – 60 minutes",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 1,
      notes: "Price includes desensitizing gel and custom maintenance trays.",
      summary: "Advanced in-office LED laser whitening & custom medical-grade take-home kits that safely lift deep stains up to 8 shades in a single session.",
      keyBenefits: [
        "Instant 6–8 shades brighter in one 60-min visit",
        "Enamel-safe desensitizing formulation",
        "Includes custom maintenance trays and gel kit",
        "Removes coffee, wine, tea, and tobacco discoloration"
      ],
      candidateFor: "Patients with stained or dull teeth seeking an immediate, bright, and camera-ready smile before weddings, interviews, or events.",
      faqs: [
        {
          q: "Does in-office teeth whitening hurt?",
          a: "Most patients feel zero pain. We apply a protective gingival barrier and use an anti-sensitivity remineralizing agent to minimize any transient sensitivity."
        },
        {
          q: "How long do the whitening results last?",
          a: "Results typically last 12 to 24 months depending on diet, brushing habits, and tobacco or coffee consumption. Maintenance touch-up kits help extend longevity."
        },
        {
          q: "What is the cost comparison between in-office and take-home?",
          a: "In-office LED power whitening starts at $350. Custom take-home precision trays with professional gel start at $220. A combined package is $480."
        }
      ]
    },
    {
      id: "invisalign",
      name: "Invisalign® Clear Aligners",
      category: "orthodontics",
      startingPrice: "$3,800",
      price: "$3,800",
      priceRange: "$3,800 – $5,200",
      duration: "6 – 18 months average",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 2,
      notes: "Complimentary initial 3D optical scan with $0 deposit to preview smile simulation.",
      summary: "Virtually invisible, removable smart-track aligners engineered to straighten teeth, close gaps, and correct bite alignments discreetly without metal brackets.",
      keyBenefits: [
        "100% metal-free, clear, and comfortable to wear",
        "Removable for meals, brushing, and special occasions",
        "Complementary 3D iTero® digital smile simulation",
        "Predictable progression with bi-weekly aligner swaps"
      ],
      candidateFor: "Adults and teens with crowded teeth, spacing gaps, overbite, underbite, or crossbite desiring discreet orthodontic treatment.",
      faqs: [
        {
          q: "How often do I need to wear the aligners each day?",
          a: "Aligners must be worn for 20 to 22 hours per day, removing them only to eat, drink anything other than water, and brush your teeth."
        },
        {
          q: "Is the initial Invisalign consultation free?",
          a: "Yes! Aura Dental provides a complimentary initial consultation including a full 3D iTero optical scan to preview your projected smile transformation."
        },
        {
          q: "How much does Invisalign cost and is financing available?",
          a: "Comprehensive cases start at $3,800 to $5,200 depending on complexity. We offer 0% APR monthly payment plans starting at $129/month."
        }
      ]
    },
    {
      id: "dental-implants",
      name: "Dental Implants",
      category: "restorative",
      startingPrice: "$2,400",
      price: "$2,400",
      priceRange: "$2,400 – $3,900 per tooth",
      duration: "2 – 4 months total healing & crown placement",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 3,
      notes: "Includes titanium root fixture, custom zirconia abutment, and porcelain crown.",
      summary: "Permanent, titanium or ceramic root replacements topped with custom handcrafted porcelain crowns that look, feel, and function exactly like natural teeth.",
      keyBenefits: [
        "Permanent, lifelong tooth replacement solution",
        "Preserves jawbone density and facial structure",
        "Full bite force restored with natural chewing function",
        "Zero damage or grinding required on adjacent healthy teeth"
      ],
      candidateFor: "Individuals missing one, several, or all teeth looking for a permanent alternative to loose dentures or dental bridges.",
      faqs: [
        {
          q: "How long does a dental implant last?",
          a: "With routine oral hygiene and annual dental checkups, the titanium implant fixture has a 98% success rate and is designed to last a lifetime."
        },
        {
          q: "Is the dental implant surgery painful?",
          a: "The procedure is performed under local anesthesia or sedation dentistry and is virtually painless. Post-procedure soreness is mild and manageable with standard pain relievers."
        }
      ]
    },
    {
      id: "emergency-care",
      name: "Emergency Dental Care",
      category: "emergency",
      startingPrice: "$150",
      price: "$150",
      priceRange: "$150 – $350 diagnostic triage",
      duration: "Immediate / Same-Day",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 4,
      notes: "Includes emergency clinical exam, diagnostic X-rays, and immediate pain alleviation plan.",
      summary: "Urgent same-day clinical appointments and 24/7 on-call triage for acute toothaches, chipped or knocked-out teeth, lost crowns, facial swelling, and trauma.",
      keyBenefits: [
        "Guaranteed same-day triage and immediate pain relief",
        "Digital low-radiation diagnostic X-rays included",
        "Gentle, emergency palliative restorative treatments",
        "Direct emergency hotline connection"
      ],
      candidateFor: "Anyone experiencing sudden severe dental pain, bleeding, broken restorations, facial swelling, or dental accidents."
    },
    {
      id: "preventive-care",
      name: "Preventive Care & Hygiene",
      category: "preventive",
      startingPrice: "$190",
      price: "$190",
      priceRange: "$190 – $260",
      duration: "45 minutes",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 5,
      summary: "Comprehensive wellness exams, gentle ultrasonic scaling, fluoride enamel strengthening, and digital oral cancer screenings.",
      keyBenefits: [
        "Removes hardened calculus and plaque biofilms",
        "Comprehensive periodontal gum health charting",
        "High-definition intraoral camera walkthrough",
        "Personalized oral hygiene recommendations"
      ],
      candidateFor: "All adults and children recommended for regular 6-month preventative checkups."
    },
    {
      id: "porcelain-veneers",
      name: "Handcrafted Porcelain Veneers",
      category: "cosmetic",
      startingPrice: "$1,100",
      price: "$1,100",
      priceRange: "$1,100 – $1,800 per tooth",
      duration: "2 visits over 2 weeks",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 6,
      summary: "Ultra-thin custom ceramic laminates bonded to front teeth to fix chips, deep discoloration, gaps, and minor misalignments with lifelike translucency.",
      keyBenefits: [
        "Custom master-ceramist design to match your facial aesthetics",
        "Stain-resistant and ultra-durable porcelain",
        "Minimally invasive micro-preparation",
        "Lasts 15–20+ years with proper oral care"
      ],
      candidateFor: "Patients with worn enamel, severe internal staining, uneven tooth shapes, or smile asymmetry."
    }
  ],
  insuranceAccepted: [
    "Delta Dental Premier / PPO",
    "MetLife Dental",
    "Cigna Dental DPPO",
    "Guardian Dental",
    "Aetna Dental",
    "Anthem BlueCross BlueShield",
    "UnitedHealthcare Dental",
    "Humana Dental",
    "Principal Financial Group"
  ],
  acceptedPayments: [
    "Visa, MasterCard, American Express, Discover",
    "Apple Pay & Google Pay",
    "FSA / HSA Health Savings Cards",
    "Cash & Certified Cashier Checks",
    "CareCredit Healthcare Financing (0% APR)",
    "Sunbit Patient Financing"
  ],
  financingOptions: [
    "0% APR Interest-Free Financing for 6, 12, or 24 Months via CareCredit",
    "Sunbit Flexible Monthly Payments with 90% Approval Rate",
    "In-House Aura Smile Club Membership (20% off all cosmetic & restorative care)"
  ],
  specialists: [
    {
      id: "dr-elena-vance",
      name: "Dr. Elena Vance, DDS",
      title: "Lead Aesthetic & Restorative Dentist",
      specialty: "Cosmetic Dentistry & Implantology",
      experience: "14+ Years Clinical Experience (UCSF School of Dentistry)",
      image: "https://images.unsplash.com/photo-1594824813589-214434259b36?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Dr. Vance is a recognized fellow of the American Academy of Cosmetic Dentistry (AACD) and specializes in smile transformations and complex dental implant reconstructions.",
      email: "dr.vance@auradentalstudio.com",
      isActive: true
    },
    {
      id: "dr-marcus-chen",
      name: "Dr. Marcus Chen, DMD, MS",
      title: "Orthodontic Specialist",
      specialty: "Invisalign® Diamond Plus Provider",
      experience: "11+ Years Experience (Harvard School of Dental Medicine)",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Dr. Chen has treated over 2,000 clear aligner cases and specializes in adolescent and adult smile alignment using non-extraction protocols.",
      email: "dr.chen@auradentalstudio.com",
      isActive: true
    }
  ],
  appointmentSettings: {
    appointmentTypes: [
      {
        id: "apt-free-scan",
        name: "Complimentary Invisalign 3D Smile Scan",
        durationMinutes: 30,
        consultationType: "in_person",
        serviceCategory: "orthodontics",
        assignedDoctorIds: ["dr-marcus-chen"],
        depositRequired: false,
        isActive: true
      },
      {
        id: "apt-whitening",
        name: "In-Office LED Teeth Whitening Session",
        durationMinutes: 60,
        consultationType: "in_person",
        serviceCategory: "cosmetic",
        assignedDoctorIds: ["dr-elena-vance"],
        depositRequired: true,
        depositAmount: 50,
        isActive: true
      },
      {
        id: "apt-implant-eval",
        name: "Dental Implant Consultation & 3D CBCT Scan",
        durationMinutes: 45,
        consultationType: "in_person",
        serviceCategory: "restorative",
        assignedDoctorIds: ["dr-elena-vance"],
        depositRequired: false,
        isActive: true
      },
      {
        id: "apt-emergency",
        name: "Same-Day Emergency Relief Exam",
        durationMinutes: 45,
        consultationType: "in_person",
        serviceCategory: "emergency",
        assignedDoctorIds: ["dr-elena-vance", "dr-marcus-chen"],
        depositRequired: false,
        isActive: true
      },
      {
        id: "apt-general-clean",
        name: "Comprehensive Exam & Ultrasonic Cleaning",
        durationMinutes: 45,
        consultationType: "in_person",
        serviceCategory: "preventive",
        assignedDoctorIds: ["dr-elena-vance"],
        depositRequired: false,
        isActive: true
      }
    ],
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    timeWindows: [
      { start: "08:30", end: "12:30" },
      { start: "14:00", end: "17:30" }
    ],
    minNoticeHours: 2,
    cancellationPolicyText: "We kindly request at least 24 hours advance notice for appointment reschedules or cancellations. Late cancellations with less than 24h notice may incur a $50 administrative fee.",
    bookingUrl: "https://auradentalstudio.com/book",
    requireDeposit: false
  },
  aiSettings: {
    assistantName: "Aura",
    welcomeMessage: "Hello and welcome to Aura Dental & Aesthetic Studio! I am Aura, your AI Patient Coordinator. How may I assist your smile today?",
    tone: "professional_warm",
    language: "en",
    clinicInstructions: "You are the clinical coordinator for Aura Dental & Aesthetic Studio in San Francisco. Provide friendly, clear, high-contrast answers about our treatments, verified pricing, insurance network, doctor qualifications, and office directions. If patients share contact info, gladly confirm that our staff will finalize the appointment.",
    greetingPrompt: "Welcome to Aura Dental! I can guide you through our cosmetic & restorative treatments, verify pricing, or schedule your personalized consultation.",
    afterHoursBehavior: "standard_with_notice",
    humanHandoffBehavior: "transfer_to_inbox",
    canAnswerFaqs: true,
    canRecommendTreatments: true,
    canDiscussPrices: true,
    canCaptureLeads: true,
    canCollectAppointments: true,
    canSendToBooking: true,
    canEscalateToStaff: true
  },
  kbArticles: [
    {
      id: "kb-1",
      clinicId: "clinic-sf",
      category: "parking_location",
      title: "Parking & Public Transportation at 450 Sutter St",
      content: "Valet and self-parking are available directly inside the 450 Sutter Garage adjacent to our building entrance. We offer 90-minute validation for patients undergoing active treatment. We are also a 5-minute walk from Montgomery BART/Muni station.",
      tags: ["parking", "directions", "garage", "bart", "muni"],
      isActive: true,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-08-01T12:00:00.000Z"
    },
    {
      id: "kb-2",
      clinicId: "clinic-sf",
      category: "insurance",
      title: "How We Handle Dental Insurance Claims",
      content: "We are in-network with Delta Dental Premier, MetLife, Cigna, Guardian, Aetna, and Anthem BlueCross. Our front desk handles all claim submissions, electronic pre-authorizations, and benefits verifications directly with your insurer so you only pay your verified co-pay.",
      tags: ["insurance", "ppo", "delta dental", "cigna", "metlife", "claims"],
      isActive: true,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-08-05T14:00:00.000Z"
    },
    {
      id: "kb-3",
      clinicId: "clinic-sf",
      category: "cancellation_refund",
      title: "Appointment Cancellation and Rescheduling Policy",
      content: "Patients may cancel or reschedule their visits at no charge with at least 24 hours advance notice. Cancellations made with less than 24 hours notice may be subject to a $50 late cancellation fee.",
      tags: ["cancel", "reschedule", "policy", "late fee"],
      isActive: true,
      createdAt: "2026-01-20T10:00:00.000Z",
      updatedAt: "2026-07-20T11:00:00.000Z"
    },
    {
      id: "kb-4",
      clinicId: "clinic-sf",
      category: "financing",
      title: "CareCredit and Sunbit 0% Interest Financing Options",
      content: "We provide 6, 12, and 24-month 0% APR interest-free payment plans through CareCredit and Sunbit for all treatments over $500, including Invisalign and Dental Implants. Application takes under 2 minutes with no hard credit hit.",
      tags: ["financing", "carecredit", "sunbit", "payment plan", "0% apr"],
      isActive: true,
      createdAt: "2026-02-01T10:00:00.000Z",
      updatedAt: "2026-08-10T09:00:00.000Z"
    },
    {
      id: "kb-5",
      clinicId: "clinic-sf",
      category: "doctor_credentials",
      title: "Lead Dentist Dr. Elena Vance Credentials & Honors",
      content: "Dr. Elena Vance graduated with clinical honors from UCSF School of Dentistry and completed advanced surgical implant fellowships at the Misch International Implant Institute. She is an active member of AACD and the American Dental Association (ADA).",
      tags: ["doctor", "dr vance", "credentials", "ucsf", "fellowship"],
      isActive: true,
      createdAt: "2026-02-10T10:00:00.000Z",
      updatedAt: "2026-08-12T16:00:00.000Z"
    }
  ],
  notificationSettings: {
    emailNotifications: true,
    notificationEmails: ["concierge@auradentalstudio.com", "manager@auradentalstudio.com"],
    notifyOnNewLead: true,
    notifyOnAppointmentRequest: true,
    notifyOnHandoff: true,
    notifyOnEmergency: true,
    soundAlerts: true,
    desktopNotifications: true,
    smsAlerts: true,
    smsRecipientPhone: "+1 (415) 555-0198"
  },
  safetySettings: {
    neverInventPrices: true,
    neverInventAvailability: true,
    neverClaimConfirmedWithoutRealSync: true,
    neverDiagnose: true,
    neverGuaranteeMedicalResults: true,
    recommendSpecialistNotice: true,
    identifyAsAI: true,
    emergencyPhoneEscalation: true
  }
};

export const initialClinicPA: ClinicConfig = {
  id: 'clinic-pa',
  slug: 'palo-alto',
  clinicName: "Aura Smile & Implant Center - Silicon Valley",
  tagline: "High-Tech Restorative & Laser Aesthetics",
  logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=120&h=120&q=80",
  address: "220 California Ave, Suite 300",
  cityStateZip: "Palo Alto, CA 94306",
  phone: "+1 (650) 555-0144",
  emergencyPhone: "+1 (650) 555-8822",
  email: "paloalto@auradentalstudio.com",
  website: "https://auradentalstudio.com/palo-alto",
  googleMapsUrl: "https://maps.google.com/?q=220+California+Ave+Palo+Alto+CA",
  about: "Aura Smile Center in Palo Alto delivers precision digital dentistry tailored for busy Silicon Valley professionals. Featuring same-day ceramic crowns, 3D implant navigation, and clear aligner therapies.",
  workingHours: {
    weekdays: "Monday – Friday: 7:30 AM – 5:30 PM",
    saturday: "Saturday: 8:30 AM – 1:30 PM",
    sunday: "Sunday: Closed",
  },
  businessHours: {
    schedule: [
      { day: 'monday', dayLabel: 'Monday', isOpen: true, openTime: '07:30', closeTime: '17:30', hasBreak: true, breakStart: '12:30', breakEnd: '13:30' },
      { day: 'tuesday', dayLabel: 'Tuesday', isOpen: true, openTime: '07:30', closeTime: '17:30', hasBreak: true, breakStart: '12:30', breakEnd: '13:30' },
      { day: 'wednesday', dayLabel: 'Wednesday', isOpen: true, openTime: '07:30', closeTime: '17:30', hasBreak: true, breakStart: '12:30', breakEnd: '13:30' },
      { day: 'thursday', dayLabel: 'Thursday', isOpen: true, openTime: '07:30', closeTime: '17:30', hasBreak: true, breakStart: '12:30', breakEnd: '13:30' },
      { day: 'friday', dayLabel: 'Friday', isOpen: true, openTime: '07:30', closeTime: '17:30', hasBreak: true, breakStart: '12:30', breakEnd: '13:30' },
      { day: 'saturday', dayLabel: 'Saturday', isOpen: true, openTime: '08:30', closeTime: '13:30', hasBreak: false },
      { day: 'sunday', dayLabel: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '13:00', hasBreak: false }
    ],
    holidayClosures: [],
    temporaryClosures: [],
    afterHoursMessage: "Our Palo Alto clinic is currently closed. Our AI assistant is ready to log your inquiry or assist in emergencies."
  },
  emergencyPolicy: "Same-day urgent appointments reserved daily. Call +1 (650) 555-8822 for triage.",
  services: [
    {
      id: "teeth-whitening-pa",
      name: "Laser Teeth Whitening",
      category: "cosmetic",
      startingPrice: "$375",
      price: "$375",
      priceRange: "$375 – $495",
      duration: "45 minutes",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 1,
      summary: "High-speed laser teeth whitening delivering 7+ shades improvement with zero tooth dehydration.",
      keyBenefits: ["Laser accelerated", "Desensitizing gel", "Immediate results"],
      candidateFor: "Professionals seeking rapid aesthetic enhancement."
    },
    {
      id: "invisalign-pa",
      name: "Invisalign® Pro Aligners",
      category: "orthodontics",
      startingPrice: "$3,950",
      price: "$3,950",
      priceRange: "$3,950 – $5,400",
      duration: "6 – 14 months",
      isActive: true,
      isBookable: true,
      aiCanMentionPrice: true,
      aiCanRecommend: true,
      displayOrder: 2,
      summary: "Custom digital aligner therapy with virtual progress tracking.",
      keyBenefits: ["Virtual check-ins", "Free 3D simulation"],
      candidateFor: "Adults seeking discreet alignment."
    }
  ],
  insuranceAccepted: [
    "Delta Dental PPO",
    "Aetna Dental",
    "MetLife",
    "Cigna",
    "Guardian"
  ],
  acceptedPayments: [
    "Credit Cards",
    "Apple Pay",
    "FSA/HSA",
    "CareCredit"
  ],
  financingOptions: [
    "0% APR 12-month financing available"
  ],
  specialists: [
    {
      id: "dr-david-liu",
      name: "Dr. David K. Liu, DDS",
      title: "Clinic Director & Implant Surgeon",
      specialty: "Restorative Dentistry & Digital CBCT Surgery",
      experience: "16+ Years Clinical Experience (Stanford / UOP Dugoni)",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80",
      isActive: true
    }
  ],
  appointmentSettings: {
    appointmentTypes: [
      {
        id: "apt-pa-consult",
        name: "General Aesthetic Consultation",
        durationMinutes: 30,
        consultationType: "in_person",
        assignedDoctorIds: ["dr-david-liu"],
        depositRequired: false,
        isActive: true
      }
    ],
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    timeWindows: [{ start: "08:00", end: "16:30" }],
    minNoticeHours: 3,
    cancellationPolicyText: "24-hour notice required.",
    requireDeposit: false
  },
  aiSettings: {
    assistantName: "Aura PA",
    welcomeMessage: "Welcome to Aura Smile Center Palo Alto! How can I help you today?",
    tone: "luxury_concierge",
    language: "en",
    clinicInstructions: "You are the coordinator for Aura Smile Center in Palo Alto. Assist patients with high-end tech-focused treatments.",
    greetingPrompt: "Welcome to Aura Palo Alto. How can I help you with your dental care?",
    afterHoursBehavior: "standard_with_notice",
    humanHandoffBehavior: "transfer_to_inbox",
    canAnswerFaqs: true,
    canRecommendTreatments: true,
    canDiscussPrices: true,
    canCaptureLeads: true,
    canCollectAppointments: true,
    canSendToBooking: true,
    canEscalateToStaff: true
  },
  kbArticles: [],
  notificationSettings: {
    emailNotifications: true,
    notificationEmails: ["paloalto@auradentalstudio.com"],
    notifyOnNewLead: true,
    notifyOnAppointmentRequest: true,
    notifyOnHandoff: true,
    notifyOnEmergency: true,
    soundAlerts: true,
    desktopNotifications: true
  },
  safetySettings: {
    neverInventPrices: true,
    neverInventAvailability: true,
    neverClaimConfirmedWithoutRealSync: true,
    neverDiagnose: true,
    neverGuaranteeMedicalResults: true,
    recommendSpecialistNotice: true,
    identifyAsAI: true,
    emergencyPhoneEscalation: true
  }
};

export const initialClinicsList: ClinicConfig[] = [
  initialClinicSF,
  initialClinicPA
];

// Initial pre-seeded Leads
export const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    clinicId: 'clinic-sf',
    name: 'Sophia Montgomery',
    phone: '+1 (415) 555-8392',
    email: 'sophia.montgomery@example.com',
    serviceId: 'invisalign',
    serviceName: 'Invisalign® Clear Aligners',
    preferredTime: 'Tomorrow afternoon (2:00 PM)',
    message: 'Interested in getting a free 3D smile scan to fix slight crowding on my bottom teeth.',
    source: 'chat',
    status: 'new',
    createdAt: '2026-08-20T01:30:00.000Z',
    updatedAt: '2026-08-20T01:30:00.000Z',
    estimatedValue: 4200
  },
  {
    id: 'lead-102',
    clinicId: 'clinic-sf',
    name: 'Marcus Holloway',
    phone: '+1 (415) 555-7104',
    email: 'm.holloway@techsf.io',
    serviceId: 'teeth-whitening',
    serviceName: 'Teeth Whitening',
    preferredTime: 'This Friday at 11:00 AM',
    message: 'Looking for in-office LED laser whitening before a presentation next week.',
    source: 'chat',
    status: 'contacted',
    notes: 'Staff reached out via SMS to confirm 11:00 AM operatory slot.',
    createdAt: '2026-08-19T18:45:00.000Z',
    updatedAt: '2026-08-19T19:10:00.000Z',
    estimatedValue: 350
  },
  {
    id: 'lead-103',
    clinicId: 'clinic-sf',
    name: 'Eleanor Sterling',
    phone: '+1 (415) 555-3341',
    email: 'eleanor.sterling@gmail.com',
    serviceId: 'dental-implants',
    serviceName: 'Dental Implants',
    preferredTime: 'Thursday morning',
    message: 'Consultation for replacing a lower molar tooth lost 2 years ago.',
    source: 'booking_form',
    status: 'appointment_requested',
    createdAt: '2026-08-19T14:20:00.000Z',
    updatedAt: '2026-08-19T15:00:00.000Z',
    estimatedValue: 2800
  },
  {
    id: 'lead-104',
    clinicId: 'clinic-sf',
    name: 'David Reynolds',
    phone: '+1 (415) 555-9081',
    email: 'david.reynolds@consulting.com',
    serviceId: 'emergency-care',
    serviceName: 'Emergency Dental Care',
    preferredTime: 'Immediate same-day slot',
    message: 'Chipped front tooth while playing squash, minor sensitivity to air.',
    source: 'emergency_triage',
    status: 'booked',
    notes: 'Booked same-day priority slot with Dr. Vance at 3:30 PM.',
    createdAt: '2026-08-19T10:15:00.000Z',
    updatedAt: '2026-08-19T10:30:00.000Z',
    estimatedValue: 450
  },
  {
    id: 'lead-105',
    clinicId: 'clinic-sf',
    name: 'Rachel Kim',
    phone: '+1 (415) 555-4429',
    email: 'rachel.kim@designstudio.org',
    serviceId: 'porcelain-veneers',
    serviceName: 'Handcrafted Porcelain Veneers',
    preferredTime: 'Next Monday morning',
    message: 'Interested in a full cosmetic consultation for 6 upper veneers.',
    source: 'chat',
    status: 'qualified',
    notes: 'Verified insurance out-of-network benefits. Sent brochure.',
    createdAt: '2026-08-18T16:00:00.000Z',
    updatedAt: '2026-08-18T17:30:00.000Z',
    estimatedValue: 7200
  }
];

// Initial pre-seeded Conversations for Admin Inbox
export const initialConversations: Conversation[] = [
  {
    id: 'conv-201',
    clinicId: 'clinic-sf',
    sessionId: 'session-sophia-101',
    patientName: 'Sophia Montgomery',
    patientContact: '+1 (415) 555-8392',
    status: 'active',
    leadId: 'lead-101',
    intent: 'Invisalign Inquiry & Booking',
    serviceMentioned: 'Invisalign® Clear Aligners',
    priority: 'normal',
    isAfterHours: false,
    createdAt: '2026-08-20T01:25:00.000Z',
    updatedAt: '2026-08-20T01:30:00.000Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        text: 'Hi, I am looking to straighten my lower teeth. How much does Invisalign cost and can I preview what it will look like?',
        timestamp: '10:25 AM'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        text: 'Hello Sophia! At **Aura Dental & Aesthetic Studio**, comprehensive Invisalign® treatments range from **$3,800 to $5,200** with 0% APR financing from $129/mo. We offer a **complimentary 3D iTero® optical scan** during your consultation so you can preview your simulated transformation before starting!\n\nWould you like me to book your complimentary 3D scan this week?',
        timestamp: '10:26 AM',
        suggestions: ['Book complimentary 3D scan', 'Payment plan details']
      },
      {
        id: 'msg-3',
        role: 'user',
        text: 'Yes please! Tomorrow afternoon around 2:00 PM works best for me. My name is Sophia Montgomery, phone is +1 (415) 555-8392.',
        timestamp: '10:28 AM'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        text: 'Thank you Sophia! I have recorded your request for a **Complimentary Invisalign 3D Smile Scan** tomorrow at **2:00 PM**. Our front desk coordinator will confirm your reserved operatory slot immediately!',
        timestamp: '10:29 AM',
        bookingActionPrompt: true
      }
    ]
  },
  {
    id: 'conv-202',
    clinicId: 'clinic-sf',
    sessionId: 'session-david-104',
    patientName: 'David Reynolds',
    patientContact: '+1 (415) 555-9081',
    status: 'resolved',
    leadId: 'lead-104',
    intent: 'Emergency Broken Tooth Triage',
    serviceMentioned: 'Emergency Dental Care',
    priority: 'emergency',
    isAfterHours: false,
    createdAt: '2026-08-19T10:10:00.000Z',
    updatedAt: '2026-08-19T10:30:00.000Z',
    messages: [
      {
        id: 'msg-21',
        role: 'user',
        text: 'I just broke a front tooth playing sports. It is sensitive to air. Do you have an emergency dentist right now?',
        timestamp: '10:10 AM'
      },
      {
        id: 'msg-22',
        role: 'assistant',
        text: '🚨 **Emergency Protocol Active**: We have same-day emergency triage slots open today at **Aura Dental**. Rinse with warm water, avoid chewing on that side, and save any tooth fragments in saline or milk. Our emergency triage fee is $150 (includes digital X-rays).\n\nCall our 24/7 hotline **+1 (415) 555-9911** or reply with your name to reserve the next emergency chair.',
        timestamp: '10:11 AM',
        emergencyNotice: true
      },
      {
        id: 'msg-23',
        role: 'user',
        text: 'I am David Reynolds, +1 415-555-9081. I am heading over now.',
        timestamp: '10:13 AM'
      },
      {
        id: 'msg-24',
        role: 'staff',
        text: 'Hi David, this is Chloe at the front desk. Dr. Vance has prepped Operatory 3 for you at 3:30 PM. We are holding your spot. See you shortly!',
        timestamp: '10:15 AM',
        isStaffTakeover: true,
        staffName: 'Chloe Bennett (Lead Coordinator)'
      }
    ]
  },
  {
    id: 'conv-203',
    clinicId: 'clinic-sf',
    sessionId: 'session-handoff-109',
    patientName: 'Jonathan Hayes',
    patientContact: 'j.hayes@baycapital.com',
    status: 'handoff_requested',
    intent: 'Complex Insurance Reimbursement',
    serviceMentioned: 'Handcrafted Porcelain Veneers',
    priority: 'urgent',
    isAfterHours: true,
    createdAt: '2026-08-19T21:40:00.000Z',
    updatedAt: '2026-08-19T21:45:00.000Z',
    messages: [
      {
        id: 'msg-31',
        role: 'user',
        text: 'Does your clinic provide itemized Superbills for international health plans like Bupa Global or Cigna International for porcelain veneers?',
        timestamp: '9:40 PM'
      },
      {
        id: 'msg-32',
        role: 'assistant',
        text: 'For international insurance plans and specialized Superbills, our billing director will review your policy coding directly. I am routing your inquiry to our clinical management team so they can email you the exact verification form first thing in the morning.',
        timestamp: '9:42 PM'
      },
      {
        id: 'msg-33',
        role: 'user',
        text: 'Great, please connect me with a human coordinator. My email is j.hayes@baycapital.com.',
        timestamp: '9:44 PM'
      }
    ]
  }
];

// Initial pre-seeded Appointments
export const initialBookings: AppointmentBooking[] = [
  {
    id: 'apt-301',
    clinicId: 'clinic-sf',
    fullName: 'Sophia Montgomery',
    contact: '+1 (415) 555-8392',
    preferredDate: '2026-08-21',
    preferredTime: '14:00',
    treatment: 'Invisalign® Clear Aligners',
    doctorAssigned: 'Dr. Marcus Chen, DMD, MS',
    status: 'confirmed',
    createdAt: '2026-08-20T01:30:00.000Z',
    source: 'chat'
  },
  {
    id: 'apt-302',
    clinicId: 'clinic-sf',
    fullName: 'David Reynolds',
    contact: '+1 (415) 555-9081',
    preferredDate: '2026-08-20',
    preferredTime: '15:30',
    treatment: 'Emergency Dental Care',
    doctorAssigned: 'Dr. Elena Vance, DDS',
    status: 'confirmed',
    createdAt: '2026-08-19T10:15:00.000Z',
    source: 'emergency_triage'
  },
  {
    id: 'apt-303',
    clinicId: 'clinic-sf',
    fullName: 'Eleanor Sterling',
    contact: '+1 (415) 555-3341',
    preferredDate: '2026-08-22',
    preferredTime: '10:00',
    treatment: 'Dental Implants',
    doctorAssigned: 'Dr. Elena Vance, DDS',
    status: 'pending',
    createdAt: '2026-08-19T14:20:00.000Z',
    source: 'booking_form'
  }
];

// Initial Audit Logs
export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    clinicId: 'clinic-sf',
    clinicName: 'Aura Dental & Aesthetic Studio',
    userId: 'user-admin-sf',
    userEmail: 'admin@auradentalstudio.com',
    userRole: 'clinic_admin',
    action: 'UPDATE_SERVICE_PRICING',
    entityType: 'service',
    entityId: 'teeth-whitening',
    fieldChanged: 'startingPrice',
    previousValue: '$320',
    newValue: '$350',
    timestamp: '2026-08-18T11:20:00.000Z',
    ipAddress: '198.51.100.42'
  },
  {
    id: 'log-2',
    clinicId: 'clinic-sf',
    clinicName: 'Aura Dental & Aesthetic Studio',
    userId: 'user-admin-sf',
    userEmail: 'admin@auradentalstudio.com',
    userRole: 'clinic_admin',
    action: 'CREATE_KB_ARTICLE',
    entityType: 'kb',
    entityId: 'kb-4',
    fieldChanged: 'title',
    previousValue: 'None',
    newValue: 'CareCredit and Sunbit 0% Interest Financing Options',
    timestamp: '2026-08-15T09:40:00.000Z',
    ipAddress: '198.51.100.42'
  },
  {
    id: 'log-3',
    clinicId: 'clinic-sf',
    clinicName: 'Aura Dental & Aesthetic Studio',
    userId: 'user-super-1',
    userEmail: 'superadmin@auraplatform.com',
    userRole: 'super_admin',
    action: 'UPDATE_AI_GUARDRAILS',
    entityType: 'safety',
    fieldChanged: 'neverInventPrices',
    previousValue: 'true',
    newValue: 'true (Enforced Strict Mode)',
    timestamp: '2026-08-10T14:10:00.000Z',
    ipAddress: '203.0.113.19'
  }
];

export const emergencyGuides: EmergencyGuide[] = [
  {
    id: "knocked-out-tooth",
    title: "Knocked-Out (Avulsed) Tooth",
    urgency: "critical",
    firstAid: [
      "Find the tooth immediately; hold it strictly by the top white crown, NEVER the root.",
      "If dirty, gently rinse with cold milk or saline for 5 seconds (do not scrub or use soap).",
      "Try to gently reinsert it into the socket, or place it in a cup of cold whole milk.",
      "Contact our emergency hotline (+1 415-555-9911) and arrive within 30 to 60 minutes for best reimplantation success."
    ],
    warningNote: "Time is critical. Teeth reimplanted within 60 minutes have the highest survival rate.",
    suggestedAction: "Call Emergency Hotline Immediately"
  },
  {
    id: "severe-toothache",
    title: "Severe Throbbing Toothache / Abscess",
    urgency: "urgent",
    firstAid: [
      "Rinse your mouth with warm salt water (1/2 tsp salt in 8 oz water).",
      "Gently floss to remove any trapped food debris around the affected tooth.",
      "Take an over-the-counter pain reliever like ibuprofen if medically safe (never place aspirin directly on the gums).",
      "Apply a cold compress to the outside of your cheek for 15 minutes at a time to reduce swelling."
    ],
    warningNote: "Facial swelling accompanied by difficulty swallowing or breathing requires immediate emergency room evaluation.",
    suggestedAction: "Book Same-Day Emergency Slot"
  },
  {
    id: "broken-chipped-tooth",
    title: "Broken or Fractured Tooth",
    urgency: "urgent",
    firstAid: [
      "Save any broken tooth fragments in a moist container or clean water.",
      "Rinse your mouth with lukewarm water to clean the area.",
      "Cover sharp edges with sugarless chewing gum or orthodontic wax to protect your tongue and cheek.",
      "Avoid eating hard foods or consuming extreme hot/cold liquids."
    ],
    warningNote: "If the inner pink pulp is exposed or bleeding, prompt treatment is required to prevent infection.",
    suggestedAction: "Book Priority Consultation"
  },
  {
    id: "lost-crown-filling",
    title: "Lost Crown or Loose Filling",
    urgency: "moderate",
    firstAid: [
      "Keep the dislodged crown safe and bring it to your appointment.",
      "Apply a small dab of over-the-counter dental cement or toothpaste inside the crown to temporarily place it over the tooth.",
      "Do not chew on that side of the mouth.",
      "Schedule a quick visit so we can properly sterilize and re-cement the crown."
    ],
    warningNote: "Do not use household superglue under any circumstances.",
    suggestedAction: "Schedule Restoration Appointment"
  }
];

export const quickQuestions = [
  "How much does Teeth Whitening cost and how long does it take?",
  "Am I a good candidate for Invisalign vs braces?",
  "What is the procedure and timeline for Dental Implants?",
  "I have a sudden dental emergency. What should I do?",
  "What are your working hours and location?",
  "I'd like to book a consultation for an appointment."
];

// Re-export default clinic for backward compatibility
export const initialClinicConfig: ClinicConfig = initialClinicSF;
