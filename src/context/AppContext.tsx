import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Repair,
  Project,
  CORSStation,
  Equipment,
  Quotation,
  InternalNote,
  UserLog,
  UserProfile,
  QuotationItem,
  Employee,
  UserAccount
} from '../types';
import {
  initialRepairs,
  initialProjects,
  initialCORSStations,
  initialEquipment,
  initialQuotations,
  initialNotes,
  initialProfile,
  initialEmployees,
  initialUsers
} from '../data/seedData';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VIEW_LABELS_LAO: Record<string, string> = {
  dashboard: 'ກຳລັງຕິດຕາມໜ້າຫຼັກ (Dashboard)',
  repairs: 'ກຳລັງຈັດການລາຍການສ້ອມແປງ (Repairs)',
  repair_details: 'ກຳລັງກວດເຊັກລາຍລະອຽດເຄື່ອງສ້ອມແປງ',
  projects: 'ກຳລັງຕິດຕາມໂຄງການສຳຫຼວດ (Projects)',
  project_details: 'ກຳລັງເບິ່ງລາຍລະອຽດໂຄງການສຳຫຼວດ',
  cors: 'ກຳລັງຕິດຕາມສະຖານີ CORS Real-time',
  equipment: 'ກຳລັງກວດສອບບັນຊີອຸປະກອນເຕັກນິກ',
  quotations: 'ກຳລັງຈັດການໃບສະເໜີລາຄາ (Quotations)',
  quotation_details: 'ກຳລັງກວດສອບລາຍລະອຽດໃບສະເໜີລາຄາ',
  profile: 'ກຳລັງຈັດການຖານຂໍ້ມູນຜູ້ໃຊ້ ແລະ ໂປຣໄຟລ໌'
};

