import React, { useState } from 'react';
import {
  Lock,
  User,
  AlertCircle,
  Database,
  Wifi,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  AtSign,
  CheckCircle2
} from 'lucide-react';
import { UniqTekLogo } from '../components/UniqTekLogo';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, addUserAccount, users, lastSyncedAt } = useApp();
  const [email, setEmail] = useState('admin@uniqtek.la');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Optional New Account Registration Mode
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Technical Survey Engineer');
  const [regSuccess, setRegSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('ກະລຸນາປ້ອນຂໍ້ມູນ ອີເມວ/ຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານໃຫ້ຄົບຖ້ວນ');
      return;
    }
    const result = login(email.trim(), password);
    if (!result.success) {
      setError(result.message || 'ຂໍ້ມູນການເຂົ້າສູ່ລະບົບບໍ່ຖືກຕ້ອງ');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('ກະລຸນາປ້ອນຂໍ້ມູນລົງທະບຽນໃຫ້ຄົບຖ້ວນ');
      return;
    }
    const duplicate = users.find(
      (u) =>
        u.email.toLowerCase() === regEmail.trim().toLowerCase() ||
        (u.username && u.username.toLowerCase() === regUsername.trim().toLowerCase())
    );
    if (duplicate) {
      setError('ຊື່ຜູ້ໃຊ້ ຫຼື ອີເມວນີ້ມີໃນຖານຂໍ້ມູນແລ້ວ');
      return;
    }

    await addUserAccount({
      name: regName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      accountEnabled: true,
      role: regRole,
      department: 'Technical Service & Support',
      phone: '020 76 111 800',
      accessLevel: 'Technician',
      status: 'Online',
      currentActivity: 'ລົງທະບຽນບັນຊີໃໝ່ຜ່ານໜ້າເຂົ້າສູ່ລະບົບ',
      themeMode: 'Light'
    });

    setRegSuccess(`ລົງທະບຽນບັນຊີ @${regUsername.trim()} ລົງຖານຂໍ້ມູນສຳເລັດແລ້ວ!`);
    setEmail(regUsername.trim());
    setPassword(regPassword.trim());
    setIsRegisterMode(false);
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-[#1E3A8A] to-[#0F172A]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <UniqTekLogo size={72} roundedClassName="rounded-2xl shadow-md" />

          <h1 className="mt-4 text-xl sm:text-2xl font-bold text-[#0F172A]">
            UNIQTEK CO., LTD
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            ລະບົບຈັດການບໍລິການເຕັກນິກ & ຖານຂໍ້ມູນບັນຊີຜູ້ໃຊ້
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>ຖານຂໍ້ມູນ ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ ({users.length} ບັນຊີ • {lastSyncedAt})</span>
          </div>
        </div>

        {/* Mode Switcher: Login vs Register Account */}
        <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError('');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isRegisterMode
                ? 'bg-white text-[#1E3A8A] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ເຂົ້າສູ່ລະບົບ (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError('');
              setRegSuccess('');
            }}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isRegisterMode
                ? 'bg-white text-[#1E3A8A] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ເພີ່ມບັນຊີໃໝ່ລົງ DB</span>
          </button>
        </div>

        {regSuccess && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{regSuccess}</span>
          </div>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ອີເມວ (Email) ຫຼື ຊື່ຜູ້ໃຊ້ (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  data-testid="username_input"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-[#0F172A] text-sm transition-all outline-hidden"
                  placeholder="ເຊັ່ນ: admin ຫຼື admin@uniqtek.la"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ລະຫັດຜ່ານ (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  data-testid="password_input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-[#0F172A] text-sm transition-all outline-hidden"
                  placeholder="ລະຫັດຜ່ານ"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'ເຊື່ອງລະຫັດຜ່ານ' : 'ສະແດງລະຫັດຜ່ານ'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-1">
              <button
                data-testid="login_button"
                type="submit"
                className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center text-base cursor-pointer"
              >
                ເຂົ້າສູ່ລະບົບ
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ຊື່ ແລະ ນາມສະກຸນ *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="ທ່ານ ສົມພອນ ເພັດດາລາ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] text-[#0F172A] outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ຊື່ຜູ້ໃຊ້ (Username) *
                </label>
                <div className="relative">
                  <AtSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="somphone.p"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] text-[#0F172A] font-mono outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ອີເມວ (Email) *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (!regUsername && e.target.value.includes('@')) {
                        setRegUsername(e.target.value.split('@')[0]);
                      }
                    }}
                    placeholder="user@uniqtek.la"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] text-[#0F172A] font-mono outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ລະຫັດຜ່ານ (Password) *
                </label>
                <input
                  type="text"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="uniqtek@2025"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] text-[#0F172A] font-mono outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ຕຳແໜ່ງ (Role)
                </label>
                <input
                  type="text"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2563EB] text-[#0F172A] outline-hidden"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>ບັນທຶກບັນຊີ & ລະຫັດຜ່ານລົງຖານຂໍ້ມູນ</span>
            </button>
          </form>
        )}

        {/* Quick Select from Firebase User & Credentials Database */}
        {users.length > 0 && !isRegisterMode && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>ເລືອກບັນຊີຈາກຖານຂໍ້ມູນ (ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ)</span>
              </span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {users.slice(0, 6).map((u) => {
                const isSelected =
                  email.toLowerCase() === u.email.toLowerCase() ||
                  (u.username && email.toLowerCase() === u.username.toLowerCase());
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setEmail(u.username || u.email);
                      setPassword(u.password || 'admin123');
                      setError('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold truncate flex items-center gap-1.5">
                        <span>{u.name}</span>
                        <span className="text-[10px] font-mono text-blue-600">
                          @{u.username || u.email.split('@')[0]}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">
                        {u.email} • ລະຫັດ: {u.password || 'admin123'}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.accountEnabled === false
                          ? 'bg-red-100 text-red-700'
                          : u.status === 'Online'
                          ? 'bg-emerald-100 text-emerald-700'
                          : u.status === 'Busy'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {u.accountEnabled === false ? 'Locked' : u.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-slate-400">
          ຕິດຕໍ່ຝ່າຍບໍລິຫານລະບົບ: 020 76 111 800
        </div>
      </div>
    </div>
  );
};


