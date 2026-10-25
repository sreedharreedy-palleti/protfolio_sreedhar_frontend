import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Database,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Code,
  CheckCircle,
  AlertCircle,
  Shield,
  ShieldAlert,
  ExternalLink,
  Server,
  Layers,
  UserCheck,
  Send,
  Save,
  Check,
  X,
  Sparkles,
  Activity,
  Upload,
  Image as ImageIcon,
  Link2,
  User,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Clock,
  LogOut,
  Briefcase,
  Globe,
  Phone,
  RotateCcw,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';
import {
  checkBackendHealth,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchPortfolioContent,
  updatePortfolioContent,
  fetchAboutData,
  updateAboutData,
  createAboutData,
  uploadAboutCv,
  deleteAboutCv,
  addAboutKeyPoint,
  deleteAboutKeyPoint,
  resetAboutData,
  FALLBACK_ABOUT,
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getAdminAuthStatus,
  loginAdmin,
  verifyAdminSession,
  logoutAdmin,
  emergencyUnlockAdmin,
  API_BASE,
} from '../services/api';
import { parseProjectPoints } from '../utils/projectHelpers';
import defaultHeroAvatar from '../assets/sreedhar_photo.jpg';
import defaultContactPhoto from '../assets/sreedhar_photo.jpg';
import brillonLogo from '../assets/Brillon_logo.png';
import TechLogo from '../components/common/TechLogos';
import { LinkedinIcon, InstagramIcon, GithubIcon, FacebookIcon, TwitterIcon } from '../components/common/SocialIcons';
import './AdminPage.css';

