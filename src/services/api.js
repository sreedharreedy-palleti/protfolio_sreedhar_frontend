export const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://protfolio-sreedhar.onrender.com'
).replace(/\/+$/, '');

export const FALLBACK_ABOUT = {
  title: 'About Me',
  subtitle: 'My introduction',
  sectionBadge: 'Profile & Background',
  sectionTitle: 'About Me',
  sectionSubtitle: 'My introduction',
  cardBadge: 'ENGINEERING PHILOSOPHY',
  headline: 'Bridging engineering precision with human-centric interfaces',
  text: 'Senior Software Engineer with 6+ years of experience building scalable cloud-native applications, data platforms, and analytics solutions. I specialize in Java, Spring Boot, Python, React, Azure, Kubernetes, and Apache Superset, with a strong interest in open-source technologies, AI-powered products, and data-driven innovation.',
  stats: [
    { value: '06+', label: 'Years experience' },
    { value: '05', label: 'Companies Work' },
    { value: '15+', label: 'Technical Skills' },
  ],
  cv: {
    url: '',
    data: '',
    fileName: '',
    fileSize: '',
    uploadedAt: '',
  },
  keyPoints: [
    'Specialized in CSE & Data Science fundamentals',
    'Extensive real-world experience across frontend and backend services',
    'Passionate about automated testing, CI/CD, and maintainable codebases',
  ],
  location: 'Andhra Pradesh, India',
  email: 'palletisreedharreddy82@gmail.com',
  availability: 'Open for Roles',
};

// Fallback seed data in case backend server is temporarily uncontactable
export const FALLBACK_CONTENT = {
  hero: {
    badge: 'Full-Stack Developer',
    heading: "HELLO ! I'm Venkata Sreedhar Reddy Palleti",
    subheading: '',
    avatarUrl: '',
  },
  about: { ...FALLBACK_ABOUT },
  skills: [
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Python',
    'Tailwind CSS',
    'Docker',
    'Kubernetes'
  ],
  contactInfo: {
    email: 'palletisreedharreddy82@gmail.com',
    phone: '+91-8885439267',
    location: 'Andhra Pradesh, India',
    photoUrl: '',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
    githubUrl: 'https://github.com',
    facebookUrl: 'https://facebook.com',
    twitterUrl: 'https://twitter.com'
  },
  education: [
    {
      degree: 'B. Tech in CSE(Data Science)',
      institution: 'Rajeev Gandhi Memorial College of Engineering and Technology',
      duration: '2023 - 2027'
    },
    {
      degree: 'Higher Secondary',
      institution: 'Narayana Junior College, Nellore',
      duration: '2021 - 2023'
    },
    {
      degree: 'Secondary (SSC)',
      institution: 'Usha Kiran High School, Kadapa',
      duration: '2021'
    }
  ]
};

export const FALLBACK_PROJECTS = [
  {
    _id: 'seed-1',
    title: 'AI Resume Analyzer & Proctoring Engine',
    content: 'ATS resume scoring paired with an automated proctoring microservice.',
    description: 'ATS resume scoring paired with an automated proctoring microservice.',
    liveDemo: 'https://example.com',
    live: 'https://example.com',
    tech: ['React', 'Node.js', 'FastAPI', 'Tailwind CSS'],
    github: 'https://github.com'
  },
  {
    _id: 'seed-2',
    title: 'Voice Emotion & Sentiment Tracker',
    content: 'Real-time emotion detection web app using speech processing models.',
    description: 'Real-time emotion detection web app using speech processing models.',
    liveDemo: 'https://example.com',
    live: 'https://example.com',
    tech: ['React', 'Express', 'Python', 'Web Audio API'],
    github: 'https://github.com'
  },
  {
    _id: 'seed-3',
    title: 'Paytm Recharge & Utility Portal',
    content: 'Full frontend checkout flow simulating mobile and utility bill recharges.',
    description: 'Full frontend checkout flow simulating mobile and utility bill recharges.',
    liveDemo: 'https://example.com',
    live: 'https://example.com',
    tech: ['React', 'Vite', 'Tailwind CSS'],
    github: 'https://github.com'
  }
];

