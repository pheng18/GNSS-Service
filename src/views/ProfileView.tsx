import React, { useState } from 'react';
import {
  User,
  Users,
  Settings,
  List,
  Edit2,
  Phone,
  Mail,
  Briefcase,
  Building,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Wrench,
  MapPin,
  Radio,
  ShoppingCart,
  Info,
  Plus,
  Search,
  Database,
  Activity,
  Shield,
  RefreshCw,
  UserCheck,
  AtSign,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAccount } from '../types';

export const ProfileView: React.FC = () => {
  const {
    user,
    profile,
    users,
    currentUserAccount,
    lastSyncedAt,
    realtimeEventCount,
    activityLogs,
    updateProfile,
    updateThemeMode,
    addUserAccount,
    updateUserAccount,
    updateUserCredentials,
    resetUserPassword,
    toggleUserAccountLock,
    deleteUserAccount,
    updateUserPresenceStatus,
    login,
    clearActivityLogs,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'credentials_db' | 'users_db' | 'profile' | 'settings' | 'logs'
  >('credentials_db');
  const [isEditing, setIsEditing] = useState(false);

  // Personal Profile Form states
  const [tempName, setTempName] = useState(profile.name);
  const [tempRole, setTempRole] = useState(profile.role);
  const [tempPhone, setTempPhone] = useState(profile.phone);
  const [tempDept, setTempDept] = useState(profile.department);
  const [liveActivityInput, setLiveActivityInput] = useState(
    currentUserAccount?.currentActivity || 'ກຳລັງຕິດຕາມລະບົບບໍລິການເຕັກນິກ'
  );

  // User & Credentials Database Filter & Modal states
  const [userSearch, setUserSearch] = useState('');
  const [credSearch, setCredSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<'All' | UserAccount['accessLevel']>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Busy' | 'Offline'>('All');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Dedicated Credentials (Username / Email / Password) Edit Modal
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credTargetUser, setCredTargetUser] = useState<UserAccount | null>(null);
  const [credUsername, setCredUsername] = useState('');
  const [credEmail, setCredEmail] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(true);

  // Password visibility & copy feedback states
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Add/Edit User Form states
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('uniqtek@2025');
  const [formRole, setFormRole] = useState('Senior Technical Specialist');
  const [formDept, setFormDept] = useState('Service & Calibration');
  const [formPhone, setFormPhone] = useState('020 ');
  const [formAccess, setFormAccess] = useState<UserAccount['accessLevel']>('Technician');
  const [formStatus, setFormStatus] = useState<UserAccount['status']>('Online');
  const [formActivity, setFormActivity] = useState('');

  const rolesList = [
    'Senior Technical Specialist',
    'Technical Survey Engineer',
    'CORS Network Administrator',
    'Equipment Calibration Engineer',
    'Hardware & Electronics Engineer',
    'Geodetic & GIS Engineer',
    'Field Survey Team Lead',
    'IT Systems Administrator',
    'Operations Manager'
  ];

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const symbols = ['@', '#', '$', '!'];
    let code = 'Uniq';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code += symbols[Math.floor(Math.random() * symbols.length)];
    code += Math.floor(10 + Math.random() * 89);
    return code;
  };

  const evaluatePasswordStrength = (pwd?: string) => {
    const p = pwd || '';
    if (p.length >= 10 && /[@#$!%&*0-9]/.test(p)) {
      return {
        label: 'ແຂງແຮງສູງ (Strong)',
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
        bar: 'w-full bg-emerald-500'
      };
    }
    if (p.length >= 7) {
      return {
        label: 'ປານກາງ (Good)',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
        bar: 'w-2/3 bg-blue-500'
      };
    }
    return {
      label: 'ພື້ນຖານ (Basic)',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
      bar: 'w-1/3 bg-amber-500'
    };
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (usr: UserAccount) => {
    const text = `Username: ${usr.username || usr.email.split('@')[0]} | Email: ${usr.email} | Password: ${usr.password || 'uniqtek123'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(usr.id);
    triggerToast(`ສຳເນົາຂໍ້ມູນບັນຊີ ${usr.username || usr.email} ແລ້ວ`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = () => {
    setTempName(profile.name);
    setTempRole(profile.role);
    setTempPhone(profile.phone);
    setTempDept(profile.department);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(tempName.trim(), tempRole.trim(), tempPhone.trim(), tempDept.trim());
    setIsEditing(false);
    triggerToast('ບັນທຶກຂໍ້ມູນສ່ວນຕົວລົງຖານຂໍ້ມູນ Real-time ແລ້ວ');
  };

  const handleUpdateLiveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveActivityInput.trim()) return;
    updateUserPresenceStatus(currentUserAccount?.status || 'Online', liveActivityInput.trim());
    triggerToast('ອັບເດດສະຖານະ Real-time ແລ້ວ');
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword(generateRandomPassword());
    setFormRole('Technical Survey Engineer');
    setFormDept('Service & Calibration');
    setFormPhone('020 ');
    setFormAccess('Technician');
    setFormStatus('Online');
    setFormActivity('ພ້ອມປະຕິບັດວຽກງານເຕັກນິກ');
    setShowModalPassword(true);
    setShowUserModal(true);
  };

  const openEditUserModal = (target: UserAccount) => {
    setEditingUser(target);
    setFormName(target.name);
    setFormUsername(target.username || target.email.split('@')[0]);
    setFormEmail(target.email);
    setFormPassword(target.password || 'uniqtek123');
    setFormRole(target.role);
    setFormDept(target.department);
    setFormPhone(target.phone);
    setFormAccess(target.accessLevel);
    setFormStatus(target.status);
    setFormActivity(target.currentActivity || '');
    setShowModalPassword(true);
    setShowUserModal(true);
  };

  const openCredentialEditModal = (target: UserAccount) => {
    setCredTargetUser(target);
    setCredUsername(target.username || target.email.split('@')[0]);
    setCredEmail(target.email);
    setCredPassword(target.password || 'uniqtek123');
    setShowModalPassword(true);
    setShowCredentialModal(true);
  };

  const handleSaveCredentialModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credTargetUser || !credUsername.trim() || !credEmail.trim() || !credPassword.trim()) return;
    await updateUserCredentials(
      credTargetUser.id,
      credUsername.trim(),
      credEmail.trim(),
      credPassword.trim()
    );
    setShowCredentialModal(false);
    triggerToast(`ອັບເດດ ຊື່ຜູ້ໃຊ້, ອີເມວ ແລະ ລະຫັດຜ່ານຂອງ ${credTargetUser.name} ສຳເລັດແລ້ວ`);
  };

  const handleQuickResetPassword = async (target: UserAccount) => {
    const newPwd = generateRandomPassword();
    await resetUserPassword(target.id, newPwd);
    setVisiblePasswords((prev) => ({ ...prev, [target.id]: true }));
    triggerToast(`ສ້າງລະຫັດຜ່ານໃໝ່ໃຫ້ ${target.username || target.email}: ${newPwd}`);
  };

  const handleSaveUserForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;
    const finalUsername = formUsername.trim() || formEmail.trim().split('@')[0];
    const finalPassword = formPassword.trim() || 'uniqtek@2025';

    if (editingUser) {
      await updateUserAccount(editingUser.id, {
        name: formName.trim(),
        username: finalUsername,
        email: formEmail.trim(),
        password: finalPassword,
        role: formRole.trim(),
        department: formDept.trim(),
        phone: formPhone.trim(),
        accessLevel: formAccess,
        status: formStatus,
        currentActivity: formActivity.trim() || 'ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ Real-time'
      });
      triggerToast(`ອັບເດດບັນຊີ ${finalUsername} (${formEmail.trim()}) ສຳເລັດແລ້ວ`);
    } else {
      await addUserAccount({
        name: formName.trim(),
        username: finalUsername,
        email: formEmail.trim(),
        password: finalPassword,
        accountEnabled: true,
        role: formRole.trim(),
        department: formDept.trim(),
        phone: formPhone.trim(),
        accessLevel: formAccess,
        status: formStatus,
        currentActivity: formActivity.trim() || 'ລົງທະບຽນເຂົ້າລະບົບໃໝ່',
        themeMode: 'Light'
      });
      triggerToast(`ເພີ່ມບັນຊີຜູ້ໃຊ້ໃໝ່ ${finalUsername} ລົງຖານຂໍ້ມູນ Firestore ແລ້ວ`);
    }
    setShowUserModal(false);
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      (u.currentActivity || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCredentials = users.filter((u) => {
    const q = credSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.password || '').toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const matchesAccess = accessFilter === 'All' || u.accessLevel === accessFilter;
    return matchesSearch && matchesAccess;
  });

  const onlineUsersCount = users.filter((u) => u.status === 'Online').length;
  const busyUsersCount = users.filter((u) => u.status === 'Busy').length;
  const adminUsersCount = users.filter((u) => u.accessLevel === 'Admin' || u.accessLevel === 'Manager').length;
  const activeAccountsCount = users.filter((u) => u.accountEnabled !== false).length;
  const strongPasswordsCount = users.filter((u) => (u.password || '').length >= 8).length;

  const getStatusStyle = (st: UserAccount['status']) => {
    switch (st) {
      case 'Online':
        return {
          dot: 'bg-emerald-500 animate-pulse',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
          label: 'ອອນລາຍ (Online)'
        };
      case 'Busy':
        return {
          dot: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
          label: 'ກຳລັງເຮັດວຽກ (Busy)'
        };
      default:
        return {
          dot: 'bg-slate-400',
          badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
          label: 'ອອບລາຍ (Offline)'
        };
    }
  };

  const getAccessBadge = (level: UserAccount['accessLevel']) => {
    switch (level) {
      case 'Admin':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      case 'Manager':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'Engineer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      default:
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return { icon: Lock, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' };
      case 'repair':
        return { icon: Wrench, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' };
      case 'project':
        return { icon: MapPin, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' };
      case 'cors':
        return { icon: Radio, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' };
      case 'quote':
        return { icon: ShoppingCart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40' };
      case 'profile':
        return { icon: User, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' };
      default:
        return { icon: Info, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto">
      {/* Feedback Toast Banner */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Upper Profile Hero Header + Real-time Presence Bar */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E3A8A] to-[#0F172A] p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative inline-block shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E21B23] to-[#2563EB] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full rounded-full bg-[#1E3A8A] flex items-center justify-center text-2xl font-bold">
                {profile.name ? profile.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            </div>
            <span
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                currentUserAccount?.status === 'Busy'
                  ? 'bg-amber-500'
                  : currentUserAccount?.status === 'Offline'
                  ? 'bg-slate-400'
                  : 'bg-emerald-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                {currentUserAccount?.accessLevel || 'Admin'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Firestore Real-time • {lastSyncedAt}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {profile.role} • {profile.department}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-[11px] text-slate-200 font-mono">
                @{currentUserAccount?.username || (user || profile.email).split('@')[0]}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-[11px] text-slate-200">
                {user || profile.email}
              </span>
            </div>
          </div>
        </div>

        {/* Live Status & Real-Time Activity Broadcaster */}
        <form
          onSubmit={handleUpdateLiveActivity}
          className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
        >
          <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2 shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">ສະຖານະ Real-time:</span>
            <select
              value={currentUserAccount?.status || 'Online'}
              onChange={(e) =>
                updateUserPresenceStatus(
                  e.target.value as 'Online' | 'Busy' | 'Offline',
                  liveActivityInput
                )
              }
              className="bg-transparent font-bold text-white outline-hidden cursor-pointer"
            >
              <option value="Online" className="text-slate-900">🟢 Online</option>
              <option value="Busy" className="text-slate-900">🟡 Busy (ກຳລັງເຮັດວຽກ)</option>
              <option value="Offline" className="text-slate-900">⚪ Offline</option>
            </select>
          </div>

          <input
            type="text"
            value={liveActivityInput}
            onChange={(e) => setLiveActivityInput(e.target.value)}
            placeholder="ອັບເດດວຽກທີ່ກຳລັງເຮັດແບບ Real-time..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 outline-hidden focus:border-blue-400"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ອັບເດດ Real-time</span>
          </button>
        </form>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-1">
        <button
          data-testid="tab_credentials_db"
          onClick={() => setActiveTab('credentials_db')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'credentials_db'
              ? 'bg-[#E21B23] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 shrink-0" />
          <span className="truncate">ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ</span>
        </button>
        <button
          data-testid="tab_users_db"
          onClick={() => setActiveTab('users_db')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'users_db'
              ? 'bg-[#E21B23] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">ຜູ້ໃຊ້ Real-time ({users.length})</span>
        </button>
        <button
          data-testid="tab_profile"
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#E21B23] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span className="truncate">ຂໍ້ມູນສ່ວນຕົວ</span>
        </button>
        <button
          data-testid="tab_settings"
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#E21B23] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="truncate">ການຕັ້ງຄ່າ</span>
        </button>
        <button
          data-testid="tab_logs"
          onClick={() => setActiveTab('logs')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'logs'
              ? 'bg-[#E21B23] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4 shrink-0" />
          <span className="truncate">ປະຫວັດ Real-time</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: EMAIL / USERNAME & PASSWORD DATABASE MANAGEMENT SYSTEM             */}
      {/* ========================================================================= */}
      {activeTab === 'credentials_db' && (
        <div className="space-y-4">
          {/* Credentials Database Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                ບັນຊີຜູ້ໃຊ້ & ລະຫັດຜ່ານທັງໝົດ
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {users.length}
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  ບັນຊີ (Accounts)
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                ບັນຊີເປີດໃຊ້ງານ (Active)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeAccountsCount}/{users.length}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">ພ້ອມເຂົ້າລະບົບ</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-2xs">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block">
                ລະຫັດຜ່ານມາດຕະຖານ
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {strongPasswordsCount}
                </span>
                <span className="text-[10px] font-bold text-blue-600">ຄວາມປອດໄພສູງ</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                ສະຖານະຖານຂໍ້ມູນ Firestore
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {lastSyncedAt}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">LIVE DB</span>
              </div>
            </div>
          </div>

          {/* Credentials DB Main Management Card */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/70">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#E21B23]" />
                  <span>ລະບົບຈັດການຖານຂໍ້ມູນ ອີເມວ / ຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ຈັດການບັນຊີເຂົ້າສູ່ລະບົບ (Username, Email & Password), ປ່ຽນລະຫັດຜ່ານ, ສຸ່ມລະຫັດຜ່ານໃໝ່ ແລະ ຄວບຄຸມການເປີດ/ລະງັບບັນຊີແບບ Real-time
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAllPasswords((prev) => !prev)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {showAllPasswords ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                      <span>ເຊື່ອງລະຫັດຜ່ານ</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>ສະແດງລະຫັດຜ່ານທັງໝົດ</span>
                    </>
                  )}
                </button>

                <button
                  data-testid="add_credential_db_btn"
                  type="button"
                  onClick={openAddUserModal}
                  className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມບັນຊີ & ລະຫັດຜ່ານໃໝ່</span>
                </button>
              </div>
            </div>

            {/* Search & Access Role Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={credSearch}
                  onChange={(e) => setCredSearch(e.target.value)}
                  placeholder="ຄົ້ນຫາດ້ວຍ ຊື່ຜູ້ໃຊ້ (Username), ອີເມວ (Email), ຊື່ແທ້ ຫຼື ຕຳແໜ່ງ..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {(['All', 'Admin', 'Manager', 'Engineer', 'Technician'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAccessFilter(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      accessFilter === lvl
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lvl === 'All' ? 'ທຸກສິດທິ' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Credentials Database Table / Cards */}
            <div className="space-y-3">
              {filteredCredentials.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  ບໍ່ພົບບັນຊີຜູ້ໃຊ້ ຫຼື ອີເມວທີ່ຄົ້ນຫາ
                </div>
              ) : (
                filteredCredentials.map((usr) => {
                  const isPwdShown = showAllPasswords || !!visiblePasswords[usr.id];
                  const pwdStrength = evaluatePasswordStrength(usr.password);
                  const isLocked = usr.accountEnabled === false;
                  const isCurrentSession =
                    user && usr.email.toLowerCase() === user.toLowerCase();
                  const resolvedUsername = usr.username || usr.email.split('@')[0];

                  return (
                    <div
                      key={usr.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isLocked
                          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                          : isCurrentSession
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800'
                          : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-700/70 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Row: User Info + Account Status + Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {usr.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getAccessBadge(
                                  usr.accessLevel
                                )}`}
                              >
                                {usr.accessLevel}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isLocked
                                    ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                }`}
                              >
                                {isLocked ? '🔒 ບັນຊີຖືກລະງັບ' : '✓ ເປີດໃຊ້ງານປົກກະຕິ'}
                              </span>
                              {isCurrentSession && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                  ກຳລັງໃຊ້ງານ
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {usr.role} • {usr.department} • ID: {usr.id}
                            </p>
                          </div>
                        </div>

                        {/* Credential Actions */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openCredentialEditModal(usr)}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>ແກ້ໄຂຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickResetPassword(usr)}
                            title="ສຸ່ມລະຫັດຜ່ານໃໝ່ທັນທີ"
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>ສຸ່ມລະຫັດໃໝ່</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(usr)}
                            title="ສຳເນົາຂໍ້ມູນການເຂົ້າລະບົບ"
                            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                          >
                            {copiedId === usr.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {!isCurrentSession && (
                            <button
                              type="button"
                              onClick={() => toggleUserAccountLock(usr.id)}
                              title={isLocked ? 'ປົດລ໋ອກບັນຊີ' : 'ລະງັບບັນຊີຊົ່ວຄາວ'}
                              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                                isLocked
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              {isLocked ? (
                                <Unlock className="w-3.5 h-3.5" />
                              ) : (
                                <Lock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Credentials Grid: Username | Email | Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        {/* 1. Username Box */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <AtSign className="w-3 h-3 text-blue-500" />
                            <span>ຊື່ຜູ້ໃຊ້ (Username)</span>
                          </span>
                          <div className="mt-1 font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                            {resolvedUsername}
                          </div>
                        </div>

                        {/* 2. Email Box */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <span>ອີເມວເຂົ້າລະບົບ (Email)</span>
                          </span>
                          <div className="mt-1 font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                            {usr.email}
                          </div>
                        </div>

                        {/* 3. Password Box with Reveal Toggle & Strength */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-[#E21B23]" />
                                <span>ລະຫັດຜ່ານ (Password)</span>
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${pwdStrength.color}`}>
                                {pwdStrength.label}
                              </span>
                            </div>
                            <div className="mt-1 font-mono font-bold text-xs text-slate-900 dark:text-white tracking-wider truncate">
                              {isPwdShown ? usr.password || 'uniqtek123' : '••••••••••••'}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(usr.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
                            title={isPwdShown ? 'ເຊື່ອງລະຫັດຜ່ານ' : 'ເບິ່ງລະຫັດຜ່ານ'}
                          >
                            {isPwdShown ? (
                              <EyeOff className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Footer Metadata: Last password update & Quick Login Switch */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                        <span>
                          ອັບເດດລະຫັດຜ່ານຫຼ້າສຸດ: <strong className="text-slate-600 dark:text-slate-300">{usr.passwordUpdatedAt || '2025-02-15 08:30'}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          {!isCurrentSession && !isLocked && (
                            <button
                              type="button"
                              onClick={() => {
                                login(usr.username || usr.email, usr.password);
                                triggerToast(`ເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີ ${usr.username || usr.email} ແລ້ວ`);
                              }}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>ທົດສອບເຂົ້າສູ່ລະບົບດ້ວຍບັນຊີນີ້</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditUserModal(usr)}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                          >
                            ແກ້ໄຂຂໍ້ມູນທັງໝົດ
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: REAL-TIME USER DATABASE (ຖານຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ງານ)                    */}
      {/* ========================================================================= */}
      {activeTab === 'users_db' && (
        <div className="space-y-4">
          {/* Real-time User Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                ຜູ້ໃຊ້ທັງໝົດໃນລະບົບ
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {users.length}
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Firestore DB
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                ກຳລັງອອນລາຍ (Online)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {onlineUsersCount}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">
                ກຳລັງປະຕິບັດງານ (Busy)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {busyUsersCount}
                </span>
                <span className="text-[10px] font-bold text-amber-600">ພາກສະໜາມ/ສ້ອມແປງ</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                ຜູ້ບໍລິຫານ (Admin)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {adminUsersCount}
                </span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  Full Access
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Add User Controls */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>ຖານຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ງານ (Firebase Real-time Users DB)</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ຂໍ້ມູນຜູ້ໃຊ້ງານ, ສິດທິການເຂົ້າເຖິງ ແລະ ສະຖານະການເຮັດວຽກອັບເດດອັດຕະໂນມັດແບບ Real-time
                </p>
              </div>
              <button
                data-testid="add_user_db_btn"
                onClick={openAddUserModal}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ເພີ່ມຜູ້ໃຊ້ໃໝ່</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="ຄົ້ນຫາຊື່ຜູ້ໃຊ້, ອີເມວ, ຕຳແໜ່ງ, ພະແນກ ຫຼື ວຽກທີ່ກຳລັງເຮັດ..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {(['All', 'Online', 'Busy', 'Offline'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' ? 'ທັງໝົດ' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-2.5 pt-1">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ງານທີ່ຄົ້ນຫາ
                </div>
              ) : (
                filteredUsers.map((usr) => {
                  const stStyle = getStatusStyle(usr.status);
                  const isCurrentSession =
                    user && usr.email.toLowerCase() === user.toLowerCase();

                  return (
                    <div
                      key={usr.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                        isCurrentSession
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800'
                          : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-700/70 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                              {usr.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${stStyle.dot}`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {usr.name}
                              </span>
                              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                                @{usr.username || usr.email.split('@')[0]}
                              </span>
                              {isCurrentSession && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                  ກຳລັງໃຊ້ງານ (You)
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getAccessBadge(
                                  usr.accessLevel
                                )}`}
                              >
                                <Shield className="w-2.5 h-2.5 inline mr-0.5" />
                                {usr.accessLevel}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${stStyle.badge}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot}`} />
                                {stStyle.label}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-slate-400" />
                                {usr.role} ({usr.department})
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {usr.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {usr.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openCredentialEditModal(usr)}
                            title="ຈັດການ ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ"
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800/60 cursor-pointer"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span className="hidden sm:inline">ລະຫັດຜ່ານ</span>
                          </button>
                          {!isCurrentSession && (
                            <button
                              type="button"
                              onClick={() => login(usr.email)}
                              title="ສະຫຼັບເຂົ້າໃຊ້ບັນຊີນີ້"
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60 cursor-pointer"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span className="hidden sm:inline">ສະຫຼັບບັນຊີ</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditUserModal(usr)}
                            title="ແກ້ໄຂຂໍ້ມູນ Real-time"
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrentSession && (
                            <button
                              type="button"
                              onClick={() => deleteUserAccount(usr.id)}
                              title="ລຶບຜູ້ໃຊ້"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Real-time Activity & Last Active Footer */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-slate-400">ກິດຈະກຳປັດຈຸບັນ:</span>
                          <span className="font-semibold">
                            {usr.currentActivity || 'ພ້ອມປະຕິບັດງານໃນລະບົບ'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-[10px] text-slate-400">{usr.lastActive}</span>
                          <select
                            value={usr.status}
                            onChange={(e) =>
                              updateUserAccount(usr.id, {
                                status: e.target.value as 'Online' | 'Busy' | 'Offline'
                              })
                            }
                            aria-label={`ປ່ຽນສະຖານະ ${usr.name}`}
                            className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 outline-hidden cursor-pointer"
                          >
                            <option value="Online">🟢 Online</option>
                            <option value="Busy">🟡 Busy</option>
                            <option value="Offline">⚪ Offline</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSONAL PROFILE (ຂໍ້ມູນສ່ວນຕົວ)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              ຂໍ້ມູນປະຈຳຕົວເຕັກນິກ (Real-time Synced)
            </h2>
            {!isEditing && (
              <button
                data-testid="edit_profile_toggle"
                onClick={handleStartEdit}
                className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                title="ແກ້ໄຂຂໍ້ມູນ"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ
                </label>
                <input
                  data-testid="edit_profile_name"
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ບົດບາດ / ຕຳແໜ່ງ
                </label>
                <select
                  data-testid="edit_profile_role"
                  value={tempRole}
                  onChange={(e) => setTempRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ພະແນກ / ຝ່າຍ
                </label>
                <input
                  data-testid="edit_profile_dept"
                  type="text"
                  value={tempDept}
                  onChange={(e) => setTempDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ເບີໂທຕິດຕໍ່
                </label>
                <input
                  data-testid="edit_profile_phone"
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  data-testid="cancel_edit_button"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  ຍົກເລີກ
                </button>
                <button
                  data-testid="save_edit_button"
                  type="submit"
                  className="px-5 py-2 bg-[#E21B23] hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  ບັນທຶກ Real-time
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <User className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 text-[10px] block">ຊື່ ແລະ ນາມສະກຸນ:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 text-[10px] block">ຕຳແໜ່ງ:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Building className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 text-[10px] block">ພະແນກ:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Phone className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 text-[10px] block">ເບີໂທຕິດຕໍ່:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{profile.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 text-[10px] block">ອີເມວລະບົບ:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user || profile.email}</span>
                </div>
              </div>

              {/* Digital Signature Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  ລາຍເຊັນດິຈິຕອນ (Digital Signature Approved)
                </span>
                <p className="font-serif italic text-lg text-blue-900 dark:text-blue-300 py-1">
                  / signed / {profile.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  ID: UNIQ-{Math.abs(profile.name.length * 9871).toString(16).toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SETTINGS & REAL-TIME SYNC DIAGNOSTICS                              */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5 text-xs">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ການຕັ້ງຄ່າແອັບພລິເຄຊັນ & Real-time Sync
          </h2>

          {/* Theme Mode */}
          <div className="space-y-2">
            <span className="text-slate-500 font-medium block">
              ຮູບແບບການສະແດງຜົນ (App Theme)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['Light', 'Dark', 'System'] as const).map((mode) => (
                <button
                  key={mode}
                  data-testid={`theme_${mode.toLowerCase()}`}
                  onClick={() => updateThemeMode(mode)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    profile.themeMode === mode
                      ? 'bg-[#E21B23] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <span className="text-slate-500 font-medium block">
              ການດູແລຮັກສາລະບົບ (Maintenance)
            </span>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  ແຄຊ໌ ແລະ ຂໍ້ມູນຊົ່ວຄາວ
                </p>
                <p className="text-[11px] text-slate-400">
                  ລຶບລາຍການບັນທຶກປະຫວັດ ແລະ ໄຟລ໌ຂີ້ເຫຍື້ອ
                </p>
              </div>
              <button
                data-testid="clear_system_cache_button"
                onClick={clearActivityLogs}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
              >
                ລ້າງຂໍ້ມູນ
              </button>
            </div>
          </div>

          {/* Sync Diagnostics */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">
                    ການເຊື່ອມຕໍ່ຖານຂໍ້ມູນ Firebase Firestore: Online (Real-time)
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    ອັບເດດຂໍ້ມູນຫຼ້າສຸດເມື່ອ: {lastSyncedAt} • ຈຳນວນ Event Sync: {realtimeEventCount} ຄັ້ງ
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['users', 'employees', 'repairs', 'projects', 'quotations', 'internal_notes', 'activity_logs'].map(
                (col) => (
                  <span
                    key={col}
                    className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/70 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] border border-emerald-200/60 dark:border-emerald-800/60"
                  >
                    /{col} ✓
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REAL-TIME LOGS (ປະຫວັດການເຮັດວຽກ Real-time)                        */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                ບັນທຶກການເຮັດວຽກ Real-time (Live Activity Stream)
              </h2>
              <p className="text-[11px] text-slate-400">
                ຊິ້ງຂໍ້ມູນກັບຄໍເລັກຊັນ Firestore `activity_logs` ແບບເວລາຈິງ
              </p>
            </div>
            {activityLogs.length > 0 && (
              <button
                data-testid="clear_logs_text"
                onClick={clearActivityLogs}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                ລ້າງປະຫວັດ
              </button>
            )}
          </div>

          {activityLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              ບໍ່ມີການເຄື່ອນໄຫວໃນເວລານີ້
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activityLogs.map((log) => {
                const { icon: IconComp, color } = getLogIcon(log.type);
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 flex items-start gap-3 text-xs"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        {log.details}
                      </p>
                      {log.userEmail && (
                        <span className="inline-block mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                          ໂດຍ: {log.userEmail}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dedicated Edit Credentials (Username / Email / Password) Modal */}
      {showCredentialModal && credTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#E21B23] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    ຈັດການ ອີເມວ / ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ບັນຊີຂອງ: {credTargetUser.name} ({credTargetUser.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentialModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentialModal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ຜູ້ໃຊ້ສຳລັບເຂົ້າລະບົບ (Username) *
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={credUsername}
                    onChange={(e) => setCredUsername(e.target.value)}
                    placeholder="username"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ອີເມວບັນຊີຜູ້ໃຊ້ (Email) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={credEmail}
                    onChange={(e) => setCredEmail(e.target.value)}
                    placeholder="user@uniqtek.la"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    ລະຫັດຜ່ານ (Password) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setCredPassword(generateRandomPassword())}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>ສຸ່ມລະຫັດຜ່ານປອດໄພ</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="ລະຫັດຜ່ານເຂົ້າລະບົບ"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">ລະດັບຄວາມປອດໄພລະຫັດຜ່ານ:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {evaluatePasswordStrength(credPassword).label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        evaluatePasswordStrength(credPassword).bar
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCredentialModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E21B23] hover:bg-red-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  ບັນທຶກລົງຖານຂໍ້ມູນ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit User & Credentials Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingUser
                  ? 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ & ລະຫັດຜ່ານ (Real-time)'
                  : 'ເພີ່ມບັນຊີຜູ້ໃຊ້, ອີເມວ & ລະຫັດຜ່ານໃໝ່'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ທ່ານ ສົມພອນ ເພັດດາລາ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ຊື່ຜູ້ໃຊ້ (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="somphone.p"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ອີເມວບັນຊີຜູ້ໃຊ້ (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => {
                      setFormEmail(e.target.value);
                      if (!formUsername && e.target.value.includes('@')) {
                        setFormUsername(e.target.value.split('@')[0]);
                      }
                    }}
                    placeholder="user@uniqtek.la"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    ລະຫັດຜ່ານສຳລັບເຂົ້າລະບົບ (Password) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormPassword(generateRandomPassword())}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>ສຸ່ມລະຫັດຜ່ານ</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="ລະຫັດຜ່ານເຂົ້າລະບົບ"
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ລະດັບສິດ (Access Level)
                  </label>
                  <select
                    value={formAccess}
                    onChange={(e) => setFormAccess(e.target.value as UserAccount['accessLevel'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  >
                    <option value="Admin">Admin (ຜູ້ບໍລິຫານ)</option>
                    <option value="Manager">Manager (ຫົວໜ້າພະແນກ)</option>
                    <option value="Engineer">Engineer (ວິສະວະກອນ)</option>
                    <option value="Technician">Technician (ຊ່າງເຕັກນິກ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ສະຖານະ (Real-time Status)
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as UserAccount['status'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  >
                    <option value="Online">🟢 Online</option>
                    <option value="Busy">🟡 Busy</option>
                    <option value="Offline">⚪ Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ຕຳແໜ່ງ (Role)
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ເບີໂທຕິດຕໍ່ (Phone)
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ພະແນກ / ຝ່າຍ (Department)
                </label>
                <input
                  type="text"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ກິດຈະກຳປັດຈຸບັນ (Real-time Activity Info)
                </label>
                <input
                  type="text"
                  value={formActivity}
                  onChange={(e) => setFormActivity(e.target.value)}
                  placeholder="ກຳລັງກວດເຊັກເຄື່ອງສ້ອມແປງ / ລົງພາກສະໜາມ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  {editingUser ? 'ບັນທຶກການອັບເດດ' : 'ບັນທຶກລົງຖານຂໍ້ມູນ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back to dashboard button */}
      <button
        data-testid="back_to_dashboard_button"
        onClick={() => navigateTo('dashboard')}
        className="w-full h-12 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ກັບຄືນໜ້າຫຼັກ</span>
      </button>
    </div>
  );
};


