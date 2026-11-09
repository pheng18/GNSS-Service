package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
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
fun CorsView(
    stations: List<CORSStation>,
    onToggleStatus: (CORSStation) -> Unit,
    onUpdateIssue: (CORSStation, String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var typeFilter by remember { mutableStateOf("ທັງໝົດ") }

    var editingStation by remember { mutableStateOf<CORSStation?>(null) }
    var issueEditText by remember { mutableStateOf("") }

    val filteredStations = stations.filter { st ->
        val matchesQuery = st.id.contains(searchQuery, ignoreCase = true) ||
                st.name.contains(searchQuery, ignoreCase = true) ||
                st.issue.contains(searchQuery, ignoreCase = true)
        val matchesType = typeFilter == "ທັງໝົດ" || st.type == typeFilter
        matchesQuery && matchesType
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header
            Text(
                "ສະຖານີອ້າງອີງພິກັດ CORS",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            // Search input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("ຄົ້ນຫາ ລະຫັດສະຖານີ, ຊື່, ບັນຫາ...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                )
            )

            // Category Filter
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val filters = listOf("ທັງໝົດ", "ໃໝ່", "ເກົ່າ")
                filters.forEach { filter ->
                    val isSelected = filter == typeFilter
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) Color(0xFFD97706) else Color(0xFFE2E8F0))
                            .clickable { typeFilter = filter }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = filter + " (CORS)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else Color(0xFF475569)
                        )
                    }
                }
            }

            // CORS Stations Cards List
            if (filteredStations.isEmpty()) {
                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                    Text("ບໍ່ພົບຂໍ້ມູນສະຖານີ CORS", color = Color.Gray)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredStations) { station ->
                        CorsStationCard(
                            station = station,
                            onToggle = { onToggleStatus(station) },
                            onEditIssue = {
                                editingStation = station
                                issueEditText = station.issue
                            }
                        )
                    }
                }
            }
        }

        // Inline dialog to edit issue description
        if (editingStation != null) {
            AlertDialog(
                onDismissRequest = { editingStation = null },
                title = { Text("ແກ້ໄຂບັນຫາ / Maintenance Log") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("ສະຖານີ: ${editingStation?.id} - ${editingStation?.name}", fontWeight = FontWeight.Bold)
                        OutlinedTextField(
                            value = issueEditText,
                            onValueChange = { issueEditText = it },
                            label = { Text("ລາຍລະອຽດບັນຫາ") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            editingStation?.let {
                                onUpdateIssue(it, issueEditText)
                            }
                            editingStation = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706))
                    ) {
                        Text("ບັນທຶກ")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { editingStation = null }) {
                        Text("ຍົກເລີກ")
                    }
                }
            )
        }
    }
}

@Composable
fun CorsStationCard(
    station: CORSStation,
    onToggle: () -> Unit,
    onEditIssue: () -> Unit
) {
    val isOnline = station.status == "Online"
    val statusBg = if (isOnline) Color(0xFFD1FAE5) else Color(0xFFFEE2E2)
    val statusText = if (isOnline) Color(0xFF047857) else Color(0xFFB91C1C)

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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFFFEF3C7))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(station.id, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFFB45309))
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(station.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }

                // Online / Offline Status Badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(statusBg)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = station.status,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = statusText
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("ປະເພດສະຖານີ:", fontSize = 11.sp, color = Color.Black)
                    Text("ສະຖານີຮຸ່ນ ${station.type}", fontSize = 11.sp, color = Color.Black, fontWeight = FontWeight.Medium)
                }

                Column {
                    Text("ລາຍງານອາການ:", fontSize = 11.sp, color = Color.Black)
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { onEditIssue() }) {
                        Text(
                            text = if (station.issue == "none") "ປົກກະຕິ" else station.issue,
                            fontSize = 11.sp,
                            color = Color.Black,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.Edit, contentDescription = null, size = 11.dp, tint = Color.Black)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(10.dp))

            // Action Row: Quick Toggle Switch/Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("ຄລິກປ່ຽນສະຖານະດ່ວນ:", fontSize = 11.sp, color = Color.Black)
                Button(
                    onClick = onToggle,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isOnline) Color(0xFFEF4444) else Color(0xFF10B981)
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, size = 12.dp, tint = Color.White)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isOnline) "ປິດ (Offline)" else "ເປີດ (Online)",
                        fontSize = 11.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}
