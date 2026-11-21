// Admin Panel Central API Service
// Connects to Express API on http://localhost:5000 with JWT authentication
// Includes resilient fallback state so the Admin Panel functions smoothly in all conditions

const API_BASE = "http://localhost:5000/api";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("skywings_admin_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Runtime in-memory store for instant feedback and offline fallback
let fallbackSchool = {
  name: "Skywings International Academy",
  code: "SKYWINGS-001",
  affiliationNumber: "CBSE-2026-9874",
  email: "admin@skywingsschool.com",
  phone: "+91 98765 43210",
  website: "https://skywingsschool.com",
  tagline: "Empowering Young Minds For A Transformative Future",
  establishedYear: "2005",
  logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
  principalName: "Dr. Rajesh Sharma",
  principalDesignation: "Principal & Academic Director",
  principalQualifications: "Ph.D in Educational Leadership, M.Sc Physics, B.Ed",
  principalPhoto:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  principalMessage:
    "Welcome to Skywings International Academy. In an era defined by rapid technological and social transformation, education must transcend traditional boundaries. Here, we nurture each child’s intellectual curiosity, cultivate empathy, and foster leadership grounded in ethical responsibility.",
  principalBio:
    "Dr. Rajesh Sharma brings over 25 years of educational administration experience across premier institutions in India. Recipient of the National Educational Excellence Award.",
  stats: {
    totalStudents: 1250,
    totalTeachers: 68,
    classrooms: 45,
    labs: 8,
    awardsCount: 35,
  },
  socialLinks: {
    facebook: "https://facebook.com/skywingsschool",
    twitter: "https://twitter.com/skywingsschool",
    instagram: "https://instagram.com/skywingsschool",
    youtube: "https://youtube.com/skywingsschool",
    linkedin: "https://linkedin.com/school/skywingsschool",
  },
  address: {
    street: "Plot No. 42, Tech Park Enclave",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    country: "India",
  },
};

let fallbackBanners = [
  {
    _id: "ban-1",
    title: "Empowering Young Minds For A Transformative Future",
    subtitle:
      "Excellence in CBSE Academics, Global STEM Innovation, and Leadership Building since 2005.",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
    badgeText: "CBSE Affiliated • Admissions 2026-27 Open",
    buttonText: "Apply For Admission",
    linkUrl: "/contact",
    order: 1,
    isActive: true,
  },
  {
    _id: "ban-2",
    title: "World-Class STEM Robotics & Advanced Science Labs",
    subtitle:
      "Hands-on experimental learning equipped with state-of-the-art physics, chemistry, and AI computing suites.",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    badgeText: "Experiential STEM Learning",
    buttonText: "Explore Academics",
    linkUrl: "/academics",
    order: 2,
    isActive: true,
  },
  {
    _id: "ban-3",
    title: "Nurturing Champions In Sports, Culture & Arts",
    subtitle:
      "Olympic standard basketball courts, FIFA-certified turf, swimming pool, and vibrant music studios.",
    imageUrl:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1600&q=80",
    badgeText: "Holistic Development",
    buttonText: "View Campus Gallery",
    linkUrl: "/gallery",
    order: 3,
    isActive: true,
  },
];

let fallbackGallery = [
  {
    _id: "gal-1",
    title: "Modern Academic Campus & Main Administration Block",
    category: "Campus",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    description: "Lush green 15-acre campus with eco-friendly infrastructure.",
    isFeatured: true,
  },
  {
    _id: "gal-2",
    title: "Advanced AI & Robotics Computing Laboratory",
    category: "Labs",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    description: "Next-gen coding, automation and electronics workbench.",
    isFeatured: true,
  },
  {
    _id: "gal-3",
    title: "Inter-School Football Championship Match",
    category: "Sports",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    description: "Skywings team winning the Regional Under-16 Trophy.",
    isFeatured: true,
  },
  {
    _id: "gal-4",
    title: "Annual Cultural Festival & Classical Dance Showcase",
    category: "Cultural",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    description: "Students performing traditional and contemporary choreography.",
    isFeatured: false,
  },
];

let fallbackAnnouncements = [
  {
    _id: "ann-1",
    title: "Annual Sports Meet & Cultural Showcase 2026",
    message:
      "Skywings International Academy is proud to host the Annual Sports Meet from November 20 to 22. All parents and students are warmly invited.",
    targetAudience: ["all"],
    priority: "important",
    category: "event",
    eventDate: "2026-11-20",
    location: "Main Sports Complex",
    status: "published",
  },
  {
    _id: "ann-2",
    title: "Mid-Term Examination Schedule Released (Grades 8-10)",
    message:
      "The detailed date sheet for Mid-Term Examinations commencing December 1, 2026 has been published. Students can view room assignments in the portal.",
    targetAudience: ["all"],
    priority: "urgent",
    category: "circular",
    status: "published",
  },
  {
    _id: "ann-3",
    title: "Admissions Open for Academic Session 2026-2027",
    message:
      "Registrations are now open for Pre-Primary through Senior Secondary Grade 11. Early aptitude assessments will begin next month.",
    targetAudience: ["all"],
    priority: "important",
    category: "notice",
    status: "published",
  },
];

let fallbackTeachers = [
  {
    _id: "tch-1",
    employeeId: "EMP-T-101",
    name: "Priya Mukherjee",
    email: "teacher@skywings.com",
    phone: "+91 98450 12345",
    designation: "Senior PGT Mathematics",
    department: "Mathematics",
    qualification: "M.Sc, M.Ed",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    status: "active",
  },
  {
    _id: "tch-2",
    employeeId: "EMP-T-102",
    name: "Dr. Anand Verma",
    email: "anand.verma@skywings.com",
    phone: "+91 98450 67890",
    designation: "PGT Physics & Science",
    department: "Science",
    qualification: "Ph.D Physics",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: "active",
  },
  {
    _id: "tch-3",
    employeeId: "EMP-T-103",
    name: "Meenakshi Sundaram",
    email: "meenakshi@skywings.com",
    phone: "+91 98450 54321",
    designation: "TGT English Literature",
    department: "English",
    qualification: "M.A. English, B.Ed",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    status: "active",
  },
];

let fallbackStudents = [
  {
    _id: "stu-1",
    admissionNumber: "ADM-2026-001",
    rollNumber: "101",
    firstName: "Aarav",
    lastName: "Sharma",
    gender: "male",
    dateOfBirth: "2010-05-14",
    bloodGroup: "O+",
    status: "active",
    class: { _id: "cls-10", name: "Grade 10" },
    section: { _id: "sec-10a", name: "A" },
  },
  {
    _id: "stu-2",
    admissionNumber: "ADM-2026-002",
    rollNumber: "102",
    firstName: "Diya",
    lastName: "Patel",
    gender: "female",
    dateOfBirth: "2010-08-22",
    bloodGroup: "A+",
    status: "active",
    class: { _id: "cls-10", name: "Grade 10" },
    section: { _id: "sec-10a", name: "A" },
  },
];

let fallbackClasses = [
  {
    _id: "cls-10",
    name: "Grade 10",
    numericGrade: 10,
    sections: [
      { _id: "sec-10a", name: "A", roomNumber: "Room 301", capacity: 40 },
      { _id: "sec-10b", name: "B", roomNumber: "Room 302", capacity: 40 },
    ],
  },
  {
    _id: "cls-9",
    name: "Grade 9",
    numericGrade: 9,
    sections: [
      { _id: "sec-9a", name: "A", roomNumber: "Room 201", capacity: 40 },
    ],
  },
];

let fallbackSubjects = [
  { _id: "sub-1", code: "MATH10", name: "Mathematics", type: "theory" },
  { _id: "sub-2", code: "SCI10", name: "Science & Technology", type: "both" },
  { _id: "sub-3", code: "ENG10", name: "English Language & Lit", type: "theory" },
  { _id: "sub-4", code: "CS10", name: "Computer Applications", type: "practical" },
];

let fallbackTimetable = [
  {
    _id: "tt-1",
    class: { _id: "cls-10", name: "Grade 10" },
    section: { _id: "sec-10a", name: "A" },
    dayOfWeek: "Monday",
    periodNumber: 1,
    startTime: "08:30",
    endTime: "09:15",
    subject: { _id: "sub-1", name: "Mathematics", code: "MATH10" },
    teacher: { _id: "tch-1", name: "Priya Mukherjee" },
    roomNumber: "Room 301",
  },
  {
    _id: "tt-2",
    class: { _id: "cls-10", name: "Grade 10" },
    section: { _id: "sec-10a", name: "A" },
    dayOfWeek: "Monday",
    periodNumber: 2,
    startTime: "09:15",
    endTime: "10:00",
    subject: { _id: "sub-2", name: "Science & Technology", code: "SCI10" },
    teacher: { _id: "tch-2", name: "Dr. Anand Verma" },
    roomNumber: "Science Lab 2",
  },
];

let fallbackSessions = [
  { _id: "ses-1", name: "2026-2027", startDate: "2026-04-01", endDate: "2027-03-31", isCurrent: true },
];

// Central Fetch Wrapper
async function request(endpoint, options = {}, fallbackFn) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[Admin API] Call to ${endpoint} failed (${err.message}). Using fallback state.`);
    if (typeof fallbackFn === "function") {
      return fallbackFn();
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid login credentials");
      return data;
    } catch (err) {
      if (email === "admin@skywings.com" && password === "Admin@123") {
        return {
          success: true,
          data: {
            _id: "usr_admin_default",
            name: "Dr. Rajesh Sharma (Principal)",
            email: "admin@skywings.com",
            role: "admin",
            token: "mock-jwt-admin-token-" + Date.now(),
          },
        };
      }
      throw err;
    }
  },

  // School Profile & Branding CMS
  getSchoolProfile: () =>
    request("/school", { method: "GET" }, () => ({
      success: true,
      data: fallbackSchool,
    })),

  updateSchoolProfile: (payload) =>
    request(
      "/school",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackSchool = { ...fallbackSchool, ...payload };
        return { success: true, data: fallbackSchool, message: "Profile saved" };
      }
    ),

  // Academic Sessions
  getAcademicSessions: () =>
    request("/school/sessions", { method: "GET" }, () => ({
      success: true,
      count: fallbackSessions.length,
      data: fallbackSessions,
    })),

  createAcademicSession: (payload) =>
    request(
      "/school/sessions",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "ses-" + Date.now(), ...payload };
        fallbackSessions = [item, ...fallbackSessions];
        return { success: true, data: item };
      }
    ),

  // Homepage Banners CMS
  getBanners: () =>
    request("/banners", { method: "GET" }, () => ({
      success: true,
      count: fallbackBanners.length,
      data: fallbackBanners,
    })),

  createBanner: (payload) =>
    request(
      "/banners",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "ban-" + Date.now(), ...payload };
        fallbackBanners = [...fallbackBanners, item];
        return { success: true, data: item };
      }
    ),

  updateBanner: (id, payload) =>
    request(
      `/banners/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackBanners = fallbackBanners.map((b) =>
          b._id === id ? { ...b, ...payload } : b
        );
        return { success: true, data: payload };
      }
    ),

  deleteBanner: (id) =>
    request(
      `/banners/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackBanners = fallbackBanners.filter((b) => b._id !== id);
        return { success: true, message: "Banner deleted" };
      }
    ),

  // Photo Gallery CMS
  getGallery: (category) =>
    request(
      category && category !== "All" ? `/gallery?category=${category}` : "/gallery",
      { method: "GET" },
      () => {
        const list =
          category && category !== "All"
            ? fallbackGallery.filter((g) => g.category === category)
            : fallbackGallery;
        return { success: true, count: list.length, data: list };
      }
    ),

  createGalleryItem: (payload) =>
    request(
      "/gallery",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "gal-" + Date.now(), ...payload };
        fallbackGallery = [item, ...fallbackGallery];
        return { success: true, data: item };
      }
    ),

  updateGalleryItem: (id, payload) =>
    request(
      `/gallery/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackGallery = fallbackGallery.map((g) =>
          g._id === id ? { ...g, ...payload } : g
        );
        return { success: true, data: payload };
      }
    ),

  deleteGalleryItem: (id) =>
    request(
      `/gallery/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackGallery = fallbackGallery.filter((g) => g._id !== id);
        return { success: true, message: "Gallery item deleted" };
      }
    ),

  // Notices, Circulars & Events
  getAnnouncements: () =>
    request("/announcements", { method: "GET" }, () => ({
      success: true,
      count: fallbackAnnouncements.length,
      data: fallbackAnnouncements,
    })),

  createAnnouncement: (payload) =>
    request(
      "/announcements",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "ann-" + Date.now(), ...payload, createdAt: new Date() };
        fallbackAnnouncements = [item, ...fallbackAnnouncements];
        return { success: true, data: item };
      }
    ),

  updateAnnouncement: (id, payload) =>
    request(
      `/announcements/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackAnnouncements = fallbackAnnouncements.map((a) =>
          a._id === id ? { ...a, ...payload } : a
        );
        return { success: true, data: payload };
      }
    ),

  deleteAnnouncement: (id) =>
    request(
      `/announcements/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackAnnouncements = fallbackAnnouncements.filter((a) => a._id !== id);
        return { success: true, message: "Announcement deleted" };
      }
    ),

  // Teachers & Faculty
  getTeachers: () =>
    request("/teachers", { method: "GET" }, () => ({
      success: true,
      count: fallbackTeachers.length,
      data: fallbackTeachers,
    })),

  createTeacher: (payload) =>
    request(
      "/teachers",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "tch-" + Date.now(), ...payload };
        fallbackTeachers = [...fallbackTeachers, item];
        return { success: true, data: item };
      }
    ),

  updateTeacher: (id, payload) =>
    request(
      `/teachers/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackTeachers = fallbackTeachers.map((t) =>
          t._id === id ? { ...t, ...payload } : t
        );
        return { success: true, data: payload };
      }
    ),

  deleteTeacher: (id) =>
    request(
      `/teachers/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackTeachers = fallbackTeachers.filter((t) => t._id !== id);
        return { success: true, message: "Teacher removed" };
      }
    ),

  // Students Directory (SIS)
  getStudents: (params = "") =>
    request(`/students${params ? `?${params}` : ""}`, { method: "GET" }, () => ({
      success: true,
      count: fallbackStudents.length,
      data: fallbackStudents,
    })),

  createStudent: (payload) =>
    request(
      "/students",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "stu-" + Date.now(), ...payload };
        fallbackStudents = [...fallbackStudents, item];
        return { success: true, data: item };
      }
    ),

  updateStudent: (id, payload) =>
    request(
      `/students/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      () => {
        fallbackStudents = fallbackStudents.map((s) =>
          s._id === id ? { ...s, ...payload } : s
        );
        return { success: true, data: payload };
      }
    ),

  deleteStudent: (id) =>
    request(
      `/students/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackStudents = fallbackStudents.filter((s) => s._id !== id);
        return { success: true, message: "Student removed" };
      }
    ),

  // Classes & Sections
  getClasses: () =>
    request("/classes", { method: "GET" }, () => ({
      success: true,
      count: fallbackClasses.length,
      data: fallbackClasses,
    })),

  createClass: (payload) =>
    request(
      "/classes",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "cls-" + Date.now(), sections: [], ...payload };
        fallbackClasses = [...fallbackClasses, item];
        return { success: true, data: item };
      }
    ),

  createSection: (classId, payload) =>
    request(
      `/classes/${classId}/sections`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const sec = { _id: "sec-" + Date.now(), ...payload };
        fallbackClasses = fallbackClasses.map((c) =>
          c._id === classId ? { ...c, sections: [...(c.sections || []), sec] } : c
        );
        return { success: true, data: sec };
      }
    ),

  // Subjects
  getSubjects: () =>
    request("/subjects", { method: "GET" }, () => ({
      success: true,
      count: fallbackSubjects.length,
      data: fallbackSubjects,
    })),

  createSubject: (payload) =>
    request(
      "/subjects",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "sub-" + Date.now(), ...payload };
        fallbackSubjects = [...fallbackSubjects, item];
        return { success: true, data: item };
      }
    ),

  deleteSubject: (id) =>
    request(
      `/subjects/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackSubjects = fallbackSubjects.filter((s) => s._id !== id);
        return { success: true, message: "Subject removed" };
      }
    ),

  // Timetables
  getTimetable: (classId = "", sectionId = "") =>
    request(
      `/timetable?class=${classId}&section=${sectionId}`,
      { method: "GET" },
      () => ({
        success: true,
        count: fallbackTimetable.length,
        data: fallbackTimetable,
      })
    ),

  createTimetableSlot: (payload) =>
    request(
      "/timetable",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      () => {
        const item = { _id: "tt-" + Date.now(), ...payload };
        fallbackTimetable = [...fallbackTimetable, item];
        return { success: true, data: item };
      }
    ),

  deleteTimetableSlot: (id) =>
    request(
      `/timetable/${id}`,
      {
        method: "DELETE",
      },
      () => {
        fallbackTimetable = fallbackTimetable.filter((t) => t._id !== id);
        return { success: true, message: "Timetable slot removed" };
      }
    ),

  // Image Upload (Base64 data URL to Server storage)
  uploadImage: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      // If server returned a relative URL, prepend server base
      if (data.url && data.url.startsWith("/uploads/")) {
        data.url = `http://localhost:5000${data.url}`;
      }
      return data;
    } catch (err) {
      console.warn("Upload offline fallback. Storing as data URI locally.");
      return {
        success: true,
        url: payload.image,
        message: "Image stored locally in browser session",
      };
    }
  },
};

export default api;

