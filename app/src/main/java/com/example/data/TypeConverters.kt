package com.example.data

import androidx.room.TypeConverter
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AppTypeConverters {
    private val json = Json { ignoreUnknownKeys = true }

    @TypeConverter
    fun fromTimelineItemList(value: List<TimelineItem>): String {
        return json.encodeToString(value)
    }

    @TypeConverter
    fun toTimelineItemList(value: String): List<TimelineItem> {
        return json.decodeFromString(value)
    }

    @TypeConverter
    fun fromTeamMemberList(value: List<TeamMember>): String {
        return json.encodeToString(value)
    }

    @TypeConverter
    fun toTeamMemberList(value: String): List<TeamMember> {
        return json.decodeFromString(value)
    }

    @TypeConverter
    fun fromQuotationItemList(value: List<QuotationItem>): String {
        return json.encodeToString(value)
    }

    @TypeConverter
    fun toQuotationItemList(value: String): List<QuotationItem> {
        return json.decodeFromString(value)
    }
}
