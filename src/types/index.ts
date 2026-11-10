export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  desc: string;
  done: boolean;
  status: 'done' | 'active' | 'upcoming';
}

export interface Repair {
  id: string;
  serialNo: string;
  model: string;
  title: string;
  client: string;
  receivedDate: string;
  status: 'ກຳລັງສ້ອມແປງ' | 'ສຳເລັດແລ້ວ' | 'ລໍຖ້າກວດເຊັກ' | 'ກຳລັງສຳຫຼວດ';
  priority?: 'High' | 'Medium' | 'Low';
  problem: string;
  cause: string;
  solution: string;
  assignedTech: string;
  timeline: TimelineItem[];
  imageUrl?: string | null;
}

export interface InternalNote {
  id: string;
  repairId: string;
  author: string;
  date: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  active: boolean;
  phone: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  progress: number;
  status: 'ກຳລັງສຳຫຼວດ' | 'ລໍຖ້າການວິເຄາະ' | 'ສຳເລັດແລ້ວ';
  location: string;
  coordinatesLat: number;
  coordinatesLng: number;
  team: TeamMember[];
}

export interface CORSStation {
  id: string;
  name: string;
  type: 'ເກົ່າ' | 'ໃໝ່';
  status: 'Online' | 'Offline';
  issue: string;
  notes?: string | null;
  lat?: number;
  lng?: number;
  province?: string;
  satellites?: number;
}

export interface QuotationItem {
  id: string;
  description: string;
  details: string;
  qty: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  refNo: string;
  customerName: string;
  date: string;
  validity: string;
  items: QuotationItem[];
  terms: string;
  subtotal: number;
  vat: number;
  total: number;
}

export interface Equipment {
  id: number;
  districtCode: string;
  districtNameLao: string;
  districtNameEng: string;
  provinceName: string;
  model: string;
  serialNo: string;
  note: string;
}

export interface UserLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'auth' | 'repair' | 'project' | 'cors' | 'quote' | 'profile' | 'system';
  userEmail?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  phone: string;
  department: string;
  email: string;
  themeMode: 'Light' | 'Dark' | 'System';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email?: string;
  active: boolean;
  specialties?: string[];
  avatarUrl?: string;
}

export interface UserAccount {
  id: string;
  username?: string;
  name: string;
  email: string;
  password?: string;
  passwordUpdatedAt?: string;
  accountEnabled?: boolean;
  role: string;
  department: string;
  phone: string;
  accessLevel: 'Admin' | 'Technician' | 'Engineer' | 'Manager';
  status: 'Online' | 'Busy' | 'Offline';
  lastActive: string;
  currentActivity?: string;
  themeMode?: 'Light' | 'Dark' | 'System';
}


