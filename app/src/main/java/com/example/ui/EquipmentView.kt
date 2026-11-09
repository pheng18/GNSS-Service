package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Equipment

@Composable
fun EquipmentView(
    equipmentList: List<Equipment>,
    onUpdateEquipment: (Equipment) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var provinceFilter by remember { mutableStateOf("ທັງໝົດ") }

    var editingEquipment by remember { mutableStateOf<Equipment?>(null) }
    var serialNumberText by remember { mutableStateOf("") }
    var noteText by remember { mutableStateOf("") }

    val filteredEquipment = equipmentList.filter { eq ->
        val matchesQuery = eq.districtCode.contains(searchQuery, ignoreCase = true) ||
                eq.districtNameLao.contains(searchQuery, ignoreCase = true) ||
                eq.districtNameEng.contains(searchQuery, ignoreCase = true) ||
                eq.model.contains(searchQuery, ignoreCase = true) ||
                eq.serialNo.contains(searchQuery, ignoreCase = true) ||
                eq.provinceName.contains(searchQuery, ignoreCase = true)

        val matchesProvince = provinceFilter == "ທັງໝົດ" || eq.provinceName.contains(provinceFilter, ignoreCase = true)
        matchesQuery && matchesProvince
    }

    val provincesList = listOf("ທັງໝົດ") + equipmentList.map { it.provinceName }.distinct().take(6)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight()
                .widthIn(max = 500.dp)
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header
            Text(
                "ລາຍການອຸປະກອນຕາມເມືອງ (Equipment Info)",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            // Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { 
                    Text(
                        "ຄົ້ນຫາ ລະຫັດເມືອງ, ຊື່ເມືອງ, ລຸ້ນອຸປະກອນ, S/N...",
                        color = Color.Gray
                    ) 
                },
                leadingIcon = { 
                    Icon(
                        Icons.Default.Search, 
                        contentDescription = null,
                        tint = Color.Gray
                    ) 
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black,
                    focusedBorderColor = Color(0xFFD97706),
                    unfocusedBorderColor = Color(0xFFCBD5E1)
                )
            )

            // Horizontal scrolling Province Filters
            Text(
                text = "ແຍກຕາມແຂວງ:", 
                fontSize = 12.sp, 
                fontWeight = FontWeight.Bold, 
                color = Color.Gray
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                provincesList.forEach { province ->
                    val isSelected = province == provinceFilter
                    val chipBg = if (isSelected) {
                        Color(0xFFD97706)
                    } else {
                        Color(0xFFE2E8F0)
                    }
                    val chipText = if (isSelected) {
                        Color.White
                    } else {
                        Color(0xFF475569)
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(chipBg)
                            .clickable { provinceFilter = province }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = province,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = chipText
                        )
                    }
                }
            }

            // Cards list
            if (filteredEquipment.isEmpty()) {
                Box(modifier = Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Text("ບໍ່ພົບຂໍ້ມູນອຸປະກອນ", color = Color.Gray)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredEquipment) { eq ->
                        EquipmentCard(
                            equipment = eq,
                            onEdit = {
                                editingEquipment = eq
                                serialNumberText = eq.serialNo
                                noteText = eq.note
                            }
                        )
                    }
                }
            }
        }

        // Dialog for editing Equipment Serial Number and Notes
        if (editingEquipment != null) {
            AlertDialog(
                onDismissRequest = { editingEquipment = null },
                title = { Text("ແກ້ໄຂຂໍ້ມູນອຸປະກອນ (ເມືອງ ${editingEquipment?.districtNameLao})") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("ລະຫັດເມືອງ: ${editingEquipment?.districtCode}", fontSize = 13.sp, color = Color.Gray)
                        Text("ລຸ້ນອຸປະກອນ: ${editingEquipment?.model}", fontSize = 14.sp, fontWeight = FontWeight.Bold)

                        OutlinedTextField(
                            value = serialNumberText,
                            onValueChange = { serialNumberText = it },
                            label = { Text("Serial Number (S/N)") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = noteText,
                            onValueChange = { noteText = it },
                            label = { Text("ບັນທຶກເພີ່ມເຕີມ / Note") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            editingEquipment?.let {
                                val updated = it.copy(
                                    serialNo = serialNumberText,
                                    note = noteText
                                )
                                onUpdateEquipment(updated)
                            }
                            editingEquipment = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706))
                    ) {
                        Text("ບັນທຶກ")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { editingEquipment = null }) {
                        Text("ຍົກເລີກ")
                    }
                }
            )
        }
    }
}

@Composable
fun EquipmentCard(
    equipment: Equipment,
    onEdit: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(Color(0xFFEFF6FF))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "ເມືອງ: " + equipment.districtCode,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                color = Color.Black
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "ສະຖານທີ່: " + equipment.districtNameLao,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = Color.Black
                        )
                    }
                    Text(
                        text = "District Name: " + equipment.districtNameEng,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }

                // Model badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFFEF3C7))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = equipment.model,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFB45309)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("ແຂວງ:", fontSize = 11.sp, color = Color.Black)
                    Text(equipment.provinceName, fontSize = 11.sp, color = Color.Black, fontWeight = FontWeight.Medium)
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text("Serial Number (S/N):", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        text = if (equipment.serialNo.isEmpty()) "ບໍ່ມີຂໍ້ມູນ S/N" else equipment.serialNo,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (equipment.serialNo.isEmpty()) Color.Red else Color(0xFF1E293B)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = Color.Gray
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "ບັນທຶກ: " + if (equipment.note.isEmpty()) "ບໍ່ມີບັນທຶກ" else equipment.note,
                        fontSize = 12.sp,
                        color = Color.DarkGray
                    )
                }

                IconButton(
                    onClick = onEdit,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit equipment",
                        modifier = Modifier.size(16.dp),
                        tint = Color(0xFF2563EB)
                    )
                }
            }
        }
    }
}