export const FALLBACK_EXPERIENCES = [
  {
    _id: 'seed-exp-1',
    company: 'GE Vernova',
    role: 'Sr Software Engineer',
    duration: 'Oct 2025 – Present',
    isCurrent: true,
    bannerBg: '#06262a',
    logoType: 'ge',
    logoText: 'GE VERNOVA',
    logoUrl: '',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      website: 'https://gevernova.com'
    },
    order: 1
  },
  {
    _id: 'seed-exp-2',
    company: 'Enterprise Cloud',
    role: 'Full-Stack Software Engineer',
    duration: '2023 – 2025',
    isCurrent: false,
    bannerBg: '#090e1c',
    logoType: 'cloud',
    logoText: 'CLOUD TECH',
    logoUrl: '',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      website: 'https://aws.amazon.com'
    },
    order: 2
  },
  {
    _id: 'seed-exp-3',
    company: 'Digital Innovation Labs',
    role: 'Frontend & Systems Developer',
    duration: '2022 – 2023',
    isCurrent: false,
    bannerBg: '#090e1c',
    logoType: 'atom',
    logoText: 'DIGITAL LABS',
    logoUrl: '',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      website: 'https://github.com'
    },
    order: 3
  }
];

// ==================== AUTH & TOKEN HELPERS ====================

export const getStoredToken = () => {
  return localStorage.getItem('portfolio_admin_token') || '';
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('portfolio_admin_token', token);
  } else {
    localStorage.removeItem('portfolio_admin_token');
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem('portfolio_admin_token');
  localStorage.removeItem('portfolio_admin_user');
};

export const getStoredSecret = () => {
  return localStorage.getItem('portfolio_admin_secret') || 'myadminsecret123';
};

export const setStoredSecret = (secret) => {
  if (secret) {
    localStorage.setItem('portfolio_admin_secret', secret);
  }
};

export const getAuthHeaders = (customSecret = null) => {
  const headers = {};
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const secret = customSecret || getStoredSecret();
  if (secret) {
    headers['x-admin-secret'] = secret;
  }
  return headers;
};

// ==================== ADMIN AUTHENTICATION & LOCKOUT APIS ====================

// GET /api/auth/status
export const getAdminAuthStatus = async () => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/auth/status`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API] Auth status check fallback:', err.message);
    return {
      isLocked: false,
      remainingAttempts: 5,
      lockoutRemainingSeconds: 0,
      authenticated: Boolean(getStoredToken()),
      error: err.message,
    };
  }
};

// POST /api/auth/login
export const loginAdmin = async (credentials) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || 'Authentication failed');
    error.isLocked = Boolean(data.isLocked);
    error.lockoutRemainingSeconds = data.lockoutRemainingSeconds || 0;
    error.lockedUntil = data.lockedUntil || null;
    error.remainingAttempts = data.remainingAttempts;
    error.status = res.status;
    throw error;
  }

  if (data.token) {
    setStoredToken(data.token);
    if (data.admin) {
      localStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin));
    }
  }

  return data;
};

// POST /api/auth/verify
export const verifyAdminSession = async () => {
  const token = getStoredToken();
  if (!token) return { valid: false };

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      clearStoredToken();
      return { valid: false };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

// POST /api/auth/logout
export const logoutAdmin = async () => {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearStoredToken();
  }
};

// POST /api/auth/unlock (Emergency master unlock)
export const emergencyUnlockAdmin = async (masterKey) => {
  const res = await fetch(`${API_BASE}/api/auth/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ masterKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unlock failed');
  return data;
};

// ==================== CORE ENDPOINTS ====================

