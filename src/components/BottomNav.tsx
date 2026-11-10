import React from 'react';
import { Home, Wrench, MapPin, Radio, Info, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentView, navigateTo } = useApp();

  const isDetailOrProfileView =
    currentView.endsWith('_details') || currentView === 'profile';

  if (isDetailOrProfileView) {
    return null;
  }

  const navItems = [
    {
      id: 'dashboard',
      label: 'ໜ້າຫຼັກ',
      icon: Home,
      indicatorColor: 'bg-blue-600',
      testId: 'nav_dashboard'
    },
    {
      id: 'repairs',
      label: 'ສ້ອມແປງ',
      icon: Wrench,
      indicatorColor: 'bg-blue-600',
      testId: 'nav_repairs'
    },
    {
      id: 'projects',
      label: 'ສຳຫຼວດ',
      icon: MapPin,
      indicatorColor: 'bg-emerald-500',
      testId: 'nav_projects'
    },
    {
      id: 'cors',
      label: 'CORS',
      icon: Radio,
      indicatorColor: 'bg-amber-600',
      testId: 'nav_cors'
    },
    {
      id: 'equipment',
      label: 'ອຸປະກອນ',
      icon: Info,
      indicatorColor: 'bg-sky-600',
      testId: 'nav_equipment'
    },
    {
      id: 'quotations',
      label: 'ໃບສະເໜີ',
      icon: ShoppingCart,
      indicatorColor: 'bg-pink-600',
      testId: 'nav_quotations'
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#1E3A8A] text-white shadow-2xl border-t border-blue-900"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 sm:py-2">
        {navItems.map((item) => {
          const isSelected = currentView === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              data-testid={item.testId}
              onClick={() => navigateTo(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group relative focus:outline-hidden"
            >
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${
                  isSelected ? `${item.indicatorColor} text-white` : 'text-white/60 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isSelected ? 'text-white font-semibold' : 'text-white/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
