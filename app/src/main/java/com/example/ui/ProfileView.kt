package com.example.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ProfileView(
    email: String,
    profileName: String,
    profileRole: String,
    profilePhone: String,
    profileDept: String,
    profileTheme: String,
    activityLogs: List<UserLog>,
    onUpdateProfile: (String, String, String, String) -> Unit,
    onUpdateTheme: (String) -> Unit,
    onClearLogs: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var activeTab by remember { mutableStateOf("profile") } // "profile", "settings", "logs"
    var isEditing by remember { mutableStateOf(false) }

    // Form states
    var tempName by remember { mutableStateOf(profileName) }
    var tempRole by remember { mutableStateOf(profileRole) }
    var tempPhone by remember { mutableStateOf(profilePhone) }
    var tempDept by remember { mutableStateOf(profileDept) }

    // Reset temporary states when profile gets updated or edit is toggled
    LaunchedEffect(isEditing) {
        if (isEditing) {
            tempName = profileName
            tempRole = profileRole
            tempPhone = profilePhone
            tempDept = profileDept
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Upper Profile Hero Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF1E3A8A), Color(0xFF0F172A))
                    )
                )
                .padding(vertical = 24.dp, horizontal = 16.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // User Avatar Circle with red badge
                Box(contentAlignment = Alignment.BottomEnd) {
                    Box(
                        modifier = Modifier
                            .size(90.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.15f))
                            .background(Brush.horizontalGradient(listOf(Color(0xFFE21B23), Color(0xFF2563EB)))),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (profileName.isNotEmpty()) profileName.take(1).uppercase() else "U",
                            fontSize = 36.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                    // Status Badge (Active/Online indicator)
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .padding(2.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(CircleShape)
                                .background(Color(0xFF10B981))
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = profileName,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Text(
                    text = profileRole,
                    fontSize = 13.sp,
                    color = Color(0xFF94A3B8),
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White.copy(alpha = 0.1f))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = email,
                        fontSize = 11.sp,
                        color = Color(0xFFCBD5E1)
                    )
                }
            }
        }

        // Custom M3 Tab Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .padding(vertical = 4.dp, horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            TabButton(
                title = "ຂໍ້ມູນສ່ວນຕົວ",
                icon = Icons.Default.Person,
                selected = activeTab == "profile",
                onClick = { activeTab = "profile" },
                modifier = Modifier.testTag("tab_profile")
            )
            TabButton(
                title = "ການຕັ້ງຄ່າ",
                icon = Icons.Default.Settings,
                selected = activeTab == "settings",
                onClick = { activeTab = "settings" },
                modifier = Modifier.testTag("tab_settings")
            )
            TabButton(
                title = "ປະຫວັດການເຮັດວຽກ",
                icon = Icons.Default.List,
                selected = activeTab == "logs",
                onClick = { activeTab = "logs" },
                modifier = Modifier.testTag("tab_logs")
            )
        }

        Divider(color = MaterialTheme.colorScheme.outlineVariant)

        // Main content body
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            when (activeTab) {
                "profile" -> {
                    if (isEditing) {
                        EditProfileForm(
                            name = tempName,
                            role = tempRole,
                            phone = tempPhone,
                            dept = tempDept,
                            onNameChange = { tempName = it },
                            onRoleChange = { tempRole = it },
                            onPhoneChange = { tempPhone = it },
                            onDeptChange = { tempDept = it },
                            onSave = {
                                onUpdateProfile(tempName, tempRole, tempPhone, tempDept)
                                isEditing = false
                            },
                            onCancel = { isEditing = false }
                        )
                    } else {
                        DisplayProfileCard(
                            name = profileName,
                            role = profileRole,
                            phone = profilePhone,
                            dept = profileDept,
                            email = email,
                            onEditToggle = { isEditing = true }
                        )
                    }
                }
                "settings" -> {
                    SettingsCard(
                        currentTheme = profileTheme,
                        onThemeChange = onUpdateTheme,
                        onClearLogs = onClearLogs
                    )
                }
                "logs" -> {
                    ActivityLogsTimeline(
                        logs = activityLogs,
                        onClearLogs = onClearLogs
                    )
                }
            }
        }

        // Back to Dashboard Button
        Button(
            onClick = onNavigateBack,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .height(48.dp)
                .testTag("back_to_dashboard_button"),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E3A8A)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.ArrowBack, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("ກັບຄືນໜ້າຫຼັກ", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun TabButton(
    title: String,
    icon: ImageVector,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val contentColor = if (selected) Color(0xFFE21B23) else Color(0xFF64748B)
    val indicatorColor = if (selected) Color(0xFFE21B23) else Color.Transparent

    Column(
        modifier = modifier
            .clickable { onClick() }
            .padding(vertical = 8.dp, horizontal = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp), tint = contentColor)
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = title,
            fontSize = 11.sp,
            color = contentColor,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
        )
        Spacer(modifier = Modifier.height(4.dp))
        Box(
            modifier = Modifier
                .width(28.dp)
                .height(3.dp)
                .clip(RoundedCornerShape(1.5.dp))
                .background(indicatorColor)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileForm(
    name: String,
    role: String,
    phone: String,
    dept: String,
    onNameChange: (String) -> Unit,
    onRoleChange: (String) -> Unit,
    onPhoneChange: (String) -> Unit,
    onDeptChange: (String) -> Unit,
    onSave: () -> Unit,
    onCancel: () -> Unit
) {
    var expandedRoles by remember { mutableStateOf(false) }
    val rolesList = listOf(
        "Senior Technical Specialist",
        "Technical Survey Engineer",
        "CORS Network Administrator",
        "Equipment Calibration Engineer",
        "IT Systems Administrator",
        "Operations Manager"
    )

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                "ແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            OutlinedTextField(
                value = name,
                onValueChange = onNameChange,
                label = { Text("ຊື່ ແລະ ນາມສະກຸນ") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth().testTag("edit_profile_name"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF2563EB)
                )
            )

            // Custom Dropdown for Roles
            Box(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = role,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("ບົດບາດ / ຕຳແໜ່ງ") },
                    trailingIcon = {
                        IconButton(onClick = { expandedRoles = true }) {
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                        }
                    },
                    modifier = Modifier.fillMaxWidth().clickable { expandedRoles = true }.testTag("edit_profile_role"),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF2563EB)
                    )
                )
                DropdownMenu(
                    expanded = expandedRoles,
                    onDismissRequest = { expandedRoles = false },
                    modifier = Modifier.fillMaxWidth(0.8f)
                ) {
                    rolesList.forEach { roleOption ->
                        DropdownMenuItem(
                            text = { Text(roleOption) },
                            onClick = {
                                onRoleChange(roleOption)
                                expandedRoles = false
                            }
                        )
                    }
                }
            }

            OutlinedTextField(
                value = dept,
                onValueChange = onDeptChange,
                label = { Text("ພະແນກ / ຝ່າຍ") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth().testTag("edit_profile_dept"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF2563EB)
                )
            )

            OutlinedTextField(
                value = phone,
                onValueChange = onPhoneChange,
                label = { Text("ເບີໂທຕິດຕໍ່") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth().testTag("edit_profile_phone"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF2563EB)
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onCancel,
                    modifier = Modifier.weight(1f).height(44.dp).testTag("cancel_edit_button"),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Color(0xFFCBD5E1))
                ) {
                    Text("ຍົກເລີກ", color = Color(0xFF64748B))
                }
                Button(
                    onClick = onSave,
                    modifier = Modifier.weight(1f).height(44.dp).testTag("save_edit_button"),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE21B23))
                ) {
                    Text("ບັນທຶກ", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun DisplayProfileCard(
    name: String,
    role: String,
    phone: String,
    dept: String,
    email: String,
    onEditToggle: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "ຂໍ້ມູນປະຈຳຕົວເຕັກນິກ",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                IconButton(
                    onClick = onEditToggle,
                    modifier = Modifier.testTag("edit_profile_toggle")
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "ແກ້ໄຂຂໍ້ມູນ",
                        tint = Color(0xFF2563EB)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            ProfileFieldRow(label = "ຊື່ ແລະ ນາມສະກຸນ:", value = name, icon = Icons.Default.Person)
            ProfileFieldRow(label = "ຕຳແໜ່ງ:", value = role, icon = Icons.Default.Star)
            ProfileFieldRow(label = "ພະແນກ:", value = dept, icon = Icons.Default.Home)
            ProfileFieldRow(label = "ເບີໂທຕິດຕໍ່:", value = phone, icon = Icons.Default.Phone)
            ProfileFieldRow(label = "ອີເມວລະບົບ:", value = email, icon = Icons.Default.Email)

            Spacer(modifier = Modifier.height(16.dp))

            // Signature Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        "ລາຍເຊັນດິຈິຕອນ (Digital Signature Approved)",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "/ signed / $name",
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF1E3A8A),
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Cursive
                    )
                    Text(
                        "ID: UNIQ-${name.hashCode().coerceAtLeast(0)}",
                        fontSize = 9.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }
    }
}