// 1. Health Check -> GET /api/health
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Health check returned ${res.status}`);
    const data = await res.json();
    return { online: true, data };
  } catch (err) {
    try {
      const res = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { online: true, data };
      }
    } catch {
      // ignore
    }
    return { online: false, error: err.message };
  }
};

// 2. Portfolio Content -> GET /api/content
export const fetchPortfolioContent = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/content`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Failed to fetch content: ${res.status}`);
    const data = await res.json();
    return {
      hero: { ...FALLBACK_CONTENT.hero, ...(data.hero || {}) },
      about: { ...FALLBACK_CONTENT.about, ...(data.about || {}) },
      skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : FALLBACK_CONTENT.skills,
      contactInfo: { ...FALLBACK_CONTENT.contactInfo, ...(data.contactInfo || {}) },
      education: Array.isArray(data.education) && data.education.length > 0 ? data.education : FALLBACK_CONTENT.education,
    };
  } catch (err) {
    console.warn('[API] Content fetch fallback active:', err.message);
    try {
      const res = await fetch('/api/content', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return {
          hero: { ...FALLBACK_CONTENT.hero, ...(data.hero || {}) },
          about: { ...FALLBACK_CONTENT.about, ...(data.about || {}) },
          skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : FALLBACK_CONTENT.skills,
          contactInfo: { ...FALLBACK_CONTENT.contactInfo, ...(data.contactInfo || {}) },
          education: Array.isArray(data.education) && data.education.length > 0 ? data.education : FALLBACK_CONTENT.education,
        };
      }
    } catch {
      // ignore
    }
    return FALLBACK_CONTENT;
  }
};

// 3. Update Portfolio Content -> PUT /api/content (Requires Admin Auth)
export const updatePortfolioContent = async (contentData, secret = null) => {
  const url = `${API_BASE}/api/content`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(contentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update content.');
  return data;
};

// ==================== ABOUT SECTION CRUD OPERATIONS ====================

// GET /api/about (Public)
export const fetchAboutData = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/about`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      ...FALLBACK_ABOUT,
      ...(data || {}),
      stats: Array.isArray(data?.stats) && data.stats.length > 0 ? data.stats : FALLBACK_ABOUT.stats,
      cv: { ...FALLBACK_ABOUT.cv, ...(data?.cv || {}) },
      keyPoints: Array.isArray(data?.keyPoints) && data.keyPoints.length > 0 ? data.keyPoints : FALLBACK_ABOUT.keyPoints,
    };
  } catch (err) {
    console.warn('[API] About fetch fallback active:', err.message);
    try {
      const res = await fetch('/api/about', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return {
          ...FALLBACK_ABOUT,
          ...(data || {}),
          stats: Array.isArray(data?.stats) && data.stats.length > 0 ? data.stats : FALLBACK_ABOUT.stats,
          cv: { ...FALLBACK_ABOUT.cv, ...(data?.cv || {}) },
          keyPoints: Array.isArray(data?.keyPoints) && data.keyPoints.length > 0 ? data.keyPoints : FALLBACK_ABOUT.keyPoints,
        };
      }
    } catch {
      // ignore
    }
    return FALLBACK_ABOUT;
  }
};

