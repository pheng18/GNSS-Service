package com.example.data

import kotlinx.coroutines.flow.Flow

class AppRepository(private val database: AppDatabase) {
    val repairs: Flow<List<Repair>> = database.repairDao().getAllRepairs()
    val projects: Flow<List<Project>> = database.projectDao().getAllProjects()
    val stations: Flow<List<CORSStation>> = database.corsStationDao().getAllStations()
    val quotations: Flow<List<Quotation>> = database.quotationDao().getAllQuotations()
    val notes: Flow<List<InternalNote>> = database.internalNoteDao().getAllNotes()
    val equipment: Flow<List<Equipment>> = database.equipmentDao().getAllEquipment()

    suspend fun insertRepair(repair: Repair) = database.repairDao().insertRepair(repair)
    suspend fun updateRepair(repair: Repair) = database.repairDao().updateRepair(repair)

    suspend fun insertProject(project: Project) = database.projectDao().insertProject(project)
    suspend fun updateProject(project: Project) = database.projectDao().updateProject(project)

    suspend fun insertStation(station: CORSStation) = database.corsStationDao().insertStation(station)
    suspend fun updateStation(station: CORSStation) = database.corsStationDao().updateStation(station)

    suspend fun insertEquipment(eq: Equipment) = database.equipmentDao().insertEquipment(eq)
    suspend fun updateEquipment(eq: Equipment) = database.equipmentDao().updateEquipment(eq)

    suspend fun insertQuotation(quotation: Quotation) = database.quotationDao().insertQuotation(quotation)

    suspend fun insertNote(note: InternalNote) = database.internalNoteDao().insertNote(note)
}
