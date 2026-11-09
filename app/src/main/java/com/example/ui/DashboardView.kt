package com.example.ui

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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*

@Composable
fun DashboardView(
    repairs: List<Repair>,
    projects: List<Project>,
    stations: List<CORSStation>,
    quotations: List<Quotation>,
    notes: List<InternalNote>,
    onNavigate: (String) -> Unit,
    onSelectRepair: (Repair) -> Unit
) {
    // Calculations
    val activeRepairsCount = repairs.count { it.status == "ກຳລັງສ້ອມແປງ" || it.status == "ລໍຖ້າກວດເຊັກ" }
    val activeProjectsCount = projects.count { it.status == "ກຳລັງສຳຫຼວດ" || it.status == "ລໍຖ້າການວິເຄາະ" }
    val onlineStationsCount = stations.count { it.status == "Online" }
    val totalStationsCount = stations.size
    val totalQuotesValue = quotations.sumOf { it.total }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header
        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    "ສະບາຍດີ, ທີມງານ UniqTek",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    "ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຕິດຕາມການສ້ອມແປງ ແລະ ການບໍລິການສຳຫຼວດວັດແທກ",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Grid-like layout for KPI Cards
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    KpiCard(
                        title = "ເຄື່ອງສ້ອມແປງຄົງຄ້າງ",
                        value = "$activeRepairsCount ລາຍການ",
                        icon = Icons.Default.Build,
                        backgroundColor = Color(0xFFEFF6FF),
                        iconColor = Color(0xFF2563EB),
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("repairs") }
                    )
                    KpiCard(
                        title = "ໂຄງການກຳລັງສຳຫຼວດ",
                        value = "$activeProjectsCount ໂຄງການ",
                        icon = Icons.Default.Place,
                        backgroundColor = Color(0xFFECFDF5),
                        iconColor = Color(0xFF10B981),
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("projects") }
                    )
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    KpiCard(
                        title = "ສະຖານີ CORS ອອນລາຍ",
                        value = "$onlineStationsCount/$totalStationsCount ສະຖານີ",
                        icon = Icons.Default.Settings,
                        backgroundColor = Color(0xFFFFFBEB),
                        iconColor = Color(0xFFD97706),
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("cors") }
                    )
                    val formattedVal = java.text.NumberFormat.getIntegerInstance().format(totalQuotesValue)
                    KpiCard(
                        title = "ຍອດໃບສະເໜີລາຄາ",
                        value = "$formattedVal LAK",
                        icon = Icons.Default.ShoppingCart,
                        backgroundColor = Color(0xFFFDF2F8),
                        iconColor = Color(0xFFDB2777),
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("quotations") }
                    )
                }
            }
        }

        // Status Breakdown Chart (Custom Compose Meter)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "ສະຫຼຸບສະຖານະເຄື່ອງສ້ອມແປງ",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    val statuses = listOf(
                        Triple("ລໍຖ້າກວດເຊັກ", repairs.count { it.status == "ລໍຖ້າກວດເຊັກ" }, Color(0xFF64748B)),
                        Triple("ກຳລັງສ້ອມແປງ", repairs.count { it.status == "ກຳລັງສ້ອມແປງ" }, Color(0xFF3B82F6)),
                        Triple("ກຳລັງສຳຫຼວດ", repairs.count { it.status == "ກຳລັງສຳຫຼວດ" }, Color(0xFFF59E0B)),
                        Triple("ສຳເລັດແລ້ວ", repairs.count { it.status == "ສຳເລັດແລ້ວ" }, Color(0xFF10B981))
                    )

                    val maxCount = statuses.maxOf { it.second }.coerceAtLeast(1)

                    statuses.forEach { (label, count, color) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = label,
                                modifier = Modifier.width(100.dp),
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(16.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxHeight()
                                        .fillMaxWidth((count.toFloat() / maxCount.toFloat()).coerceIn(0f, 1f))
                                        .background(color)
                                )
                            }
                            Text(
                                text = "$count",
                                modifier = Modifier.width(32.dp),
                                textAlign = androidx.compose.ui.text.style.TextAlign.End,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }
        }

        // Recent Repairs & Service Orders
        item {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "ລາຍການສ້ອມແປງຫຼ້າສຸດ",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        "ເບິ່ງທັງໝົດ",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 12.sp,
                        modifier = Modifier.clickable { onNavigate("repairs") }
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))

                if (repairs.isEmpty()) {
                    Text("ບໍ່ມີຂໍ້ມູນລາຍການສ້ອມແປງ", fontSize = 13.sp, color = Color.Gray)
                } else {
                    repairs.take(3).forEach { repair ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .clickable { onSelectRepair(repair) },
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .background(Color(0xFFEFF6FF), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Build, contentDescription = null, tint = Color(0xFF2563EB))
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(repair.model, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(repair.client, fontSize = 11.sp, color = Color.Gray)
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                StatusBadge(status = repair.status)
                            }
                        }
                    }
                }
            }
        }

        // Latest Internal Tech Notes
        item {
            Column {
                Text(
                    "ບັນທຶກເຕັກນິກພາຍໃນຫຼ້າສຸດ (Internal Notes)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Spacer(modifier = Modifier.height(8.dp))

                if (notes.isEmpty()) {
                    Text("ບໍ່ມີບັນທຶກພາຍໃນ", fontSize = 13.sp, color = Color.Gray)
                } else {
                    notes.take(3).forEach { note ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        note.author,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = Color(0xFF1E3A8A)
                                    )
                                    Text(note.date, fontSize = 11.sp, color = Color.Gray)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(note.text, fontSize = 13.sp, color = Color(0xFF334155))
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    "ເລກບັດ: ${note.repairId}",
                                    fontSize = 10.sp,
                                    color = Color(0xFF94A3B8)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun KpiCard(
    title: String,
    value: String,
    icon: ImageVector,
    backgroundColor: Color,
    iconColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .clickable { onClick() }
            .height(100.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    title,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Medium
                )
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .background(backgroundColor, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, size = 16.dp, tint = iconColor)
                }
            }
            Text(
                value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
fun Icon(imageVector: ImageVector, contentDescription: String?, size: androidx.compose.ui.unit.Dp, tint: Color) {
    androidx.compose.material3.Icon(
        imageVector = imageVector,
        contentDescription = contentDescription,
        tint = tint,
        modifier = Modifier.size(size)
    )
}

@Composable
fun StatusBadge(status: String) {
    val (bgColor, textColor) = when (status) {
        "ລໍຖ້າກວດເຊັກ" -> Pair(Color(0xFFF1F5F9), Color(0xFF475569))
        "ກຳລັງສ້ອມແປງ" -> Pair(Color(0xFFDBEAFE), Color(0xFF1D4ED8))
        "ກຳລັງສຳຫຼວດ" -> Pair(Color(0xFFFEF3C7), Color(0xFFB45309))
        "ສຳເລັດແລ້ວ" -> Pair(Color(0xFFD1FAE5), Color(0xFF047857))
        else -> Pair(Color(0xFFE2E8F0), Color(0xFF1E293B))
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(status, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textColor)
    }
}
