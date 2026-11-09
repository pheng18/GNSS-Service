package com.example.ui

import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*

@Composable
fun RepairsView(
    repairs: List<Repair>,
    notes: List<InternalNote>,
    selectedRepair: Repair?,
    onSelectRepair: (Repair?) -> Unit,
    onAddRepair: (serialNo: String, model: String, title: String, client: String, problem: String, assignedTech: String) -> Unit,
    onUpdateRepairStatus: (Repair, String, String, String) -> Unit,
    onAddInternalNote: (String, String, String) -> Unit,
    currentUser: String
) {
    var showAddDialog by remember { mutableStateOf(false) }

    // Detail Screen
    if (selectedRepair != null) {
        RepairDetailScreen(
            repair = selectedRepair,
            allNotes = notes.filter { it.repairId == selectedRepair.id },
            onBack = { onSelectRepair(null) },
            onUpdateStatus = onUpdateRepairStatus,
            onAddNote = onAddInternalNote,
            currentUser = currentUser
        )
    } else {
        // List Screen
        var searchQuery by remember { mutableStateOf("") }
        var statusFilter by remember { mutableStateOf("ທັງໝົດ") }

        val filteredRepairs = repairs.filter { repair ->
            val matchesQuery = repair.model.contains(searchQuery, ignoreCase = true) ||
                    repair.client.contains(searchQuery, ignoreCase = true) ||
                    repair.serialNo.contains(searchQuery, ignoreCase = true) ||
                    repair.id.contains(searchQuery, ignoreCase = true)
            val matchesStatus = statusFilter == "ທັງໝົດ" || repair.status == statusFilter
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
                        "ບໍລິການສ້ອມແປງ (Repairs)",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Button(
                        onClick = { showAddDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                        modifier = Modifier.testTag("add_repair_btn")
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
                    placeholder = { Text("ຄົ້ນຫາ ຣຸ່ນ, ລູກຄ້າ, ໝາຍເລກເຄື່ອງ...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    )
                )

                // Filters Row
                val filters = listOf("ທັງໝົດ", "ລໍຖ້າກວດເຊັກ", "ກຳລັງສ້ອມແປງ", "ສຳເລັດແລ້ວ")
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
                                .background(if (isSelected) Color(0xFF2563EB) else Color(0xFFE2E8F0))
                                .clickable { statusFilter = filter }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = filter,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Color(0xFF475569)
                            )
                        }
                    }
                }

                // Repairs List
                if (filteredRepairs.isEmpty()) {
                    Box(modifier = Modifier.fillWeight(1f), contentAlignment = Alignment.Center) {
                        Text("ບໍ່ພົບຂໍ້ມູນໃບສ້ອມແປງ", color = Color.Gray, fontSize = 14.sp)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(filteredRepairs) { repair ->
                            RepairItemCard(repair = repair, onClick = { onSelectRepair(repair) })
                        }
                    }
                }
            }

            // Dialog for adding new repair
            if (showAddDialog) {
                AddRepairDialog(
                    onDismiss = { showAddDialog = false },
                    onConfirm = { serial, model, title, client, problem, tech ->
                        onAddRepair(serial, model, title, client, problem, tech)
                        showAddDialog = false
                    }
                )
            }
        }
    }
}

@Composable
fun Modifier.fillWeight(value: Float): Modifier = this.fillMaxHeight(value).fillMaxWidth()

