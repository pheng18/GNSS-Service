import { Repair, Project, CORSStation, Equipment, Quotation, InternalNote, UserProfile, Employee, UserAccount } from '../types';

export const initialRepairs: Repair[] = [
  {
    id: "REP-2024-0089",
    serialNo: "SN: 894521",
    model: "Leica TS16 P 1\"",
    title: "Total Station Leica TS16 - ຄວາມຜິດພາດຂອງລະບົບ EDM",
    client: "ກົມແຜນທີ່ ແລະ ພູມສາດ",
    receivedDate: "2024-05-12",
    status: "ກຳລັງສ້ອມແປງ",
    problem: "ລະບົບ EDM ບໍ່ສາມາດວັດແທກໄລຍະທາງໄດ້ໃນໂໝດ Prism, ພົບຄວາມຜິດພາດ Code E102.",
    cause: "Optical sensor ພາຍໃນມີຂີ້ຝຸ່ນ ແລະ ການປັບຈູນເລເຊີເຄື່ອນຍ້າຍຈາກຕຳແໜ່ງມາດຕະຖານ.",
    solution: "ທຳຄວາມສະອາດຊຸດເລນ, ປັບຈູນ Optical Alignment ໃໝ່ ແລະ ທົດສອບ Calibration ຕາມມາດຕະຖານ ISO.",
    assignedTech: "ສົມພອນ ເພັດດາລາ",
    priority: "High",
    timeline: [
      { id: "t1", date: "12/05/2024 - 09:30", title: "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", desc: "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", done: true, status: "done" },
      { id: "t2", date: "13/05/2024 - 14:20", title: "ວິນິດໄສອາການ", desc: "ຊ່າງເຕັກນິກກວດພົບສາເຫດຂອງ Code E102.", done: true, status: "done" },
      { id: "t3", date: "14/05/2024 - 10:00", title: "ກຳລັງສ້ອມແປງ ແລະ ປັບຈູນ", desc: "ກຳລັງລໍຖ້າການປັບຈູນ Optical alignment ດ້ວຍເຄື່ອງມືພິເສດ.", done: false, status: "active" },
      { id: "t4", date: "15/05/2024 - 16:00", title: "ທົດສອບ Calibration", desc: "ທົດສອບຄວາມຖືກຕ້ອງກ່ອນສົ່ງມອບ.", done: false, status: "upcoming" }
    ]
  },
  {
    id: "REP-2024-0091",
    serialNo: "SN: 624190",
    model: "Trimble R12i GNSS",
    title: "GNSS Receiver Trimble R12i - ບໍ່ຮັບສັນຍານດາວທຽມ RTK",
    client: "ບໍລິສັດ ກໍ່ສ້າງຂົວທາງ ຈຳກັດ",
    receivedDate: "2024-05-10",
    status: "ສຳເລັດແລ້ວ",
    problem: "ບໍ່ສາມາດເຊື່ອມຕໍ່ສັນຍານ RTK ໄດ້ ແລະ ການຮັບດາວທຽມຕໍ່າຜິດປົກກະຕິ.",
    cause: "ບອດຮັບສັນຍານ GPS ພາຍໃນມີຮອຍເສຍຫາຍຈາກຄວາມຊື້ນ.",
    solution: "ປ່ຽນບອດຮັບສັນຍານ GPS ໃໝ່, ທຳຄວາມສະອາດພອດ ແລະ ອັບເດດ Firmware ຫຼ້າສຸດ.",
    assignedTech: "ສົມພອນ ເພັດດາລາ",
    priority: "Medium",
    timeline: [
      { id: "t21", date: "10/05/2024 - 08:30", title: "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", desc: "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", done: true, status: "done" },
      { id: "t22", date: "11/05/2024 - 11:15", title: "ວິນິດໄສອາການ", desc: "ກວດພົບບອດຮັບສັນຍານເສຍຫາຍ.", done: true, status: "done" },
      { id: "t23", date: "12/05/2024 - 13:00", title: "ປ່ຽນອະໄຫຼ່ ແລະ ສ້ອມແປງ", desc: "ປ່ຽນບອດຮັບສັນຍານໃໝ່ ແລະ ທົດສອບພາຍໃນ.", done: true, status: "done" },
      { id: "t24", date: "13/05/2024 - 15:30", title: "ທົດສອບ Calibration & ສົ່ງມອບ", desc: "ທົດສອບ RTK ຜ່ານ ແລະ ກຽມສົ່ງມອບຄືນລູກຄ້າ.", done: true, status: "done" }
    ]
  },
  {
    id: "REP-2024-0095",
    serialNo: "SN: 431055",
    model: "Leica LS15",
    title: "Digital Level Leica LS15 - ຈໍສຳຜັດບໍ່ຕອບສະໜອງ",
    client: "ລັດວິສາຫະກິດ ໄຟຟ້າລາວ",
    receivedDate: "2024-05-15",
    status: "ລໍຖ້າກວດເຊັກ",
    problem: "ໜ້າຈໍສະແດງຜົນມີເສັ້ນສີດຳ ແລະ ລະບົບສຳຜັດໃຊ້ງານບໍ່ໄດ້ບາງຈຸດ.",
    cause: "ຈໍ LCD ເສຍຫາຍຈາກການກະແທກໃນພາກສະໜາມ.",
    solution: "ປ່ຽນຊຸດໜ້າຈໍ LCD ໃໝ່ ແລະ ທົດສອບຄວາມຖືກຕ້ອງຂອງລະບົບວັດແທກ.",
    assignedTech: "ວັນໄຊ ມະນີວົງ",
    priority: "Low",
    timeline: [
      { id: "t31", date: "15/05/2024 - 10:30", title: "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", desc: "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", done: true, status: "done" },
      { id: "t32", date: "16/05/2024 - 09:00", title: "ວິນິດໄສ ແລະ ວາງແຜນ", desc: "ກຳລັງກວດສອບຄວາມເສຍຫາຍຂອງລະບົບພາຍໃນອື່ນໆ.", done: false, status: "active" }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: "PRJ-001",
    title: "ສຳຫຼວດພື້ນທີ່ສ້າງທາງດ່ວນ ນະຄອນຫຼວງ-ວັງວຽງ",
    client: "ກົມຂົນສົ່ງ ແລະ ທາງຫຼວງ",
    progress: 75,
    status: "ກຳລັງສຳຫຼວດ",
    location: "ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ",
    coordinatesLat: 18.2,
    coordinatesLng: 102.5,
    team: [
      { name: "ທ່ານ ອານຸສອນ ສີຫາວົງ", role: "ຫົວໜ້າທີມສຳຫຼວດ", active: true, phone: "020 5556 1234" },
      { name: "ນາງ ມະນີວັນ ເພັດດາລາ", role: "ວິສະວະກອນແຜນທີ່", active: true, phone: "020 9998 7654" }
    ]
  },
  {
    id: "PRJ-002",
    title: "ວັດແທກລະດັບນ້ຳເຂື່ອນໄຟຟ້າ ນ້ຳງື່ມ 1",
    client: "ລັດວິສາຫະກິດໄຟຟ້າລາວ",
    progress: 40,
    status: "ລໍຖ້າການວິເຄາະ",
    location: "ແຂວງວຽງຈັນ, ສປປ ລາວ",
    coordinatesLat: 18.5,
    coordinatesLng: 102.6,
    team: [
      { name: "ທ່ານ ສົມສັກ ເພັດດາວົງ", role: "ນັກວິເຄາະຂໍ້ມູນວັດແທກ", active: false, phone: "020 2233 4455" }
    ]
  },
  {
    id: "PRJ-003",
    title: "ສຳຫຼວດຂອບເຂດທີ່ດິນ ອຸດສາຫະກຳສະເພາະ",
    client: "ກຸ່ມບໍລິສັດ ພັດທະນາເສດຖະກິດ",
    progress: 100,
    status: "ສຳເລັດແລ້ວ",
    location: "ແຂວງສະຫວັນນະເຂດ, ສປປ ລາວ",
    coordinatesLat: 16.5,
    coordinatesLng: 104.8,
    team: [
      { name: "ນາງ ວິໄລວັນ ສົມພອນ", role: "ວິສະວະກອນໂຍທາ", active: true, phone: "020 7788 9900" }
    ]
  },
  {
    id: "PRJ-004",
    title: "ວາງລະບົບສາຍສົ່ງໄຟຟ້າແຮງສູງ 500kV",
    client: "ກຸ່ມພະລັງງານໄຟຟ້າພາກໃຕ້",
    progress: 15,
    status: "ກຳລັງສຳຫຼວດ",
    location: "ແຂວງອັດຕະປື, ສປປ ລາວ",
    coordinatesLat: 14.8,
    coordinatesLng: 106.8,
    team: [
      { name: "ທ່ານ ອານຸສອນ ສີຫາວົງ", role: "ຫົວໜ້າທີມສຳຫຼວດ", active: true, phone: "020 5556 1234" }
    ]
  }
];

export const initialCORSStations: CORSStation[] = [
  { id: "ANUV", name: "ອານຸວົງ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "ASFT", name: "ອາດສະພັງທອງ", type: "ໃໝ່", status: "Online", issue: "Receiver problem" },
  { id: "ATTP", name: "ອັດຕະປື", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "BLKX", name: "ບໍລິຄຳໄຊ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "BLPD", name: "ບົວລະພາ", type: "ໃໝ່", status: "Offline", issue: "Receiver problem", notes: "Power supply + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300$ + 300,000 LAK ເດືອນ" },
  { id: "BNEU", name: "ບູນເໜືອ", type: "ໃໝ່", status: "Offline", issue: "Receiver problem", notes: "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ" },
  { id: "BTAY", name: "ບູນໃຕ້", type: "ເກົ່າ", status: "Online", issue: "Electrical problem" },
  { id: "CHPH", name: "ຈຳພອນ", type: "ໃໝ່", status: "Online", issue: "Lightning problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "DJEU", name: "ດັກຈຶງ", type: "ໃໝ່", status: "Online", issue: "UPS problem", notes: "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "DOL1", name: "ກົມທີ່ດິນ DOL", type: "ເກົ່າ", status: "Online", issue: "none" },
  { id: "FEUN", name: "ເຟືອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 250$ + 300,000 LAK ເດືອນ" },
  { id: "HGSA", name: "ຫົງສາ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "HIAM", name: "ຮ້ຽມ", type: "ໃໝ່", status: "Offline", issue: "Receiver problem", notes: "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ" },
  { id: "HINB", name: "ຫິນບຸນ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "HMUA", name: "ຫົວເມືອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem, UPS problem", notes: "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "HOON", name: "ຮູນ", type: "ໃໝ່", status: "Online", issue: "UPS problem" },
  { id: "HPPV", name: "ຊຳເໜືອ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "HXAY", name: "ຫ້ວຍຊາຍ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "KENT", name: "ແກ່ນທ້າວ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem, Current problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "KERD", name: "ຄຳເກີດ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "KHAM", name: "ຄຳ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "KHNG", name: "ໂຂງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "KHUA", name: "ຂວາ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "KXDD", name: "ຄົງເຊໂດນ", type: "ເກົ່າ", status: "Online", issue: "none" },
  { id: "LKPD", name: "ລະຄອນເພັງ", type: "ໃໝ່", status: "Offline", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "LNTD", name: "ຫຼວງນໍ້າທາ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "LONG", name: "ລອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "LPBP", name: "ຫຼວງພະບາງ", type: "ເກົ່າ", status: "Online", issue: "Normal" },
  { id: "LXAN", name: "ລ້ອງຊານ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "MEUN", name: "ໝື່ນ", type: "ໃໝ່", status: "Online", issue: "none" },
  { id: "NGAR", name: "ງາ", type: "ໃໝ່", status: "Online", issue: "none" },
  { id: "NGOY", name: "ງອຍ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "NHAD", name: "ໜອງແຮດ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem, UPS problem", notes: "ມີເນັດແລ້ວ" },
  { id: "NKAY", name: "ນາກາຍ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "NLAE", name: "ນາແລ", type: "ໃໝ່", status: "Online", issue: "Receiver problem", notes: "ແກ້ໄຂບັນຫາການຕັ້ງຄ່າສຳເລັດແລ້ວ" },
  { id: "NONG", name: "ນອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "PHIA", name: "ພຽງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "Replace Fan cooling motor + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 33$ + 300,000 LAK ເດືອນ" },
  { id: "PHIN", name: "ພີນ", type: "ເກົ່າ", status: "Online", issue: "Normal" },
  { id: "PHTH", name: "ໂພນທອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 250$ + 300,000 LAK ເດືອນ" },
  { id: "PHXY", name: "ໂພນໄຊ", type: "ໃໝ່", status: "Offline", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "PKDD", name: "ປາກກະດິ່ງ", type: "ໃໝ່", status: "Online", issue: "Battery problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "PKLY", name: "ປາກລາຍ", type: "ໃໝ່", status: "Offline", issue: "Internet exprired problem" },
  { id: "PKNG", name: "ປາກງື່ມ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "PKSE", name: "ປາກເຊ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "PKSG", name: "ປາກຊ່ອງ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "PKUN", name: "ພູຄູນ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "PUDD", name: "ຜາອຸດົມ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "SANG", name: "ສັງທອງ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "SGKH", name: "ສອງຄອນ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "SKMD", name: "ສຸຂູມມາ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "SLVP", name: "ສາລະວັນ", type: "ເກົ່າ", status: "Online", issue: "Normal" },
  { id: "SNXD", name: "ສະໜາມໄຊ", type: "ໃໝ່", status: "Offline", issue: "Internet exprired problem" },
  { id: "SVNK", name: "ສະຫວັນນະເຂດ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "THKH", name: "ທ່າແຂກ", type: "ໃໝ່", status: "Offline", issue: "Electrical problem", notes: "Rebuild constructions due to Relocate New Office | ງົບປະມານ: 23,000$" },
  { id: "THOM", name: "ທ່າໂທມ", type: "ໃໝ່", status: "Online", issue: "Electrical problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "TOAY", name: "ຕະໂອ້ຍ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "UDX2", name: "ອຸດົມໄຊ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "VLBL", name: "ວິລະບູລີ", type: "ໃໝ່", status: "Online", issue: "Adapter problem, UPS problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "VTHG", name: "ວຽງທອງ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "VTPV", name: "ແຂວງວຽງຈັນ", type: "ເກົ່າ", status: "Online", issue: "none" },
  { id: "VVNG", name: "ວັງວຽງ", type: "ໃໝ່", status: "Online", issue: "none" },
  { id: "XAYY", name: "ໄຊຍະບູລີ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "XBFD", name: "ເຊບັ້ງໄຟ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "XBTD", name: "ໄຊບົວທອງ", type: "ໃໝ່", status: "Online", issue: "Normal" },
  { id: "XCPD", name: "ໄຊຈຳພອນ", type: "ໃໝ່", status: "Online", issue: "Normal", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "XHND", name: "ຊຽງຮ່ອນ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "XIAN", name: "ຊຽງຂວາງ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "XKHO", name: "ຊຽງຄໍ້", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem" },
  { id: "XKXK", name: "ເຊກອງ", type: "ເກົ່າ", status: "Online", issue: "Internet exprired problem" },
  { id: "XONE", name: "ຊ່ອນ", type: "ໃໝ່", status: "Online", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "XTAY", name: "ຊໍາໃຕ້", type: "ໃໝ່", status: "Offline", issue: "Receiver problem", notes: "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ" },
  { id: "XXAY", name: "ຊານໄຊ", type: "ໃໝ່", status: "Offline", issue: "Internet exprired problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" },
  { id: "YODU", name: "ຍອດອູ", type: "ໃໝ່", status: "Online", issue: "Electrical problem", notes: "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ" }
];

export const initialEquipment: Equipment[] = [
  { id: 1, districtCode: "101", districtNameLao: "ຈັນທະບູລີ", districtNameEng: "CHANTHABOULI", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "AA450", serialNo: "SN-AA450-101", note: "ສະຖານະປົກກະຕິ" },
  { id: 2, districtCode: "102", districtNameLao: "ສີໂຄດຕະບອງ", districtNameEng: "Sikhottabong", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "BB4Pro", serialNo: "SN-BB4P-102", note: "ສະຖານະປົກກະຕິ" },
  { id: 3, districtCode: "103", districtNameLao: "ໄຊເສດຖາ", districtNameEng: "Xaisettha", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "C3", serialNo: "SN-C300-103", note: "ສະຖານະປົກກະຕິ" },
  { id: 4, districtCode: "104", districtNameLao: "ສີສັດຕະນາກ", districtNameEng: "Sisattanak", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "C5", serialNo: "SN-C500-104", note: "ກຳລັງສ້ອມແປງ" },
  { id: 5, districtCode: "105", districtNameLao: "ນາຊາຍທອງ", districtNameEng: "Naxaythong", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "CB-H10", serialNo: "SN-CB10-105", note: "ສະຖານະປົກກະຕິ" },
  { id: 6, districtCode: "106", districtNameLao: "ໄຊທານີ", districtNameEng: "Xaithani", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "CTS-112R4", serialNo: "SN-CTS1-106", note: "ສະຖານະປົກກະຕິ" },
  { id: 7, districtCode: "107", districtNameLao: "ຫາດຊາຍຟອງ", districtNameEng: "hatxayfong", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "DL8", serialNo: "SN-DL80-107", note: "ສະຖານະປົກກະຕິ" },
  { id: 8, districtCode: "108", districtNameLao: "ສັງທອງ", districtNameEng: "Sangthong", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "E98", serialNo: "SN-E980-108", note: "ສະຖານະປົກກະຕິ" },
  { id: 9, districtCode: "109", districtNameLao: "ປາກງື່ມ", districtNameEng: "Pakngum", provinceName: "ນະຄອນຫຼວງວຽງຈັນ", model: "ESR-1", serialNo: "SN-ESR1-109", note: "ສະຖານະປົກກະຕິ" },
  { id: 10, districtCode: "201", districtNameLao: "ຜົ້ງສາລີ", districtNameEng: "PHONGSALI", provinceName: "ແຂວງຜົ້ງສາລີ", model: "F4", serialNo: "SN-F400-201", note: "ສະຖານະປົກກະຕິ" },
  { id: 11, districtCode: "202", districtNameLao: "ໃໝ່", districtNameEng: "Mai", provinceName: "ແຂວງຜົ້ງສາລີ", model: "F7", serialNo: "SN-F700-202", note: "ສະຖານະປົກກະຕິ" },
  { id: 12, districtCode: "203", districtNameLao: "ຂວາ", districtNameEng: "Khoa", provinceName: "ແຂວງຜົ້ງສາລີ", model: "F8", serialNo: "SN-F800-203", note: "ສະຖານະປົກກະຕິ" },
  { id: 13, districtCode: "204", districtNameLao: "ສຳພັນ", districtNameEng: "Samphan", provinceName: "ແຂວງຜົ້ງສາລີ", model: "FC2", serialNo: "SN-FC20-204", note: "ສະຖານະປົກກະຕິ" },
  { id: 14, districtCode: "205", districtNameLao: "ບຸນເໜືອ", districtNameEng: "Boun-Nua", provinceName: "ແຂວງຜົ້ງສາລີ", model: "HCE300", serialNo: "SN-HCE3-205", note: "ສະຖານະປົກກະຕິ" },
  { id: 15, districtCode: "206", districtNameLao: "ຍອດອູ", districtNameEng: "Gnot-Ou", provinceName: "ແຂວງຜົ້ງສາລີ", model: "HCE320", serialNo: "SN-HCE3-206", note: "ສະຖານະປົກກະຕິ" },
  { id: 16, districtCode: "207", districtNameLao: "ເມືອງບຸນໃຕ້", districtNameEng: "Boun-Tai", provinceName: "ແຂວງຜົ້ງສາລີ", model: "HCE600", serialNo: "SN-HCE6-207", note: "ສະຖານະປົກກະຕິ" },
  { id: 17, districtCode: "301", districtNameLao: "ເມືອງຫຼວງນໍ້້າທາ", districtNameEng: "LOUANGNAMTHA", provinceName: "ແຂວງຫຼວງນໍ້າທາ", model: "i30", serialNo: "SN-I300-301", note: "ສະຖານະປົກກະຕິ" },
  { id: 18, districtCode: "302", districtNameLao: "ສິງ", districtNameEng: "Sing", provinceName: "ແຂວງຫຼວງນໍ້າທາ", model: "i30IMU", serialNo: "SN-I30I-302", note: "ສະຖານະປົກກະຕິ" },
  { id: 19, districtCode: "303", districtNameLao: "ລອງ", districtNameEng: "Long", provinceName: "ແຂວງຫຼວງນໍ້າທາ", model: "i30VR", serialNo: "SN-I30V-303", note: "ສະຖານະປົກກະຕິ" },
  { id: 20, districtCode: "304", districtNameLao: "ວຽງພູຄາ", districtNameEng: "Viangphoukha", provinceName: "ແຂວງຫຼວງນໍ້າທາ", model: "i50", serialNo: "SN-I500-304", note: "ສະຖານະປົກກະຕິ" },
  { id: 21, districtCode: "305", districtNameLao: "ນາແລ", districtNameEng: "Nale", provinceName: "ແຂວງຫຼວງນໍ້າທາ", model: "i70", serialNo: "SN-I700-305", note: "ສະຖານະປົກກະຕິ" },
  { id: 22, districtCode: "401", districtNameLao: "ໄຊ", districtNameEng: "XAI", provinceName: "ແຂວງອຸດົມໄຊ", model: "i73", serialNo: "SN-I730-401", note: "ສະຖານະປົກກະຕິ" },
  { id: 23, districtCode: "402", districtNameLao: "ຫຼາ", districtNameEng: "La", provinceName: "ແຂວງອຸດົມໄຊ", model: "i76", serialNo: "SN-I760-402", note: "ສະຖານະປົກກະຕິ" },
  { id: 24, districtCode: "403", districtNameLao: "ນາໝໍ້", districtNameEng: "Namo", provinceName: "ແຂວງອຸດົມໄຊ", model: "i80", serialNo: "SN-I800-403", note: "ສະຖານະປົກກະຕິ" },
  { id: 25, districtCode: "404", districtNameLao: "ງາ", districtNameEng: "Nga", provinceName: "ແຂວງອຸດົມໄຊ", model: "i80Pro", serialNo: "SN-I80P-404", note: "ສະຖານະປົກກະຕິ" },
  { id: 26, districtCode: "405", districtNameLao: "ແບງ", districtNameEng: "Beng", provinceName: "ແຂວງອຸດົມໄຊ", model: "i83", serialNo: "SN-I830-405", note: "ສະຖານະປົກກະຕິ" },
  { id: 27, districtCode: "406", districtNameLao: "ຮຸນ", districtNameEng: "Houn", provinceName: "ແຂວງອຸດົມໄຊ", model: "i89", serialNo: "SN-I890-406", note: "ສະຖານະປົກກະຕິ" },
  { id: 28, districtCode: "407", districtNameLao: "ປາກແບ່ງ", districtNameEng: "Pakbeng", provinceName: "ແຂວງອຸດົມໄຊ", model: "i90", serialNo: "SN-I900-407", note: "ສະຖານະປົກກະຕິ" },
  { id: 29, districtCode: "501", districtNameLao: "ຫ້ວຍຊາຍ", districtNameEng: "HOUYXAY", provinceName: "ແຂວງບໍ່ແກ້ວ", model: "i90VR", serialNo: "SN-I90V-501", note: "ສະຖານະປົກກະຕິ" },
  { id: 30, districtCode: "502", districtNameLao: "ຕົ້ນເຜີ້ງ", districtNameEng: "Tonpheung", provinceName: "ແຂວງບໍ່ແກ້ວ", model: "i93", serialNo: "SN-I930-502", note: "ສະຖານະປົກກະຕິ" },
  { id: 31, districtCode: "503", districtNameLao: "ເມິງ", districtNameEng: "Meung", provinceName: "ແຂວງບໍ່ແກ້ວ", model: "i93UB", serialNo: "SN-I93U-503", note: "ສະຖານະປົກກະຕິ" },
  { id: 32, districtCode: "504", districtNameLao: "ຜາອຸດົມ", districtNameEng: "Pha-Oudom", provinceName: "ແຂວງບໍ່ແກ້ວ", model: "iBase", serialNo: "SN-IBSA-504", note: "ສະຖານະປົກກະຕິ" },
  { id: 33, districtCode: "505", districtNameLao: "ປາກທາ", districtNameEng: "Paktha", provinceName: "ແຂວງບໍ່ແກ້ວ", model: "iBaseUB", serialNo: "SN-IBSU-505", note: "ສະຖານະປົກກະຕິ" },
  { id: 34, districtCode: "601", districtNameLao: "ນະຄອນຫຼວງພະບາງ", districtNameEng: "LUANG PRABANG CITY", provinceName: "ແຂວງຫຼວງພະບາງ", model: "IC100", serialNo: "SN-IC10-601", note: "ສະຖານະປົກກະຕິ" },
  { id: 35, districtCode: "602", districtNameLao: "ຊຽງເງິນ", districtNameEng: "Xiang-Ngeun", provinceName: "ແຂວງຫຼວງພະບາງ", model: "LT60H", serialNo: "SN-LT60-602", note: "ສະຖານະປົກກະຕິ" },
  { id: 36, districtCode: "603", districtNameLao: "ນານ", districtNameEng: "Nan", provinceName: "ແຂວງຫຼວງພະບາງ", model: "LT700", serialNo: "SN-LT70-603", note: "ສະຖານະປົກກະຕິ" },
  { id: 37, districtCode: "604", districtNameLao: "ປາກອູ", districtNameEng: "Pak-Ou", provinceName: "ແຂວງຫຼວງພະບາງ", model: "LT800", serialNo: "SN-LT80-604", note: "ສະຖານະປົກກະຕິ" },
  { id: 38, districtCode: "605", districtNameLao: "ນໍ້າບາກ", districtNameEng: "Nambak", provinceName: "ແຂວງຫຼວງພະບາງ", model: "M3D", serialNo: "SN-M3D0-605", note: "ສະຖານະປົກກະຕິ" },
  { id: 39, districtCode: "606", districtNameLao: "ງອຍ", districtNameEng: "Ngoy", provinceName: "ແຂວງຫຼວງພະບາງ", model: "M6", serialNo: "SN-M600-606", note: "ສະຖານະປົກກະຕິ" },
  { id: 40, districtCode: "607", districtNameLao: "ປາກແຊງ", districtNameEng: "Pakxeng", provinceName: "ແຂວງຫຼວງພະບາງ", model: "NX200", serialNo: "SN-NX20-607", note: "ສະຖານະປົກກະຕິ" },
  { id: 41, districtCode: "608", districtNameLao: "ໂພນໄຊ", districtNameEng: "Phonxai", provinceName: "ແຂວງຫຼວງພະບາງ", model: "P330Pro", serialNo: "SN-P330-608", note: "ສະຖານະປົກກະຕິ" },
  { id: 42, districtCode: "609", districtNameLao: "ຈອມເພັດ", districtNameEng: "Chomphet", provinceName: "ແຂວງຫຼວງພະບາງ", model: "P5", serialNo: "SN-P500-609", note: "ສະຖານະປົກກະຕິ" },
  { id: 43, districtCode: "610", districtNameLao: "ວຽງຄຳ", districtNameEng: "Viangkham", provinceName: "ແຂວງຫຼວງພະບາງ", model: "PA-3", serialNo: "SN-PA30-610", note: "ສະຖານະປົກກະຕິ" },
  { id: 44, districtCode: "611", districtNameLao: "ພູຄູນ", districtNameEng: "Phoukhoun", provinceName: "ແຂວງຫຼວງພະບາງ", model: "RS10", serialNo: "SN-RS10-611", note: "ສະຖານະປົກກະຕິ" },
  { id: 45, districtCode: "612", districtNameLao: "ໂພນທອງ", districtNameEng: "Phonthong", provinceName: "ແຂວງຫຼວງພະບາງ", model: "SG5", serialNo: "SN-SG50-612", note: "ສະຖານະປົກກະຕິ" },
  { id: 46, districtCode: "701", districtNameLao: "ຊຳເໜືອ", districtNameEng: "XAM-NUA", provinceName: "ແຂວງຫົວພັນ", model: "SG6", serialNo: "SN-SG60-701", note: "ສະຖານະປົກກະຕິ" },
  { id: 47, districtCode: "702", districtNameLao: "ຊຽງຄໍ້", districtNameEng: "Xiangkho", provinceName: "ແຂວງຫົວພັນ", model: "SG7", serialNo: "SN-SG70-702", note: "ສະຖານະປົກກະຕິ" },
  { id: 48, districtCode: "703", districtNameLao: "ຮ້ຽມ (ວຽງທອງ)", districtNameEng: "Hiam (Viangthong)", provinceName: "ແຂວງຫົວພັນ", model: "X900", serialNo: "SN-X900-703", note: "ສະຖານະປົກກະຕິ" },
  { id: 49, districtCode: "704", districtNameLao: "ວຽງໄຊ", districtNameEng: "Viangxai", provinceName: "ແຂວງຫົວພັນ", model: "X91+", serialNo: "SN-X910-704", note: "ສະຖານະປົກກະຕິ" },
  { id: 50, districtCode: "705", districtNameLao: "ຫົວເມືອງ", districtNameEng: "Houamuang", provinceName: "ແຂວງຫົວພັນ", model: "华微3号Pro", serialNo: "SN-HW3P-705", note: "ສະຖານະປົກກະຕິ" },
  { id: 51, districtCode: "706", districtNameLao: "ຊຳໃຕ້", districtNameEng: "Xam-tai", provinceName: "ແຂວງຫົວພັນ", model: "C220GR2", serialNo: "SN-C220-706", note: "ສະຖານະປົກກະຕິ" },
  { id: 52, districtCode: "707", districtNameLao: "ສົບເບົາ", districtNameEng: "Sopbao", provinceName: "ແຂວງຫົວພັນ", model: "P5E-Net", serialNo: "SN-P5EN-707", note: "ສະຖານະປົກກະຕິ" },
  { id: 53, districtCode: "708", districtNameLao: "ແອດ", districtNameEng: "Et", provinceName: "ແຂວງຫົວພັນ", model: "P5", serialNo: "SN-P500-708", note: "ສະຖານະປົກກະຕິ" },
  { id: 54, districtCode: "709", districtNameLao: "ກວັນ", districtNameEng: "Quanh", provinceName: "ແຂວງຫົວພັນ", model: "Computer", serialNo: "SN-COMP-709", note: "ສະຖານະປົກກະຕິ" },
  { id: 55, districtCode: "710", districtNameLao: "ຊ່ອນ", districtNameEng: "Shon", provinceName: "ແຂວງຫົວພັນ", model: "Primus", serialNo: "SN-PRIM-710", note: "ສະຖານະປົກກະຕິ" },
  { id: 56, districtCode: "801", districtNameLao: "ໄຊຍະບູລີ", districtNameEng: "XAINGABOULI", provinceName: "ແຂວງໄຊຍະບູລີ", model: "UPS 750VA", serialNo: "SN-UPS7-801", note: "ສະຖານະປົກກະຕິ" },
  { id: 57, districtCode: "802", districtNameLao: "ຄອບ", districtNameEng: "Khop", provinceName: "ແຂວງໄຊຍະບູລີ", model: "LandStar Software", serialNo: "SN-LSST-802", note: "ສະຖານະປົກກະຕິ" },
  { id: 58, districtCode: "803", districtNameLao: "ຫົງສາ", districtNameEng: "Hongsa", provinceName: "ແຂວງໄຊຍະບູລີ", model: "VIVO", serialNo: "SN-VIVO-803", note: "ສະຖານະປົກກະຕິ" },
  { id: 59, districtCode: "804", districtNameLao: "ເງິນ", districtNameEng: "Ngeun", provinceName: "ແຂວງໄຊຍະບູລີ", model: "HUAWEI", serialNo: "SN-HUWA-804", note: "ສະຖານະປົກກະຕິ" },
  { id: 60, districtCode: "805", districtNameLao: "ຊຽງຮ່ອນ", districtNameEng: "Xianghon", provinceName: "ແຂວງໄຊຍະບູລີ", model: "TECNO", serialNo: "SN-TECN-805", note: "ສະຖານະປົກກະຕິ" },
  { id: 61, districtCode: "806", districtNameLao: "ພຽງ", districtNameEng: "Phiang", provinceName: "ແຂວງໄຊຍະບູລີ", model: "GPSMAP64s", serialNo: "SN-GPS6-806", note: "ສະຖານະປົກກະຕິ" },
  { id: 62, districtCode: "807", districtNameLao: "ປາກລາຍ", districtNameEng: "Paklay", provinceName: "ແຂວງໄຊຍະບູລີ", model: "GPSMAP64s", serialNo: "SN-GPS6-807", note: "ສະຖານະປົກກະຕິ" },
  { id: 63, districtCode: "808", districtNameLao: "ແກ່ນທ້າວ", districtNameEng: "Kenthao", provinceName: "ແຂວງໄຊຍະບູລີ", model: "HUAWEI", serialNo: "SN-HW90-808", note: "ສະຖານະປົກກະຕິ" },
  { id: 64, districtCode: "809", districtNameLao: "ບໍ່ແຕນ", districtNameEng: "Boten", provinceName: "ແຂວງໄຊຍະບູລີ", model: "TECNO", serialNo: "SN-TC03-809", note: "ສະຖານະປົກກະຕິ" },
  { id: 65, districtCode: "901", districtNameLao: "ແປກ", districtNameEng: "PEK", provinceName: "ແຂວງຊຽງຂວາງ", model: "i80", serialNo: "SN-I800-901", note: "ສະຖານະປົກກະຕິ" },
  { id: 66, districtCode: "902", districtNameLao: "ຄຳ", districtNameEng: "Kham", provinceName: "ແຂວງຊຽງຂວາງ", model: "i70", serialNo: "SN-I700-902", note: "ສະຖານະປົກກະຕິ" },
  { id: 67, districtCode: "1001", districtNameLao: "ໂພນໂຮງ", districtNameEng: "Phonhong", provinceName: "ແຂວງວຽງຈັນ", model: "i90", serialNo: "SN-I900-1001", note: "ສະຖານະປົກກະຕິ" },
  { id: 68, districtCode: "1005", districtNameLao: "ວັງວຽງ", districtNameEng: "Vangving", provinceName: "ແຂວງວຽງຈັນ", model: "i30", serialNo: "SN-I300-1005", note: "ສະຖານະປົກກະຕິ" },
  { id: 69, districtCode: "1101", districtNameLao: "ປາກຊັນ", districtNameEng: "PAKXAN", provinceName: "ແຂວງບໍລິຄຳໄຊ", model: "iBase", serialNo: "SN-IBSA-1101", note: "ສະຖານະປົກກະຕິ" },
  { id: 70, districtCode: "1201", districtNameLao: "ທ່າແຂກ", districtNameEng: "THAKEK", provinceName: "ແຂວງຄຳມ່ວນ", model: "IC100", serialNo: "SN-IC10-1201", note: "ສະຖານະປົກກະຕິ" },
  { id: 71, districtCode: "1301", districtNameLao: "ນະຄອນໄກສອນ ພົມວິຫານ", districtNameEng: "KAYSONE PHOMVIHANE CITY", provinceName: "ແຂວງສະຫວັນນະເຂດ", model: "M6", serialNo: "SN-M600-1301", note: "ສະຖານະປົກກະຕິ" },
  { id: 72, districtCode: "1401", districtNameLao: "ສາລະວັນ", districtNameEng: "SALAVAN", provinceName: "ແຂວງສາລະວັນ", model: "P5", serialNo: "SN-P500-1401", note: "ສະຖານະປົກກະຕິ" },
  { id: 73, districtCode: "1501", districtNameLao: "ລະມາມ", districtNameEng: "LAMAM", provinceName: "ແຂວງເຊກອງ", model: "i83", serialNo: "SN-I830-1501", note: "ສະຖານະປົກກະຕິ" },
  { id: 74, districtCode: "1601", districtNameLao: "ນະຄອນປາກເຊ", districtNameEng: "PAKXE CITY", provinceName: "ແຂວງຈຳປາສັກ", model: "RS10", serialNo: "SN-RS10-1601", note: "ສະຖານະປົກກະຕິ" },
  { id: 75, districtCode: "1701", districtNameLao: "ໄຊເສດຖາ", districtNameEng: "Xaisettha", provinceName: "ແຂວງອັດຕະປື", model: "SG7", serialNo: "SN-SG70-1701", note: "ສະຖານະປົກກະຕິ" },
  { id: 76, districtCode: "1801", districtNameLao: "ອານຸວົງ", districtNameEng: "Arnuvong", provinceName: "ແຂວງໄຊສົມບູນ", model: "X900", serialNo: "SN-X900-1801", note: "ສະຖານະປົກກະຕິ" }
];

export const initialQuotations: Quotation[] = [
  {
    id: "QT-2024-001",
    refNo: "QT-2023-11004",
    customerName: "Lao-China Railway Co., Ltd",
    date: "2024-05-14",
    validity: "30 ວັນ",
    items: [
      {
        id: "item-1",
        description: "Repair Service for Total Station (Leica TS16)",
        details: "Full calibration, lens cleaning, and firmware update.",
        qty: 1,
        unitPrice: 2500000
      },
      {
        id: "item-2",
        description: "CORS Station Maintenance",
        details: "Quarterly site inspection and hardware diagnostic.",
        qty: 2,
        unitPrice: 4200000
      }
    ],
    terms: "ລາຄານີ້ລວມຄ່າຂົນສົ່ງພາຍໃນນະຄອນຫຼວງວຽງຈັນ. ສໍາລັບຕ່າງແຂວງຈະມີຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມຕາມໄລຍະທາງຕົວຈິງ.",
    subtotal: 10900000,
    vat: 763000,
    total: 11663000
  }
];

export const initialNotes: InternalNote[] = [
  { id: "note-1", repairId: "REP-2024-0089", author: "ຊ່າງ ພອນ", date: "14/05/2024", text: "ຕ້ອງການອາໄຫຼ່ Prism Holder ໃໝ່ ເນື່ອງຈາກໂຕເກົ່າມີຮອຍແຕກ." },
  { id: "note-2", repairId: "REP-2024-0089", author: "Admin", date: "13/05/2024", text: "ລູກຄ້າແຈ້ງວ່າຕ້ອງການເຄື່ອງຄືນກ່ອນວັນທີ 20 ນີ້." }
];

export const initialProfile: UserProfile = {
  name: "ສົມພອນ ໄຊຍະເສນ",
  role: "Senior Technical Specialist",
  phone: "020 76 111 800",
  department: "Technical Service & Support",
  email: "admin@uniqtek.la",
  themeMode: "Light"
};

export const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "ສົມພອນ ເພັດດາລາ",
    role: "Senior Technical Specialist",
    department: "Service & Calibration",
    phone: "020 76 111 800",
    email: "somphone.p@uniqtek.la",
    active: true,
    specialties: ["Total Station", "EDM Calibration", "Leica Optics", "Laser Alignment"]
  },
  {
    id: "EMP-002",
    name: "ວັນໄຊ ມະນີວົງ",
    role: "Hardware & Electronics Engineer",
    department: "Electronics & Diagnostics",
    phone: "020 55 422 911",
    email: "vanxay.m@uniqtek.la",
    active: true,
    specialties: ["GNSS Receiver", "Trimble RTK", "Circuit Board Repair", "Firmware Flash"]
  },
  {
    id: "EMP-003",
    name: "ທ່ານ ອານຸສອນ ສີຫາວົງ",
    role: "Field Survey Team Lead",
    department: "Geodetic Engineering",
    phone: "020 5556 1234",
    email: "anousone.s@uniqtek.la",
    active: true,
    specialties: ["CORS Network", "Field Survey", "UAV LiDAR", "Network RTK"]
  },
  {
    id: "EMP-004",
    name: "ນາງ ມະນີວັນ ເພັດດາລາ",
    role: "Geodetic & GIS Engineer",
    department: "Data Analysis & QA",
    phone: "020 9998 7654",
    email: "manyvanh.p@uniqtek.la",
    active: true,
    specialties: ["GIS Mapping", "Post-Processing", "Photogrammetry", "Quality Control"]
  },
  {
    id: "EMP-005",
    name: "ທະວີສັກ ແກ້ວມະນີ",
    role: "Optical & Leveling Technician",
    department: "Optical Workshop",
    phone: "020 58 776 321",
    email: "thavisack.k@uniqtek.la",
    active: true,
    specialties: ["Digital Level", "Auto Level", "Theodolite", "Prism Collimation"]
  },
  {
    id: "EMP-006",
    name: "ນາງ ວິໄລວັນ ສົມພອນ",
    role: "Maintenance & Field Support Engineer",
    department: "Field Support",
    phone: "020 7788 9900",
    email: "vilayvanh.s@uniqtek.la",
    active: true,
    specialties: ["CORS Solar/UPS", "Field Inspection", "Sensor Maintenance"]
  }
];

export const initialUsers: UserAccount[] = [
  {
    id: "USR-001",
    username: "admin",
    name: "ສົມພອນ ໄຊຍະເສນ",
    email: "admin@uniqtek.la",
    password: "admin123",
    passwordUpdatedAt: "2025-02-15 08:30",
    accountEnabled: true,
    role: "Senior Technical Specialist",
    department: "Technical Service & Support",
    phone: "020 76 111 800",
    accessLevel: "Admin",
    status: "Online",
    lastActive: "ຫາກໍ່ອັບເດດ (Real-time)",
    currentActivity: "ກຳລັງຕິດຕາມລະບົບບໍລິການສ້ອມແປງ ແລະ ຖານຂໍ້ມູນ",
    themeMode: "Light"
  },
  {
    id: "USR-002",
    username: "pheng.admin",
    name: "Pheng (System Architect)",
    email: "PhengBMCY18@gmail.com",
    password: "uniqtek@2025",
    passwordUpdatedAt: "2025-02-18 10:15",
    accountEnabled: true,
    role: "Operations & Systems Director",
    department: "Executive & IT Infrastructure",
    phone: "020 76 111 800",
    accessLevel: "Admin",
    status: "Online",
    lastActive: "ຫາກໍ່ອັບເດດ (Real-time)",
    currentActivity: "ຄວບຄຸມລະບົບ Cloud Firestore & ສະຖານີ CORS",
    themeMode: "Light"
  },
  {
    id: "USR-003",
    username: "somphone.p",
    name: "ສົມພອນ ເພັດດາລາ",
    email: "somphone.p@uniqtek.la",
    password: "tech@1234",
    passwordUpdatedAt: "2025-02-10 14:20",
    accountEnabled: true,
    role: "Senior Technical Specialist",
    department: "Service & Calibration",
    phone: "020 76 111 800",
    accessLevel: "Technician",
    status: "Online",
    lastActive: "2 ນາທີກ່ອນ",
    currentActivity: "ກຳລັງປັບຈູນ Optical Alignment ເຄື່ອງ Leica TS16",
    themeMode: "Light"
  },
  {
    id: "USR-004",
    username: "vanxay.m",
    name: "ວັນໄຊ ມະນີວົງ",
    email: "vanxay.m@uniqtek.la",
    password: "vanxay@2025",
    passwordUpdatedAt: "2025-02-12 09:45",
    accountEnabled: true,
    role: "Hardware & Electronics Engineer",
    department: "Electronics & Diagnostics",
    phone: "020 55 422 911",
    accessLevel: "Technician",
    status: "Busy",
    lastActive: "5 ນາທີກ່ອນ",
    currentActivity: "ກວດເຊັກບອດຮັບສັນຍານ GNSS RTK & ຈໍ LCD Leica LS15",
    themeMode: "Dark"
  },
  {
    id: "USR-005",
    username: "anousone.s",
    name: "ທ່ານ ອານຸສອນ ສີຫາວົງ",
    email: "anousone.s@uniqtek.la",
    password: "survey@2025",
    passwordUpdatedAt: "2025-02-14 16:00",
    accountEnabled: true,
    role: "Field Survey Team Lead",
    department: "Geodetic Engineering",
    phone: "020 5556 1234",
    accessLevel: "Engineer",
    status: "Online",
    lastActive: "1 ນາທີກ່ອນ",
    currentActivity: "ລົງພາກສະໜາມສຳຫຼວດພື້ນທີ່ ນະຄອນຫຼວງ-ວັງວຽງ",
    themeMode: "Light"
  },
  {
    id: "USR-006",
    username: "manyvanh.p",
    name: "ນາງ ມະນີວັນ ເພັດດາລາ",
    email: "manyvanh.p@uniqtek.la",
    password: "gis@uniqtek",
    passwordUpdatedAt: "2025-02-16 11:10",
    accountEnabled: true,
    role: "Geodetic & GIS Engineer",
    department: "Data Analysis & QA",
    phone: "020 9998 7654",
    accessLevel: "Engineer",
    status: "Online",
    lastActive: "8 ນາທີກ່ອນ",
    currentActivity: "ວິເຄາະຂໍ້ມູນພິກັດ GIS ແລະ ກວດສອບຄຸນນະພາບ",
    themeMode: "System"
  },
  {
    id: "USR-007",
    username: "thavisack.k",
    name: "ທະວີສັກ ແກ້ວມະນີ",
    email: "thavisack.k@uniqtek.la",
    password: "optical@888",
    passwordUpdatedAt: "2025-02-05 13:50",
    accountEnabled: true,
    role: "Optical & Leveling Technician",
    department: "Optical Workshop",
    phone: "020 58 776 321",
    accessLevel: "Technician",
    status: "Offline",
    lastActive: "1 ຊົ່ວໂມງກ່ອນ",
    currentActivity: "ສຳເລັດການທົດສອບ Collimation ກ້ອງລະດັບ",
    themeMode: "Light"
  }
];


