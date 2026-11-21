const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      default: 'Skywings International Academy',
    },
    code: {
      type: String,
      required: [true, 'School registration code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      default: 'SKYWINGS-001',
    },
    affiliationNumber: {
      type: String,
      trim: true,
      default: 'CBSE-2026-9874',
    },
    logo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'School email is required'],
      trim: true,
      lowercase: true,
      default: 'admin@skywingsschool.com',
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      default: '+91 98765 43210',
    },
    address: {
      street: { type: String, default: 'Plot No. 42, Tech Park Enclave' },
      city: { type: String, default: 'Bangalore' },
      state: { type: String, default: 'Karnataka' },
      zipCode: { type: String, default: '560001' },
      country: { type: String, default: 'India' },
    },
    website: {
      type: String,
      default: 'https://skywingsschool.com',
    },
    tagline: {
      type: String,
      default: 'Empowering Young Minds for a Brighter Tomorrow',
    },
    establishedYear: {
      type: String,
      default: '2005',
    },
    principalName: {
      type: String,
      default: 'Dr. Rajesh Sharma',
    },
    principalDesignation: {
      type: String,
      default: 'Principal & Academic Director',
    },
    principalQualifications: {
      type: String,
      default: 'Ph.D in Education, M.Sc Physics, B.Ed',
    },
    principalPhoto: {
      type: String,
      default: '',
    },
    principalMessage: {
      type: String,
      default:
        'Welcome to Skywings International Academy. We believe every child is born with unique potential. Our mission is to ignite that spark through inquiry-based learning, strong moral values, and state-of-the-art facilities. We prepare students not just for board examinations, but for life.',
    },
    principalBio: {
      type: String,
      default:
        'Dr. Rajesh Sharma brings 25+ years of distinguished leadership in Indian and International curricula. An alumnus of Delhi University and recipient of the National Academic Leader Award.',
    },
    stats: {
      totalStudents: { type: Number, default: 1250 },
      totalTeachers: { type: Number, default: 68 },
      classrooms: { type: Number, default: 45 },
      labs: { type: Number, default: 8 },
      awardsCount: { type: Number, default: 35 },
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/skywingsschool' },
      twitter: { type: String, default: 'https://twitter.com/skywingsschool' },
      instagram: { type: String, default: 'https://instagram.com/skywingsschool' },
      youtube: { type: String, default: 'https://youtube.com/skywingsschool' },
      linkedin: { type: String, default: 'https://linkedin.com/school/skywingsschool' },
    },
    currentAcademicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);

