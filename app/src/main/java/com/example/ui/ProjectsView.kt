package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*

@Composable
fun ProjectsView(
    projects: List<Project>,
    selectedProject: Project?,
    onSelectProject: (Project?) -> Unit,
    onAddProject: (title: String, client: String, location: String, lat: Double, lng: Double, teamName: String, teamRole: String, teamPhone: String) -> Unit,
    onUpdateProject: (Project, Int, String) -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }

    if (selectedProject != null) {
        ProjectDetailScreen(
            project = selectedProject,
            onBack = { onSelectProject(null) },
            onUpdateProject = onUpdateProject
        )
    } else {
        var searchQuery by remember { mutableStateOf("") }
        var statusFilter by remember { mutableStateOf("ທັງໝົດ") }

        val filteredProjects = projects.filter { prj ->
            val matchesQuery = prj.title.contains(searchQuery, ignoreCase = true) ||
                    prj.client.contains(searchQuery, ignoreCase = true) ||
                    prj.location.contains(searchQuery, ignoreCase = true)
            val matchesStatus = statusFilter == "ທັງໝົດ" || prj.status == statusFilter
            matchesQuery && matchesStatus
        }

        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Header
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        "ໂຄງການສຳຫຼວດວັດແທກ",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Button(
                        onClick = { showAddDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("ເພີ່ມໃໝ່", color = Color.White)
                    }
                }

                // Search Bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("ຄົ້ນຫາ ຫົວຂໍ້ໂຄງການ, ລູກຄ້າ...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    )
                )

                // Filter Buttons
                val filters = listOf("ທັງໝົດ", "ກຳລັງສຳຫຼວດ", "ລໍຖ້າການວິເຄາະ", "ສຳເລັດແລ້ວ")
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    filters.forEach { filter ->
                        val isSelected = filter == statusFilter
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isSelected) Color(0xFF10B981) else Color(0xFFE2E8F0))
                                .clickable { statusFilter = filter }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = filter,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Color(0xFF475569)
                            )
                        }
                    }
                }

                // Projects List
                if (filteredProjects.isEmpty()) {
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                        Text("ບໍ່ພົບຂໍ້ມູນໂຄງການ", color = Color.Gray, fontSize = 14.sp)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(filteredProjects) { project ->
                            ProjectItemCard(project = project, onClick = { onSelectProject(project) })
                        }
                    }
                }
            }

            if (showAddDialog) {
                AddProjectDialog(
                    onDismiss = { showAddDialog = false },
                    onConfirm = { title, client, location, lat, lng, name, role, phone ->
                        onAddProject(title, client, location, lat, lng, name, role, phone)
                        showAddDialog = false
                    }
                )
            }
        }
    }
}

@Composable
fun ProjectItemCard(project: Project, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    project.id,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF10B981),
                    fontSize = 11.sp
                )
                StatusBadge(status = project.status)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(project.title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF1E293B))
            Spacer(modifier = Modifier.height(4.dp))
            Text("ລູກຄ້າ: ${project.client}", fontSize = 11.sp, color = Color.Black)

            Spacer(modifier = Modifier.height(12.dp))

            // Progress bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LinearProgressIndicator(
                    progress = { project.progress / 100f },
                    modifier = Modifier
                        .weight(1f)
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = Color(0xFF10B981),
                    trackColor = Color(0xFFE2E8F0)
                )
                Text(
                    text = "${project.progress}%",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(8.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Place, contentDescription = null, size = 14.dp, tint = Color.Black)
                Spacer(modifier = Modifier.width(4.dp))
                Text("ສະຖານທີ່: ${project.location}", fontSize = 11.sp, color = Color.Black)
            }
        }
    }
}