export default function AdminPage({ onNavigateHome }) {
  // Authentication & Security Gate States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState('admin');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Lockout States
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  // Master Unlock States
  const [showMasterUnlock, setShowMasterUnlock] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Dashboard Tabs & Form States
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'content' | 'experience'
  const [adminSecret, setAdminSecret] = useState(
    () => localStorage.getItem('portfolio_admin_secret') || 'myadminsecret123'
  );
  const [isSecretSaved, setIsSecretSaved] = useState(true);

  // Live state from Backend
  const [backendHealth, setBackendHealth] = useState({ online: false, data: null });
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [content, setContent] = useState(null);
  const [aboutData, setAboutData] = useState(FALLBACK_ABOUT);

  // Loading states
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotification, setStatusNotification] = useState({ type: '', text: '' });

  // Project Form (Add / Edit)
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    content: '',
    liveDemo: '',
  });

  // Experience Form (Add / Edit)
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    role: '',
    duration: '',
    isCurrent: false,
    bannerBg: '#06262a',
    logoType: 'ge',
    logoText: '',
    logoUrl: '',
    instagram: '',
    linkedin: '',
    website: '',
    order: 0,
  });

  // Content Editor Form
  const [contentForm, setContentForm] = useState({
    badge: '',
    heading: '',
    subheading: '',
    avatarUrl: '',
    chips: [
      { text: 'Cloud Ready', icon: 'sparkles', position: 'top-right', animate: true },
    ],
    aboutText: '',
    skills: [],
    email: '',
    phone: '',
    photoUrl: '',
    location: '',
    linkedinUrl: '',
    instagramUrl: '',
    githubUrl: '',
    facebookUrl: '',
    twitterUrl: '',
  });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillLogoUrl, setNewSkillLogoUrl] = useState('');
  const [skillLogoUploadMode, setSkillLogoUploadMode] = useState('local'); // 'local' | 'url'
  const [skillLogoFileName, setSkillLogoFileName] = useState('');
  const [editingSkillIdx, setEditingSkillIdx] = useState(null);
  const skillLogoFileInputRef = useRef(null);

  // Hero Chips / Text Boxes CRUD States
  const [newChipForm, setNewChipForm] = useState({
    text: '',
    icon: 'sparkles',
    position: 'top-right',
    animate: true,
  });
  const [editingChipIdx, setEditingChipIdx] = useState(null);

  // About Section Form & CRUD States
  const [aboutForm, setAboutForm] = useState(FALLBACK_ABOUT);
  const [newKeyPointInput, setNewKeyPointInput] = useState('');
  const [editingKeyPointIdx, setEditingKeyPointIdx] = useState(null);
  const [editingKeyPointText, setEditingKeyPointText] = useState('');

  // Local Image Upload States (Hero Avatar)
  const [avatarUploadMode, setAvatarUploadMode] = useState('local'); // 'local' | 'url'
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarFileSize, setAvatarFileSize] = useState('');
  const avatarFileInputRef = useRef(null);

  // Local Image Upload States (Contact Portrait Photo)
  const [contactPhotoUploadMode, setContactPhotoUploadMode] = useState('local'); // 'local' | 'url'
  const [contactPhotoFileName, setContactPhotoFileName] = useState('');
  const [contactPhotoFileSize, setContactPhotoFileSize] = useState('');
  const contactPhotoFileInputRef = useRef(null);

  // Local Image Upload States (Work Experience Logo / Banner)
  const [experienceLogoUploadMode, setExperienceLogoUploadMode] = useState('local'); // 'local' | 'url'
  const [experienceLogoFileName, setExperienceLogoFileName] = useState('');
  const [experienceLogoFileSize, setExperienceLogoFileSize] = useState('');
  const experienceLogoFileInputRef = useRef(null);

  // CV / Resume Upload States
  const [cvUploadMode, setCvUploadMode] = useState('local'); // 'local' | 'url'
  const [cvFileName, setCvFileName] = useState('');
  const [cvFileSize, setCvFileSize] = useState('');
  const cvFileInputRef = useRef(null);

  // Process and optimize image from local computer
  const handleLocalImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Optimize on canvas to max 800x800 for high resolution and fast loading
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setContentForm((prev) => ({
          ...prev,
          avatarUrl: optimizedDataUrl,
        }));
        setAvatarFileName(file.name);
        setAvatarFileSize((file.size / 1024).toFixed(1) + ' KB');
        showNotification('success', `Image "${file.name}" loaded from your computer! Click Save below to apply.`);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Process and optimize contact portrait image (.png, .jpg, .jpeg, .webp)
  const handleLocalContactPhotoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // High quality portrait optimization (max 1200px)
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const optimizedDataUrl = canvas.toDataURL(mime, 0.90);
        setContentForm((prev) => ({
          ...prev,
          photoUrl: optimizedDataUrl,
        }));
        setContactPhotoFileName(file.name);
        setContactPhotoFileSize((file.size / 1024).toFixed(1) + ' KB');
        showNotification('success', `Contact portrait "${file.name}" loaded! Click Save below to apply.`);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Process and optimize work experience company logo / banner image
  const handleLocalExperienceLogoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const optimizedDataUrl = canvas.toDataURL(mime, 0.90);
        setExperienceForm((prev) => ({
          ...prev,
          logoUrl: optimizedDataUrl,
          logoType: 'custom',
        }));
        setExperienceLogoFileName(file.name);
        setExperienceLogoFileSize((file.size / 1024).toFixed(1) + ' KB');
        showNotification('success', `Experience image "${file.name}" loaded! Click Save Experience below to apply.`);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Process and optimize skill logo (SVG, PNG, WebP, JPG)
  const handleLocalSkillLogoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file (.svg, .png, .jpg, .webp)');
      return;
    }

    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewSkillLogoUrl(e.target.result);
        setSkillLogoFileName(file.name);
        showNotification('success', `SVG logo "${file.name}" loaded!`);
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 256;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mime, 0.95);
        setNewSkillLogoUrl(dataUrl);
        setSkillLogoFileName(file.name);
        showNotification('success', `Skill logo "${file.name}" loaded!`);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Save secret to localStorage
  const handleSecretChange = (val) => {
    setAdminSecret(val);
    localStorage.setItem('portfolio_admin_secret', val);
    setIsSecretSaved(false);
    setTimeout(() => setIsSecretSaved(true), 1200);
  };

  const showNotification = (type, text) => {
    setStatusNotification({ type, text });
    setTimeout(() => {
      setStatusNotification({ type: '', text: '' });
    }, 5000);
  };

  // Helper to format remaining seconds into MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check backend lockout status and existing session token
  const checkAuthAndLockout = useCallback(async () => {
    try {
      const status = await getAdminAuthStatus();
      setIsLockedOut(Boolean(status.isLocked));
      setRemainingAttempts(
        typeof status.remainingAttempts === 'number' ? status.remainingAttempts : 5
      );
      if (status.lockoutRemainingSeconds) {
        setLockoutRemainingSec(status.lockoutRemainingSeconds);
      } else {
        setLockoutRemainingSec(0);
      }

      // Verify if token exists and is valid
      if (status.authenticated) {
        setIsAuthenticated(true);
        if (status.admin?.username) setAdminUser(status.admin.username);
      } else {
        const verifyRes = await verifyAdminSession();
        if (verifyRes.valid) {
          setIsAuthenticated(true);
          if (verifyRes.admin?.username) setAdminUser(verifyRes.admin.username);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.warn('Initial auth check warning:', err.message);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // Run auth check on initial component mount
  useEffect(() => {
    checkAuthAndLockout();
  }, [checkAuthAndLockout]);

  // Live countdown timer for security lockout
  useEffect(() => {
    if (!isLockedOut || lockoutRemainingSec <= 0) return;

    const timer = setInterval(() => {
      setLockoutRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          checkAuthAndLockout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLockedOut, lockoutRemainingSec, checkAuthAndLockout]);

  // Handle Admin Login submission with Lockout handling
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPassword.trim()) {
      setLoginError('Password / Admin Secret is required to authenticate.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await loginAdmin({
        username: loginUsername.trim(),
        password: loginPassword.trim(),
      });

      setIsAuthenticated(true);
      setAdminUser(res.admin?.username || loginUsername || 'admin');
      showNotification('success', 'Admin session authenticated successfully. Full system unlocked.');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message || 'Authentication failed.');
      if (err.isLocked) {
        setIsLockedOut(true);
        setLockoutRemainingSec(err.lockoutRemainingSeconds || 900);
        setRemainingAttempts(0);
      } else if (typeof err.remainingAttempts === 'number') {
        setRemainingAttempts(err.remainingAttempts);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setLoginPassword('');
    setLoginError('');
    showNotification('info', 'Logged out of admin session successfully.');
    checkAuthAndLockout();
  };

  // Handle Emergency Master Unlock
  const handleMasterUnlock = async (e) => {
    e.preventDefault();
    if (!masterKeyInput.trim()) return;

    setIsUnlocking(true);
    try {
      await emergencyUnlockAdmin(masterKeyInput.trim());
      setIsLockedOut(false);
      setLockoutRemainingSec(0);
      setRemainingAttempts(5);
      setLoginError('');
      setShowMasterUnlock(false);
      setMasterKeyInput('');
      showNotification('success', 'Lockout cleared! You can now proceed to log in.');
    } catch (err) {
      showNotification('error', `Unlock failed: ${err.message}`);
    } finally {
      setIsUnlocking(false);
    }
  };

  // Load all initial data from backend APIs
  const loadData = useCallback(async () => {
    setIsLoadingAll(true);
    try {
      const [healthRes, projectsRes, contentRes, expRes, aboutRes] = await Promise.allSettled([
        checkBackendHealth(),
        fetchProjects(),
        fetchPortfolioContent(),
        fetchExperiences(),
        fetchAboutData(),
      ]);

      if (healthRes.status === 'fulfilled') {
        setBackendHealth(healthRes.value);
      }

      if (projectsRes.status === 'fulfilled' && projectsRes.value) {
        setProjects(projectsRes.value);
      }

      if (expRes.status === 'fulfilled' && expRes.value) {
        setExperiences(expRes.value);
      }

      if (contentRes.status === 'fulfilled' && contentRes.value) {
        setContent(contentRes.value);
        setContentForm({
          badge: contentRes.value.hero?.badge || '',
          heading: contentRes.value.hero?.heading || '',
          subheading: contentRes.value.hero?.subheading || '',
          avatarUrl: contentRes.value.hero?.avatarUrl || '',
          chips:
            Array.isArray(contentRes.value.hero?.chips) && contentRes.value.hero.chips.length > 0
              ? contentRes.value.hero.chips
              : [
                  { text: 'Cloud Ready', icon: 'sparkles', position: 'top-right', animate: true },
                ],
          aboutText: contentRes.value.about?.text || '',
          skills: Array.isArray(contentRes.value.skills) ? contentRes.value.skills : [],
          email: contentRes.value.contactInfo?.email || '',
          phone: contentRes.value.contactInfo?.phone || '',
          photoUrl: contentRes.value.contactInfo?.photoUrl || '',
          location: contentRes.value.contactInfo?.location || '',
          linkedinUrl: contentRes.value.contactInfo?.linkedinUrl || '',
          instagramUrl: contentRes.value.contactInfo?.instagramUrl || '',
          githubUrl: contentRes.value.contactInfo?.githubUrl || '',
          facebookUrl: contentRes.value.contactInfo?.facebookUrl || '',
          twitterUrl: contentRes.value.contactInfo?.twitterUrl || '',
        });
      }

      if (aboutRes.status === 'fulfilled' && aboutRes.value) {
        const ab = aboutRes.value;
        setAboutData(ab);
        setAboutForm({
          title: ab.title || FALLBACK_ABOUT.title,
          subtitle: ab.subtitle || FALLBACK_ABOUT.subtitle,
          sectionBadge: ab.sectionBadge || FALLBACK_ABOUT.sectionBadge,
          sectionTitle: ab.sectionTitle || ab.title || FALLBACK_ABOUT.sectionTitle,
          sectionSubtitle: ab.sectionSubtitle || ab.subtitle || FALLBACK_ABOUT.sectionSubtitle,
          cardBadge: ab.cardBadge || FALLBACK_ABOUT.cardBadge,
          headline: ab.headline || FALLBACK_ABOUT.headline,
          text: ab.text || FALLBACK_ABOUT.text,
          stats: Array.isArray(ab.stats) && ab.stats.length > 0 ? ab.stats : FALLBACK_ABOUT.stats,
          cv: ab.cv || FALLBACK_ABOUT.cv,
          keyPoints: Array.isArray(ab.keyPoints) ? ab.keyPoints : FALLBACK_ABOUT.keyPoints,
          location: ab.location || FALLBACK_ABOUT.location,
          email: ab.email || FALLBACK_ABOUT.email,
          availability: ab.availability || FALLBACK_ABOUT.availability,
        });
        if (ab.cv?.fileName) {
          setCvFileName(ab.cv.fileName);
          setCvFileSize(ab.cv.fileSize || '');
        }
      }

    } catch (err) {
      showNotification('error', `Sync notice: ${err.message}`);
    } finally {
      setIsLoadingAll(false);
    }
  }, [adminSecret]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handle Project Form Submission (Create or Update)
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.content.trim()) {
      showNotification('error', 'Project Title and Content are required.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: projectForm.title.trim(),
      content: projectForm.content.trim(),
      liveDemo: projectForm.liveDemo.trim(),
    };

    try {
      if (isEditingProject && editingProjectId) {
        await updateProject(editingProjectId, payload, adminSecret);
        showNotification('success', `Updated project "${payload.title}" successfully via PUT /api/projects/${editingProjectId}`);
      } else {
        await createProject(payload, adminSecret);
        showNotification('success', `Created project "${payload.title}" successfully via POST /api/projects`);
      }

      // Reset form
      setProjectForm({ title: '', content: '', liveDemo: '' });
      setIsEditingProject(false);
      setEditingProjectId(null);

      // Re-fetch projects from API
      const updatedProjects = await fetchProjects();
      setProjects(updatedProjects);
    } catch (err) {
      showNotification('error', `API Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProjectClick = (p) => {
    setIsEditingProject(true);
    setEditingProjectId(p._id);
    setProjectForm({
      title: p.title || '',
      content: p.content || p.description || '',
      liveDemo: p.liveDemo || p.live || '',
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCancelEditProject = () => {
    setIsEditingProject(false);
    setEditingProjectId(null);
    setProjectForm({ title: '', content: '', liveDemo: '' });
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsSubmitting(true);
    try {
      await deleteProject(id, adminSecret);
      showNotification('success', `Project "${title}" deleted via DELETE /api/projects/${id}`);
      const updated = await fetchProjects();
      setProjects(updated);
    } catch (err) {
      showNotification('error', `Delete failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== WORK EXPERIENCE CRUD HANDLERS ====================
  const handleSubmitExperience = async (e) => {
    e.preventDefault();
    const company = (experienceForm.company || '').trim();
    const role = (experienceForm.role || '').trim();
    const duration = (experienceForm.duration || '').trim();

    if (!company || !role || !duration) {
      showNotification('error', 'Company, role, and duration are required.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      company,
      role,
      duration,
      isCurrent: Boolean(experienceForm.isCurrent),
      bannerBg: experienceForm.bannerBg || '#06262a',
      logoType: experienceForm.logoType || 'brillon',
      logoText: (experienceForm.logoText || '').trim() || company,
      logoUrl: (experienceForm.logoUrl || '').trim(),
      socials: {
        instagram: (experienceForm.instagram || '').trim(),
        linkedin: (experienceForm.linkedin || '').trim(),
        website: (experienceForm.website || '').trim(),
      },
      order: Number(experienceForm.order) || 0,
    };

    try {
      if (isEditingExperience && editingExperienceId) {
        await updateExperience(editingExperienceId, payload, adminSecret);
        showNotification('success', `Experience at "${company}" updated via PUT /api/experience/${editingExperienceId}!`);
      } else {
        await createExperience(payload, adminSecret);
        showNotification('success', `Experience at "${company}" created via POST /api/experience!`);
      }
      setIsEditingExperience(false);
      setEditingExperienceId(null);
      setExperienceForm({
        company: '',
        role: '',
        duration: '',
        isCurrent: false,
        bannerBg: '#06262a',
        logoType: 'brillon',
        logoText: '',
        logoUrl: '',
        instagram: '',
        linkedin: '',
        website: '',
        order: 0,
      });
      setExperienceLogoFileName('');
      setExperienceLogoFileSize('');
      const updated = await fetchExperiences();
      setExperiences(updated);
    } catch (err) {
      showNotification('error', `Experience operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExperience = (exp) => {
    if (!exp) return;
    const expId = exp._id || exp.id;
    setIsEditingExperience(true);
    setEditingExperienceId(expId);
    setActiveTab('experience');
    setExperienceForm({
      company: exp.company || '',
      role: exp.role || '',
      duration: exp.duration || '',
      isCurrent: Boolean(exp.isCurrent),
      bannerBg: exp.bannerBg || '#06262a',
      logoType: exp.logoType || 'brillon',
      logoText: exp.logoText || exp.company || '',
      logoUrl: exp.logoUrl || '',
      instagram: exp.socials?.instagram || '',
      linkedin: exp.socials?.linkedin || '',
      website: exp.socials?.website || '',
      order: typeof exp.order === 'number' ? exp.order : 0,
    });
    setExperienceLogoFileName('');
    setExperienceLogoFileSize('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEditExperience = () => {
    setIsEditingExperience(false);
    setEditingExperienceId(null);
    setExperienceLogoFileName('');
    setExperienceLogoFileSize('');
    setExperienceForm({
      company: '',
      role: '',
      duration: '',
      isCurrent: false,
      bannerBg: '#06262a',
      logoType: 'brillon',
      logoText: '',
      logoUrl: '',
      instagram: '',
      linkedin: '',
      website: '',
      order: 0,
    });
  };

  const handleDeleteExperience = async (id, company) => {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to delete experience at "${company}"?`)) return;

    setIsSubmitting(true);
    try {
      await deleteExperience(id, adminSecret);
      showNotification('success', `Experience "${company}" removed via DELETE /api/experience/${id}`);
      const updated = await fetchExperiences();
      setExperiences(updated);
    } catch (err) {
      showNotification('error', `Delete failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Content Save
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      hero: {
        badge: contentForm.badge,
        heading: contentForm.heading,
        subheading: contentForm.subheading,
        avatarUrl: contentForm.avatarUrl,
        chips: Array.isArray(contentForm.chips) ? contentForm.chips : [],
      },
      about: {
        ...aboutForm,
        text: contentForm.aboutText || aboutForm.text,
      },
      skills: contentForm.skills,
      contactInfo: {
        email: contentForm.email,
        phone: contentForm.phone,
        photoUrl: contentForm.photoUrl,
        location: contentForm.location,
        linkedinUrl: contentForm.linkedinUrl,
        instagramUrl: contentForm.instagramUrl,
        githubUrl: contentForm.githubUrl,
        facebookUrl: contentForm.facebookUrl,
        twitterUrl: contentForm.twitterUrl,
      },
    };

    try {
      const updated = await updatePortfolioContent(payload, adminSecret);
      setContent(updated);
      showNotification('success', 'Portfolio content and skills saved to backend via PUT /api/content!');
    } catch (err) {
      showNotification('error', `Content update failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== ABOUT SECTION CRUD HANDLERS ====================
  const handleSaveAbout = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await updateAboutData(aboutForm, adminSecret);
      setAboutData(updated);
      setContentForm((prev) => ({ ...prev, aboutText: updated.text }));
      showNotification('success', 'About Section saved to MongoDB successfully via PUT /api/about!');
    } catch (err) {
      showNotification('error', `Failed to save About section: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyPoint = () => {
    const trimmed = newKeyPointInput.trim();
    if (!trimmed) return;
    if (aboutForm.keyPoints.includes(trimmed)) {
      showNotification('error', 'This key point already exists.');
      return;
    }
    setAboutForm((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, trimmed],
    }));
    setNewKeyPointInput('');
    showNotification('success', 'Point added! Click "Save About Section" to store in MongoDB.');
  };

  const handleDeleteKeyPoint = (index) => {
    setAboutForm((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }));
    showNotification('info', 'Point removed from form. Click "Save About Section" to commit.');
  };

  const handleStartEditKeyPoint = (index) => {
    setEditingKeyPointIdx(index);
    setEditingKeyPointText(aboutForm.keyPoints[index] || '');
  };

  const handleSaveEditKeyPoint = (index) => {
    const trimmed = editingKeyPointText.trim();
    if (!trimmed) return;
    setAboutForm((prev) => {
      const updated = [...prev.keyPoints];
      updated[index] = trimmed;
      return { ...prev, keyPoints: updated };
    });
    setEditingKeyPointIdx(null);
    setEditingKeyPointText('');
    showNotification('success', 'Point updated! Click "Save About Section" to store in MongoDB.');
  };

  const handleCancelEditKeyPoint = () => {
    setEditingKeyPointIdx(null);
    setEditingKeyPointText('');
  };

  const handleResetAbout = async () => {
    if (!window.confirm('Reset About section to default values?')) return;
    setIsSubmitting(true);
    try {
      const res = await resetAboutData(adminSecret);
      const defaultData = res.about || FALLBACK_ABOUT;
      setAboutData(defaultData);
      setAboutForm(defaultData);
      setCvFileName('');
      setCvFileSize('');
      showNotification('success', 'About section reset to defaults in MongoDB via DELETE /api/about!');
    } catch (err) {
      showNotification('error', `Reset failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CV / Resume upload handlers
  const handleLocalCvUpload = (file) => {
    if (!file) return;
    const isPdfOrDoc =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.doc');

    if (!isPdfOrDoc) {
      showNotification('error', 'Please select a PDF document file (.pdf).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showNotification('error', 'File size exceeds 12 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const base64Data = readerEvent.target.result;
      const formattedSize = (file.size / 1024).toFixed(1) + ' KB';
      setAboutForm((prev) => ({
        ...prev,
        cv: {
          ...(prev.cv || {}),
          data: base64Data,
          fileName: file.name,
          fileSize: formattedSize,
          uploadedAt: new Date().toISOString(),
        },
      }));
      setCvFileName(file.name);
      setCvFileSize(formattedSize);
      showNotification('success', `CV document "${file.name}" loaded! Click "Save About Section" to store in MongoDB.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCv = async () => {
    if (!window.confirm('Are you sure you want to remove the current CV document?')) return;
    setIsSubmitting(true);
    try {
      await deleteAboutCv(adminSecret);
      setAboutForm((prev) => ({
        ...prev,
        cv: { url: '', data: '', fileName: '', fileSize: '', uploadedAt: '' },
      }));
      setAboutData((prev) => ({
        ...prev,
        cv: { url: '', data: '', fileName: '', fileSize: '', uploadedAt: '' },
      }));
      setCvFileName('');
      setCvFileSize('');
      showNotification('success', 'CV document removed from MongoDB.');
    } catch (err) {
      showNotification('error', `Failed to remove CV: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCvPreview = () => {
    const cv = aboutForm.cv;
    if (cv?.data) {
      const link = document.createElement('a');
      link.href = cv.data;
      link.download = cv.fileName || 'CV_Preview.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    if (cv?.url) {
      window.open(cv.url, '_blank', 'noopener,noreferrer');
      return;
    }
    // Fallback preview
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Venkata_Sreedhar_Reddy_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('info', 'Downloading pre-bundled default resume PDF.');
  };

  const handleStatChange = (index, field, value) => {
    setAboutForm((prev) => {
      const updatedStats = [...(prev.stats || [])];
      if (!updatedStats[index]) {
        updatedStats[index] = { value: '', label: '' };
      }
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: value,
      };
      return { ...prev, stats: updatedStats };
    });
  };

  // Helper to extract skill name and iconUrl
  const getSkillInfo = (skill) => {
    if (typeof skill === 'object' && skill !== null) {
      return {
        name: skill.name || '',
        iconUrl: skill.iconUrl || '',
      };
    }
    return {
      name: String(skill || ''),
      iconUrl: '',
    };
  };

  // Add or update skill tag with logo
  const handleAddSkill = () => {
    const trimmedName = newSkillInput.trim();
    if (!trimmedName) {
      showNotification('error', 'Please enter a skill name.');
      return;
    }
    const trimmedLogo = (newSkillLogoUrl || '').trim();

    if (editingSkillIdx !== null) {
      setContentForm((prev) => {
        const updated = [...prev.skills];
        updated[editingSkillIdx] = {
          name: trimmedName,
          iconUrl: trimmedLogo,
        };
        return { ...prev, skills: updated };
      });
      showNotification('success', `Skill "${trimmedName}" updated! Click Save Changes below to persist.`);
      setEditingSkillIdx(null);
    } else {
      const exists = contentForm.skills.some((s) => {
        const info = getSkillInfo(s);
        return info.name.toLowerCase() === trimmedName.toLowerCase();
      });
      if (exists) {
        showNotification('error', `"${trimmedName}" is already present in your skills list.`);
        return;
      }
      setContentForm((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: trimmedName, iconUrl: trimmedLogo }],
      }));
      showNotification('success', `Skill "${trimmedName}" added! Click Save Changes below to persist.`);
    }

    setNewSkillInput('');
    setNewSkillLogoUrl('');
    setSkillLogoFileName('');
    if (skillLogoFileInputRef.current) {
      skillLogoFileInputRef.current.value = '';
    }
  };

  // Edit skill
  const handleEditSkill = (index) => {
    const skill = contentForm.skills[index];
    const info = getSkillInfo(skill);
    setNewSkillInput(info.name);
    setNewSkillLogoUrl(info.iconUrl || '');
    setSkillLogoFileName(info.iconUrl ? 'Loaded logo' : '');
    setEditingSkillIdx(index);
  };

  // Cancel skill edit
  const handleCancelSkillEdit = () => {
    setNewSkillInput('');
    setNewSkillLogoUrl('');
    setSkillLogoFileName('');
    setEditingSkillIdx(null);
    if (skillLogoFileInputRef.current) {
      skillLogoFileInputRef.current.value = '';
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (indexToRemove) => {
    setContentForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove),
    }));
    if (editingSkillIdx === indexToRemove) {
      handleCancelSkillEdit();
    }
  };

  // --- Hero Floating Chips / Text Boxes CRUD Operations ---
  const handleAddChip = () => {
    if (!newChipForm.text.trim()) {
      showNotification('error', 'Please enter text for the text box / chip.');
      return;
    }
    const chipToAdd = {
      text: newChipForm.text.trim(),
      icon: newChipForm.icon || 'sparkles',
      position: newChipForm.position || 'top-right',
      animate: Boolean(newChipForm.animate),
    };

    setContentForm((prev) => ({
      ...prev,
      chips: [...(prev.chips || []), chipToAdd],
    }));

    setNewChipForm({
      text: '',
      icon: 'sparkles',
      position: 'top-right',
      animate: true,
    });
    showNotification('success', `Added "${chipToAdd.text}" text box! Click "Save Profile & Skills" below to sync to MongoDB.`);
  };

  const handleEditChip = (index) => {
    const chip = contentForm.chips?.[index];
    if (!chip) return;
    setEditingChipIdx(index);
    setNewChipForm({
      text: chip.text || '',
      icon: chip.icon || 'sparkles',
      position: chip.position || 'top-right',
      animate: chip.animate !== false,
    });
  };

  const handleUpdateChip = () => {
    if (editingChipIdx === null || !newChipForm.text.trim()) return;
    setContentForm((prev) => {
      const updated = [...(prev.chips || [])];
      updated[editingChipIdx] = {
        text: newChipForm.text.trim(),
        icon: newChipForm.icon || 'sparkles',
        position: newChipForm.position || 'top-right',
        animate: Boolean(newChipForm.animate),
      };
      return { ...prev, chips: updated };
    });
    setEditingChipIdx(null);
    setNewChipForm({
      text: '',
      icon: 'sparkles',
      position: 'top-right',
      animate: true,
    });
    showNotification('success', 'Updated text box! Click "Save Profile & Skills" below to sync to MongoDB.');
  };

  const handleDeleteChip = (index) => {
    const chip = contentForm.chips?.[index];
    const name = chip?.text || 'Text box';
    if (!window.confirm(`Delete "${name}" text box?`)) return;
    setContentForm((prev) => ({
      ...prev,
      chips: (prev.chips || []).filter((_, i) => i !== index),
    }));
    if (editingChipIdx === index) {
      setEditingChipIdx(null);
      setNewChipForm({ text: '', icon: 'sparkles', position: 'top-right', animate: true });
    }
    showNotification('info', `Removed "${name}". Click Save below to apply.`);
  };

  const handleCancelEditChip = () => {
    setEditingChipIdx(null);
    setNewChipForm({
      text: '',
      icon: 'sparkles',
      position: 'top-right',
      animate: true,
    });
  };

  return (
    <div className="admin-page-root">
      {/* Background Cyber Grid */}
      <div className="cyber-grid" aria-hidden="true" />

      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-back-btn"
              onClick={onNavigateHome}
              title="Return to Public Portfolio"
            >
              <ArrowLeft size={16} />
              <span>Back to Portfolio</span>
            </button>

            <div className="admin-title-badge">
              <Shield size={18} className="shield-icon" />
              <div>
                <span className="admin-brand-title">Admin Dashboard</span>
                <span className="admin-brand-sub">Backend API Engine Controller</span>
              </div>
            </div>
          </div>

          <div className="admin-header-right">
            {isAuthenticated && (
              <div className="admin-user-pill">
                <User size={13} />
                <span>{adminUser}</span>
              </div>
            )}

            {/* Live API Status Pill */}
            <div
              className={`admin-status-pill ${backendHealth.online ? 'online' : 'offline'}`}
              title={`API URL: ${API_BASE}`}
            >
              <Server size={14} />
              <span className="status-dot"></span>
              <span>
                {backendHealth.online ? 'Cloud Backend Online' : 'Backend Standby / Connecting'}
              </span>
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                type="button"
                className="admin-logout-btn"
                onClick={handleLogout}
                title="Log out of admin session"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}

            {/* Refresh Data Button */}
            {isAuthenticated && (
              <button
                type="button"
                className="admin-refresh-btn"
                onClick={loadData}
                disabled={isLoadingAll}
                title="Refresh all data directly from Backend APIs"
              >
                <RefreshCw size={15} className={isLoadingAll ? 'spin-icon' : ''} />
                <span>Sync</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main">
        {/* Status Notification Alert */}
        {statusNotification.text && (
          <div className={`admin-alert ${statusNotification.type}`}>
            {statusNotification.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{statusNotification.text}</span>
            <button
              type="button"
              className="alert-close-btn"
              onClick={() => setStatusNotification({ type: '', text: '' })}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="security-gate-container">
            <div className={`security-gate-card ${isLockedOut ? 'locked-border' : ''}`}>
              <div className="gate-badge-wrap">
                <div className={`gate-shield-emblem ${isLockedOut ? 'locked' : ''}`}>
                  {isLockedOut ? <Lock size={30} /> : <Shield size={30} />}
                </div>
              </div>

              <div className="gate-title-group">
                <h2 className="gate-main-title">Admin Security Console</h2>
                <p className="gate-subtitle">
                  Restricted developer control center with automated brute-force lockout protection.
                </p>
              </div>

              {/* Security Lockout Banner */}
              {isLockedOut ? (
                <div className="lockout-alert-box">
                  <div className="lockout-alert-header">
                    <ShieldAlert size={18} />
                    <span>Security Lockout In Effect</span>
                  </div>
                  <p className="lockout-alert-desc">
                    5 consecutive failed authentication attempts were detected. System access is temporarily locked to protect your portfolio.
                  </p>
                  <div className="lockout-timer-display">
                    <span className="lockout-timer-label">
                      <Clock size={12} />
                      <span>Automatic Unlock In</span>
                    </span>
                    <span className="countdown-digits">{formatTime(lockoutRemainingSec)}</span>
                  </div>
                </div>
              ) : (
                /* Remaining Attempts Indicator */
                <div className="attempts-status-bar">
                  <span className="attempts-label">
                    <Shield size={14} />
                    <span>Brute-force Guard:</span>
                  </span>
                  <span
                    className={`attempts-pill ${remainingAttempts >= 4 ? 'safe' : remainingAttempts >= 2 ? 'warning' : 'danger'
                      }`}
                  >
                    {remainingAttempts} / 5 Attempts Left
                  </span>
                </div>
              )}

              {/* Login Error Alert */}
              {loginError && !isLockedOut && (
                <div className="admin-alert error" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="gate-form">
                <div className="gate-input-wrapper">
                  <User size={16} className="gate-input-icon" />
                  <input
                    type="text"
                    className="gate-input"
                    placeholder="Admin Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    disabled={isLockedOut || isLoggingIn}
                    required
                  />
                </div>

                <div className="gate-input-wrapper">
                  <Lock size={16} className="gate-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="gate-input"
                    placeholder="Admin Password / Secret"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLockedOut || isLoggingIn}
                    required
                  />
                  <button
                    type="button"
                    className="gate-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className={`gate-submit-btn ${isLockedOut ? 'locked' : ''}`}
                  disabled={isLockedOut || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : isLockedOut ? (
                    <>
                      <Lock size={16} />
                      <span>Console Locked ({formatTime(lockoutRemainingSec)})</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={16} />
                      <span>Authenticate & Access Console</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Demo Hint & Emergency Unlock */}
              <div className="gate-footer-tools">
                <div className="demo-credentials-card">
                  <div className="demo-credentials-text">
                    Dev Key: <code>admin</code> / <code>myadminsecret123</code>
                  </div>
                  <button
                    type="button"
                    className="autofill-btn"
                    onClick={() => {
                      setLoginUsername('admin');
                      setLoginPassword('myadminsecret123');
                    }}
                    disabled={isLockedOut}
                  >
                    Quick Fill
                  </button>
                </div>

                <button
                  type="button"
                  className="master-unlock-btn"
                  onClick={() => setShowMasterUnlock(!showMasterUnlock)}
                >
                  {showMasterUnlock ? 'Hide Emergency Master Unlock' : 'Emergency Unlock Master Key?'}
                </button>

                {showMasterUnlock && (
                  <form onSubmit={handleMasterUnlock} className="master-unlock-box">
                    <span className="master-unlock-title">
                      <Key size={14} />
                      <span>Master Secret Override</span>
                    </span>
                    <div className="master-unlock-row">
                      <input
                        type="password"
                        className="master-unlock-input"
                        placeholder="Master ADMIN_SECRET"
                        value={masterKeyInput}
                        onChange={(e) => setMasterKeyInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="master-clear-btn" disabled={isUnlocking}>
                        {isUnlocking ? 'Clearing...' : 'Clear Lockout'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Secret Key & Authentication Card */}
            <section className="admin-auth-card">
              <div className="auth-card-info">
                <Shield size={20} className="auth-icon" />
                <div>
                  <h3 className="auth-card-title">Backend API Authentication</h3>
                  <p className="auth-card-desc">
                    Protected endpoints (POST, PUT, DELETE) require the <code>x-admin-secret</code> header verified by Express.
                  </p>
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="adminSecretInput">Admin Secret:</label>
                <div className="auth-input-wrapper">
                  <input
                    id="adminSecretInput"
                    type="password"
                    className="auth-secret-input"
                    value={adminSecret}
                    onChange={(e) => handleSecretChange(e.target.value)}
                    placeholder="Enter ADMIN_SECRET"
                  />
                  <span className={`secret-status-tag ${isSecretSaved ? 'saved' : 'typing'}`}>
                    {isSecretSaved ? <Check size={12} /> : null}
                    {isSecretSaved ? 'Saved' : 'Saving...'}
                  </span>
                </div>
              </div>
            </section>

            {/* Metric Quick Stats */}
            <section className="admin-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box projects-accent">
                  <Layers size={20} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Managed Projects</span>
                  <span className="metric-value">{projects.length}</span>
                  <span className="metric-sub">Synced from MongoDB</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box skills-accent">
                  <Code size={20} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Technical Skills</span>
                  <span className="metric-value">{contentForm.skills.length}</span>
                  <span className="metric-sub">Active in Arsenal</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <Briefcase size={20} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Work Experience</span>
                  <span className="metric-value">{experiences.length}</span>
                  <span className="metric-sub">MongoDB /api/experience</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box server-accent">
                  <Activity size={20} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Backend Health</span>
                  <span className="metric-value">{backendHealth.online ? '200 OK' : 'Offline'}</span>
                  <span className="metric-sub">Express / REST API</span>
                </div>
              </div>
            </section>

            {/* Navigation Tabs */}
            <nav className="admin-tabs-nav">
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <Layers size={16} />
                <span>Projects Management ({projects.length})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                <Briefcase size={16} />
                <span>Work Experience ({experiences.length})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Sparkles size={16} />
                <span>About Section ({aboutForm.keyPoints?.length || 0})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <UserCheck size={16} />
                <span>Profile & Skills</span>
              </button>
            </nav>

            {/* TAB 1: PROJECTS MANAGEMENT */}
            {activeTab === 'projects' && (
              <div className="admin-tab-pane">
                {/* Create / Edit Project Form */}
                <div className="admin-card form-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        {isEditingProject ? (
                          <>
                            <Edit3 size={18} className="title-icon" />
                            Edit Project (ID: <code>{editingProjectId}</code>)
                          </>
                        ) : (
                          <>
                            <Plus size={18} className="title-icon" />
                            Create New Project via POST /api/projects
                          </>
                        )}
                      </h3>
                      <p className="card-subtitle">
                        Add or update full-stack projects stored in MongoDB Atlas.
                      </p>
                    </div>
                    {isEditingProject && (
                      <button
                        type="button"
                        className="btn btn-secondary cancel-btn"
                        onClick={handleCancelEditProject}
                      >
                        <X size={14} />
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitProject} className="project-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Project Title *</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Distributed Task Queue"
                          value={projectForm.title}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Live Demo URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://myproject.demo.app"
                          value={projectForm.liveDemo}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, liveDemo: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <div className="label-with-hint">
                        <label>Project Content (Points Wise) *</label>
                        <span className="field-hint">Add one point per line or with bullets</span>
                      </div>
                      <textarea
                        rows={5}
                        className="admin-textarea"
                        placeholder="Enter points (one per line, e.g.):&#10;• Architecture and high-performance system design&#10;• Real-time emotion detection web app using speech processing models.&#10;• Low-latency audio stream processing"
                        value={projectForm.content}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, content: e.target.value })
                        }
                        required
                      />
                      <div className="textarea-footer-action">
                        <button
                          type="button"
                          className="btn-add-bullet"
                          onClick={() => {
                            const cur = projectForm.content ? projectForm.content.trim() + '\n• ' : '• ';
                            setProjectForm({ ...projectForm, content: cur });
                          }}
                        >
                          + Add Bullet Point
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="spin-icon" />
                            <span>Sending to Backend...</span>
                          </>
                        ) : isEditingProject ? (
                          <>
                            <Save size={16} />
                            <span>Update Project (PUT)</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Publish Project (POST)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Projects List */}
                <div className="admin-card list-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">Active Projects in Database ({projects.length})</h3>
                      <p className="card-subtitle">
                        Live records returned from <code>GET /api/projects</code>
                      </p>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className="admin-empty-state">
                      <Layers size={36} className="empty-icon" />
                      <h4>No Projects Found</h4>
                      <p>Use the form above to post your first project to MongoDB.</p>
                    </div>
                  ) : (
                    <div className="admin-projects-grid">
                      {projects.map((project) => (
                        <div key={project._id} className="admin-project-item">
                          <div className="project-item-top">
                            <h4 className="project-item-title">{project.title}</h4>
                            <div className="project-item-actions">
                              <button
                                type="button"
                                className="item-action-btn edit"
                                onClick={() => handleEditProjectClick(project)}
                                title="Edit this project"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                className="item-action-btn delete"
                                onClick={() => handleDeleteProject(project._id, project.title)}
                                title="Delete this project from MongoDB"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <ul className="admin-project-points-list">
                            {parseProjectPoints(project.content || project.description).map((pt, i) => (
                              <li key={i} className="admin-point-item">
                                <span className="admin-point-bullet">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Links Footer */}
                          <div className="project-item-footer">
                            {(project.liveDemo || project.live) && (
                              <a
                                href={project.liveDemo || project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="project-link live"
                              >
                                <Sparkles size={13} />
                                <span>Live Demo</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                            <span className="project-id-tag">ID: {project._id?.slice(-6)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE & SKILLS */}
            {activeTab === 'content' && (
              <div className="admin-tab-pane">
                <form onSubmit={handleSaveContent}>
                  {/* Hero & About Info */}
                  <div className="admin-card form-card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">Hero & About Section Content</h3>
                        <p className="card-subtitle">
                          Updates the main headings, badges, and personal narrative via <code>PUT /api/content</code>.
                        </p>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Hero Role Badge</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={contentForm.badge}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, badge: e.target.value })
                          }
                          placeholder="e.g. Full-Stack Software Engineer"
                        />
                      </div>

                      <div className="form-group">
                        <label>Hero Main Heading</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={contentForm.heading}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, heading: e.target.value })
                          }
                          placeholder="e.g. Engineering Scalable Distributed Systems"
                        />
                      </div>

                      <div className="form-group">
                        <label>Hero Subtitle / Pitch</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={contentForm.subheading}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, subheading: e.target.value })
                          }
                          placeholder="e.g. Specializing in high-throughput backends..."
                        />
                      </div>
                    </div>

                    {/* Hero Avatar / Profile Image Uploader */}
                    <div className="form-group full-width avatar-upload-section">
                      <div className="avatar-section-header">
                        <label className="avatar-section-label">
                          <ImageIcon size={16} />
                          <span>Hero Profile / Portrait Image</span>
                        </label>
                        <div className="avatar-mode-toggle">
                          <button
                            type="button"
                            className={`mode-toggle-btn ${avatarUploadMode === 'local' ? 'active' : ''}`}
                            onClick={() => setAvatarUploadMode('local')}
                          >
                            <Upload size={13} />
                            <span>Upload from Local System</span>
                          </button>
                          <button
                            type="button"
                            className={`mode-toggle-btn ${avatarUploadMode === 'url' ? 'active' : ''}`}
                            onClick={() => setAvatarUploadMode('url')}
                          >
                            <Link2 size={13} />
                            <span>Image Web URL</span>
                          </button>
                        </div>
                      </div>

                      <div className="avatar-uploader-container">
                        {/* Live Preview Box */}
                        <div className="avatar-preview-box">
                          <img
                            src={(contentForm.avatarUrl && !contentForm.avatarUrl.includes('images.unsplash.com')) ? contentForm.avatarUrl : defaultHeroAvatar}
                            alt="Hero Avatar Preview"
                            className="avatar-preview-img"
                            onError={(e) => {
                              e.target.src = defaultHeroAvatar;
                            }}
                          />
                          <span className="contact-photo-source-tag">
                            {(contentForm.avatarUrl && !contentForm.avatarUrl.includes('images.unsplash.com')) ? 'Admin Upload' : 'Code Asset'}
                          </span>
                        </div>

                        <div className="avatar-uploader-controls">
                          {avatarUploadMode === 'local' ? (
                            <div
                              className="avatar-dropzone"
                              onClick={() => avatarFileInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.[0]) {
                                  handleLocalImageUpload(e.dataTransfer.files[0]);
                                }
                              }}
                            >
                              <input
                                ref={avatarFileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleLocalImageUpload(e.target.files[0]);
                                  }
                                }}
                              />
                              <div className="dropzone-content">
                                <Upload size={24} className="dropzone-icon" />
                                <div className="dropzone-text">
                                  <span className="dropzone-main-text">
                                    Click to select image from your computer (.jpg, .png) or drag & drop
                                  </span>
                                  <span className="dropzone-sub-text">
                                    Supports PNG, JPG, JPEG, WebP (Optimized automatically for high-performance loading)
                                  </span>
                                </div>
                              </div>
                              {avatarFileName && (
                                <div className="selected-file-pill">
                                  <Check size={12} className="text-emerald" />
                                  <span>Loaded: {avatarFileName} ({avatarFileSize})</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="avatar-url-input-wrap">
                              <input
                                type="url"
                                className="admin-input"
                                placeholder="Paste direct image URL (e.g. https://... or data:image/...)"
                                value={contentForm.avatarUrl}
                                onChange={(e) => {
                                  setContentForm({ ...contentForm, avatarUrl: e.target.value });
                                  setAvatarFileName('');
                                }}
                              />
                              <span className="avatar-url-hint">
                                Enter any direct image link from cloud storage or CDN.
                              </span>
                            </div>
                          )}

                          <div className="avatar-action-bar">
                            {contentForm.avatarUrl && (
                              <button
                                type="button"
                                className="btn btn-secondary clear-avatar-btn"
                                onClick={() => {
                                  setContentForm({ ...contentForm, avatarUrl: '' });
                                  setAvatarFileName('');
                                  showNotification('info', 'Reverted to default code asset image (sreedhar_photo.jpg).');
                                }}
                              >
                                <RotateCcw size={13} />
                                <span>Reset to Default Code Photo (sreedhar_photo.jpg)</span>
                              </button>
                            )}
                          </div>

                          <div className="contact-code-note">
                            <span className="code-note-icon">💡</span>
                            <span>
                              <strong>Code Update:</strong> You can also replace or update the Hero image directly in code at{' '}
                              <code>Frontend/src/assets/sreedhar_photo.jpg</code> (supports <code>.jpg</code>, <code>.png</code>).
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>About Me Bio Narrative</label>
                      <textarea
                        rows={4}
                        className="admin-textarea"
                        value={contentForm.aboutText}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, aboutText: e.target.value })
                        }
                        placeholder="Detailed professional bio..."
                      />
                    </div>
                  </div>

                  {/* Hero Photo Floating Text Boxes & Chips Manager */}
                  <div className="admin-card form-card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Sparkles size={18} style={{ color: '#a855f7' }} />
                          <span>Hero Photo Floating Text Boxes & Badges ({(contentForm.chips || []).length})</span>
                        </h3>
                        <p className="card-subtitle">
                          Add, edit, or delete floating text boxes around your hero photo (e.g. "Cloud Ready", "Python Pro", "AI Explorer"). Each box can float up and down and be placed in any corner.
                        </p>
                      </div>
                    </div>

                    {/* Add / Edit Form */}
                    <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#a855f7', marginBottom: '1rem' }}>
                        {editingChipIdx !== null ? `Edit Text Box #${editingChipIdx + 1}` : '+ Add New Floating Text Box'}
                      </h4>

                      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="form-group">
                          <label>Text Label *</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={newChipForm.text}
                            onChange={(e) => setNewChipForm({ ...newChipForm, text: e.target.value })}
                            placeholder="e.g. Cloud Ready, Python Pro, AI Explorer"
                          />
                        </div>

                        <div className="form-group">
                          <label>Position on Image Edges (Corners & Middles)</label>
                          <select
                            className="admin-input"
                            value={newChipForm.position}
                            onChange={(e) => setNewChipForm({ ...newChipForm, position: e.target.value })}
                          >
                            <option value="top-left">↖ Top Left (Above Photo Left)</option>
                            <option value="top-center">⬆ Middle Up / Top Center (Above Photo Middle)</option>
                            <option value="top-right">↗ Top Right (Above Photo Right - Default)</option>
                            <option value="middle-left">⬅ Middle Left (Center Left Edge)</option>
                            <option value="middle-right">➡ Middle Right (Center Right Edge)</option>
                            <option value="bottom-left">↙ Bottom Left (Lower Left Edge)</option>
                            <option value="bottom-center">⬇ Middle Down / Bottom Center (Lower Middle Edge)</option>
                            <option value="bottom-right">↘ Bottom Right (Lower Right Edge)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Badge Icon</label>
                          <select
                            className="admin-input"
                            value={newChipForm.icon}
                            onChange={(e) => setNewChipForm({ ...newChipForm, icon: e.target.value })}
                          >
                            <option value="sparkles">✨ Sparkles (Violet)</option>
                            <option value="cloud">☁️ Cloud (Sky Blue)</option>
                            <option value="code">💻 Code &lt;/&gt; (Cyan)</option>
                            <option value="terminal">⌨️ Terminal &gt;_ (Emerald)</option>
                            <option value="zap">⚡ Zap / Lightning (Amber)</option>
                            <option value="star">⭐ Star (Gold)</option>
                            <option value="shield">🛡️ Shield Security (Purple)</option>
                            <option value="check">✅ Verified Check (Green)</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <label>Floating Animation</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '0.4rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                            <input
                              type="checkbox"
                              checked={newChipForm.animate}
                              onChange={(e) => setNewChipForm({ ...newChipForm, animate: e.target.checked })}
                              style={{ width: '18px', height: '18px', accentColor: '#a855f7' }}
                            />
                            <span>Moveable Up and Down (Smooth float)</span>
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        {editingChipIdx !== null ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', borderColor: '#a855f7' }}
                              onClick={handleUpdateChip}
                            >
                              <Save size={14} />
                              <span>Update Text Box</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleCancelEditChip}
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', borderColor: '#a855f7' }}
                            onClick={handleAddChip}
                          >
                            <Plus size={14} />
                            <span>Add Text Box</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chips List with Previews & Actions */}
                    {(contentForm.chips || []).length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 }}>
                        No floating text boxes currently added. Use the form above to add one.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {(contentForm.chips || []).map((chip, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.85rem 1.25rem',
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: '10px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              flexWrap: 'wrap',
                              gap: '1rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                              {/* Visual Badge Preview */}
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.45rem 0.95rem',
                                  borderRadius: '8px',
                                  background: 'rgba(14, 18, 34, 0.95)',
                                  border: '1px solid rgba(139, 92, 246, 0.45)',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  color: '#ffffff',
                                }}
                              >
                                <span>{chip.icon === 'cloud' ? '☁️' : chip.icon === 'code' ? '💻' : chip.icon === 'terminal' ? '⌨️' : chip.icon === 'zap' ? '⚡' : chip.icon === 'star' ? '⭐' : chip.icon === 'shield' ? '🛡️' : chip.icon === 'check' ? '✅' : '✨'}</span>
                                <span>{chip.text}</span>
                              </div>

                              <span style={{ fontSize: '0.78rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                Position:{' '}
                                <strong style={{ color: '#cbd5e1' }}>
                                  {chip.position === 'top-left'
                                    ? '↖ Top Left'
                                    : chip.position === 'top-center'
                                    ? '⬆ Middle Up'
                                    : chip.position === 'top-right'
                                    ? '↗ Top Right'
                                    : chip.position === 'middle-left'
                                    ? '⬅ Middle Left'
                                    : chip.position === 'middle-right'
                                    ? '➡ Middle Right'
                                    : chip.position === 'bottom-left'
                                    ? '↙ Bottom Left'
                                    : chip.position === 'bottom-center'
                                    ? '⬇ Middle Down'
                                    : chip.position === 'bottom-right'
                                    ? '↘ Bottom Right'
                                    : chip.position || '↗ Top Right'}
                                </strong>
                              </span>

                              {chip.animate !== false ? (
                                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                                  <span>Moveable (Floating up & down)</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Static</span>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleEditChip(cIdx)}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                              >
                                <Edit3 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleDeleteChip(cIdx)}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#f87171' }}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills Arsenal Manager */}
                  <div className="admin-card form-card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">Technical Skills Arsenal ({contentForm.skills.length})</h3>
                        <p className="card-subtitle">
                          Add, update, or remove skills and upload custom brand logos displayed on your portfolio.
                        </p>
                      </div>
                    </div>

                    <div className="skill-editor-box">
                      <div className="skill-editor-form-grid">
                        <div className="skill-editor-field">
                          <label className="admin-field-label">Skill Name</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="Enter skill name (e.g. React.js, Node.js, Python, AWS)..."
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                          />
                        </div>

                        <div className="skill-editor-field">
                          <div className="skill-logo-mode-header">
                            <label className="admin-field-label">Skill Logo / Icon</label>
                            <div className="skill-mode-toggle">
                              <button
                                type="button"
                                className={`skill-toggle-btn ${skillLogoUploadMode === 'local' ? 'active' : ''}`}
                                onClick={() => setSkillLogoUploadMode('local')}
                              >
                                <Upload size={12} />
                                <span>Upload File</span>
                              </button>
                              <button
                                type="button"
                                className={`skill-toggle-btn ${skillLogoUploadMode === 'url' ? 'active' : ''}`}
                                onClick={() => setSkillLogoUploadMode('url')}
                              >
                                <Link2 size={12} />
                                <span>Image URL</span>
                              </button>
                            </div>
                          </div>

                          {skillLogoUploadMode === 'local' ? (
                            <div className="skill-logo-upload-row">
                              <input
                                ref={skillLogoFileInputRef}
                                type="file"
                                accept="image/png, image/svg+xml, image/jpeg, image/webp"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleLocalSkillLogoUpload(e.target.files[0]);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-secondary skill-file-browse-btn"
                                onClick={() => skillLogoFileInputRef.current?.click()}
                              >
                                <Upload size={14} />
                                <span>Choose Logo File (.svg, .png, .webp)</span>
                              </button>
                              {skillLogoFileName && (
                                <span className="skill-file-name-tag">
                                  {skillLogoFileName}
                                  <button
                                    type="button"
                                    className="skill-file-clear-btn"
                                    onClick={() => {
                                      setNewSkillLogoUrl('');
                                      setSkillLogoFileName('');
                                      if (skillLogoFileInputRef.current) {
                                        skillLogoFileInputRef.current.value = '';
                                      }
                                    }}
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="skill-url-input-wrap">
                              <input
                                type="url"
                                className="admin-input"
                                placeholder="https://example.com/logo.svg or logo URL..."
                                value={newSkillLogoUrl}
                                onChange={(e) => setNewSkillLogoUrl(e.target.value)}
                              />
                              {newSkillLogoUrl && (
                                <button
                                  type="button"
                                  className="skill-url-clear-btn"
                                  onClick={() => setNewSkillLogoUrl('')}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Logo Preview & Action Row */}
                      <div className="skill-preview-action-row">
                        <div className="skill-preview-badge">
                          <span className="skill-preview-label">Live Preview:</span>
                          <div className="skill-preview-chip">
                            <div className="skill-preview-icon-bubble">
                              <TechLogo
                                name={newSkillInput || 'Skill'}
                                iconUrl={newSkillLogoUrl}
                                size={22}
                              />
                            </div>
                            <span className="skill-preview-name">{newSkillInput || 'Skill Name'}</span>
                          </div>
                          <span className="skill-preview-hint">
                            {newSkillLogoUrl
                              ? '(Using custom uploaded logo)'
                              : '(Uses auto-detected official tech icon if available)'}
                          </span>
                        </div>

                        <div className="skill-action-buttons">
                          {editingSkillIdx !== null && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleCancelSkillEdit}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary add-skill-btn"
                            onClick={handleAddSkill}
                          >
                            {editingSkillIdx !== null ? (
                              <>
                                <Check size={16} />
                                <span>Update Skill</span>
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                <span>Add Skill</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="skills-badge-collection">
                      {contentForm.skills.map((skill, index) => {
                        const info = getSkillInfo(skill);
                        const isEditing = editingSkillIdx === index;
                        return (
                          <div
                            key={index}
                            className={`admin-skill-chip ${isEditing ? 'editing' : ''}`}
                          >
                            <div className="admin-skill-chip-icon">
                              <TechLogo name={info.name} iconUrl={info.iconUrl} size={18} />
                            </div>
                            <span className="admin-skill-chip-name">{info.name}</span>
                            <div className="admin-skill-chip-actions">
                              <button
                                type="button"
                                className="skill-action-btn edit"
                                onClick={() => handleEditSkill(index)}
                                title={`Edit ${info.name}`}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                className="skill-action-btn remove"
                                onClick={() => handleRemoveSkill(index)}
                                title={`Remove ${info.name}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Info Settings */}
                  <div className="admin-card form-card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">Contact Information & Portrait Photo</h3>
                        <p className="card-subtitle">
                          Configure your Contact Us portrait photo, communication endpoints, and social links.
                        </p>
                      </div>
                    </div>

                    {/* Contact Portrait Photo Uploader */}
                    <div className="form-group full-width contact-photo-section">
                      <div className="avatar-section-header">
                        <div>
                          <div className="avatar-section-label">
                            <ImageIcon size={16} />
                            <span>Contact Us Portrait Photo</span>
                          </div>
                          <div className="field-hint" style={{ marginTop: '0.2rem' }}>
                            Displayed prominently on the left side of the Contact Us card. Supports .png, .jpg, .jpeg, .webp.
                          </div>
                        </div>

                        <div className="avatar-mode-toggle">
                          <button
                            type="button"
                            className={`mode-toggle-btn ${contactPhotoUploadMode === 'local' ? 'active' : ''}`}
                            onClick={() => setContactPhotoUploadMode('local')}
                          >
                            <Upload size={13} />
                            <span>Upload File (.jpg / .png)</span>
                          </button>
                          <button
                            type="button"
                            className={`mode-toggle-btn ${contactPhotoUploadMode === 'url' ? 'active' : ''}`}
                            onClick={() => setContactPhotoUploadMode('url')}
                          >
                            <Link2 size={13} />
                            <span>Image Web URL</span>
                          </button>
                        </div>
                      </div>

                      <div className="avatar-uploader-container contact-uploader-container">
                        {/* Live Preview Box */}
                        <div className="avatar-preview-box contact-portrait-preview-box">
                          <img
                            src={contentForm.photoUrl || defaultContactPhoto}
                            alt="Contact Portrait Preview"
                            className="avatar-preview-img contact-preview-img"
                            onError={(e) => {
                              e.target.src = defaultContactPhoto;
                            }}
                          />
                          <span className="contact-photo-source-tag">
                            {contentForm.photoUrl ? 'Admin Upload' : 'Code Asset'}
                          </span>
                        </div>

                        <div className="avatar-uploader-controls">
                          {contactPhotoUploadMode === 'local' ? (
                            <div
                              className="avatar-dropzone"
                              onClick={() => contactPhotoFileInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.[0]) {
                                  handleLocalContactPhotoUpload(e.dataTransfer.files[0]);
                                }
                              }}
                            >
                              <input
                                ref={contactPhotoFileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleLocalContactPhotoUpload(e.target.files[0]);
                                  }
                                }}
                              />
                              <div className="dropzone-content">
                                <Upload size={24} className="dropzone-icon" />
                                <div className="dropzone-text">
                                  <span className="dropzone-main-text">
                                    Click to select portrait photo (.jpg, .png) or drag & drop here
                                  </span>
                                  <span className="dropzone-sub-text">
                                    Automatically optimized for crisp clarity & lightning-fast performance
                                  </span>
                                </div>
                              </div>
                              {contactPhotoFileName && (
                                <div className="selected-file-pill">
                                  <Check size={12} className="text-emerald" />
                                  <span>Loaded: {contactPhotoFileName} ({contactPhotoFileSize})</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="avatar-url-input-wrap">
                              <input
                                type="url"
                                className="admin-input"
                                placeholder="Paste direct portrait URL (e.g. https://... or data:image/...)"
                                value={contentForm.photoUrl}
                                onChange={(e) => {
                                  setContentForm({ ...contentForm, photoUrl: e.target.value });
                                  setContactPhotoFileName('');
                                }}
                              />
                              <span className="avatar-url-hint">
                                Enter any direct image URL. Click Save below to store in database.
                              </span>
                            </div>
                          )}

                          <div className="avatar-action-bar">
                            {contentForm.photoUrl && (
                              <button
                                type="button"
                                className="btn btn-secondary clear-avatar-btn"
                                onClick={() => {
                                  setContentForm({ ...contentForm, photoUrl: '' });
                                  setContactPhotoFileName('');
                                  showNotification('info', 'Reverted to default code asset image.');
                                }}
                              >
                                <RotateCcw size={13} />
                                <span>Reset to Default Code Photo (sreedhar_photo.jpg)</span>
                              </button>
                            )}
                          </div>

                          <div className="contact-code-note">
                            <span className="code-note-icon">💡</span>
                            <span>
                              <strong>Code Update:</strong> You can also replace or update the image directly in code at{' '}
                              <code>Frontend/src/assets/sreedhar_photo.jpg</code>.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={contentForm.email}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, email: e.target.value })
                          }
                          placeholder="nmallikarjunareddy1998@gmail.com"
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone / WhatsApp Number</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={contentForm.phone}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, phone: e.target.value })
                          }
                          placeholder="+91-9885366006"
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={contentForm.location}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, location: e.target.value })
                          }
                          placeholder="Andhra Pradesh, India"
                        />
                      </div>

                      {/* Website & Social Profiles Section */}
                      <div className="form-full-width-section">
                        <label className="admin-section-label">
                          <Globe size={16} />
                          <span>Website Links & Social Profiles</span>
                        </label>
                        <p className="card-subtitle" style={{ margin: '0.25rem 0 1rem' }}>
                          Connect your social media and developer profile links displayed on your portfolio.
                        </p>
                      </div>

                      <div className="form-group">
                        <label className="admin-social-input-label">
                          <LinkedinIcon size={16} />
                          <span>LinkedIn Profile URL</span>
                        </label>
                        <input
                          type="url"
                          className="admin-input"
                          value={contentForm.linkedinUrl}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, linkedinUrl: e.target.value })
                          }
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-social-input-label">
                          <InstagramIcon size={16} />
                          <span>Instagram Profile URL</span>
                        </label>
                        <input
                          type="url"
                          className="admin-input"
                          value={contentForm.instagramUrl}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, instagramUrl: e.target.value })
                          }
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-social-input-label">
                          <GithubIcon size={16} />
                          <span>GitHub Profile URL</span>
                        </label>
                        <input
                          type="url"
                          className="admin-input"
                          value={contentForm.githubUrl}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, githubUrl: e.target.value })
                          }
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-social-input-label">
                          <FacebookIcon size={16} />
                          <span>Facebook Profile URL</span>
                        </label>
                        <input
                          type="url"
                          className="admin-input"
                          value={contentForm.facebookUrl}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, facebookUrl: e.target.value })
                          }
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="admin-social-input-label">
                          <TwitterIcon size={16} />
                          <span>Twitter / X Profile URL</span>
                        </label>
                        <input
                          type="url"
                          className="admin-input"
                          value={contentForm.twitterUrl}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, twitterUrl: e.target.value })
                          }
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="spin-icon" />
                            <span>Updating Backend...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Save Profile & Skills (PUT /api/content)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: WORK EXPERIENCE CRUD */}
            {activeTab === 'experience' && (
              <div className="admin-tab-pane">
                {/* Create / Edit Experience Form Card */}
                <div className="admin-card form-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        {isEditingExperience ? (
                          <>
                            <Edit3 size={18} className="title-icon" />
                            Edit Experience: <code>{experienceForm.company}</code> (ID: <code>{editingExperienceId}</code>)
                          </>
                        ) : (
                          <>
                            <Plus size={18} className="title-icon" />
                            Add New Work Experience via POST /api/experience
                          </>
                        )}
                      </h3>
                      <p className="card-subtitle">
                        Manage corporate roles, durations, logo banners, and social links stored in MongoDB Atlas.
                      </p>
                    </div>
                    {isEditingExperience && (
                      <button
                        type="button"
                        className="btn btn-secondary cancel-btn"
                        onClick={handleCancelEditExperience}
                      >
                        <X size={14} />
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitExperience} className="project-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Company Name *</label>
                        <input
                          type="text"
                          className="admin-input"
                          required
                          placeholder="e.g. GE Vernova, Google, AWS"
                          value={experienceForm.company}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, company: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Role / Position Title *</label>
                        <input
                          type="text"
                          className="admin-input"
                          required
                          placeholder="e.g. Sr Software Engineer, Full-Stack Developer"
                          value={experienceForm.role}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, role: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Duration / Period *</label>
                        <input
                          type="text"
                          className="admin-input"
                          required
                          placeholder="e.g. Oct 2025 – Present or 2023 – 2025"
                          value={experienceForm.duration}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, duration: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Display Order (Priority)</label>
                        <input
                          type="number"
                          className="admin-input"
                          placeholder="1, 2, 3..."
                          value={experienceForm.order}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, order: e.target.value })
                          }
                        />
                      </div>

                      {/* Current Active Company Toggle */}
                      <div className="form-group full-width">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={experienceForm.isCurrent}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, isCurrent: e.target.checked })
                            }
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                          />
                          <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                            Is this your current working company? (Present Role)
                          </span>
                        </label>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '2rem', display: 'block', marginTop: '0.25rem' }}>
                          ⭐ When checked, this card is highlighted with the portfolio's Royal Indigo/Violet gradient and an active green pulse dot.
                        </span>
                      </div>

                      {/* Banner Background Color with Quick Presets */}
                      <div className="form-group full-width">
                        <label>Logo Banner Background Color</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ maxWidth: '180px' }}
                            value={experienceForm.bannerBg}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, bannerBg: e.target.value })
                            }
                            placeholder="#06262a"
                          />
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              background: experienceForm.bannerBg || '#06262a',
                              border: '2px solid rgba(255,255,255,0.2)',
                              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
                            }}
                          />
                          {/* Presets */}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            onClick={() => setExperienceForm({ ...experienceForm, bannerBg: '#06262a' })}
                          >
                            Deep Teal (#06262a)
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            onClick={() => setExperienceForm({ ...experienceForm, bannerBg: '#090e1c' })}
                          >
                            Midnight Navy (#090e1c)
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            onClick={() => setExperienceForm({ ...experienceForm, bannerBg: '#2c1458' })}
                          >
                            Deep Purple (#2c1458)
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            onClick={() => setExperienceForm({ ...experienceForm, bannerBg: '#09365e' })}
                          >
                            Sapphire (#09365e)
                          </button>
                        </div>
                      </div>

                      {/* Logo Style & Brand Text */}
                      <div className="form-group">
                        <label>Logo Emblem Style</label>
                        <select
                          className="admin-input"
                          value={experienceForm.logoType}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, logoType: e.target.value })
                          }
                        >
                          <option value="ge">GE Vernova (Code Asset: ge_vernova_logo.png)</option>
                          <option value="cloud">Cloud Architecture & Nodes</option>
                          <option value="atom">Digital Innovation Atom Orbit</option>
                          <option value="custom">Custom Uploaded Logo / Image</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Brand Header Text on Banner</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. GE VERNOVA, CLOUD TECH"
                          value={experienceForm.logoText}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, logoText: e.target.value })
                          }
                        />
                      </div>

                      {/* Company Logo / Banner Image Upload Section */}
                      <div className="form-group full-width">
                        <div className="avatar-field-header">
                          <label className="field-label-prominent">
                            <ImageIcon size={16} className="text-cyan" />
                            <span>Company Logo & Banner Image</span>
                          </label>

                          <div className="avatar-mode-toggle">
                            <button
                              type="button"
                              className={`mode-toggle-btn ${experienceLogoUploadMode === 'local' ? 'active' : ''}`}
                              onClick={() => setExperienceLogoUploadMode('local')}
                            >
                              <Upload size={13} />
                              <span>Upload from Local System</span>
                            </button>
                            <button
                              type="button"
                              className={`mode-toggle-btn ${experienceLogoUploadMode === 'url' ? 'active' : ''}`}
                              onClick={() => setExperienceLogoUploadMode('url')}
                            >
                              <Link2 size={13} />
                              <span>Direct Image URL</span>
                            </button>
                          </div>
                        </div>

                        <div className="avatar-uploader-container">
                          {/* Live Preview Box */}
                          <div
                            className="avatar-preview-box"
                            style={{
                              background: experienceForm.bannerBg || '#06262a',
                              padding: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img
                              src={experienceForm.logoUrl || brillonLogo}
                              alt="Company Logo Preview"
                              style={{
                                maxWidth: '120px',
                                maxHeight: '44px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
                              }}
                              onError={(e) => {
                                e.target.src = brillonLogo;
                              }}
                            />
                            <span className="contact-photo-source-tag">
                              {experienceForm.logoUrl ? 'Custom Image' : 'Code Asset'}
                            </span>
                          </div>

                          <div className="avatar-uploader-controls">
                            {experienceLogoUploadMode === 'local' ? (
                              <div
                                className="avatar-dropzone"
                                onClick={() => experienceLogoFileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (e.dataTransfer.files?.[0]) {
                                    handleLocalExperienceLogoUpload(e.dataTransfer.files[0]);
                                  }
                                }}
                              >
                                <input
                                  ref={experienceLogoFileInputRef}
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleLocalExperienceLogoUpload(e.target.files[0]);
                                    }
                                  }}
                                />
                                <div className="dropzone-content">
                                  <Upload size={24} className="dropzone-icon" />
                                  <div className="dropzone-text">
                                    <span className="dropzone-main-text">
                                      Click to select image from your computer (.png, .jpg, .webp) or drag & drop
                                    </span>
                                    <span className="dropzone-sub-text">
                                      Supports PNG, JPG, JPEG, WebP (Optimized automatically for high-performance loading)
                                    </span>
                                  </div>
                                </div>
                                {experienceLogoFileName && (
                                  <div className="selected-file-pill">
                                    <Check size={12} className="text-emerald" />
                                    <span>Loaded: {experienceLogoFileName} ({experienceLogoFileSize})</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="avatar-url-input-wrap">
                                <input
                                  type="url"
                                  className="admin-input"
                                  placeholder="Paste direct company logo or banner URL (https://... or data:image/...)"
                                  value={experienceForm.logoUrl}
                                  onChange={(e) => {
                                    setExperienceForm({ ...experienceForm, logoUrl: e.target.value, logoType: 'custom' });
                                    setExperienceLogoFileName('');
                                  }}
                                />
                                <span className="avatar-url-hint">
                                  Enter any direct image link from cloud storage or CDN.
                                </span>
                              </div>
                            )}

                            <div className="avatar-action-bar">
                              {experienceForm.logoUrl && (
                                <button
                                  type="button"
                                  className="btn btn-secondary clear-avatar-btn"
                                  onClick={() => {
                                    setExperienceForm({ ...experienceForm, logoUrl: '', logoType: 'brillon' });
                                    setExperienceLogoFileName('');
                                    showNotification('info', 'Reverted to default logo (Brillon_logo.png).');
                                  }}
                                >
                                  <RotateCcw size={13} />
                                  <span>Reset to Default Logo (Brillon_logo.png)</span>
                                </button>
                              )}
                            </div>

                            <div className="contact-code-note">
                              <span className="code-note-icon">💡</span>
                              <span>
                                <strong>Logo Asset:</strong> You can upload custom company logos above or use the default asset at{' '}
                                <code>Frontend/src/assets/Brillon_logo.png</code>.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      <div className="form-group">
                        <label>Instagram URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://instagram.com/company"
                          value={experienceForm.instagram}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, instagram: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>LinkedIn URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://linkedin.com/company"
                          value={experienceForm.linkedin}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, linkedin: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Company Website / Globe URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://gevernova.com"
                          value={experienceForm.website}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, website: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="spin-icon" />
                            <span>Saving Experience...</span>
                          </>
                        ) : isEditingExperience ? (
                          <>
                            <Save size={16} />
                            <span>Update Experience (PUT /api/experience)</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Create Experience (POST /api/experience)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Managed Experiences Grid & List */}
                <div className="admin-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">Live Work Experiences in Database ({experiences.length})</h3>
                      <p className="card-subtitle">
                        Real-time records from MongoDB Atlas. Updates instantly reflect on the public portfolio.
                      </p>
                    </div>
                  </div>

                  {experiences.length === 0 ? (
                    <div className="empty-state">
                      <Briefcase size={36} />
                      <p>No experiences configured yet. Add your first company experience above!</p>
                    </div>
                  ) : (
                    <div className="admin-projects-grid">
                      {experiences.map((exp) => (
                        <div
                          key={exp._id || exp.id}
                          className="admin-project-item"
                          style={{
                            borderColor: exp.isCurrent ? 'rgba(99, 102, 241, 0.45)' : undefined,
                            boxShadow: exp.isCurrent ? '0 0 20px rgba(99, 102, 241, 0.15)' : undefined,
                          }}
                        >
                          <div className="project-item-top">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <span
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '4px',
                                  background: exp.bannerBg || '#06262a',
                                  display: 'inline-block',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                }}
                              />
                              <h4 className="project-item-title">{exp.company}</h4>
                            </div>

                            <div className="project-item-actions">
                              {exp.isCurrent && (
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color: '#34d399',
                                    background: 'rgba(52, 211, 153, 0.12)',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '9999px',
                                    border: '1px solid rgba(52, 211, 153, 0.3)',
                                    marginRight: '0.35rem',
                                  }}
                                >
                                  ● CURRENT
                                </span>
                              )}
                              <button
                                type="button"
                                className="item-action-btn edit"
                                onClick={() => handleEditExperience(exp)}
                                disabled={isSubmitting}
                                title="Edit this experience"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                className="item-action-btn delete"
                                onClick={() => handleDeleteExperience(exp._id || exp.id, exp.company)}
                                disabled={isSubmitting}
                                title="Delete this experience"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div style={{ margin: '0.5rem 0' }}>
                            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                              {exp.role}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                              {exp.duration}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '0.8rem' }}>
                            <span>Banner: <code>{exp.bannerBg || '#06262a'}</code></span>
                            <span>•</span>
                            <span>Logo: <code>{exp.logoType || 'ge'}</code></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ABOUT SECTION & CV MANAGEMENT */}
            {activeTab === 'about' && (
              <div className="admin-tab-pane">
                {/* Form Card */}
                <div className="admin-card form-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">
                        <Sparkles size={18} className="title-icon" style={{ color: '#ef4444' }} />
                        About Me, Stats & CV Management
                      </h3>
                      <p className="card-subtitle">
                        Edit your introduction narrative, 3-metric stats counters, and upload your downloadable CV stored in MongoDB Atlas.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleResetAbout}
                        disabled={isSubmitting}
                        title="Reset to defaults"
                      >
                        <RotateCcw size={14} />
                        <span>Reset Defaults</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAbout} className="project-form">
                    {/* 1. Header Titles */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>1. Section Title & Subtitle</span>
                      </h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Main Title (e.g. "About Me" - last word gets the red accent)</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={aboutForm.title || aboutForm.sectionTitle || 'About Me'}
                            onChange={(e) =>
                              setAboutForm({
                                ...aboutForm,
                                title: e.target.value,
                                sectionTitle: e.target.value,
                              })
                            }
                            placeholder="About Me"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Subtitle / Tagline</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={aboutForm.subtitle || aboutForm.sectionSubtitle || 'My introduction'}
                            onChange={(e) =>
                              setAboutForm({
                                ...aboutForm,
                                subtitle: e.target.value,
                                sectionSubtitle: e.target.value,
                              })
                            }
                            placeholder="My introduction"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Passage (Introduction Narrative Paragraph) */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>2. Narrative Passage (Introduction Paragraph)</span>
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Displays as a continuous narrative passage
                        </span>
                      </div>
                      <div className="form-group full-width">
                        <label>Introductory Passage Text *</label>
                        <textarea
                          rows={4}
                          className="admin-textarea"
                          style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                          value={aboutForm.text}
                          onChange={(e) => setAboutForm({ ...aboutForm, text: e.target.value })}
                          placeholder="Passionate about building practical software solutions. I am a final-year B.Tech student specializing in Computer Science and Engineering with Data Science. I am passionate about software development, building web applications, and exploring AI-powered solutions."
                          required
                        />
                      </div>
                    </div>

                    {/* 3. Points-Wise Highlights (Key Bullet Points) */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>3. Key Points (Points-wise Bullet Highlights)</span>
                        </h4>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 600 }}>
                          {(aboutForm.keyPoints || []).length} points configured
                        </span>
                      </div>

                      {/* Add new point input bar */}
                      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ flex: 1, minWidth: '240px' }}
                          value={newKeyPointInput}
                          onChange={(e) => setNewKeyPointInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddKeyPoint();
                            }
                          }}
                          placeholder="Type a point (e.g. Skilled in frontend and backend web development)..."
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
                          onClick={handleAddKeyPoint}
                        >
                          <Plus size={16} />
                          <span>Add Point</span>
                        </button>
                      </div>

                      {/* Points List */}
                      {Array.isArray(aboutForm.keyPoints) && aboutForm.keyPoints.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {aboutForm.keyPoints.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              {editingKeyPointIdx === pIdx ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                  <input
                                    type="text"
                                    className="admin-input"
                                    style={{ flex: 1 }}
                                    value={editingKeyPointText}
                                    onChange={(e) => setEditingKeyPointText(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEditKeyPoint(pIdx);
                                      if (e.key === 'Escape') handleCancelEditKeyPoint();
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-primary"
                                    style={{ padding: '0.45rem', minWidth: 'auto' }}
                                    onClick={() => handleSaveEditKeyPoint(pIdx)}
                                    title="Save Point"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '0.45rem', minWidth: 'auto' }}
                                    onClick={handleCancelEditKeyPoint}
                                    title="Cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '18px',
                                        height: '18px',
                                        minWidth: '18px',
                                        marginTop: '3px',
                                        borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                      }}
                                    >
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                                    </span>
                                    <span style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                      {point}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    <button
                                      type="button"
                                      className="admin-btn-icon"
                                      style={{ color: '#94a3b8' }}
                                      onClick={() => handleStartEditKeyPoint(pIdx)}
                                      title="Edit Point"
                                    >
                                      <Edit3 size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-btn-icon"
                                      style={{ color: '#ef4444' }}
                                      onClick={() => handleDeleteKeyPoint(pIdx)}
                                      title="Delete Point"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                          No points added yet. Type a point above and click "Add Point" to display points-wise bullet items on your portfolio.
                        </p>
                      )}
                    </div>

                    {/* 3. 3-Stat Counters Row */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>3. Stats Counters (Displayed above the Download CV button)</span>
                      </h4>
                      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                        {/* Stat 1 */}
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>STAT 1</span>
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.78rem' }}>Number / Value</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[0]?.value || '06+'}
                              onChange={(e) => handleStatChange(0, 'value', e.target.value)}
                              placeholder="06+"
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.78rem' }}>Description Label</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[0]?.label || 'Years experience'}
                              onChange={(e) => handleStatChange(0, 'label', e.target.value)}
                              placeholder="Years experience"
                            />
                          </div>
                        </div>

                        {/* Stat 2 */}
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>STAT 2</span>
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.78rem' }}>Number / Value</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[1]?.value || '05'}
                              onChange={(e) => handleStatChange(1, 'value', e.target.value)}
                              placeholder="05"
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.78rem' }}>Description Label</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[1]?.label || 'Companies Work'}
                              onChange={(e) => handleStatChange(1, 'label', e.target.value)}
                              placeholder="Companies Work"
                            />
                          </div>
                        </div>

                        {/* Stat 3 */}
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>STAT 3</span>
                          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.78rem' }}>Number / Value</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[2]?.value || '15+'}
                              onChange={(e) => handleStatChange(2, 'value', e.target.value)}
                              placeholder="15+"
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.78rem' }}>Description Label</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={aboutForm.stats?.[2]?.label || 'Technical Skills'}
                              onChange={(e) => handleStatChange(2, 'label', e.target.value)}
                              placeholder="Technical Skills"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. CV / Resume Uploader & Link Manager */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="avatar-section-header" style={{ marginBottom: '1.25rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} />
                            <span>4. Upload CV / Resume Document</span>
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Upload your PDF resume from your computer to store in MongoDB, or paste an external link.
                          </span>
                        </div>

                        <div className="avatar-mode-toggle">
                          <button
                            type="button"
                            className={`mode-toggle-btn ${cvUploadMode === 'local' ? 'active' : ''}`}
                            onClick={() => setCvUploadMode('local')}
                          >
                            <Upload size={13} />
                            <span>Upload PDF File</span>
                          </button>
                          <button
                            type="button"
                            className={`mode-toggle-btn ${cvUploadMode === 'url' ? 'active' : ''}`}
                            onClick={() => setCvUploadMode('url')}
                          >
                            <Link2 size={13} />
                            <span>External Link / Drive</span>
                          </button>
                        </div>
                      </div>

                      {cvUploadMode === 'local' ? (
                        <div
                          className="avatar-dropzone"
                          onClick={() => cvFileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files?.[0]) {
                              handleLocalCvUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          style={{ cursor: 'pointer', padding: '2rem 1.5rem', textAlign: 'center' }}
                        >
                          <input
                            ref={cvFileInputRef}
                            type="file"
                            accept="application/pdf, .pdf, .docx, .doc"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleLocalCvUpload(e.target.files[0]);
                              }
                            }}
                          />
                          <div className="dropzone-content">
                            <Upload size={28} className="dropzone-icon" style={{ color: '#ef4444' }} />
                            <div className="dropzone-text">
                              <span className="dropzone-main-text" style={{ fontSize: '1rem', fontWeight: 600 }}>
                                Click to select your CV document (.pdf) or drag & drop here
                              </span>
                              <span className="dropzone-sub-text" style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                                Stored safely in MongoDB Atlas for direct downloads from the portfolio
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="avatar-url-input-wrap">
                          <input
                            type="url"
                            className="admin-input"
                            placeholder="Paste direct PDF URL or Google Drive link (e.g. https://drive.google.com/...)"
                            value={aboutForm.cv?.url || ''}
                            onChange={(e) =>
                              setAboutForm({
                                ...aboutForm,
                                cv: { ...(aboutForm.cv || {}), url: e.target.value },
                              })
                            }
                          />
                          <span className="avatar-url-hint">
                            Provide a publicly accessible link to your resume document.
                          </span>
                        </div>
                      )}

                      {/* Current Loaded / Stored CV Status Badge */}
                      {(aboutForm.cv?.fileName || aboutForm.cv?.data || aboutForm.cv?.url) && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.85rem 1rem',
                            marginTop: '1rem',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: '8px',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <FileText size={18} style={{ color: '#ef4444' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                                {aboutForm.cv?.fileName || (aboutForm.cv?.url ? 'Linked CV URL' : 'CV Document')}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                {aboutForm.cv?.fileSize && <span>Size: {aboutForm.cv.fileSize} • </span>}
                                <span>Status: Ready in Form (Click Save to commit to MongoDB)</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleDownloadCvPreview}
                              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                            >
                              <Download size={13} />
                              <span>Test Download</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleRemoveCv}
                              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: '#f87171' }}
                            >
                              <Trash2 size={13} />
                              <span>Remove CV</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Quick Meta Details */}
                    <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>5. Location, Email & Availability</span>
                      </h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={aboutForm.location}
                            onChange={(e) => setAboutForm({ ...aboutForm, location: e.target.value })}
                            placeholder="Andhra Pradesh, India"
                          />
                        </div>

                        <div className="form-group">
                          <label>Primary Email</label>
                          <input
                            type="email"
                            className="admin-input"
                            value={aboutForm.email}
                            onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                            placeholder="palletisreedharreddy82@gmail.com"
                          />
                        </div>

                        <div className="form-group">
                          <label>Availability Status</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={aboutForm.availability}
                            onChange={(e) => setAboutForm({ ...aboutForm, availability: e.target.value })}
                            placeholder="Open for Roles"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', borderColor: '#ef4444' }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="spin-icon" />
                            <span>Updating MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Save About Section & CV (PUT /api/about)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleResetAbout}
                        disabled={isSubmitting}
                      >
                        <RotateCcw size={14} />
                        <span>Reset to Defaults</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live MongoDB Sync Preview Card */}
                <div className="admin-card" style={{ marginTop: '2rem' }}>
                  <div className="card-header">
                    <div>
                      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Eye size={18} style={{ color: '#ef4444' }} />
                        <span>Live Preview (Matching Portfolio About Section)</span>
                      </h3>
                      <p className="card-subtitle">
                        Simulating how your About Me heading, narrative bio, 3-stat counters, and CV download render on the live website.
                      </p>
                    </div>
                  </div>

                  {/* Section Header (Up side of the section) */}
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {(() => {
                        const t = (aboutForm.title || 'About Me').trim().split(' ');
                        const main = t.slice(0, -1).join(' ') || t[0];
                        const acc = t.length > 1 ? t[t.length - 1] : '';
                        return (
                          <>
                            {main}{' '}
                            {acc && <span style={{ color: '#ef4444' }}>{acc}</span>}
                          </>
                        );
                      })()}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.4rem' }}>
                      {aboutForm.subtitle || 'My introduction'}
                    </p>
                  </div>

                  {/* Modern Preview Container Box */}
                  <div style={{ padding: '2.5rem', background: 'rgba(16, 22, 39, 0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Bio Narrative Passage & Key Points Preview */}
                    <div style={{ maxWidth: '950px', marginBottom: '2.5rem' }}>
                      {aboutForm.text && (
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: '#cbd5e1', whiteSpace: 'pre-line', margin: '0 0 1.75rem 0' }}>
                          {aboutForm.text}
                        </p>
                      )}

                      {Array.isArray(aboutForm.keyPoints) && aboutForm.keyPoints.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                          {aboutForm.keyPoints.map((pt, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', fontSize: '1.08rem', lineHeight: 1.8, color: '#cbd5e1' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', minWidth: '22px', marginTop: '4px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', position: 'relative', flexShrink: 0 }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.85)' }} />
                              </span>
                              <span style={{ flex: 1, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Stats Counters Grid */}
                    <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                      {(aboutForm.stats || [
                        { value: '06+', label: 'Years experience' },
                        { value: '05', label: 'Companies Work' },
                        { value: '15+', label: 'Technical Skills' },
                      ]).map((stat, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.1 }}>
                            {stat.value}
                          </span>
                          <span style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '0.45rem', fontWeight: 500 }}>
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Download CV Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleDownloadCvPreview}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.9rem 2.2rem',
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '1rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(239, 68, 68, 0.45)',
                        }}
                      >
                        <span>Download CV</span>
                        <Download size={18} />
                      </button>

                      {aboutForm.cv?.fileName && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9999px', fontSize: '0.8rem', color: '#94a3b8' }}>
                          <FileText size={13} style={{ color: '#ef4444' }} />
                          <span>{aboutForm.cv.fileName}</span>
                          {aboutForm.cv.fileSize && <span>({aboutForm.cv.fileSize})</span>}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
