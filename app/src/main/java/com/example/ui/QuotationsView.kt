package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun QuotationsView(
    quotations: List<Quotation>,
    selectedQuotation: Quotation?,
    onSelectQuotation: (Quotation?) -> Unit,
    onAddQuotation: (customerName: String, validity: String, items: List<QuotationItem>, terms: String) -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }

    if (selectedQuotation != null) {
        QuotationDetailScreen(
            quotation = selectedQuotation,
            onBack = { onSelectQuotation(null) }
        )
    } else {
        var searchQuery by remember { mutableStateOf("") }
        var validityFilter by remember { mutableStateOf("ທັງໝົດ") }

        val filteredQuotations = quotations.filter { qt ->
            val matchesQuery = qt.customerName.contains(searchQuery, ignoreCase = true) ||
                    qt.refNo.contains(searchQuery, ignoreCase = true) ||
                    qt.id.contains(searchQuery, ignoreCase = true)
            val matchesValidity = validityFilter == "ທັງໝົດ" || qt.validity == validityFilter
            matchesQuery && matchesValidity
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
                        "ໃບສະເໜີລາຄາ (Quotations)",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Button(
                        onClick = { showAddDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDB2777))
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
                    placeholder = { Text("ຄົ້ນຫາ ຊື່ລູກຄ້າ, ໝາຍເລກໃບສະເໜີ...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    )
                )

                // Filters Row
                val filters = listOf("ທັງໝົດ", "30 ວັນ", "60 ວັນ", "90 ວັນ")
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    filters.forEach { filter ->
                        val isSelected = filter == validityFilter
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isSelected) Color(0xFFDB2777) else Color(0xFFE2E8F0))
                                .clickable { validityFilter = filter }
                                .padding(horizontal = 14.dp, vertical = 6.dp)
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

                // Quotations List
                if (filteredQuotations.isEmpty()) {
                    Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                        Text("ບໍ່ພົບຂໍ້ມູນໃບສະເໜີລາຄາ", color = Color.Gray)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(filteredQuotations) { quotation ->
                            QuotationItemCard(quotation = quotation, onClick = { onSelectQuotation(quotation) })
                        }
                    }
                }
            }

            if (showAddDialog) {
                AddQuotationDialog(
                    onDismiss = { showAddDialog = false },
                    onConfirm = { customer, validity, items, terms ->
                        onAddQuotation(customer, validity, items, terms)
                        showAddDialog = false
                    }
                )
            }
        }
    }
}

@Composable
fun QuotationItemCard(quotation: Quotation, onClick: () -> Unit) {
    val totalFormatted = java.text.NumberFormat.getIntegerInstance().format(quotation.total)

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
                    quotation.refNo,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFDB2777),
                    fontSize = 11.sp
                )
                Text(
                    quotation.date,
                    fontSize = 11.sp,
                    color = Color.Gray
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text("ລູກຄ້າ: ${quotation.customerName}", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color.Black)
            Spacer(modifier = Modifier.height(4.dp))
            Text("ລາຍການສະເໜີ: ${quotation.items.size} ລາຍການ", fontSize = 12.sp, color = Color.Gray)

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("ມູນຄ່າລວມ (Total):", fontSize = 12.sp, color = Color.Gray)
                Text(
                    "$totalFormatted LAK",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFDB2777)
                )
            }
        }
    }
}

@Composable
fun QuotationDetailScreen(
    quotation: Quotation,
    onBack: () -> Unit
) {
    val numberFormat = java.text.NumberFormat.getIntegerInstance()

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
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color(0xFFDB2777))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("ກັບຄືນ", color = Color(0xFFDB2777), fontWeight = FontWeight.Bold)
                }
                Text(quotation.id, fontWeight = FontWeight.Bold, color = Color.Gray)
            }
        }

        // Customer Info Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("ໃບສະເໜີລາຄາ (QUOTATION)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFFDB2777))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("ລູກຄ້າ: ${quotation.customerName}", fontSize = 11.sp, color = Color.Black, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("ເລກອ້າງອີງ: ${quotation.refNo}", fontSize = 12.sp, color = Color.Gray)
                    Text("ວັນທີສະເໜີ: ${quotation.date}", fontSize = 12.sp, color = Color.Gray)
                    Text("ກຳນົດຍືນລາຄາ: ${quotation.validity}", fontSize = 12.sp, color = Color.Gray)
                }
            }
        }

        // Invoice Items Rows
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("ລາຍການສິນຄ້າ ແລະ ບໍລິການ", fontWeight = FontWeight.Bold, fontSize = 15.sp)

                    quotation.items.forEachIndexed { index, item ->
                        val itemTotal = item.qty * item.unitPrice
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.Top
                        ) {
                            Text("${index + 1}.", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color.Gray)
                            Spacer(modifier = Modifier.width(6.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.description, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(item.details, fontSize = 11.sp, color = Color.Gray)
                                Text(
                                    "${item.qty} x ${numberFormat.format(item.unitPrice)} LAK",
                                    fontSize = 11.sp,
                                    color = Color(0xFFDB2777)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                "${numberFormat.format(itemTotal)} LAK",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Color(0xFF1E293B)
                            )
                        }
                        if (index < quotation.items.size - 1) {
                            HorizontalDivider(color = Color(0xFFF1F5F9))
                        }
                    }
                }
            }
        }

        // Calculations Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("ມູນຄ່າລວມສິນຄ້າ (Subtotal):", fontSize = 13.sp, color = Color.Gray)
                        Text("${numberFormat.format(quotation.subtotal)} LAK", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("ພາສີມູນຄ່າເພີ່ມ (VAT 7%):", fontSize = 13.sp, color = Color.Gray)
                        Text("${numberFormat.format(quotation.vat)} LAK", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                    HorizontalDivider(color = Color(0xFFF1F5F9))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("ມູນຄ່າສຸດທິ (Grand Total):", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Text(
                            "${numberFormat.format(quotation.total)} LAK",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFDB2777)
                        )
                    }
                }
            }
        }

        // Terms and Conditions Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("ເງື່ອນໄຂການຄ້າ (Terms & Conditions)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(quotation.terms, fontSize = 12.sp, color = Color(0xFF475569))
                }
            }
        }
    }
}