@Composable
fun ProfileFieldRow(label: String, value: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(Color(0xFFEFF6FF)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color(0xFF2563EB))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(label, fontSize = 11.sp, color = Color(0xFF64748B))
            Text(value, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
fun SettingsCard(
    currentTheme: String,
    onThemeChange: (String) -> Unit,
    onClearLogs: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                "ການຕັ້ງຄ່າແອັບພລິເຄຊັນ",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            // Theme Mode options
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("ຮູບແບບການສະແດງຜົນ (App Theme)", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF64748B))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ThemeOptionButton(
                        label = "Light",
                        selected = currentTheme == "Light",
                        onClick = { onThemeChange("Light") },
                        modifier = Modifier.weight(1f).testTag("theme_light")
                    )
                    ThemeOptionButton(
                        label = "Dark",
                        selected = currentTheme == "Dark",
                        onClick = { onThemeChange("Dark") },
                        modifier = Modifier.weight(1f).testTag("theme_dark")
                    )
                    ThemeOptionButton(
                        label = "System",
                        selected = currentTheme == "System",
                        onClick = { onThemeChange("System") },
                        modifier = Modifier.weight(1f).testTag("theme_system")
                    )
                }
            }

            Divider(color = MaterialTheme.colorScheme.outlineVariant)

            // Storage Operations
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("ການດູແລຮັກສາລະບົບ (Maintenance)", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF64748B))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("ແຄຊ໌ ແລະ ຂໍ້ມູນຊົ່ວຄາວ", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        Text("ລຶບລາຍການບັນທຶກປະຫວັດ ແລະ ໄຟລ໌ຂີ້ເຫຍື້ອ", fontSize = 11.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = onClearLogs,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.testTag("clear_system_cache_button")
                    ) {
                        Text("ລ້າງຂໍ້ມູນ", color = Color.White, fontSize = 12.sp)
                    }
                }
            }

            // Sync diagnostics
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFECFDF5))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("ການເຊື່ອມຕໍ່ຖານຂໍ້ມູນ: Online", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF047857))
                        Text("ເຊື່ອມຕໍ່ກັບ Firebase Database ສຳເລັດແລ້ວ.", fontSize = 11.sp, color = Color(0xFF065F46))
                    }
                }
            }
        }
    }
}

