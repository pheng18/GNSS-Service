package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
data class TimelineItem(
    val id: String,
    val date: String,
    val title: String,
    val desc: String,
    val done: Boolean,
    val status: String // "done", "active", "upcoming"
)

@Serializable
@Entity(tableName = "repairs")
data class Repair(
    @PrimaryKey val id: String,
    val serialNo: String,
    val model: String,
    val title: String,
    val client: String,
    val receivedDate: String,
    val status: String, // "ກຳລັງສ້ອມແປງ", "ສຳເລັດແລ້ວ", "ລໍຖ້າກວດເຊັກ", "ກຳລັງສຳຫຼວດ"
    val problem: String,
    val cause: String,
    val solution: String,
    val assignedTech: String,
    val timeline: List<TimelineItem>,
    val imageUrl: String? = null
)

@Serializable
@Entity(tableName = "internal_notes")
data class InternalNote(
    @PrimaryKey val id: String,
    val repairId: String,
    val author: String,
    val date: String,
    val text: String
)

@Serializable
data class TeamMember(
    val name: String,
    val role: String,
    val avatar: String,
    val active: Boolean,
    val phone: String
)

@Serializable
@Entity(tableName = "projects")
data class Project(
    @PrimaryKey val id: String,
    val title: String,
    val client: String,
    val progress: Int,
    val status: String, // "ກຳລັງສຳຫຼວດ", "ລໍຖ້າການວິເຄາະ", "ສຳເລັດແລ້ວ"
    val location: String,
    val coordinatesLat: Double,
    val coordinatesLng: Double,
    val team: List<TeamMember>
)

@Serializable
@Entity(tableName = "cors_stations")
data class CORSStation(
    @PrimaryKey val id: String,
    val name: String,
    val type: String, // "ເກົ່າ", "ໃໝ່"
    val status: String, // "Online", "Offline"
    val issue: String,
    val notes: String? = null
)

@Serializable
data class QuotationItem(
    val id: String,
    val description: String,
    val details: String,
    val qty: Int,
    val unitPrice: Double
)

@Serializable
@Entity(tableName = "quotations")
data class Quotation(
    @PrimaryKey val id: String,
    val refNo: String,
    val customerName: String,
    val date: String,
    val validity: String,
    val items: List<QuotationItem>,
    val terms: String,
    val subtotal: Double,
    val vat: Double,
    val total: Double
)

@Serializable
@Entity(tableName = "equipment")
data class Equipment(
    @PrimaryKey val id: Int,
    val districtCode: String,
    val districtNameLao: String,
    val districtNameEng: String,
    val provinceName: String,
    val model: String,
    val serialNo: String = "",
    val note: String = ""
)