@Composable
fun AddQuotationDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String, List<QuotationItem>, String) -> Unit
) {
    var customerName by remember { mutableStateOf("") }
    var validity by remember { mutableStateOf("30 ວັນ") }
    var terms by remember { mutableStateOf("ລາຄານີ້ລວມຄ່າຂົນສົ່ງພາຍໃນນະຄອນຫຼວງວຽງຈັນ. ສໍາລັບຕ່າງແຂວງຈະມີຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມຕາມໄລຍະທາງຕົວຈິງ.") }

    // Sub-items management
    val itemsList = remember { mutableStateListOf<QuotationItem>() }

    var tempDesc by remember { mutableStateOf("") }
    var tempDetails by remember { mutableStateOf("") }
    var tempQtyText by remember { mutableStateOf("1") }
    var tempPriceText by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("ອອກໃບສະເໜີລາຄາໃໝ່") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = customerName,
                    onValueChange = { customerName = it },
                    label = { Text("ຊື່ລູກຄ້າ / ບໍລິສັດ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = validity,
                    onValueChange = { validity = it },
                    label = { Text("ກຳນົດຍືນລາຄາ (e.g., 30 ວັນ)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = terms,
                    onValueChange = { terms = it },
                    label = { Text("ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(6.dp))
                Text("ເພີ່ມລາຍການສິນຄ້າ:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFFDB2777))

                // Item Rows added so far
                if (itemsList.isNotEmpty()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFFF8FAFC))
                            .padding(8.dp)
                    ) {
                        itemsList.forEachIndexed { index, item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("${index + 1}. ${item.description} (x${item.qty})", fontSize = 11.sp, maxLines = 1)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("${java.text.NumberFormat.getIntegerInstance().format(item.qty * item.unitPrice)} LAK", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Icon(
                                        Icons.Default.Delete,
                                        contentDescription = null,
                                        modifier = Modifier.size(14.dp).clickable { itemsList.removeAt(index) },
                                        tint = Color.Red
                                    )
                                }
                            }
                        }
                    }
                }

                // Temporary Inputs to build an item
                OutlinedTextField(
                    value = tempDesc,
                    onValueChange = { tempDesc = it },
                    label = { Text("ຊື່ລາຍການສິນຄ້າ / ບໍລິການ") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = tempDetails,
                    onValueChange = { tempDetails = it },
                    label = { Text("ລາຍລະອຽດ ຫຼື Specification") },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = tempQtyText,
                        onValueChange = { tempQtyText = it },
                        label = { Text("ຈຳນວນ") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = tempPriceText,
                        onValueChange = { tempPriceText = it },
                        label = { Text("ລາຄາຕໍ່ໜ່ວຍ (LAK)") },
                        modifier = Modifier.weight(1.5f)
                    )
                }

                Button(
                    onClick = {
                        if (tempDesc.isNotEmpty() && tempPriceText.isNotEmpty()) {
                            val qty = tempQtyText.toIntOrNull() ?: 1
                            val price = tempPriceText.toDoubleOrNull() ?: 0.0
                            itemsList.add(
                                QuotationItem(
                                    id = "item-${System.currentTimeMillis()}",
                                    description = tempDesc,
                                    details = tempDetails,
                                    qty = qty,
                                    unitPrice = price
                                )
                            )
                            tempDesc = ""
                            tempDetails = ""
                            tempQtyText = "1"
                            tempPriceText = ""
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF475569))
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("ເພີ່ມລາຍການນີ້", color = Color.White)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (customerName.isNotEmpty() && itemsList.isNotEmpty()) {
                        onConfirm(customerName, validity, itemsList.toList(), terms)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDB2777))
            ) {
                Text("ບັນທຶກໃບສະເໜີ")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("ຍົກເລີກ")
            }
        }
    )
}