@Composable
fun ProjectDetailScreen(
    project: Project,
    onBack: () -> Unit,
    onUpdateProject: (Project, Int, String) -> Unit
) {
    var editMode by remember { mutableStateOf(false) }
    var progress by remember { mutableStateOf(project.progress.toFloat()) }
    var selectedStatus by remember { mutableStateOf(project.status) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Back Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.clickable { onBack() },
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF10B981))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("ກັບຄືນ", color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                }
                Text(project.id, fontWeight = FontWeight.Bold, color = Color.Gray)
            }
        }

        // Title Info
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(project.title, fontSize = 18.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                        Spacer(modifier = Modifier.width(8.dp))
                        StatusBadge(status = project.status)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("ລູກຄ້າ: ${project.client}", fontSize = 11.sp, color = Color.Black)
                    Text("ສະຖານທີ່: ${project.location}", fontSize = 11.sp, color = Color.Black)
                    Text("ພິກັດ: ${project.coordinatesLat}, ${project.coordinatesLng}", fontSize = 13.sp, color = Color.Gray)
                }
            }
        }

        // Progress update panel
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("ຄວາມຄືບໜ້າ ແລະ ສະຖານະໂຄງການ", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(
                            if (editMode) "ຍົກເລີກ" else "ແກ້ໄຂ",
                            color = Color(0xFF10B981),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.clickable { editMode = !editMode }
                        )
                    }

                    if (editMode) {
                        Text("ສະຖານະໂຄງການ:", fontSize = 12.sp, color = Color.Gray)
                        val statuses = listOf("ກຳລັງສຳຫຼວດ", "ລໍຖ້າການວິເຄາະ", "ສຳເລັດແລ້ວ")
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            statuses.forEach { st ->
                                val active = selectedStatus == st
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (active) Color(0xFF10B981) else Color(0xFFF1F5F9))
                                        .clickable { selectedStatus = st }
                                        .padding(horizontal = 10.dp, vertical = 6.dp)
                                ) {
                                    Text(st, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (active) Color.White else Color.Black)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text("ຄວາມຄືບໜ້າ: ${progress.toInt()}%", fontSize = 12.sp, color = Color.Gray)
                        Slider(
                            value = progress,
                            onValueChange = { progress = it },
                            valueRange = 0f..100f,
                            colors = SliderDefaults.colors(
                                thumbColor = Color(0xFF10B981),
                                activeTrackColor = Color(0xFF10B981)
                            )
                        )

                        Button(
                            onClick = {
                                onUpdateProject(project, progress.toInt(), selectedStatus)
                                editMode = false
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                        ) {
                            Text("ບັນທຶກຄວາມຄືບໜ້າ", color = Color.White)
                        }
                    } else {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            LinearProgressIndicator(
                                progress = { project.progress / 100f },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(10.dp)
                                    .clip(RoundedCornerShape(5.dp)),
                                color = Color(0xFF10B981),
                                trackColor = Color(0xFFE2E8F0)
                            )
                            Text("${project.progress}%", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }
                }
            }
        }

        // Team members
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("ທີມງານປະຕິບັດງານພາກສະໜາມ", fontWeight = FontWeight.Bold, fontSize = 15.sp)

                    project.team.forEach { member ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(Color(0xFFECFDF5), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Person, contentDescription = null, tint = Color(0xFF10B981))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(member.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(member.role, fontSize = 11.sp, color = Color.Gray)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(member.phone, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF10B981))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AddProjectDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String, String, Double, Double, String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var client by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var latText by remember { mutableStateOf("18.0") }
    var lngText by remember { mutableStateOf("102.0") }
    var name by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("ຫົວໜ້າທີມສຳຫຼວດ") }
    var phone by remember { mutableStateOf("020 5556 1234") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("ເພີ່ມໂຄງການສຳຫຼວດໃໝ່") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("ຊື່ໂຄງການສຳຫຼວດ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = client,
                    onValueChange = { client = it },
                    label = { Text("ຊື່ລູກຄ້າ / ໜ່ວຍງານ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = { Text("ສະຖານທີ່ (ແຂວງ/ເມືອງ)") },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = latText,
                        onValueChange = { latText = it },
                        label = { Text("Latitude") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = lngText,
                        onValueChange = { lngText = it },
                        label = { Text("Longitude") },
                        modifier = Modifier.weight(1f)
                    )
                }
                Text("ຜູ້ຮັບຜິດຊອບພາກສະໜາມ:", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("ຊື່-ນາມສະກຸນ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = role,
                    onValueChange = { role = it },
                    label = { Text("ຕຳແໜ່ງ (Role)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("ເບີໂທຕິດຕໍ່") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotEmpty() && client.isNotEmpty()) {
                        val lat = latText.toDoubleOrNull() ?: 18.0
                        val lng = lngText.toDoubleOrNull() ?: 102.0
                        onConfirm(title, client, location, lat, lng, name, role, phone)
                    }
                }
            ) {
                Text("ບັນທຶກ")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("ຍົກເລີກ")
            }
        }
    )
}