@Composable
fun RepairItemCard(repair: Repair, onClick: () -> Unit) {
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
                    repair.id,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF2563EB),
                    fontSize = 12.sp
                )
                StatusBadge(status = repair.status)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(repair.title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF1E293B))
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Build, contentDescription = null, size = 12.dp, tint = Color.Gray)
                Spacer(modifier = Modifier.width(4.dp))
                Text(repair.model, fontSize = 12.sp, color = Color.Gray)
                Spacer(modifier = Modifier.width(12.dp))
                Icon(Icons.Default.Person, contentDescription = null, size = 12.dp, tint = Color.Black)
                Spacer(modifier = Modifier.width(4.dp))
                Text("ລູກຄ້າ: ${repair.client}", fontSize = 11.sp, color = Color.Black)
            }
            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "ວັນທີຮັບ: ${repair.receivedDate}",
                    fontSize = 11.sp,
                    color = Color(0xFF64748B)
                )
                Text(
                    "ຊ່າງເຕັກນິກ: ${repair.assignedTech}",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddRepairDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String, String, String, String, String) -> Unit
) {
    var serialNo by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("") }
    var title by remember { mutableStateOf("") }
    var client by remember { mutableStateOf("") }
    var problem by remember { mutableStateOf("") }
    var assignedTech by remember { mutableStateOf("ສົມພອນ ເພັດດາລາ") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("ເພີ່ມໃບຮັບສ້ອມແປງໃໝ່") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = model,
                    onValueChange = { model = it },
                    label = { Text("ລຸ່ນອຸປະກອນ (e.g., Leica TS16)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = serialNo,
                    onValueChange = { serialNo = it },
                    label = { Text("ໝາຍເລກເຄື່ອງ (Serial Number)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("ຫົວຂໍ້ອາການເສຍຫາຍ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = client,
                    onValueChange = { client = it },
                    label = { Text("ຊື່ລູກຄ້າ / ໜ່ວຍງານ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = problem,
                    onValueChange = { problem = it },
                    label = { Text("ລາຍລະອຽດບັນຫາ / ອາການ") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 2
                )
                OutlinedTextField(
                    value = assignedTech,
                    onValueChange = { assignedTech = it },
                    label = { Text("ຊ່າງເຕັກນິກຜູ້ຮັບຜິດຊອບ") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (model.isNotEmpty() && client.isNotEmpty()) {
                        onConfirm(serialNo, model, title, client, problem, assignedTech)
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

@Composable
fun RepairDetailScreen(
    repair: Repair,
    allNotes: List<InternalNote>,
    onBack: () -> Unit,
    onUpdateStatus: (Repair, String, String, String) -> Unit,
    onAddNote: (String, String, String) -> Unit,
    currentUser: String
) {
    var editMode by remember { mutableStateOf(false) }
    var selectedStatus by remember { mutableStateOf(repair.status) }
    var cause by remember { mutableStateOf(repair.cause) }
    var solution by remember { mutableStateOf(repair.solution) }

    var newNoteText by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Bar
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
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFF2563EB))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("ກັບຄືນ", color = Color(0xFF2563EB), fontWeight = FontWeight.Bold)
                }
                Text(repair.id, fontWeight = FontWeight.Bold, color = Color.Gray)
            }
        }

        // Card Info
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
                        Text(repair.model, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        StatusBadge(status = repair.status)
                    }
                    Text("ລູກຄ້າ: ${repair.client}", fontSize = 11.sp, color = Color.Black)
                    Text("ເລກເຄື່ອງ: ${repair.serialNo}", fontSize = 13.sp, color = Color.Gray)
                    Text("ວັນທີຮັບ: ${repair.receivedDate}", fontSize = 13.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(repair.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                }
            }
        }

        // Diagnostics Edit / Display Card
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
                        Text("ຂໍ້ມູນເຕັກນິກ ແລະ ການວິນິດໄສ", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(
                            if (editMode) "ຍົກເລີກ" else "ແກ້ໄຂສະຖານະ",
                            color = Color(0xFF2563EB),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.clickable { editMode = !editMode }
                        )
                    }

                    if (editMode) {
                        // Dropdown-like status selectors
                        Text("ສະຖານະເຄື່ອງສ້ອມແປງ:", fontSize = 12.sp, color = Color.Gray)
                        val statuses = listOf("ລໍຖ້າກວດເຊັກ", "ກຳລັງສ້ອມແປງ", "ສຳເລັດແລ້ວ")
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            statuses.forEach { st ->
                                val active = selectedStatus == st
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (active) Color(0xFF2563EB) else Color(0xFFF1F5F9))
                                        .clickable { selectedStatus = st }
                                        .padding(horizontal = 10.dp, vertical = 6.dp)
                                ) {
                                    Text(st, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = if (active) Color.White else Color.Black)
                                }
                            }
                        }

                        OutlinedTextField(
                            value = cause,
                            onValueChange = { cause = it },
                            label = { Text("ສາເຫດຂອງບັນຫາ") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = solution,
                            onValueChange = { solution = it },
                            label = { Text("ວິທີແກ້ໄຂ / ອາໄຫຼ່ທີ່ໃຊ້") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Button(
                            onClick = {
                                onUpdateStatus(repair, selectedStatus, cause, solution)
                                editMode = false
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                        ) {
                            Text("ບັນທຶກການແກ້ໄຂ", color = Color.White)
                        }
                    } else {
                        // Display Diagnostics
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            DiagnosticItem(label = "ອາການເສຍຫາຍເບື້ອງຕົ້ນ:", value = repair.problem)
                            DiagnosticItem(
                                label = "ສາເຫດຂອງບັນຫາ (Cause):",
                                value = repair.cause.ifEmpty { "ກຳລັງກວດສອບ..." }
                            )
                            DiagnosticItem(
                                label = "ການແກ້ໄຂ (Solution):",
                                value = repair.solution.ifEmpty { "ກຳລັງວາງແຜນແກ້ໄຂ..." }
                            )
                        }
                    }
                }
            }
        }

        // Timeline Progress
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("ທາມລາຍການດຳເນີນງານ (Timeline)", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    repair.timeline.forEachIndexed { idx, item ->
                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .border(2.dp, Color(0xFF2563EB), CircleShape)
                                        .background(if (item.done) Color(0xFF2563EB) else Color.White, CircleShape)
                                )
                                if (idx < repair.timeline.size - 1) {
                                    Box(
                                        modifier = Modifier
                                            .width(2.dp)
                                            .height(40.dp)
                                            .background(Color(0xFFDBEAFE))
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f).padding(bottom = 16.dp)) {
                                Text(item.title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(item.desc, fontSize = 11.sp, color = Color.Gray)
                                Text(item.date, fontSize = 10.sp, color = Color(0xFF94A3B8))
                            }
                        }
                    }
                }
            }
        }

        // Internal Notes Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("ບັນທຶກຊ່າງພາຍໃນ (Internal Notes)", fontWeight = FontWeight.Bold, fontSize = 15.sp)

                    allNotes.forEach { note ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFF8FAFC))
                                .padding(10.dp)
                        ) {
                            Column {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(note.author, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color(0xFF1E3A8A))
                                    Text(note.date, fontSize = 10.sp, color = Color.Gray)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(note.text, fontSize = 12.sp, color = Color(0xFF334155))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = newNoteText,
                            onValueChange = { newNoteText = it },
                            placeholder = { Text("ເພີ່ມບັນທຶກ...") },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                        Button(
                            onClick = {
                                if (newNoteText.isNotEmpty()) {
                                    onAddNote(repair.id, "ຊ່າງເຕັກນິກ (" + currentUser.take(8) + ")", newNoteText)
                                    newNoteText = ""
                                }
                            },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                        ) {
                            Text("ສົ່ງ", color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DiagnosticItem(label: String, value: String) {
    Column {
        Text(label, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = Color.Gray)
        Text(value, fontSize = 13.sp, color = Color(0xFF1E293B))
    }
}

@Composable
fun HorizontalDivider(color: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(color)
    )
}

@Composable
fun VerticalScrollModifier(modifier: Modifier = Modifier): Modifier = modifier

fun Modifier.verticalScroll(state: ScrollState): Modifier = this
