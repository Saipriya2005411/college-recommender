const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const College = require('./models/College');
const User = require('./models/User');

const colleges = [
  {
    collegeName: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    tier: 'Tier 1',
    ranking: 3,
    nirfRanking: 3,
    accreditation: 'NAAC A++',
    description: 'IIT Bombay is one of the premier engineering institutes in India, known for cutting-edge research and industry connections.',
    imageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1d/IIT_Bombay_Logo.svg',
    website: 'https://www.iitb.ac.in',
    established: 1958,
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 120, duration: '4 Years', fees: { tuition: 200000, hostel: 40000, other: 20000 }, cutoff: { general: 150, obc: 100, sc: 70, st: 50, ews: 130 }, examAccepted: ['JEE Advanced'] },
      { name: 'Electrical Engineering', code: 'EE', seats: 100, duration: '4 Years', fees: { tuition: 200000, hostel: 40000, other: 20000 }, cutoff: { general: 120, obc: 80, sc: 55, st: 40, ews: 100 }, examAccepted: ['JEE Advanced'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 90, duration: '4 Years', fees: { tuition: 200000, hostel: 40000, other: 20000 }, cutoff: { general: 100, obc: 65, sc: 45, st: 30, ews: 85 }, examAccepted: ['JEE Advanced'] },
      { name: 'AI/ML', code: 'AIML', seats: 60, duration: '4 Years', fees: { tuition: 200000, hostel: 40000, other: 20000 }, cutoff: { general: 160, obc: 110, sc: 80, st: 60, ews: 140 }, examAccepted: ['JEE Advanced'] }
    ],
    placements: { percentage: 98, avgPackage: 2500000, highestPackage: 8000000, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'DE Shaw'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.8, totalReviews: 0
  },
  {
    collegeName: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    tier: 'Tier 1',
    ranking: 2,
    nirfRanking: 2,
    accreditation: 'NAAC A++',
    description: 'IIT Delhi consistently ranks among the top engineering institutions globally with exceptional placements.',
    imageURL: 'https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_logo.png',
    website: 'https://home.iitd.ac.in',
    established: 1961,
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 110, duration: '4 Years', fees: { tuition: 200000, hostel: 45000, other: 20000 }, cutoff: { general: 145, obc: 95, sc: 65, st: 48, ews: 125 }, examAccepted: ['JEE Advanced'] },
      { name: 'AI/ML', code: 'AIML', seats: 50, duration: '4 Years', fees: { tuition: 200000, hostel: 45000, other: 20000 }, cutoff: { general: 155, obc: 105, sc: 75, st: 55, ews: 135 }, examAccepted: ['JEE Advanced'] },
      { name: 'ECE', code: 'ECE', seats: 95, duration: '4 Years', fees: { tuition: 200000, hostel: 45000, other: 20000 }, cutoff: { general: 115, obc: 75, sc: 52, st: 38, ews: 95 }, examAccepted: ['JEE Advanced'] }
    ],
    placements: { percentage: 97, avgPackage: 2300000, highestPackage: 7500000, topRecruiters: ['Google', 'Microsoft', 'Facebook', 'BCG', 'McKinsey'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.7, totalReviews: 0
  },
  {
    collegeName: 'BITS Pilani',
    shortName: 'BITS Pilani',
    state: 'Rajasthan',
    city: 'Pilani',
    type: 'Deemed',
    tier: 'Tier 1',
    ranking: 25,
    nirfRanking: 25,
    accreditation: 'NAAC A',
    description: 'BITS Pilani is a premier private engineering university known for its industry-integrated curriculum and dual degree programs.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 200, duration: '4 Years', fees: { tuition: 520000, hostel: 80000, other: 30000 }, cutoff: { general: 330, obc: 300, sc: 260, st: 240, ews: 315 }, examAccepted: ['BITSAT'] },
      { name: 'AI/ML', code: 'AIML', seats: 60, duration: '4 Years', fees: { tuition: 520000, hostel: 80000, other: 30000 }, cutoff: { general: 345, obc: 315, sc: 275, st: 255, ews: 330 }, examAccepted: ['BITSAT'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 150, duration: '4 Years', fees: { tuition: 520000, hostel: 80000, other: 30000 }, cutoff: { general: 290, obc: 265, sc: 220, st: 200, ews: 275 }, examAccepted: ['BITSAT'] }
    ],
    placements: { percentage: 96, avgPackage: 1800000, highestPackage: 6000000, topRecruiters: ['Qualcomm', 'Samsung', 'Amazon', 'Flipkart', 'JPMorgan'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.6, totalReviews: 0
  },
  {
    collegeName: 'National Institute of Technology Trichy',
    shortName: 'NIT Trichy',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    type: 'Government',
    tier: 'Tier 1',
    ranking: 9,
    nirfRanking: 9,
    accreditation: 'NAAC A++',
    description: 'NIT Trichy is consistently ranked as the best NIT in India with excellent academics and placements.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 90, duration: '4 Years', fees: { tuition: 130000, hostel: 30000, other: 15000 }, cutoff: { general: 85, obc: 60, sc: 40, st: 28, ews: 72 }, examAccepted: ['JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 100, duration: '4 Years', fees: { tuition: 130000, hostel: 30000, other: 15000 }, cutoff: { general: 75, obc: 50, sc: 32, st: 22, ews: 62 }, examAccepted: ['JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 100, duration: '4 Years', fees: { tuition: 130000, hostel: 30000, other: 15000 }, cutoff: { general: 65, obc: 42, sc: 26, st: 18, ews: 54 }, examAccepted: ['JEE Main'] }
    ],
    placements: { percentage: 92, avgPackage: 1200000, highestPackage: 4500000, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'BHEL'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.4, totalReviews: 0
  },
  {
    collegeName: 'Vellore Institute of Technology',
    shortName: 'VIT Vellore',
    state: 'Tamil Nadu',
    city: 'Vellore',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 11,
    nirfRanking: 11,
    accreditation: 'NAAC A++',
    description: 'VIT is one of India\'s leading private engineering universities with strong industry connections and modern infrastructure.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 500, duration: '4 Years', fees: { tuition: 198000, hostel: 70000, other: 20000 }, cutoff: { general: 75, obc: 65, sc: 55, st: 50, ews: 70 }, examAccepted: ['VITEEE', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 180, duration: '4 Years', fees: { tuition: 210000, hostel: 70000, other: 20000 }, cutoff: { general: 80, obc: 70, sc: 60, st: 55, ews: 75 }, examAccepted: ['VITEEE', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 400, duration: '4 Years', fees: { tuition: 198000, hostel: 70000, other: 20000 }, cutoff: { general: 70, obc: 60, sc: 50, st: 45, ews: 65 }, examAccepted: ['VITEEE', 'JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 300, duration: '4 Years', fees: { tuition: 198000, hostel: 70000, other: 20000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 40, ews: 60 }, examAccepted: ['VITEEE', 'JEE Main'] }
    ],
    placements: { percentage: 87, avgPackage: 800000, highestPackage: 4200000, topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'HCL', 'Accenture'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.2, totalReviews: 0
  },
  {
    collegeName: 'Manipal Institute of Technology',
    shortName: 'MIT Manipal',
    state: 'Karnataka',
    city: 'Manipal',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 42,
    nirfRanking: 42,
    accreditation: 'NAAC A+',
    description: 'MIT Manipal offers world-class education with excellent international exchange programs and research facilities.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 360, duration: '4 Years', fees: { tuition: 370000, hostel: 90000, other: 25000 }, cutoff: { general: 70, obc: 60, sc: 50, st: 45, ews: 65 }, examAccepted: ['MU OET', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 120, duration: '4 Years', fees: { tuition: 390000, hostel: 90000, other: 25000 }, cutoff: { general: 75, obc: 65, sc: 55, st: 50, ews: 70 }, examAccepted: ['MU OET', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 240, duration: '4 Years', fees: { tuition: 370000, hostel: 90000, other: 25000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 40, ews: 60 }, examAccepted: ['MU OET', 'JEE Main'] }
    ],
    placements: { percentage: 83, avgPackage: 750000, highestPackage: 3800000, topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Mindtree', 'Mphasis'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.1, totalReviews: 0
  },
  {
    collegeName: 'Amity University Noida',
    shortName: 'Amity Noida',
    state: 'Uttar Pradesh',
    city: 'Noida',
    type: 'Private',
    tier: 'Tier 2',
    ranking: 85,
    nirfRanking: 85,
    accreditation: 'NAAC A+',
    description: 'Amity University offers diverse programs with strong corporate connections and modern campus facilities.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 480, duration: '4 Years', fees: { tuition: 280000, hostel: 85000, other: 30000 }, cutoff: { general: 60, obc: 50, sc: 40, st: 35, ews: 55 }, examAccepted: ['AMICET', 'JEE Main', 'CUET'] },
      { name: 'AI/ML', code: 'AIML', seats: 120, duration: '4 Years', fees: { tuition: 295000, hostel: 85000, other: 30000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 40, ews: 60 }, examAccepted: ['AMICET', 'JEE Main', 'CUET'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 240, duration: '4 Years', fees: { tuition: 270000, hostel: 85000, other: 30000 }, cutoff: { general: 55, obc: 45, sc: 35, st: 30, ews: 50 }, examAccepted: ['AMICET', 'JEE Main', 'CUET'] }
    ],
    placements: { percentage: 78, avgPackage: 600000, highestPackage: 3200000, topRecruiters: ['Cognizant', 'HCL', 'Tech Mahindra', 'Wipro', 'Capgemini'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 3.9, totalReviews: 0
  },
  {
    collegeName: 'National Institute of Technology Rourkela',
    shortName: 'NIT Rourkela',
    state: 'Odisha',
    city: 'Rourkela',
    type: 'Government',
    tier: 'Tier 1',
    ranking: 18,
    nirfRanking: 18,
    accreditation: 'NAAC A',
    description: 'NIT Rourkela is one of the top NITs with a sprawling campus and excellent research infrastructure.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 80, duration: '4 Years', fees: { tuition: 130000, hostel: 28000, other: 12000 }, cutoff: { general: 70, obc: 48, sc: 32, st: 22, ews: 58 }, examAccepted: ['JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 90, duration: '4 Years', fees: { tuition: 130000, hostel: 28000, other: 12000 }, cutoff: { general: 60, obc: 40, sc: 26, st: 18, ews: 50 }, examAccepted: ['JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 100, duration: '4 Years', fees: { tuition: 130000, hostel: 28000, other: 12000 }, cutoff: { general: 55, obc: 35, sc: 22, st: 15, ews: 45 }, examAccepted: ['JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 40, duration: '4 Years', fees: { tuition: 140000, hostel: 28000, other: 12000 }, cutoff: { general: 75, obc: 52, sc: 36, st: 25, ews: 63 }, examAccepted: ['JEE Main'] }
    ],
    placements: { percentage: 88, avgPackage: 1050000, highestPackage: 4000000, topRecruiters: ['TCS', 'Infosys', 'SAIL', 'ONGC', 'Capgemini'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.3, totalReviews: 0
  },
  {
    collegeName: 'SRM Institute of Science and Technology',
    shortName: 'SRM Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 32,
    nirfRanking: 32,
    accreditation: 'NAAC A++',
    description: 'SRM is among the top-ranked engineering universities with massive infrastructure and global connections.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 700, duration: '4 Years', fees: { tuition: 230000, hostel: 75000, other: 22000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 40, ews: 60 }, examAccepted: ['SRMJEEE', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 200, duration: '4 Years', fees: { tuition: 245000, hostel: 75000, other: 22000 }, cutoff: { general: 70, obc: 60, sc: 50, st: 45, ews: 65 }, examAccepted: ['SRMJEEE', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 500, duration: '4 Years', fees: { tuition: 220000, hostel: 75000, other: 22000 }, cutoff: { general: 60, obc: 50, sc: 40, st: 35, ews: 55 }, examAccepted: ['SRMJEEE', 'JEE Main'] }
    ],
    placements: { percentage: 84, avgPackage: 700000, highestPackage: 4500000, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Zoho'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.0, totalReviews: 0
  },
  {
    collegeName: 'Pune Institute of Computer Technology',
    shortName: 'PICT Pune',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Autonomous',
    tier: 'Tier 2',
    ranking: 120,
    nirfRanking: 120,
    accreditation: 'NAAC A',
    description: 'PICT is one of the best autonomous institutes in Pune known for its strong CS program and placement record.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 240, duration: '4 Years', fees: { tuition: 140000, hostel: 40000, other: 10000 }, cutoff: { general: 72, obc: 60, sc: 48, st: 42, ews: 67 }, examAccepted: ['MHT CET', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 60, duration: '4 Years', fees: { tuition: 150000, hostel: 40000, other: 10000 }, cutoff: { general: 76, obc: 64, sc: 52, st: 46, ews: 71 }, examAccepted: ['MHT CET', 'JEE Main'] }
    ],
    placements: { percentage: 82, avgPackage: 820000, highestPackage: 3500000, topRecruiters: ['Infosys', 'TCS', 'Persistent', 'Cognizant', 'KPIT'] },
    facilities: { hostel: false, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.0, totalReviews: 0
  },
  {
    collegeName: 'Chandigarh University',
    shortName: 'CU Chandigarh',
    state: 'Punjab',
    city: 'Mohali',
    type: 'Private',
    tier: 'Tier 2',
    ranking: 55,
    nirfRanking: 55,
    accreditation: 'NAAC A+',
    description: 'Chandigarh University is a rapidly growing university with excellent placement statistics and modern campus.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 1200, duration: '4 Years', fees: { tuition: 152000, hostel: 65000, other: 18000 }, cutoff: { general: 60, obc: 50, sc: 40, st: 35, ews: 55 }, examAccepted: ['CUCET', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 300, duration: '4 Years', fees: { tuition: 165000, hostel: 65000, other: 18000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 40, ews: 60 }, examAccepted: ['CUCET', 'JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 600, duration: '4 Years', fees: { tuition: 145000, hostel: 65000, other: 18000 }, cutoff: { general: 55, obc: 45, sc: 35, st: 30, ews: 50 }, examAccepted: ['CUCET', 'JEE Main'] }
    ],
    placements: { percentage: 80, avgPackage: 680000, highestPackage: 4200000, topRecruiters: ['TCS', 'Infosys', 'Capgemini', 'Amazon', 'IBM'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 3.9, totalReviews: 0
  },
  {
    collegeName: 'JSS Academy of Technical Education',
    shortName: 'JSS Noida',
    state: 'Uttar Pradesh',
    city: 'Noida',
    type: 'Private',
    tier: 'Tier 3',
    ranking: 200,
    nirfRanking: 200,
    accreditation: 'NAAC A',
    description: 'JSS NOIDA offers quality education at affordable fees with decent placement opportunities in the NCR region.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 180, duration: '4 Years', fees: { tuition: 95000, hostel: 45000, other: 10000 }, cutoff: { general: 50, obc: 40, sc: 30, st: 25, ews: 45 }, examAccepted: ['JEE Main', 'CUET'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 120, duration: '4 Years', fees: { tuition: 90000, hostel: 45000, other: 10000 }, cutoff: { general: 45, obc: 35, sc: 25, st: 20, ews: 40 }, examAccepted: ['JEE Main', 'CUET'] }
    ],
    placements: { percentage: 70, avgPackage: 450000, highestPackage: 2000000, topRecruiters: ['TCS', 'Wipro', 'HCL', 'Infosys', 'Tech Mahindra'] },
    facilities: { hostel: true, labs: true, library: true, sports: false, wifi: true, cafeteria: true },
    avgRating: 3.5, totalReviews: 0
  },
  {
    collegeName: 'Thapar Institute of Engineering & Technology',
    shortName: 'Thapar University',
    state: 'Punjab',
    city: 'Patiala',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 28,
    nirfRanking: 28,
    accreditation: 'NAAC A',
    description: 'Thapar is a premier deemed university with strong research culture and excellent placement track record.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 180, duration: '4 Years', fees: { tuition: 300000, hostel: 80000, other: 20000 }, cutoff: { general: 78, obc: 65, sc: 50, st: 40, ews: 70 }, examAccepted: ['JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 160, duration: '4 Years', fees: { tuition: 300000, hostel: 80000, other: 20000 }, cutoff: { general: 70, obc: 58, sc: 44, st: 34, ews: 62 }, examAccepted: ['JEE Main'] }
    ],
    placements: { percentage: 85, avgPackage: 1100000, highestPackage: 4800000, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Samsung', 'Adobe'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.2, totalReviews: 0
  },
  {
    collegeName: 'Institute of Technology, Nirma University',
    shortName: 'Nirma University',
    state: 'Gujarat',
    city: 'Ahmedabad',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 68,
    nirfRanking: 68,
    accreditation: 'NAAC A+',
    description: 'Nirma University is among the best private universities in western India with strong industry connect.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 240, duration: '4 Years', fees: { tuition: 205000, hostel: 70000, other: 18000 }, cutoff: { general: 68, obc: 56, sc: 44, st: 38, ews: 63 }, examAccepted: ['JEE Main', 'GUJCET'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 200, duration: '4 Years', fees: { tuition: 195000, hostel: 70000, other: 18000 }, cutoff: { general: 62, obc: 50, sc: 38, st: 32, ews: 57 }, examAccepted: ['JEE Main', 'GUJCET'] }
    ],
    placements: { percentage: 82, avgPackage: 780000, highestPackage: 3600000, topRecruiters: ['Infosys', 'TCS', 'L&T', 'Adani', 'Reliance'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.0, totalReviews: 0
  },
  {
    collegeName: 'RV College of Engineering',
    shortName: 'RVCE Bangalore',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Autonomous',
    tier: 'Tier 2',
    ranking: 76,
    nirfRanking: 76,
    accreditation: 'NAAC A+',
    description: 'RVCE is one of the best autonomous engineering colleges in Bangalore with an excellent placement record in the IT industry.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 180, duration: '4 Years', fees: { tuition: 155000, hostel: 55000, other: 15000 }, cutoff: { general: 70, obc: 60, sc: 48, st: 42, ews: 65 }, examAccepted: ['KCET', 'COMEDK', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 180, duration: '4 Years', fees: { tuition: 150000, hostel: 55000, other: 15000 }, cutoff: { general: 65, obc: 55, sc: 43, st: 37, ews: 60 }, examAccepted: ['KCET', 'COMEDK', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 60, duration: '4 Years', fees: { tuition: 165000, hostel: 55000, other: 15000 }, cutoff: { general: 74, obc: 64, sc: 52, st: 46, ews: 69 }, examAccepted: ['KCET', 'COMEDK', 'JEE Main'] }
    ],
    placements: { percentage: 88, avgPackage: 850000, highestPackage: 4000000, topRecruiters: ['Amazon', 'Infosys', 'TCS', 'Cisco', 'Qualcomm'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.1, totalReviews: 0
  },
  {
    collegeName: 'Saveetha Engineering College',
    shortName: 'SEC Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Autonomous',
    tier: 'Tier 3',
    ranking: 250,
    nirfRanking: 250,
    accreditation: 'NAAC A',
    description: 'Saveetha Engineering College offers quality education with good placement assistance.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 300, duration: '4 Years', fees: { tuition: 85000, hostel: 50000, other: 12000 }, cutoff: { general: 55, obc: 45, sc: 35, st: 30, ews: 50 }, examAccepted: ['TNEA', 'JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 200, duration: '4 Years', fees: { tuition: 80000, hostel: 50000, other: 12000 }, cutoff: { general: 50, obc: 40, sc: 30, st: 25, ews: 45 }, examAccepted: ['TNEA', 'JEE Main'] }
    ],
    placements: { percentage: 68, avgPackage: 380000, highestPackage: 1800000, topRecruiters: ['TCS', 'Wipro', 'Infosys', 'Sutherland', 'HCL'] },
    facilities: { hostel: true, labs: true, library: true, sports: false, wifi: true, cafeteria: true },
    avgRating: 3.4, totalReviews: 0
  },
  {
    collegeName: 'KIIT University',
    shortName: 'KIIT Bhubaneswar',
    state: 'Odisha',
    city: 'Bhubaneswar',
    type: 'Deemed',
    tier: 'Tier 2',
    ranking: 45,
    nirfRanking: 45,
    accreditation: 'NAAC A+',
    description: 'KIIT is one of the fastest growing universities in India with 30+ schools and excellent placement infrastructure.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 600, duration: '4 Years', fees: { tuition: 220000, hostel: 80000, other: 20000 }, cutoff: { general: 65, obc: 55, sc: 45, st: 38, ews: 60 }, examAccepted: ['KIITEE', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 180, duration: '4 Years', fees: { tuition: 230000, hostel: 80000, other: 20000 }, cutoff: { general: 70, obc: 60, sc: 50, st: 43, ews: 65 }, examAccepted: ['KIITEE', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 300, duration: '4 Years', fees: { tuition: 215000, hostel: 80000, other: 20000 }, cutoff: { general: 60, obc: 50, sc: 40, st: 33, ews: 55 }, examAccepted: ['KIITEE', 'JEE Main'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 240, duration: '4 Years', fees: { tuition: 210000, hostel: 80000, other: 20000 }, cutoff: { general: 55, obc: 45, sc: 35, st: 28, ews: 50 }, examAccepted: ['KIITEE', 'JEE Main'] }
    ],
    placements: { percentage: 86, avgPackage: 850000, highestPackage: 4500000, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Cognizant', 'Accenture'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.1, totalReviews: 0
  },
  {
    collegeName: 'College of Engineering and Technology, Bhubaneswar',
    shortName: 'CET Bhubaneswar',
    state: 'Odisha',
    city: 'Bhubaneswar',
    type: 'Government',
    tier: 'Tier 2',
    ranking: 140,
    nirfRanking: 140,
    accreditation: 'NAAC A',
    description: 'CET is one of the oldest and most reputed government engineering colleges in Odisha with affordable fees.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 120, duration: '4 Years', fees: { tuition: 55000, hostel: 25000, other: 8000 }, cutoff: { general: 58, obc: 48, sc: 36, st: 28, ews: 53 }, examAccepted: ['JEE Main', 'OJEE'] },
      { name: 'ECE', code: 'ECE', seats: 120, duration: '4 Years', fees: { tuition: 55000, hostel: 25000, other: 8000 }, cutoff: { general: 52, obc: 42, sc: 30, st: 22, ews: 47 }, examAccepted: ['JEE Main', 'OJEE'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 120, duration: '4 Years', fees: { tuition: 50000, hostel: 25000, other: 8000 }, cutoff: { general: 48, obc: 38, sc: 26, st: 18, ews: 43 }, examAccepted: ['JEE Main', 'OJEE'] }
    ],
    placements: { percentage: 75, avgPackage: 500000, highestPackage: 2200000, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'NALCO', 'NTPC'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 3.8, totalReviews: 0
  },
  {
    collegeName: 'Lovely Professional University',
    shortName: 'LPU Punjab',
    state: 'Punjab',
    city: 'Phagwara',
    type: 'Private',
    tier: 'Tier 2',
    ranking: 52,
    nirfRanking: 52,
    accreditation: 'NAAC A+',
    description: 'LPU is one of the largest private universities in India with diverse programs and massive placement drives.',
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 2000, duration: '4 Years', fees: { tuition: 180000, hostel: 70000, other: 15000 }, cutoff: { general: 55, obc: 45, sc: 35, st: 30, ews: 50 }, examAccepted: ['LPUNEST', 'JEE Main', 'CUET'] },
      { name: 'AI/ML', code: 'AIML', seats: 600, duration: '4 Years', fees: { tuition: 190000, hostel: 70000, other: 15000 }, cutoff: { general: 58, obc: 48, sc: 38, st: 33, ews: 53 }, examAccepted: ['LPUNEST', 'JEE Main', 'CUET'] },
      { name: 'Mechanical Engineering', code: 'ME', seats: 1000, duration: '4 Years', fees: { tuition: 170000, hostel: 70000, other: 15000 }, cutoff: { general: 50, obc: 40, sc: 30, st: 25, ews: 45 }, examAccepted: ['LPUNEST', 'JEE Main', 'CUET'] }
    ],
    placements: { percentage: 79, avgPackage: 620000, highestPackage: 4500000, topRecruiters: ['TCS', 'Infosys', 'HCL', 'Cognizant', 'Capgemini'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 3.8, totalReviews: 0
  },
  {
    collegeName: 'International Institute of Information Technology Hyderabad',
    shortName: 'IIIT Hyderabad',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Autonomous',
    tier: 'Tier 1',
    ranking: 12,
    nirfRanking: 12,
    accreditation: 'NAAC A++',
    description: 'IIIT Hyderabad is a research-focused institute known for AI, ML, and Computer Science with outstanding placements.',
    featured: true,
    courses: [
      { name: 'Computer Science Engineering', code: 'CSE', seats: 200, duration: '4 Years', fees: { tuition: 350000, hostel: 75000, other: 20000 }, cutoff: { general: 90, obc: 68, sc: 48, st: 36, ews: 78 }, examAccepted: ['UGEE', 'JEE Advanced', 'JEE Main'] },
      { name: 'AI/ML', code: 'AIML', seats: 80, duration: '4 Years', fees: { tuition: 360000, hostel: 75000, other: 20000 }, cutoff: { general: 95, obc: 72, sc: 52, st: 40, ews: 83 }, examAccepted: ['UGEE', 'JEE Advanced', 'JEE Main'] },
      { name: 'ECE', code: 'ECE', seats: 100, duration: '4 Years', fees: { tuition: 345000, hostel: 75000, other: 20000 }, cutoff: { general: 82, obc: 62, sc: 44, st: 32, ews: 72 }, examAccepted: ['UGEE', 'JEE Advanced', 'JEE Main'] }
    ],
    placements: { percentage: 95, avgPackage: 1800000, highestPackage: 7200000, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Qualcomm'] },
    facilities: { hostel: true, labs: true, library: true, sports: true, wifi: true, cafeteria: true },
    avgRating: 4.6, totalReviews: 0
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_recommender';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await College.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert colleges
    await College.insertMany(colleges);
    console.log(`✅ Inserted ${colleges.length} colleges`);

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@collegefinder.com',
      password: 'admin123',
      mobile: '9999999999',
      state: 'Delhi',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin user created: admin@collegefinder.com / admin123');

    // Create test student
    const student = new User({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'student123',
      mobile: '8888888888',
      state: 'Odisha',
      role: 'student'
    });
    await student.save();
    console.log('✅ Test student created: student@test.com / student123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