@Composable
fun ThemeOptionButton(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val bgColor = if (selected) Color(0xFFE21B23) else Color(0xFFF1F5F9)
    val textColor = if (selected) Color.White else Color(0xFF334155)

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(bgColor)
            .clickable { onClick() }
            .padding(vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}

@Composable
fun ActivityLogsTimeline(
    logs: List<UserLog>,
    onClearLogs: () -> Unit
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "ບັນທຶກການເຮັດວຽກຂອງຜູ້ໃຊ້ (Session Logs)",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            if (logs.isNotEmpty()) {
                Text(
                    "ລ້າງປະຫວັດ",
                    fontSize = 12.sp,
                    color = Color(0xFFEF4444),
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onClearLogs() }.testTag("clear_logs_text")
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (logs.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize().padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.Info, contentDescription = null, modifier = Modifier.size(48.dp), tint = Color.LightGray)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("ບໍ່ມີການເຄື່ອນໄຫວໃນເວລານີ້", fontSize = 13.sp, color = Color.Gray, textAlign = TextAlign.Center)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(logs) { log ->
                    LogTimelineItem(log)
                }
            }
        }
    }
}

@Composable
fun LogTimelineItem(log: UserLog) {
    val (icon, color) = when (log.type) {
        "auth" -> Pair(Icons.Default.Lock, Color(0xFF10B981)) // Green
        "repair" -> Pair(Icons.Default.Build, Color(0xFF2563EB)) // Blue
        "project" -> Pair(Icons.Default.Place, Color(0xFFF59E0B)) // Amber
        "cors" -> Pair(Icons.Default.Settings, Color(0xFF8B5CF6)) // Purple
        "quote" -> Pair(Icons.Default.ShoppingCart, Color(0xFFDB2777)) // Pink
        "profile" -> Pair(Icons.Default.Person, Color(0xFF06B6D4)) // Cyan
        else -> Pair(Icons.Default.Info, Color(0xFF64748B)) // Slate
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp), tint = color)
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = log.action,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = log.details,
                    fontSize = 11.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = log.timestamp,
                    fontSize = 9.sp,
                    color = Color.LightGray
                )
            }
        }
    }
}