interface AppContextType {
  user: string | null;
  currentView: string;
  selectedRepair: Repair | null;
  selectedProject: Project | null;
  selectedQuotation: Quotation | null;
  profile: UserProfile;
  activityLogs: UserLog[];
  repairs: Repair[];
  projects: Project[];
  stations: CORSStation[];
  equipment: Equipment[];
  quotations: Quotation[];
  notes: InternalNote[];
  employees: Employee[];
  isLoadingEmployees: boolean;
  users: UserAccount[];
  currentUserAccount: UserAccount | null;
  isRealtimeConnected: boolean;
  lastSyncedAt: string;
  realtimeEventCount: number;
  addEmployee: (employee: Omit<Employee, 'id'> & { id?: string }) => Promise<void>;
  addUserAccount: (userData: Omit<UserAccount, 'id' | 'lastActive'> & { id?: string }) => Promise<void>;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => Promise<void>;
  updateUserCredentials: (id: string, username: string, email: string, password: string) => Promise<void>;
  resetUserPassword: (id: string, newPassword: string) => Promise<void>;
  toggleUserAccountLock: (id: string) => Promise<void>;
  deleteUserAccount: (id: string) => Promise<void>;
  updateUserPresenceStatus: (status: 'Online' | 'Busy' | 'Offline', currentActivity?: string) => Promise<void>;
  login: (identifier: string, passwordInput?: string) => { success: boolean; message?: string };
  logout: () => void;
  navigateTo: (view: string) => void;
  selectRepair: (repair: Repair | null) => void;
  selectProject: (project: Project | null) => void;
  selectQuotation: (quotation: Quotation | null) => void;
  addRepair: (
    serialNo: string,
    model: string,
    title: string,
    client: string,
    problem: string,
    assignedTech: string,
    priority?: 'High' | 'Medium' | 'Low'
  ) => void;
  updateRepairStatus: (
    repair: Repair,
    newStatus: 'ກຳລັງສ້ອມແປງ' | 'ສຳເລັດແລ້ວ' | 'ລໍຖ້າກວດເຊັກ' | 'ກຳລັງສຳຫຼວດ',
    cause?: string,
    solution?: string,
    priority?: 'High' | 'Medium' | 'Low'
  ) => void;
  addInternalNote: (repairId: string, author: string, text: string) => void;
  addProject: (title: string, client: string, location: string, lat: number, lng: number, teamName: string, teamRole: string, teamPhone: string) => void;
  updateProjectProgress: (project: Project, progress: number, status: 'ກຳລັງສຳຫຼວດ' | 'ລໍຖ້າການວິເຄາະ' | 'ສຳເລັດແລ້ວ') => void;
  toggleStationStatus: (station: CORSStation) => void;
  updateStationIssue: (station: CORSStation, issue: string) => void;
  updateEquipmentDetail: (eq: Equipment) => void;
  addQuotation: (customerName: string, validity: string, items: QuotationItem[], terms: string) => void;
  updateProfile: (name: string, role: string, phone: string, dept: string) => void;
  updateThemeMode: (mode: 'Light' | 'Dark' | 'System') => void;
  clearActivityLogs: () => void;
  logUserOperation: (action: string, details: string, type: UserLog['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`uniqtek_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`uniqtek_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(() => loadFromStorage<string | null>('user', 'admin@uniqtek.la'));
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const [repairs, setRepairs] = useState<Repair[]>(() => loadFromStorage<Repair[]>('repairs', initialRepairs));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage<Project[]>('projects', initialProjects));
  const [stations, setStations] = useState<CORSStation[]>(() => loadFromStorage<CORSStation[]>('stations', initialCORSStations));
  const [equipment, setEquipment] = useState<Equipment[]>(() => loadFromStorage<Equipment[]>('equipment', initialEquipment));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadFromStorage<Quotation[]>('quotations', initialQuotations));
  const [notes, setNotes] = useState<InternalNote[]>(() => loadFromStorage<InternalNote[]>('notes', initialNotes));
  const [profile, setProfile] = useState<UserProfile>(() => loadFromStorage<UserProfile>('profile', initialProfile));
  const [employees, setEmployees] = useState<Employee[]>(() => loadFromStorage<Employee[]>('employees', initialEmployees));
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(true);
  const [users, setUsers] = useState<UserAccount[]>(() => loadFromStorage<UserAccount[]>('users_db', initialUsers));
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => new Date().toLocaleTimeString('en-GB'));
  const [realtimeEventCount, setRealtimeEventCount] = useState<number>(1);

  const [activityLogs, setActivityLogs] = useState<UserLog[]>(() => loadFromStorage<UserLog[]>('logs', [
    {
      id: "log-init",
      timestamp: new Date().toLocaleString('en-GB'),
      action: "ເລີ່ມຕົ້ນລະບົບ Real-time",
      details: "ເຊື່ອມຕໍ່ຖານຂໍ້ມູນຜູ້ໃຊ້ງານ ແລະ Cloud Firestore Real-time Sync ສຳເລັດ",
      type: "system",
      userEmail: "admin@uniqtek.la"
    }
  ]));

  const markRealtimeSync = () => {
    setIsRealtimeConnected(true);
    setLastSyncedAt(new Date().toLocaleTimeString('en-GB'));
    setRealtimeEventCount(prev => prev + 1);
  };

  // Current logged-in user account matched from Firestore users DB
  const currentUserAccount = useMemo<UserAccount | null>(() => {
    if (!user) return null;
    const found = users.find(
      u =>
        u.email.toLowerCase() === user.toLowerCase() ||
        (u.username && u.username.toLowerCase() === user.toLowerCase())
    );
    if (found) return found;
    return {
      id: 'USR-ACTIVE',
      username: user.split('@')[0],
      name: profile.name,
      email: user,
      password: 'admin123',
      passwordUpdatedAt: '2025-02-15 08:30',
      accountEnabled: true,
      role: profile.role,
      department: profile.department,
      phone: profile.phone,
      accessLevel: 'Admin',
      status: 'Online',
      lastActive: lastSyncedAt,
      currentActivity: VIEW_LABELS_LAO[currentView] || 'ກຳລັງໃຊ້ງານລະບົບ',
      themeMode: profile.themeMode
    };
  }, [user, users, profile, lastSyncedAt, currentView]);

  // 1. Real-time listener for `users` (User & Credentials Database)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const colRef = collection(db, 'users');
      unsubscribe = onSnapshot(
        colRef,
        async (snapshot) => {
          if (snapshot.empty) {
            for (const usr of initialUsers) {
              try {
                await setDoc(doc(db, 'users', usr.id), usr, { merge: true });
              } catch (err) {
                console.warn(`Failed seeding user ${usr.id}:`, err);
              }
            }
            setUsers(initialUsers);
            saveToStorage('users_db', initialUsers);
          } else {
            const list: UserAccount[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as UserAccount;
              const docId = data.id || docSnap.id;
              const seedMatch = initialUsers.find(
                s => s.id === docId || s.email.toLowerCase() === (data.email || '').toLowerCase()
              );
              const enriched: UserAccount = {
                ...data,
                id: docId,
                username:
                  data.username ||
                  seedMatch?.username ||
                  (data.email ? data.email.split('@')[0] : docId.toLowerCase()),
                password: data.password || seedMatch?.password || 'uniqtek123',
                passwordUpdatedAt:
                  data.passwordUpdatedAt || seedMatch?.passwordUpdatedAt || '2025-02-15 08:30',
                accountEnabled: data.accountEnabled !== undefined ? data.accountEnabled : true
              };
              // Backfill missing credential fields to Firestore once
              if (!data.username || !data.password) {
                setDoc(doc(db, 'users', docId), enriched, { merge: true }).catch(() => {});
              }
              list.push(enriched);
            });
            // Sort Online first, then Busy, then Offline, then by name
            const statusOrder: Record<string, number> = { Online: 3, Busy: 2, Offline: 1 };
            list.sort(
              (a, b) =>
                (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0) ||
                a.name.localeCompare(b.name)
            );
            setUsers(list);
            saveToStorage('users_db', list);
          }
          markRealtimeSync();
        },
        (error) => {
          console.warn("Firestore users listener:", error.message);
        }
      );
    } catch (err) {
      console.warn("Firestore users setup error:", err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync current user's profile state when their Firestore UserAccount updates in real-time
  useEffect(() => {
    if (!user) return;
    const matched = users.find(u => u.email.toLowerCase() === user.toLowerCase());
    if (matched) {
      setProfile(prev => {
        if (
          prev.name === matched.name &&
          prev.role === matched.role &&
          prev.phone === matched.phone &&
          prev.department === matched.department &&
          prev.email === matched.email
        ) {
          return prev;
        }
        return {
          ...prev,
          name: matched.name,
          role: matched.role,
          phone: matched.phone,
          department: matched.department,
          email: matched.email,
          themeMode: matched.themeMode || prev.themeMode
        };
      });
    }
  }, [users, user]);

  // 2. Real-time listener for `employees`
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const colRef = collection(db, 'employees');
      unsubscribe = onSnapshot(
        colRef,
        async (snapshot) => {
          if (snapshot.empty) {
            for (const emp of initialEmployees) {
              try {
                await setDoc(doc(db, 'employees', emp.id), emp, { merge: true });
              } catch (err) {
                console.warn(`Failed seeding employee ${emp.id}:`, err);
              }
            }
            setEmployees(initialEmployees);
            saveToStorage('employees', initialEmployees);
          } else {
            const list: Employee[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Employee;
              list.push({
                ...data,
                id: data.id || docSnap.id
              });
            });
            list.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || a.name.localeCompare(b.name));
            setEmployees(list);
            saveToStorage('employees', list);
          }
          setIsLoadingEmployees(false);
          markRealtimeSync();
        },
        (error) => {
          console.warn("Firestore employees listener:", error.message);
          setIsLoadingEmployees(false);
        }
      );
    } catch (err) {
      console.warn("Firestore employees setup error:", err);
      setIsLoadingEmployees(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 3. Real-time listener for `repairs`, `projects`, `quotations`, `internal_notes`, `activity_logs`
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    try {
      // Repairs real-time sync
      unsubs.push(
        onSnapshot(
          collection(db, 'repairs'),
          async (snapshot) => {
            if (snapshot.empty) {
              for (const r of initialRepairs) {
                setDoc(doc(db, 'repairs', r.id), r, { merge: true }).catch(() => {});
              }
            } else {
              const list: Repair[] = [];
              snapshot.forEach((d) => list.push({ ...(d.data() as Repair), id: d.id }));
              list.sort((a, b) => b.receivedDate.localeCompare(a.receivedDate));
              setRepairs(list);
              saveToStorage('repairs', list);
              markRealtimeSync();
            }
          },
          () => {}
        )
      );

      // Projects real-time sync
      unsubs.push(
        onSnapshot(
          collection(db, 'projects'),
          async (snapshot) => {
            if (snapshot.empty) {
              for (const p of initialProjects) {
                setDoc(doc(db, 'projects', p.id), p, { merge: true }).catch(() => {});
              }
            } else {
              const list: Project[] = [];
              snapshot.forEach((d) => list.push({ ...(d.data() as Project), id: d.id }));
              setProjects(list);
              saveToStorage('projects', list);
              markRealtimeSync();
            }
          },
          () => {}
        )
      );

      // Quotations real-time sync
      unsubs.push(
        onSnapshot(
          collection(db, 'quotations'),
          async (snapshot) => {
            if (snapshot.empty) {
              for (const q of initialQuotations) {
                setDoc(doc(db, 'quotations', q.id), q, { merge: true }).catch(() => {});
              }
            } else {
              const list: Quotation[] = [];
              snapshot.forEach((d) => list.push({ ...(d.data() as Quotation), id: d.id }));
              setQuotations(list);
              saveToStorage('quotations', list);
              markRealtimeSync();
            }
          },
          () => {}
        )
      );

      // Internal Notes real-time sync
      unsubs.push(
        onSnapshot(
          collection(db, 'internal_notes'),
          async (snapshot) => {
            if (snapshot.empty) {
              for (const n of initialNotes) {
                setDoc(doc(db, 'internal_notes', n.id), n, { merge: true }).catch(() => {});
              }
            } else {
              const list: InternalNote[] = [];
              snapshot.forEach((d) => list.push({ ...(d.data() as InternalNote), id: d.id }));
              setNotes(list);
              saveToStorage('notes', list);
              markRealtimeSync();
            }
          },
          () => {}
        )
      );

      // Activity Logs real-time sync
      unsubs.push(
        onSnapshot(
          collection(db, 'activity_logs'),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: UserLog[] = [];
              snapshot.forEach((d) => list.push({ ...(d.data() as UserLog), id: d.id }));
              list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
              setActivityLogs(list.slice(0, 50));
              saveToStorage('logs', list.slice(0, 50));
              markRealtimeSync();
            }
          },
          () => {}
        )
      );
    } catch (err) {
      console.warn("Real-time listeners setup notice:", err);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  // Auto-sync theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (profile.themeMode === 'Dark') {
      root.classList.add('dark');
    } else if (profile.themeMode === 'Light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [profile.themeMode]);

  // Sync state changes to storage
  useEffect(() => saveToStorage('user', user), [user]);
  useEffect(() => saveToStorage('repairs', repairs), [repairs]);
  useEffect(() => saveToStorage('projects', projects), [projects]);
  useEffect(() => saveToStorage('stations', stations), [stations]);
  useEffect(() => saveToStorage('equipment', equipment), [equipment]);
  useEffect(() => saveToStorage('quotations', quotations), [quotations]);
  useEffect(() => saveToStorage('notes', notes), [notes]);
  useEffect(() => saveToStorage('profile', profile), [profile]);
  useEffect(() => saveToStorage('employees', employees), [employees]);
  useEffect(() => saveToStorage('users_db', users), [users]);
  useEffect(() => saveToStorage('logs', activityLogs), [activityLogs]);

  const logUserOperation = (action: string, details: string, type: UserLog['type']) => {
    const timestamp = new Date().toLocaleString('en-GB');
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLog: UserLog = {
      id,
      timestamp,
      action,
      details,
      type,
      userEmail: user || profile.email
    };
    setActivityLogs(prev => [newLog, ...prev]);
    markRealtimeSync();
    setDoc(doc(db, 'activity_logs', id), newLog, { merge: true }).catch(() => {});
  };

  // Helper to update current user's real-time presence in Firestore
  const syncCurrentUserActivity = async (
    targetEmail: string,
    updates: Partial<UserAccount>
  ) => {
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const existing = users.find(
      u =>
        u.email.toLowerCase() === targetEmail.toLowerCase() ||
        (u.username && u.username.toLowerCase() === targetEmail.toLowerCase())
    );
    if (existing) {
      const updatedUser: UserAccount = {
        ...existing,
        ...updates,
        lastActive: `ອັບເດດເມື່ອ ${nowTime}`
      };
      setUsers(prev => prev.map(u => (u.id === existing.id ? updatedUser : u)));
      setDoc(doc(db, 'users', existing.id), updatedUser, { merge: true }).catch(() => {});
    } else {
      const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
      const isEmail = targetEmail.includes('@');
      const derivedUsername = updates.username || (isEmail ? targetEmail.split('@')[0] : targetEmail);
      const derivedEmail = isEmail ? targetEmail : `${targetEmail}@uniqtek.la`;
      const newUser: UserAccount = {
        id: newId,
        username: derivedUsername,
        name: updates.name || derivedUsername,
        email: derivedEmail,
        password: updates.password || 'uniqtek123',
        passwordUpdatedAt: updates.passwordUpdatedAt || new Date().toLocaleString('en-GB'),
        accountEnabled: updates.accountEnabled !== undefined ? updates.accountEnabled : true,
        role: updates.role || 'Technical Specialist',
        department: updates.department || 'Technical Service & Support',
        phone: updates.phone || '020 76 111 800',
        accessLevel: updates.accessLevel || 'Technician',
        status: updates.status || 'Online',
        lastActive: `ອັບເດດເມື່ອ ${nowTime}`,
        currentActivity: updates.currentActivity || 'ເຂົ້າສູ່ລະບົບ Real-time',
        themeMode: updates.themeMode || 'Light'
      };
      setUsers(prev => [newUser, ...prev]);
      setDoc(doc(db, 'users', newId), newUser, { merge: true }).catch(() => {});
    }
    markRealtimeSync();
  };

  const login = (identifier: string, passwordInput?: string): { success: boolean; message?: string } => {
    const cleanId = identifier.trim();
    const matched = users.find(
      u =>
        u.email.toLowerCase() === cleanId.toLowerCase() ||
        (u.username && u.username.toLowerCase() === cleanId.toLowerCase()) ||
        u.name.toLowerCase() === cleanId.toLowerCase()
    );

    if (matched) {
      if (matched.accountEnabled === false) {
        logUserOperation(
          "ປະຕິເສດການເຂົ້າສູ່ລະບົບ (ບັນຊີຖືກລະງັບ)",
          `ຜູ້ໃຊ້: ${matched.email} (${matched.username || matched.name})`,
          "auth"
        );
        return {
          success: false,
          message: 'ບັນຊີຜູ້ໃຊ້ນີ້ຖືກລະງັບການໃຊ້ງານຊົ່ວຄາວ ກະລຸນາຕິດຕໍ່ຜູ້ບໍລິຫານລະບົບ'
        };
      }

      if (passwordInput !== undefined && matched.password && matched.password !== passwordInput) {
        logUserOperation(
          "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ (ລະຫັດຜ່ານຜິດ)",
          `ບັນຊີ: ${matched.email} (${matched.username || matched.name})`,
          "auth"
        );
        return {
          success: false,
          message: 'ອີເມວ / ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ ກະລຸນາກວດສອບອີກຄັ້ງ'
        };
      }

      setUser(matched.email);
      setProfile({
        name: matched.name,
        role: matched.role,
        phone: matched.phone,
        department: matched.department,
        email: matched.email,
        themeMode: matched.themeMode || 'Light'
      });
      syncCurrentUserActivity(matched.email, {
        status: 'Online',
        currentActivity: 'ຫາກໍ່ເຂົ້າສູ່ລະບົບ (Active Session)'
      });
      logUserOperation(
        "ເຂົ້າສູ່ລະບົບສຳເລັດ",
        `ຜູ້ໃຊ້: ${matched.name} (${matched.username || matched.email})`,
        "auth"
      );
      return { success: true };
    }

    // If user is not yet in `users` database, register and sign in
    const resolvedEmail = cleanId.includes('@') ? cleanId : `${cleanId}@uniqtek.la`;
    setUser(resolvedEmail);
    setProfile(prev => ({ ...prev, email: resolvedEmail }));
    syncCurrentUserActivity(resolvedEmail, {
      username: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
      password: passwordInput || 'uniqtek123',
      passwordUpdatedAt: new Date().toLocaleString('en-GB'),
      accountEnabled: true,
      status: 'Online',
      currentActivity: 'ຫາກໍ່ເຂົ້າສູ່ລະບົບ (Active Session)'
    });
    logUserOperation("ເຂົ້າສູ່ລະບົບ", `ຜູ້ໃຊ້: ${resolvedEmail} (Real-time Session)`, "auth");
    return { success: true };
  };

  const logout = () => {
    const lastUser = user || "ບໍ່ລະບຸ";
    if (user) {
      syncCurrentUserActivity(user, {
        status: 'Offline',
        currentActivity: 'ອອກຈາກລະບົບແລ້ວ'
      });
    }
    setUser(null);
    setCurrentView('dashboard');
    setSelectedRepair(null);
    setSelectedProject(null);
    setSelectedQuotation(null);
    logUserOperation("ອອກຈາກລະບົບ", `ຜູ້ໃຊ້: ${lastUser}`, "auth");
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    if (view !== 'repair_details') setSelectedRepair(null);
    if (view !== 'project_details') setSelectedProject(null);
    if (view !== 'quotation_details') setSelectedQuotation(null);

    if (user && VIEW_LABELS_LAO[view]) {
      syncCurrentUserActivity(user, {
        currentActivity: VIEW_LABELS_LAO[view]
      });
    }
  };

  const selectRepair = (repair: Repair | null) => {
    setSelectedRepair(repair);
    if (repair) navigateTo('repair_details');
  };

  const selectProject = (project: Project | null) => {
    setSelectedProject(project);
    if (project) navigateTo('project_details');
  };

  const selectQuotation = (quotation: Quotation | null) => {
    setSelectedQuotation(quotation);
    if (quotation) navigateTo('quotation_details');
  };

  const addRepair = (
    serialNo: string,
    model: string,
    title: string,
    client: string,
    problem: string,
    assignedTech: string,
    priority: 'High' | 'Medium' | 'Low' = 'Medium'
  ) => {
    const date = new Date().toISOString().split('T')[0];
    const id = `REP-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRepair: Repair = {
      id,
      serialNo: serialNo.startsWith("SN:") ? serialNo : `SN: ${serialNo}`,
      model,
      title,
      client,
      receivedDate: date,
      status: "ລໍຖ້າກວດເຊັກ",
      priority: priority || 'Medium',
      problem,
      cause: "",
      solution: "",
      assignedTech: assignedTech || "ສົມພອນ ເພັດດາລາ",
      timeline: [
        {
          id: "t1",
          date: `${date} - 09:00`,
          title: "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ",
          desc: "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.",
          done: true,
          status: "done"
        }
      ]
    };
    setRepairs(prev => [newRepair, ...prev]);
    setDoc(doc(db, 'repairs', id), newRepair, { merge: true }).catch(() => {});
    logUserOperation("ເພີ່ມລາຍການສ້ອມແປງ", `ເລກບັດ: ${id}, ອຸປະກອນ: ${model} (${serialNo}), ບູລິມະສິດ: ${priority}`, "repair");
  };

  const updateRepairStatus = (
    repair: Repair,
    newStatus: 'ກຳລັງສ້ອມແປງ' | 'ສຳເລັດແລ້ວ' | 'ລໍຖ້າກວດເຊັກ' | 'ກຳລັງສຳຫຼວດ',
    cause = '',
    solution = '',
    priority?: 'High' | 'Medium' | 'Low'
  ) => {
    const currentTimeline = [...repair.timeline];
    const nowStr = new Date().toLocaleString('en-GB');
    const nextId = `t${currentTimeline.length + 1}`;
    currentTimeline.push({
      id: nextId,
      date: nowStr,
      title: `ອັບເດດສະຖານະ: ${newStatus}`,
      desc: newStatus === 'ສຳເລັດແລ້ວ' ? "ສ້ອມແປງສຳເລັດ ແລະ ພ້ອມສົ່ງມອບ" : "ປ່ຽນສະຖານະໃນລະບົບຈັດການສ້ອມແປງ",
      done: true,
      status: "done"
    });

    const updated: Repair = {
      ...repair,
      status: newStatus,
      priority: priority || repair.priority || 'Medium',
      cause: cause || repair.cause,
      solution: solution || repair.solution,
      timeline: currentTimeline
    };

    setRepairs(prev => prev.map(r => r.id === repair.id ? updated : r));
    if (selectedRepair?.id === repair.id) {
      setSelectedRepair(updated);
    }
    setDoc(doc(db, 'repairs', repair.id), updated, { merge: true }).catch(() => {});
    logUserOperation("ອັບເດດສະຖານະການສ້ອມແປງ", `ບັດ: ${repair.id}, ສະຖານະ: ${newStatus}`, "repair");
  };

  const addInternalNote = (repairId: string, author: string, text: string) => {
    const date = new Date().toLocaleDateString('en-GB');
    const id = `note-${Math.random().toString(36).substring(2, 9)}`;
    const newNote: InternalNote = { id, repairId, author, date, text };
    setNotes(prev => [newNote, ...prev]);
    setDoc(doc(db, 'internal_notes', id), newNote, { merge: true }).catch(() => {});
    logUserOperation("ເພີ່ມບັນທຶກພາຍໃນ", `ເລກບັດ: ${repairId}, ໂດຍ: ${author}`, "repair");
  };

  const addProject = (
    title: string,
    client: string,
    location: string,
    lat: number,
    lng: number,
    teamName: string,
    teamRole: string,
    teamPhone: string
  ) => {
    const id = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject: Project = {
      id,
      title,
      client,
      progress: 0,
      status: "ກຳລັງສຳຫຼວດ",
      location,
      coordinatesLat: lat,
      coordinatesLng: lng,
      team: [
        {
          name: teamName || "ທ່ານ ອານຸສອນ ສີຫາວົງ",
          role: teamRole || "ຫົວໜ້າທີມສຳຫຼວດ",
          active: true,
          phone: teamPhone || "020 5556 1234"
        }
      ]
    };
    setProjects(prev => [newProject, ...prev]);
    setDoc(doc(db, 'projects', id), newProject, { merge: true }).catch(() => {});
    logUserOperation("ເພີ່ມໂຄງການສຳຫຼວດ", `ໂຄງການ: ${title}, ສະຖານທີ່: ${location}`, "project");
  };

  const updateProjectProgress = (
    project: Project,
    progress: number,
    status: 'ກຳລັງສຳຫຼວດ' | 'ລໍຖ້າການວິເຄາະ' | 'ສຳເລັດແລ້ວ'
  ) => {
    const updated: Project = { ...project, progress, status };
    setProjects(prev => prev.map(p => p.id === project.id ? updated : p));
    if (selectedProject?.id === project.id) {
      setSelectedProject(updated);
    }
    setDoc(doc(db, 'projects', project.id), updated, { merge: true }).catch(() => {});
    logUserOperation("ອັບເດດໂຄງການສຳຫຼວດ", `ໂຄງການ: ${project.id}, ຄວາມຄືບໜ້າ: ${progress}%`, "project");
  };

  const toggleStationStatus = (station: CORSStation) => {
    const newStatus = station.status === 'Online' ? 'Offline' : 'Online';
    const updated: CORSStation = { ...station, status: newStatus };
    setStations(prev => prev.map(s => s.id === station.id ? updated : s));
    setDoc(doc(db, 'cors_stations', station.id), updated, { merge: true }).catch(() => {});
    logUserOperation("ປ່ຽນສະຖານະສະຖານີ CORS", `ສະຖານີ: ${station.name} (${station.id}) -> ${newStatus}`, "cors");
  };

  const updateStationIssue = (station: CORSStation, issue: string) => {
    const updated: CORSStation = { ...station, issue };
    setStations(prev => prev.map(s => s.id === station.id ? updated : s));
    setDoc(doc(db, 'cors_stations', station.id), updated, { merge: true }).catch(() => {});
    logUserOperation("ອັບເດດບັນຫາສະຖານີ CORS", `ສະຖານີ: ${station.name}, ບັນຫາ: ${issue}`, "cors");
  };

  const updateEquipmentDetail = (eq: Equipment) => {
    setEquipment(prev => prev.map(e => e.id === eq.id ? eq : e));
    setDoc(doc(db, 'equipment', String(eq.id)), eq, { merge: true }).catch(() => {});
    logUserOperation("ອັບເດດຂໍ້ມູນອຸປະກອນ", `ເມືອງ: ${eq.districtNameLao}, ລຸ້ນ: ${eq.model}, SN: ${eq.serialNo}`, "system");
  };

  const addQuotation = (
    customerName: string,
    validity: string,
    items: QuotationItem[],
    terms: string
  ) => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const vat = subtotal * 0.07;
    const total = subtotal + vat;
    const date = new Date().toISOString().split('T')[0];
    const refNo = `QT-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = `QT-2024-${Math.floor(100 + Math.random() * 900)}`;

    const newQuotation: Quotation = {
      id,
      refNo,
      customerName,
      date,
      validity,
      items,
      terms,
      subtotal,
      vat,
      total
    };
    setQuotations(prev => [newQuotation, ...prev]);
    setDoc(doc(db, 'quotations', id), newQuotation, { merge: true }).catch(() => {});
    logUserOperation("ສ້າງໃບສະເໜີລາຄາ", `ເລກທີ: ${refNo}, ລູກຄ້າ: ${customerName}, ຍອດລວມ: ${total.toLocaleString()} LAK`, "quote");
  };

  const updateProfile = (name: string, role: string, phone: string, dept: string) => {
    setProfile(prev => ({ ...prev, name, role, phone, department: dept }));
    if (user) {
      syncCurrentUserActivity(user, {
        name,
        role,
        phone,
        department: dept,
        currentActivity: `ອັບເດດຂໍ້ມູນໂປຣໄຟລ໌ (${role})`
      });
    }
    logUserOperation("ອັບເດດຂໍ້ມູນສ່ວນຕົວ (Real-time)", `ຊື່ແທ້: ${name}, ຕຳແໜ່ງ: ${role}, ພະແນກ: ${dept}`, "profile");
  };

  const updateThemeMode = (mode: 'Light' | 'Dark' | 'System') => {
    setProfile(prev => ({ ...prev, themeMode: mode }));
    if (user) {
      syncCurrentUserActivity(user, { themeMode: mode });
    }
    logUserOperation("ປ່ຽນຮູບແບບການສະແດງຜົນ", `ເປັນຮູບແບບ: ${mode}`, "profile");
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id'> & { id?: string }) => {
    const id = employeeData.id || `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: Employee = {
      ...employeeData,
      id,
      active: employeeData.active ?? true
    };

    setEmployees(prev => [newEmp, ...prev.filter(e => e.id !== id)]);

    try {
      await setDoc(doc(db, 'employees', id), newEmp, { merge: true });
      logUserOperation("ເພີ່ມຊ່າງເຕັກນິກ / ພະນັກງານ", `ຊື່: ${newEmp.name}, ຕຳແໜ່ງ: ${newEmp.role} (Firestore ID: ${id})`, "system");
    } catch (err) {
      console.warn("Could not save employee to Firestore (offline fallback):", err);
      logUserOperation("ເພີ່ມຊ່າງເຕັກນິກ (Local Cache)", `ຊື່: ${newEmp.name}`, "system");
    }
  };

  // User & Credentials Database CRUD Operations (Real-time synced with Firestore `users` collection)
  const addUserAccount = async (userData: Omit<UserAccount, 'id' | 'lastActive'> & { id?: string }) => {
    const id = userData.id || `USR-${Math.floor(100 + Math.random() * 900)}`;
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const nowFull = new Date().toLocaleString('en-GB');
    const newUser: UserAccount = {
      ...userData,
      id,
      username: userData.username || userData.email.split('@')[0],
      password: userData.password || 'uniqtek@2025',
      passwordUpdatedAt: userData.passwordUpdatedAt || nowFull,
      accountEnabled: userData.accountEnabled !== undefined ? userData.accountEnabled : true,
      lastActive: `ລົງທະບຽນເມື່ອ ${nowTime}`,
      currentActivity: userData.currentActivity || 'ລົງທະບຽນໃໝ່ໃນລະບົບຖານຂໍ້ມູນຜູ້ໃຊ້'
    };

    setUsers(prev => [newUser, ...prev.filter(u => u.id !== id)]);
    markRealtimeSync();

    try {
      await setDoc(doc(db, 'users', id), newUser, { merge: true });
      logUserOperation(
        "ເພີ່ມບັນຊີຜູ້ໃຊ້ & ລະຫັດຜ່ານໃໝ່ (User DB)",
        `ຊື່ຜູ້ໃຊ້: ${newUser.username} | ອີເມວ: ${newUser.email} - ສິດ: ${newUser.accessLevel}`,
        "profile"
      );
    } catch (err) {
      console.warn("Failed saving user to Firestore:", err);
    }
  };

  const updateUserAccount = async (id: string, updates: Partial<UserAccount>) => {
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const existing = users.find(u => u.id === id);
    if (!existing) return;

    const updatedUser: UserAccount = {
      ...existing,
      ...updates,
      ...(updates.password && updates.password !== existing.password
        ? { passwordUpdatedAt: new Date().toLocaleString('en-GB') }
        : {}),
      lastActive: `ອັບເດດເມື່ອ ${nowTime}`
    };

    setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
    markRealtimeSync();

    // If updating the currently logged-in user, also update local profile state
    if (user && (updatedUser.email.toLowerCase() === user.toLowerCase() || existing.email.toLowerCase() === user.toLowerCase())) {
      setUser(updatedUser.email);
      setProfile(prev => ({
        ...prev,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        department: updatedUser.department,
        email: updatedUser.email
      }));
    }

    try {
      await setDoc(doc(db, 'users', id), updatedUser, { merge: true });
      logUserOperation(
        "ອັບເດດຖານຂໍ້ມູນຜູ້ໃຊ້ (Real-time)",
        `ຜູ້ໃຊ້: ${updatedUser.name} (${updatedUser.username || updatedUser.email})`,
        "profile"
      );
    } catch (err) {
      console.warn("Failed updating user in Firestore:", err);
    }
  };

  const updateUserCredentials = async (
    id: string,
    username: string,
    email: string,
    password: string
  ) => {
    const nowFull = new Date().toLocaleString('en-GB');
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const existing = users.find(u => u.id === id);
    if (!existing) return;

    const updatedUser: UserAccount = {
      ...existing,
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      passwordUpdatedAt: nowFull,
      lastActive: `ອັບເດດບັນຊີເມື່ອ ${nowTime}`
    };

    setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
    markRealtimeSync();

    if (user && existing.email.toLowerCase() === user.toLowerCase()) {
      setUser(updatedUser.email);
      setProfile(prev => ({ ...prev, email: updatedUser.email }));
    }

    try {
      await setDoc(doc(db, 'users', id), updatedUser, { merge: true });
      logUserOperation(
        "ອັບເດດຂໍ້ມູນ ອີເມວ/ຊື່ຜູ້ໃຊ້ & ລະຫັດຜ່ານ",
        `ບັນຊີ: ${updatedUser.name} (Username: ${updatedUser.username}, Email: ${updatedUser.email})`,
        "auth"
      );
    } catch (err) {
      console.warn("Failed updating credentials in Firestore:", err);
    }
  };

  const resetUserPassword = async (id: string, newPassword: string) => {
    const nowFull = new Date().toLocaleString('en-GB');
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const existing = users.find(u => u.id === id);
    if (!existing) return;

    const updatedUser: UserAccount = {
      ...existing,
      password: newPassword.trim(),
      passwordUpdatedAt: nowFull,
      lastActive: `ປ່ຽນລະຫັດຜ່ານເມື່ອ ${nowTime}`
    };

    setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
    markRealtimeSync();

    try {
      await setDoc(doc(db, 'users', id), updatedUser, { merge: true });
      logUserOperation(
        "ປ່ຽນລະຫັດຜ່ານຜູ້ໃຊ້ງານ (Password Reset)",
        `ບັນຊີ: ${updatedUser.name} (${updatedUser.username || updatedUser.email})`,
        "auth"
      );
    } catch (err) {
      console.warn("Failed resetting password in Firestore:", err);
    }
  };

  const toggleUserAccountLock = async (id: string) => {
    const existing = users.find(u => u.id === id);
    if (!existing) return;

    const nextEnabled = existing.accountEnabled === false ? true : false;
    const nowTime = new Date().toLocaleTimeString('en-GB');
    const updatedUser: UserAccount = {
      ...existing,
      accountEnabled: nextEnabled,
      status: nextEnabled ? existing.status : 'Offline',
      lastActive: `${nextEnabled ? 'ເປີດໃຊ້ບັນຊີ' : 'ລະງັບບັນຊີ'}ເມື່ອ ${nowTime}`
    };

    setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
    markRealtimeSync();

    try {
      await setDoc(doc(db, 'users', id), updatedUser, { merge: true });
      logUserOperation(
        nextEnabled ? "ເປີດການໃຊ້ງານບັນຊີຜູ້ໃຊ້" : "ລະງັບການໃຊ້ງານບັນຊີຜູ້ໃຊ້",
        `ບັນຊີ: ${updatedUser.name} (${updatedUser.username || updatedUser.email})`,
        "auth"
      );
    } catch (err) {
      console.warn("Failed toggling account lock in Firestore:", err);
    }
  };

  const deleteUserAccount = async (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    markRealtimeSync();

    try {
      await deleteDoc(doc(db, 'users', id));
      if (target) {
        logUserOperation("ລຶບບັນຊີຜູ້ໃຊ້ງານ", `ລຶບຜູ້ໃຊ້: ${target.name} (${target.email})`, "profile");
      }
    } catch (err) {
      console.warn("Failed deleting user from Firestore:", err);
    }
  };

  const updateUserPresenceStatus = async (
    status: 'Online' | 'Busy' | 'Offline',
    currentActivity?: string
  ) => {
    if (!user) return;
    await syncCurrentUserActivity(user, {
      status,
      ...(currentActivity !== undefined ? { currentActivity } : {})
    });
    logUserOperation(
      "ປ່ຽນສະຖານະຜູ້ໃຊ້ Real-time",
      `ສະຖານະ: ${status}${currentActivity ? ` • ${currentActivity}` : ''}`,
      "profile"
    );
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    logUserOperation("ລ້າງປະຫວັດການເຮັດວຽກ", "ປະຫວັດການເຮັດວຽກທັງໝົດຖືກລຶບອອກແລ້ວ", "system");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        selectedRepair,
        selectedProject,
        selectedQuotation,
        profile,
        activityLogs,
        repairs,
        projects,
        stations,
        equipment,
        quotations,
        notes,
        employees,
        isLoadingEmployees,
        users,
        currentUserAccount,
        isRealtimeConnected,
        lastSyncedAt,
        realtimeEventCount,
        addEmployee,
        addUserAccount,
        updateUserAccount,
        updateUserCredentials,
        resetUserPassword,
        toggleUserAccountLock,
        deleteUserAccount,
        updateUserPresenceStatus,
        login,
        logout,
        navigateTo,
        selectRepair,
        selectProject,
        selectQuotation,
        addRepair,
        updateRepairStatus,
        addInternalNote,
        addProject,
        updateProjectProgress,
        toggleStationStatus,
        updateStationIssue,
        updateEquipmentDetail,
        addQuotation,
        updateProfile,
        updateThemeMode,
        clearActivityLogs,
        logUserOperation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
};

