import React from 'react';
import { User, LogOut, Users, Wifi } from 'lucide-react';
import { UniqTekLogo } from './UniqTekLogo';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    user,
    profile,
    users,
    currentUserAccount,
    lastSyncedAt,
    updateUserPresenceStatus,
    navigateTo,
    logout
  } = useApp();

  const onlineCount = users.filter((u) => u.status === 'Online' || u.status === 'Busy').length;
  const activeStatus = currentUserAccount?.status || 'Online';

  const statusColor =
    activeStatus === 'Online'
      ? 'bg-emerald-500'
      : activeStatus === 'Busy'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div
          data-testid="app_header_row"
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => navigateTo('dashboard')}
        >
          <UniqTekLogo size={34} roundedClassName="rounded-lg shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-slate-900 dark:text-white leading-tight truncate">
                UNIQTEK SERVICES
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>LIVE • {lastSyncedAt}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`} />
              <span className="truncate">
                {profile.name || user || 'ບໍ່ລະບຸ'} ({currentUserAccount?.accessLevel || 'Admin'})
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions & Real-Time Presence */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Online Status Selector */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <select
              data-testid="header_presence_select"
              value={activeStatus}
              onChange={(e) =>
                updateUserPresenceStatus(e.target.value as 'Online' | 'Busy' | 'Offline')
              }
              aria-label="ສະຖານະອອນລາຍ"
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer text-[11px]"
            >
              <option value="Online" className="text-slate-900">🟢 ອອນລາຍ (Online)</option>
              <option value="Busy" className="text-slate-900">🟡 ກຳລັງເຮັດວຽກ (Busy)</option>
              <option value="Offline" className="text-slate-900">⚪ ອອບລາຍ (Offline)</option>
            </select>
          </div>

          {/* Users Database Quick Button */}
          <button
            data-testid="users_db_header_btn"
            onClick={() => navigateTo('profile')}
            title="ຖານຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ງານ Real-time"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/70 dark:border-blue-800/60 transition-colors text-xs font-bold"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">ຜູ້ໃຊ້ ({onlineCount}/{users.length})</span>
            <span className="sm:hidden">{onlineCount}</span>
          </button>

          <button
            data-testid="profile_button"
            onClick={() => navigateTo('profile')}
            title="ຂໍ້ມູນສ່ວນຕົວ (Profile)"
            className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            data-testid="logout_button"
            onClick={logout}
            title="ອອກຈາກລະບົບ (Logout)"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

