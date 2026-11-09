# UniqTek Technical Services - Android Application

ລະບົບຈັດການບໍລິການສ້ອມແປງອຸປະກອນ ແລະ ສຳຫຼວດວັດແທກ ບໍລິສັດ ຢູນິກເທັກ ຈຳກັດ (UniqTek Co., Ltd) ພ້ອມສະຫຼຸບລາຍເດືອນ, ສະແດງກຣາຟວິເຄາະ ແລະ ເກັບຂໍ້ມູນພາຍໃນ.

This project is a modern, responsive, and robust native Android application built using **Kotlin**, **Jetpack Compose**, and **Material Design 3 (M3)**. It is a direct cross-framework rewrite from the original React web app.

---

## 📱 Features

1. **Dashboard & KPIs (ໜ້າຫຼັກ)**:
   - Real-time summaries of active repair tickets, ongoing field survey projects, online CORS stations, and quotations.
   - Beautiful visual status breakdown metrics utilizing Material 3 card designs.
   - Display lists of latest technical internal notes and service orders.

2. **Equipment Repairs Management (ບໍລິການສ້ອມແປງ)**:
   - Full search and status filters (e.g., waiting, repairing, completed) for high precision.
   - Interactive, beautiful stepper-like operational timelines.
   - Diagnostic controls allowing technicians to update causes, standard solutions, and add technical internal notes.

3. **Field Survey Projects (ໂຄງການສຳຫຼວດວັດແທກ)**:
   - Survey project listing including progress tracking via custom slider controllers.
   - Team assignments, GPS/Coordinate tracking, and client logs.

4. **CORS Reference Stations (ສະຖານີ CORS)**:
   - Live toggles for CORS station status (Online/Offline) and inline editing of maintenance/problem logs.

5. **Quotations System (ໃບສະເໜີລາຄາ)**:
   - Advanced quote builder allowing technicians to dynamically add item lines.
   - Automatic calculations of subtotal, tax (VAT 7%), and grand totals.

---

## 🛠️ Architecture & Tech Stack

- **UI Framework**: [Jetpack Compose](https://developer.android.com/compose) with Material Design 3.
- **Language**: Kotlin.
- **Local Database & Persistence**: [Room Database](https://developer.android.com/training/data-storage/room) for robust offline CRUD operation storage and pre-seeded database setups.
- **Architecture Pattern**: MVVM (Model-View-ViewModel) with responsive Kotlin StateFlows.
- **Build Tooling**: Gradle (Kotlin DSL).

---

## 🚀 How to Run & Build

1. **Export / Download Project**:
   - In Google AI Studio, click on **Settings** and choose **Export as ZIP** or **Push to GitHub**.
2. **Open in Android Studio**:
   - Open Android Studio (Ladybug or newer) and select **Open Project**.
   - Let Gradle sync and download the SDK dependencies.
3. **Build the APK**:
   - In Android Studio, go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
   - Run the application on an emulator or an Android device.
