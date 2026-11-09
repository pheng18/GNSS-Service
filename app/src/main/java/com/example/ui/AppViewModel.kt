package com.example.ui

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID

data class UserLog(
    val id: String,
    val timestamp: String,
    val action: String,
    val details: String,
    val type: String // "auth", "repair", "project", "cors", "quote", "profile", "system"
)

class AppViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application, viewModelScope)
    private val repository = AppRepository(database)
    private val prefs = application.getSharedPreferences("uniqtek_user_preferences", Context.MODE_PRIVATE)

    // Auth state: holds the user's email if logged in
    private val _user = MutableStateFlow<String?>(null)
    val user: StateFlow<String?> = _user.asStateFlow()

    // Current navigation view
    private val _currentView = MutableStateFlow("dashboard")
    val currentView: StateFlow<String> = _currentView.asStateFlow()

    // Selection states
    private val _selectedRepair = MutableStateFlow<Repair?>(null)
    val selectedRepair: StateFlow<Repair?> = _selectedRepair.asStateFlow()

    private val _selectedProject = MutableStateFlow<Project?>(null)
    val selectedProject: StateFlow<Project?> = _selectedProject.asStateFlow()

    private val _selectedQuotation = MutableStateFlow<Quotation?>(null)
    val selectedQuotation: StateFlow<Quotation?> = _selectedQuotation.asStateFlow()

    // Global search input
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // User Profile persistent states (SharedPreferences)
    private val _profileName = MutableStateFlow(prefs.getString("fullName", "ສົມພອນ ໄຊຍະເສນ") ?: "ສົມພອນ ໄຊຍະເສນ")
    val profileName: StateFlow<String> = _profileName.asStateFlow()

    private val _profileRole = MutableStateFlow(prefs.getString("role", "Senior Technical Specialist") ?: "Senior Technical Specialist")
    val profileRole: StateFlow<String> = _profileRole.asStateFlow()

    private val _profilePhone = MutableStateFlow(prefs.getString("phone", "020 76 111 800") ?: "020 76 111 800")
    val profilePhone: StateFlow<String> = _profilePhone.asStateFlow()

    private val _profileDept = MutableStateFlow(prefs.getString("department", "Technical Service & Support") ?: "Technical Service & Support")
    val profileDept: StateFlow<String> = _profileDept.asStateFlow()

    private val _profileTheme = MutableStateFlow(prefs.getString("themeMode", "System") ?: "System")
    val profileTheme: StateFlow<String> = _profileTheme.asStateFlow()

    // Activity log stream for user operations
    private val _activityLogs = MutableStateFlow<List<UserLog>>(emptyList())
    val activityLogs: StateFlow<List<UserLog>> = _activityLogs.asStateFlow()

    // Subscribed state lists from database
    val repairs = repository.repairs.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val projects = repository.projects.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val stations = repository.stations.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val quotations = repository.quotations.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val notes = repository.notes.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val equipment = repository.equipment.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        logUserOperation("ເລີ່ມຕົ້ນລະບົບ", "ແອັບພລິເຄຊັນພ້ອມໃຊ້ງານໃນໂໝດປອດໄພ", "system")
    }

    fun login(email: String) {
        _user.value = email
        logUserOperation("ເຂົ້າສູ່ລະບົບ", "ຜູ້ໃຊ້: $email", "auth")
    }

    fun logout() {
        val lastUser = _user.value ?: "ບໍ່ລະບຸ"
        _user.value = null
        _currentView.value = "dashboard"
        _selectedRepair.value = null
        _selectedProject.value = null
        _selectedQuotation.value = null
        logUserOperation("ອອກຈາກລະບົບ", "ຜູ້ໃຊ້: $lastUser", "auth")
    }

    fun navigateTo(view: String) {
        _currentView.value = view
        // Reset specific selections if not viewing detail pages
        if (view != "repair_details") _selectedRepair.value = null
        if (view != "project_details") _selectedProject.value = null
        if (view != "quotation_details") _selectedQuotation.value = null
    }

    fun selectRepair(repair: Repair?) {
        _selectedRepair.value = repair
        if (repair != null) {
            navigateTo("repair_details")
        }
    }

    fun selectProject(project: Project?) {
        _selectedProject.value = project
        if (project != null) {
            navigateTo("project_details")
        }
    }

    fun selectQuotation(quotation: Quotation?) {
        _selectedQuotation.value = quotation
        if (quotation != null) {
            navigateTo("quotation_details")
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    // --- User Profile Settings & Operations ---
    fun updateProfile(name: String, role: String, phone: String, dept: String) {
        _profileName.value = name
        _profileRole.value = role
        _profilePhone.value = phone
        _profileDept.value = dept
        prefs.edit().apply {
            putString("fullName", name)
            putString("role", role)
            putString("phone", phone)
            putString("department", dept)
            apply()
        }
        logUserOperation("ອັບເດດຂໍ້ມູນສ່ວນຕົວ", "ຊື່ແທ້: $name, ຕຳແໜ່ງ: $role, ພະແນກ: $dept", "profile")
    }

    fun updateThemeMode(mode: String) {
        _profileTheme.value = mode
        prefs.edit().putString("themeMode", mode).apply()
        logUserOperation("ປ່ຽນຮູບແບບການສະແດງຜົນ", "ເປັນຮູບແບບ: $mode", "profile")
    }

    fun clearActivityLogs() {
        _activityLogs.value = emptyList()
        logUserOperation("ລ້າງປະຫວັດການເຮັດວຽກ", "ປະຫວັດການເຮັດວຽກທັງໝົດຖືກລຶບອອກແລ້ວ", "system")
    }

    fun logUserOperation(action: String, details: String, type: String) {
        val timestamp = java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
        val newLog = UserLog(
            id = UUID.randomUUID().toString().take(8),
            timestamp = timestamp,
            action = action,
            details = details,
            type = type
        )
        _activityLogs.value = listOf(newLog) + _activityLogs.value
    }

    // --- Repair Actions ---
    fun addRepair(serialNo: String, model: String, title: String, client: String, problem: String, assignedTech: String) {
        viewModelScope.launch {
            val date = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date())
            val id = "REP-2024-${(1000..9999).random()}"
            val newRepair = Repair(
                id = id,
                serialNo = if (serialNo.startsWith("SN:")) serialNo else "SN: $serialNo",
                model = model,
                title = title,
                client = client,
                receivedDate = date,
                status = "ລໍຖ້າກວດເຊັກ",
                problem = problem,
                cause = "",
                solution = "",
                assignedTech = assignedTech,
                timeline = listOf(
                    TimelineItem("t1", "$date - 09:00", "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", true, "done")
                )
            )
            repository.insertRepair(newRepair)
            logUserOperation("ເພີ່ມລາຍການສ້ອມແປງ", "ເລກບັດ: $id, ອຸປະກອນ: $model ($serialNo)", "repair")
        }
    }

    fun updateRepairStatus(repair: Repair, newStatus: String, cause: String = "", solution: String = "") {
        viewModelScope.launch {
            val currentTimeline = repair.timeline.toMutableList()
            val date = java.text.SimpleDateFormat("dd/MM/yyyy - HH:mm", java.util.Locale.getDefault()).format(java.util.Date())

            // Add new timeline entry on status change
            val nextId = "t${currentTimeline.size + 1}"
            currentTimeline.add(
                TimelineItem(
                    id = nextId,
                    date = date,
                    title = "ອັບເດດສະຖານະ: $newStatus",
                    desc = if (newStatus == "ສຳເລັດແລ້ວ") "ສ້ອມແປງສຳເລັດ ແລະ ພ້ອມສົ່ງມອບ" else "ປ່ຽນສະຖານະໃນລະບົບຈັດການສ້ອມແປງ",
                    done = true,
                    status = "done"
                )
            )

            val updated = repair.copy(
                status = newStatus,
                cause = cause.ifEmpty { repair.cause },
                solution = solution.ifEmpty { repair.solution },
                timeline = currentTimeline
            )
            repository.updateRepair(updated)
            if (_selectedRepair.value?.id == repair.id) {
                _selectedRepair.value = updated
            }
            logUserOperation("ອັບເດດສະຖານະການສ້ອມແປງ", "ບັດ: ${repair.id}, ສະຖານະ: $newStatus", "repair")
        }
    }

    fun addInternalNote(repairId: String, author: String, text: String) {
        viewModelScope.launch {
            val date = java.text.SimpleDateFormat("dd/MM/yyyy", java.util.Locale.getDefault()).format(java.util.Date())
            val id = "note-${UUID.randomUUID().toString().take(8)}"
            val newNote = InternalNote(id, repairId, author, date, text)
            repository.insertNote(newNote)
            logUserOperation("ເພີ່ມບັນທຶກພາຍໃນ", "ເລກບັດ: $repairId, ໂດຍ: $author", "repair")
        }
    }

    // --- Project Actions ---
    fun addProject(title: String, client: String, location: String, lat: Double, lng: Double, teamName: String, teamRole: String, teamPhone: String) {
        viewModelScope.launch {
            val id = "PRJ-${(100..999).random()}"
            val newProject = Project(
                id = id,
                title = title,
                client = client,
                progress = 0,
                status = "ກຳລັງສຳຫຼວດ",
                location = location,
                coordinatesLat = lat,
                coordinatesLng = lng,
                team = listOf(
                    TeamMember(teamName, teamRole, "", true, teamPhone)
                )
            )
            repository.insertProject(newProject)
            logUserOperation("ເພີ່ມໂໂຄງການສຳຫຼວດ", "ໂຄງການ: $title, ສະຖານທີ່: $location", "project")
        }
    }

    fun updateProjectProgress(project: Project, progress: Int, status: String) {
        viewModelScope.launch {
            val updated = project.copy(progress = progress, status = status)
            repository.updateProject(updated)
            if (_selectedProject.value?.id == project.id) {
                _selectedProject.value = updated
            }
            logUserOperation("ອັບເດດໂຄງການສຳຫຼວດ", "ໂຄງການ: ${project.id}, ຄວາມຄືບໜ້າ: $progress%", "project")
        }
    }

    // --- CORS Actions ---
    fun toggleStationStatus(station: CORSStation) {
        viewModelScope.launch {
            val newStatus = if (station.status == "Online") "Offline" else "Online"
            val updated = station.copy(status = newStatus)
            repository.updateStation(updated)
            logUserOperation("ປ່ຽນສະຖານະສະຖານີ CORS", "ສະຖານີ: ${station.name} -> $newStatus", "cors")
        }
    }

    fun updateStationIssue(station: CORSStation, issue: String) {
        viewModelScope.launch {
            val updated = station.copy(issue = issue)
            repository.updateStation(updated)
            logUserOperation("ອັບເດດບັນຫາສະຖານີ CORS", "ສະຖານີ: ${station.name}, ບັນຫາ: $issue", "cors")
        }
    }

    // --- Equipment Actions ---
    fun updateEquipmentDetail(eq: Equipment) {
        viewModelScope.launch {
            repository.updateEquipment(eq)
            logUserOperation("ອັບເດດຂໍ້ມູນອຸປະກອນ", "ລຸ້ນ: ${eq.model}, SN: ${eq.serialNo}", "system")
        }
    }

    // --- Quotation Actions ---
    fun addQuotation(customerName: String, validity: String, items: List<QuotationItem>, terms: String) {
        viewModelScope.launch {
            val subtotal = items.sumOf { it.qty * it.unitPrice }
            val vat = subtotal * 0.07
            val total = subtotal + vat
            val date = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date())
            val refNo = "QT-2024-${(10000..99999).random()}"
            val id = "QT-2024-${(100..999).random()}"

            val newQuotation = Quotation(
                id = id,
                refNo = refNo,
                customerName = customerName,
                date = date,
                validity = validity,
                items = items,
                terms = terms,
                subtotal = subtotal,
                vat = vat,
                total = total
            )
            repository.insertQuotation(newQuotation)
            logUserOperation("ສ້າງໃບສະເໜີລາຄາ", "ເລກທີ: $refNo, ລູກຄ້າ: $customerName, ຍອດລວມ: $total LAK", "quote")
        }
    }
}