// PUT /api/about (Requires Admin Auth)
export const updateAboutData = async (aboutData, secret = null) => {
  const url = `${API_BASE}/api/about`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(aboutData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update about section.');
  return data;
};

// POST /api/about (Requires Admin Auth)
export const createAboutData = async (aboutData, secret = null) => {
  const url = `${API_BASE}/api/about`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(aboutData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create about section.');
  return data;
};

// POST /api/about/cv (Upload CV / Resume to MongoDB)
export const uploadAboutCv = async (cvPayload, secret = null) => {
  const url = `${API_BASE}/api/about/cv`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(cvPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload CV.');
  return data;
};

// DELETE /api/about/cv (Remove CV from MongoDB)
export const deleteAboutCv = async (secret = null) => {
  const url = `${API_BASE}/api/about/cv`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete CV.');
  return data;
};

// POST /api/about/keypoint (Requires Admin Auth)
export const addAboutKeyPoint = async (keyPoint, secret = null) => {
  const url = `${API_BASE}/api/about/keypoint`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify({ keyPoint })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add key point.');
  return data;
};

// DELETE /api/about/keypoint/:index (Requires Admin Auth)
export const deleteAboutKeyPoint = async (index, secret = null) => {
  const url = `${API_BASE}/api/about/keypoint/${index}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete key point.');
  return data;
};

// DELETE /api/about (Requires Admin Auth) - Resets about to defaults
export const resetAboutData = async (secret = null) => {
  const url = `${API_BASE}/api/about`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset about section.');
  return data;
};

// 4. Projects List -> GET /api/projects
export const fetchProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_PROJECTS;
  } catch (err) {
    console.warn('[API] Projects fetch fallback active:', err.message);
    try {
      const res = await fetch('/api/projects', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return FALLBACK_PROJECTS;
  }
};

// 5. Create Project -> POST /api/projects (Requires Admin Auth)
export const createProject = async (projectData, secret = null) => {
  const url = `${API_BASE}/api/projects`;
  const content = projectData.content !== undefined ? projectData.content : projectData.description;
  const liveDemo = projectData.liveDemo !== undefined ? projectData.liveDemo : projectData.live;

  const payload = {
    ...projectData,
    title: projectData.title,
    content: content || '',
    description: content || '',
    liveDemo: liveDemo || '',
    live: liveDemo || '',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create project.');
  return data;
};

// 6. Delete Project -> DELETE /api/projects/:id (Requires Admin Auth)
export const deleteProject = async (projectId, secret = null) => {
  const url = `${API_BASE}/api/projects/${projectId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete project.');
  return data;
};

// 6.1 Update Project -> PUT /api/projects/:id (Requires Admin Auth)
export const updateProject = async (projectId, projectData, secret = null) => {
  const url = `${API_BASE}/api/projects/${projectId}`;
  const content = projectData.content !== undefined ? projectData.content : projectData.description;
  const liveDemo = projectData.liveDemo !== undefined ? projectData.liveDemo : projectData.live;

  const payload = {
    ...projectData,
  };
  if (projectData.title !== undefined) payload.title = projectData.title;
  if (content !== undefined) {
    payload.content = content;
    payload.description = content;
  }
  if (liveDemo !== undefined) {
    payload.liveDemo = liveDemo;
    payload.live = liveDemo;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update project.');
  return data;
};

// 7. Dispatch Contact Message -> POST /api/contact or /api/messages
export const sendContactMessage = async (payload) => {
  const url = `${API_BASE}/api/contact`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to dispatch message.');
  return data;
};

// 8. Fetch Submitted Messages -> GET /api/messages (Requires Admin Auth)
export const fetchMessages = async (secret = null) => {
  const url = `${API_BASE}/api/messages`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch messages.');
  return data;
};

// 9. Delete Submitted Message -> DELETE /api/messages/:id (Requires Admin Auth)
export const deleteMessage = async (messageId, secret = null) => {
  const url = `${API_BASE}/api/messages/${messageId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete message.');
  return data;
};

// ==================== WORK EXPERIENCE ENDPOINTS ====================

// 10. Experiences List -> GET /api/experience
export const fetchExperiences = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/experience`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Failed to fetch experiences: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_EXPERIENCES;
  } catch (err) {
    console.warn('[API] Experiences fetch fallback active:', err.message);
    try {
      const res = await fetch('/api/experience', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return FALLBACK_EXPERIENCES;
  }
};

// 11. Create Experience -> POST /api/experience (Requires Admin Auth)
export const createExperience = async (expData, secret = null) => {
  const url = `${API_BASE}/api/experience`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(expData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create experience.');
  return data;
};

// 12. Update Experience -> PUT /api/experience/:id (Requires Admin Auth)
export const updateExperience = async (expId, expData, secret = null) => {
  const url = `${API_BASE}/api/experience/${expId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(secret),
    },
    body: JSON.stringify(expData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update experience.');
  return data;
};

// 13. Delete Experience -> DELETE /api/experience/:id (Requires Admin Auth)
export const deleteExperience = async (expId, secret = null) => {
  const url = `${API_BASE}/api/experience/${expId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(secret),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete experience.');
  return data;
};
