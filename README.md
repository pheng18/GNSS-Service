# UniqTek Technical Services - Web Application

ລະບົບຈັດການບໍລິການສ້ອມແປງອຸປະກອນ ແລະ ສຳຫຼວດວັດແທກ ບໍລິສັດ ຢູນິກເທັກ ຈຳກັດ (UniqTek Co., Ltd) ພ້ອມສະຫຼຸບລາຍເດືອນ, ສະແດງກຣາຟວິເຄາະ ແລະ ເກັບຂໍ້ມູນໃນ Firebase.

This project is a modern, responsive, and robust web application built using **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase**.

---

## 📱 Features

1. **Dashboard & KPIs (ໜ້າຫຼັກ)**:
   - Real-time summaries of active repair tickets, ongoing field survey projects, online CORS stations, and quotations.
   - Status breakdown meters and visual indicators.
   - Latest technical internal notes and recent repair service orders.

2. **Equipment Repairs Management (ບໍລິການສ້ອມແປງ)**:
   - Full search by serial number, model, client name, and repair ticket ID.
   - Status filters (`ທັງໝົດ`, `ລໍຖ້າກວດເຊັກ`, `ກຳລັງສ້ອມແປງ`, `ສຳເລັດແລ້ວ`).
   - Detailed diagnostics editor (problem, cause, solution, assigned technician).
   - Dynamic operational timeline steps.
   - Internal technical notes feed with instant submission.

3. **Field Survey Projects (ໂຄງການສຳຫຼວດວັດແທກ)**:
   - Survey project listing with interactive progress slider (0–100%).
   - Team assignments, GPS/Coordinate tracking, and client logs.
   - Status management (`ກຳລັງສຳຫຼວດ`, `ລໍຖ້າການວິເຄາະ`, `ສຳເລັດແລ້ວ`).

4. **CORS Reference Stations (ສະຖານີ CORS)**:
   - Complete 73 CORS stations database.
   - Real-time quick toggle for station status (`Online` / `Offline`).
   - Category filtering (`ທັງໝົດ`, `ໃໝ່`, `ເກົ່າ`).
   - Maintenance log and budget notes editor.

5. **District Equipment Info (ອຸປະກອນ)**:
   - 76 district equipment records across all 18 provinces of Lao PDR.
   - Filter by province and search by district code, model, and serial number.
   - Serial number and notes management modal.

6. **Quotations System (ໃບສະເໜີລາຄາ)**:
   - Dynamic quote builder with itemized services/products.
   - Automatic calculations of subtotal, VAT (7%), and grand total (LAK).
   - Printable invoice layout with validity terms and customer details.

7. **User Profile & Activity Audit (ຂໍ້ມູນສ່ວນຕົວ)**:
   - Technician profile with digital signature approval badge.
   - App theme switcher (`Light`, `Dark`, `System`).
   - Audit trail session logs timeline.

---

## 🛠️ Architecture & Tech Stack

- **UI Framework**: React 18 with TypeScript.
- **Styling**: Tailwind CSS with dark mode and custom UniqTek theme tokens.
- **Build Tool**: Vite.
- **Database & Auth**: Firebase Firestore & Auth integration with local persistent fallback.
- **Icons**: Lucide React.
