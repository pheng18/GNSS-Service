package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.*

class MainActivity : ComponentActivity() {
    private val viewModel: AppViewModel by viewModels()

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val profileTheme by viewModel.profileTheme.collectAsState()
            val isDarkTheme = when (profileTheme) {
                "Light" -> false
                "Dark" -> true
                else -> androidx.compose.foundation.isSystemInDarkTheme()
            }

            UniqTekTheme(darkTheme = isDarkTheme) {
                val user by viewModel.user.collectAsState()
                val currentView by viewModel.currentView.collectAsState()
                val repairs by viewModel.repairs.collectAsState()
                val projects by viewModel.projects.collectAsState()
                val stations by viewModel.stations.collectAsState()
                val quotations by viewModel.quotations.collectAsState()
                val notes by viewModel.notes.collectAsState()
                val equipmentList by viewModel.equipment.collectAsState()

                val selectedRepair by viewModel.selectedRepair.collectAsState()
                val selectedProject by viewModel.selectedProject.collectAsState()
                val selectedQuotation by viewModel.selectedQuotation.collectAsState()

                if (user == null) {
                    LoginScreen(
                        onLoginSuccess = { email -> viewModel.login(email) }
                    )
                } else {
                    Scaffold(
                        topBar = {
                            TopAppBar(
                                title = {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.testTag("app_header_row")
                                    ) {
                                        UniqTekLogo(modifier = Modifier.size(32.dp))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Column {
                                            Text(
                                                "UNIQTEK SERVICES",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 13.sp,
                                                color = MaterialTheme.colorScheme.onSurface
                                            )
                                            Text(
                                                "ຜູ້ໃຊ້: $user",
                                                fontSize = 9.sp,
                                                color = Color.Gray,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                },
                                actions = {
                                    IconButton(
                                        onClick = { viewModel.navigateTo("profile") },
                                        modifier = Modifier.testTag("profile_button")
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Person,
                                            contentDescription = "ຂໍ້ມູນສ່ວນຕົວ",
                                            tint = Color(0xFF2563EB)
                                        )
                                    }
                                    IconButton(
                                        onClick = { viewModel.logout() },
                                        modifier = Modifier.testTag("logout_button")
                                    ) {
                                        Icon(
                                            imageVector = Icons.AutoMirrored.Filled.ExitToApp,
                                            contentDescription = "ອອກຈາກລະບົບ",
                                            tint = Color(0xFFEF4444)
                                        )
                                    }
                                },
                                colors = TopAppBarDefaults.topAppBarColors(
                                    containerColor = MaterialTheme.colorScheme.surface
                                )
                            )
                        },
                        bottomBar = {
                            // Hide navigation bar on sub-detailed screens and profile view
                            val isDetailOrProfileView = currentView.endsWith("_details") || currentView == "profile"
                            if (!isDetailOrProfileView) {
                                NavigationBar(
                                    containerColor = Color(0xFF1E3A8A), // Elegant deep blue background
                                    tonalElevation = 8.dp
                                ) {
                                    NavigationBarItem(
                                        selected = currentView == "dashboard",
                                        onClick = { viewModel.navigateTo("dashboard") },
                                        icon = { Icon(Icons.Default.Home, contentDescription = null) },
                                        label = { Text("ໜ້າຫຼັກ", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFF2563EB)
                                        ),
                                        modifier = Modifier.testTag("nav_dashboard")
                                    )
                                    NavigationBarItem(
                                        selected = currentView == "repairs",
                                        onClick = { viewModel.navigateTo("repairs") },
                                        icon = { Icon(Icons.Default.Build, contentDescription = null) },
                                        label = { Text("ສ້ອມແປງ", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFF2563EB)
                                        ),
                                        modifier = Modifier.testTag("nav_repairs")
                                    )
                                    NavigationBarItem(
                                        selected = currentView == "projects",
                                        onClick = { viewModel.navigateTo("projects") },
                                        icon = { Icon(Icons.Default.Place, contentDescription = null) },
                                        label = { Text("ສຳຫຼວດ", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFF10B981)
                                        ),
                                        modifier = Modifier.testTag("nav_projects")
                                    )
                                    NavigationBarItem(
                                        selected = currentView == "cors",
                                        onClick = { viewModel.navigateTo("cors") },
                                        icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                                        label = { Text("CORS", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFFD97706)
                                        ),
                                        modifier = Modifier.testTag("nav_cors")
                                    )
                                    NavigationBarItem(
                                        selected = currentView == "equipment",
                                        onClick = { viewModel.navigateTo("equipment") },
                                        icon = { Icon(Icons.Default.Info, contentDescription = null) },
                                        label = { Text("ອຸປະກອນ", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFF0284C7)
                                        ),
                                        modifier = Modifier.testTag("nav_equipment")
                                    )
                                    NavigationBarItem(
                                        selected = currentView == "quotations",
                                        onClick = { viewModel.navigateTo("quotations") },
                                        icon = { Icon(Icons.Default.ShoppingCart, contentDescription = null) },
                                        label = { Text("ໃບສະເໜີ", fontSize = 10.sp) },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = Color.White,
                                            selectedTextColor = Color.White,
                                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                                            unselectedTextColor = Color.White.copy(alpha = 0.6f),
                                            indicatorColor = Color(0xFFDB2777)
                                        ),
                                        modifier = Modifier.testTag("nav_quotations")
                                    )
                                }
                            }
                        }
                    ) { innerPadding ->
                        Surface(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding),
                            color = MaterialTheme.colorScheme.background
                        ) {
                            when (currentView) {
                                "dashboard" -> DashboardView(
                                    repairs = repairs,
                                    projects = projects,
                                    stations = stations,
                                    quotations = quotations,
                                    notes = notes,
                                    onNavigate = { view -> viewModel.navigateTo(view) },
                                    onSelectRepair = { repair -> viewModel.selectRepair(repair) }
                                )
                                "repairs", "repair_details" -> RepairsView(
                                    repairs = repairs,
                                    notes = notes,
                                    selectedRepair = selectedRepair,
                                    onSelectRepair = { repair -> viewModel.selectRepair(repair) },
                                    onAddRepair = { serial, model, title, client, prob, tech ->
                                        viewModel.addRepair(serial, model, title, client, prob, tech)
                                    },
                                    onUpdateRepairStatus = { repair, status, cause, solution ->
                                        viewModel.updateRepairStatus(repair, status, cause, solution)
                                    },
                                    onAddInternalNote = { repId, auth, text ->
                                        viewModel.addInternalNote(repId, auth, text)
                                    },
                                    currentUser = user ?: "Guest"
                                )
                                "projects", "project_details" -> ProjectsView(
                                    projects = projects,
                                    selectedProject = selectedProject,
                                    onSelectProject = { project -> viewModel.selectProject(project) },
                                    onAddProject = { title, client, location, lat, lng, name, role, phone ->
                                        viewModel.addProject(title, client, location, lat, lng, name, role, phone)
                                    },
                                    onUpdateProject = { project, progress, status ->
                                        viewModel.updateProjectProgress(project, progress, status)
                                    }
                                )
                                "cors" -> CorsView(
                                    stations = stations,
                                    onToggleStatus = { station -> viewModel.toggleStationStatus(station) },
                                    onUpdateIssue = { station, issue -> viewModel.updateStationIssue(station, issue) }
                                )
                                "equipment" -> EquipmentView(
                                    equipmentList = equipmentList,
                                    onUpdateEquipment = { eq -> viewModel.updateEquipmentDetail(eq) }
                                )
                                "quotations", "quotation_details" -> QuotationsView(
                                    quotations = quotations,
                                    selectedQuotation = selectedQuotation,
                                    onSelectQuotation = { quotation -> viewModel.selectQuotation(quotation) },
                                    onAddQuotation = { customer, validity, items, terms ->
                                        viewModel.addQuotation(customer, validity, items, terms)
                                    }
                                )
                                "profile" -> {
                                    val profileName by viewModel.profileName.collectAsState()
                                    val profileRole by viewModel.profileRole.collectAsState()
                                    val profilePhone by viewModel.profilePhone.collectAsState()
                                    val profileDept by viewModel.profileDept.collectAsState()
                                    val activityLogs by viewModel.activityLogs.collectAsState()

                                    ProfileView(
                                        email = user ?: "",
                                        profileName = profileName,
                                        profileRole = profileRole,
                                        profilePhone = profilePhone,
                                        profileDept = profileDept,
                                        profileTheme = profileTheme,
                                        activityLogs = activityLogs,
                                        onUpdateProfile = { name, role, phone, dept ->
                                            viewModel.updateProfile(name, role, phone, dept)
                                        },
                                        onUpdateTheme = { theme ->
                                            viewModel.updateThemeMode(theme)
                                        },
                                        onClearLogs = {
                                            viewModel.clearActivityLogs()
                                        },
                                        onNavigateBack = {
                                            viewModel.navigateTo("dashboard")
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
