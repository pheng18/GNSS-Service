package com.example.data

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

@Dao
interface RepairDao {
    @Query("SELECT * FROM repairs")
    fun getAllRepairs(): Flow<List<Repair>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRepair(repair: Repair)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(repairs: List<Repair>)

    @Update
    suspend fun updateRepair(repair: Repair)
}

@Dao
interface ProjectDao {
    @Query("SELECT * FROM projects")
    fun getAllProjects(): Flow<List<Project>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: Project)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(projects: List<Project>)

    @Update
    suspend fun updateProject(project: Project)
}

@Dao
interface CORSStationDao {
    @Query("SELECT * FROM cors_stations")
    fun getAllStations(): Flow<List<CORSStation>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStation(station: CORSStation)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(stations: List<CORSStation>)

    @Update
    suspend fun updateStation(station: CORSStation)
}

@Dao
interface EquipmentDao {
    @Query("SELECT * FROM equipment")
    fun getAllEquipment(): Flow<List<Equipment>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEquipment(equipment: Equipment)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(equipmentList: List<Equipment>)

    @Update
    suspend fun updateEquipment(equipment: Equipment)
}

@Dao
interface QuotationDao {
    @Query("SELECT * FROM quotations")
    fun getAllQuotations(): Flow<List<Quotation>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQuotation(quotation: Quotation)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(quotations: List<Quotation>)
}

@Dao
interface InternalNoteDao {
    @Query("SELECT * FROM internal_notes")
    fun getAllNotes(): Flow<List<InternalNote>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: InternalNote)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(notes: List<InternalNote>)
}

@Database(
    entities = [Repair::class, Project::class, CORSStation::class, Quotation::class, InternalNote::class, Equipment::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(AppTypeConverters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun repairDao(): RepairDao
    abstract fun projectDao(): ProjectDao
    abstract fun corsStationDao(): CORSStationDao
    abstract fun quotationDao(): QuotationDao
    abstract fun internalNoteDao(): InternalNoteDao
    abstract fun equipmentDao(): EquipmentDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "uniqtek_database"
                )
                .addCallback(AppDatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class AppDatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    seedDatabase(database)
                }
            }
        }

        private suspend fun seedDatabase(db: AppDatabase) {
            // Seed repairs
            db.repairDao().insertAll(listOf(
                Repair(
                    id = "REP-2024-0089",
                    serialNo = "SN: 894521",
                    model = "Leica TS16 P 1\"",
                    title = "Total Station Leica TS16 - ຄວາມຜິດພາດຂອງລະບົບ EDM",
                    client = "ກົມແຜນທີ່ ແລະ ພູມສາດ",
                    receivedDate = "2024-05-12",
                    status = "ກຳລັງສ້ອມແປງ",
                    problem = "ລະບົບ EDM ບໍ່ສາມາດວັດແທກໄລຍະທາງໄດ້ໃນໂໝດ Prism, ພົບຄວາມຜິດພາດ Code E102.",
                    cause = "Optical sensor ພາຍໃນມີຂີ້ຝຸ່ນ ແລະ ການປັບຈູນເລເຊີເຄື່ອນຍ້າຍຈາກຕຳແໜ່ງມາດຕະຖານ.",
                    solution = "ທຳຄວາມສະອາດຊຸດເລນ, ປັບຈູນ Optical Alignment ໃໝ່ ແລະ ທົດສອບ Calibration ຕາມມາດຕະຖານ ISO.",
                    assignedTech = "ສົມພອນ ເພັດດາລາ",
                    timeline = listOf(
                        TimelineItem("t1", "12/05/2024 - 09:30", "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", true, "done"),
                        TimelineItem("t2", "13/05/2024 - 14:20", "ວິນິດໄສອາການ", "ຊ່າງເຕັກນິກກວດພົບສາເຫດຂອງ Code E102.", true, "done"),
                        TimelineItem("t3", "14/05/2024 - 10:00", "ກຳລັງສ້ອມແປງ ແລະ ປັບຈູນ", "ກຳລັງລໍຖ້າການປັບຈູນ Optical alignment ດ້ວຍເຄື່ອງມືພິເສດ.", false, "active"),
                        TimelineItem("t4", "15/05/2024 - 16:00", "ທົດສອບ Calibration", "ທົດສອບຄວາມຖືກຕ້ອງກ່ອນສົ່ງມອບ.", false, "upcoming")
                    )
                ),
                Repair(
                    id = "REP-2024-0091",
                    serialNo = "SN: 624190",
                    model = "Trimble R12i GNSS",
                    title = "GNSS Receiver Trimble R12i - ບໍ່ຮັບສັນຍານດາວທຽມ RTK",
                    client = "ບໍລິສັດ ກໍ່ສ້າງຂົວທາງ ຈຳກັດ",
                    receivedDate = "2024-05-10",
                    status = "ສຳເລັດແລ້ວ",
                    problem = "ບໍ່ສາມາດເຊື່ອມຕໍ່ສັນຍານ RTK ໄດ້ ແລະ ການຮັບດາວທຽມຕໍ່າຜິດປົກກະຕິ.",
                    cause = "ບອດຮັບສັນຍານ GPS ພາຍໃນມີຮອຍເສຍຫາຍຈາກຄວາມຊື້ນ.",
                    solution = "ປ່ຽນບອດຮັບສັນຍານ GPS ໃໝ່, ທຳຄວາມສະອາດພອດ ແລະ ອັບເດດ Firmware ຫຼ້າສຸດ.",
                    assignedTech = "ສົມພອນ ເພັດດາລາ",
                    timeline = listOf(
                        TimelineItem("t21", "10/05/2024 - 08:30", "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", true, "done"),
                        TimelineItem("t22", "11/05/2024 - 11:15", "ວິນິດໄສອາການ", "ກວດພົບບອດຮັບສັນຍານເສຍຫາຍ.", true, "done"),
                        TimelineItem("t23", "12/05/2024 - 13:00", "ປ່ຽນອະໄຫຼ່ ແລະ ສ້ອມແປງ", "ປ່ຽນບອດຮັບສັນຍານໃໝ່ ແລະ ທົດສອບພາຍໃນ.", true, "done"),
                        TimelineItem("t24", "13/05/2024 - 15:30", "ທົດສອບ Calibration & ສົ່ງມອບ", "ທົດສອບ RTK ຜ່ານ ແລະ ກຽມສົ່ງມອບຄືນລູກຄ້າ.", true, "done")
                    )
                ),
                Repair(
                    id = "REP-2024-0095",
                    serialNo = "SN: 431055",
                    model = "Leica LS15",
                    title = "Digital Level Leica LS15 - จໍສຳຜັດບໍ່ຕອບສະໜອງ",
                    client = "ລັດວິສາຫະກິດ ໄຟຟ້າລາວ",
                    receivedDate = "2024-05-15",
                    status = "ລໍຖ້າກວດເຊັກ",
                    problem = "ໜ້າຈໍສະແດງຜົນມີເສັ້ນສີດຳ ແລະ ລະບົບສຳຜັດໃຊ້ງານບໍ່ໄດ້ບາງຈຸດ.",
                    cause = "ຈໍ LCD ເສຍຫາຍຈາກການກະແທກໃນພາກສະໜາມ.",
                    solution = "ປ່ຽນຊຸດໜ້າຈໍ LCD ໃໝ່ ແລະ ທົດສອບຄວາມຖືກຕ້ອງຂອງລະບົບວັດແທກ.",
                    assignedTech = "ວັນໄຊ ມະນີວົງ",
                    timeline = listOf(
                        TimelineItem("t31", "15/05/2024 - 10:30", "ຮັບເຄື່ອງ ແລະ ລົງທະບຽນ", "ອຸປະກອນຖືກຮັບເຂົ້າສາງ ແລະ ກວດສອບເບື້ອງຕົ້ນ.", true, "done"),
                        TimelineItem("t32", "16/05/2024 - 09:00", "ວິນິດໄສ ແລະ ວາງແຜນ", "ກຳລັງກວດສອບຄວາມເສຍຫາຍຂອງລະບົບພາຍໃນອື່ນໆ.", false, "active")
                    )
                )
            ))

            // Seed projects
            db.projectDao().insertAll(listOf(
                Project(
                    id = "PRJ-001",
                    title = "ສຳຫຼວດພື້ນທີ່ສ້າງທາງດ່ວນ ນະຄອນຫຼວງ-ວັງວຽງ",
                    client = "ກົມຂົນສົ່ງ ແລະ ທາງຫຼວງ",
                    progress = 75,
                    status = "ກຳລັງສຳຫຼວດ",
                    location = "ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ",
                    coordinatesLat = 18.2,
                    coordinatesLng = 102.5,
                    team = listOf(
                        TeamMember("ທ່ານ ອານຸສອນ ສີຫາວົງ", "ຫົວໜ້າທີມສຳຫຼວດ", "", true, "020 5556 1234"),
                        TeamMember("ນາງ ມະນີວັນ ເພັດດາລາ", "ວິສະວະກອນແຜນທີ່", "", true, "020 9998 7654")
                    )
                ),
                Project(
                    id = "PRJ-002",
                    title = "ວັດແທກລະດັບນ້ຳເຂື່ອນໄຟຟ້າ ນ້ຳງື່ມ 1",
                    client = "ລັດວິສາຫະກິດໄຟຟ້າລາວ",
                    progress = 40,
                    status = "ລໍຖ້າການວິເຄາະ",
                    location = "ແຂວງວຽງຈັນ, ສປປ ລາວ",
                    coordinatesLat = 18.5,
                    coordinatesLng = 102.6,
                    team = listOf(
                        TeamMember("ທ່ານ ສົມສັກ ເພັດດາວົງ", "ນັກວິເຄາະຂໍ້ມູນວັດແທກ", "", false, "020 2233 4455")
                    )
                ),
                Project(
                    id = "PRJ-003",
                    title = "ສຳຫຼວດຂອບເຂດທີ່ດິນ ອຸດສາຫະກຳສະເພາະ",
                    client = "ກຸ່ມບໍລິສັດ ພັດທະນາເສດຖະກິດ",
                    progress = 100,
                    status = "ສຳເລັດແລ້ວ",
                    location = "ແຂວງສະຫວັນນະເຂດ, ສປປ ລາວ",
                    coordinatesLat = 16.5,
                    coordinatesLng = 104.8,
                    team = listOf(
                        TeamMember("ນາງ ວິໄລວັນ ສົມພອນ", "ວິສະວະກອນໂຍທາ", "", true, "020 7788 9900")
                    )
                ),
                Project(
                    id = "PRJ-004",
                    title = "ວາງລະບົບສາຍສົ່ງໄຟຟ້າແຮງສູງ 500kV",
                    client = "ກຸ່ມພະລັງງານໄຟຟ້າພາກໃຕ້",
                    progress = 15,
                    status = "ກຳລັງສຳຫຼວດ",
                    location = "ແຂວງອັດຕະປື, ສປປ ລາວ",
                    coordinatesLat = 14.8,
                    coordinatesLng = 106.8,
                    team = listOf(
                        TeamMember("ທ່ານ ອານຸສອນ ສີຫາວົງ", "ຫົວໜ້າທີມສຳຫຼວດ", "", true, "020 5556 1234")
                    )
                )
            ))

            // Seed stations (complete 73 CORS Stations from the CORS Station info.html database)
            db.corsStationDao().insertAll(listOf(
                CORSStation("ANUV", "ອານຸວົງ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("ASFT", "ອາດສະພັງທອງ", "ໃໝ່", "Online", "Receiver problem"),
                CORSStation("ATTP", "ອັດຕະປື", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("BLKX", "ບໍລິຄຳໄຊ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("BLPD", "ບົວລະພາ", "ໃໝ່", "Offline", "Receiver problem", "Power supply + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300$ + 300,000 LAK ເດືອນ"),
                CORSStation("BNEU", "ບູນເໜືອ", "ໃໝ່", "Offline", "Receiver problem", "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ"),
                CORSStation("BTAY", "ບູນໃຕ້", "ເກົ່າ", "Online", "Electrical problem"),
                CORSStation("CHPH", "ຈຳພອນ", "ໃໝ່", "Online", "Lightning problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("DJEU", "ດັກຈຶງ", "ໃໝ່", "Online", "UPS problem", "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("DOL1", "ກົມທີ່ດິນ DOL", "ເກົ່າ", "Online", "none"),
                CORSStation("FEUN", "ເຟືອງ", "ໃໝ່", "Online", "Internet exprired problem", "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 250$ + 300,000 LAK ເດືອນ"),
                CORSStation("HGSA", "ຫົງສາ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("HIAM", "ຮ້ຽມ", "ໃໝ່", "Offline", "Receiver problem", "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ"),
                CORSStation("HINB", "ຫິນບຸນ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("HMUA", "ຫົວເມືອງ", "ໃໝ່", "Online", "Internet exprired problem, UPS problem", "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("HOON", "ຮູນ", "ໃໝ່", "Online", "UPS problem"),
                CORSStation("HPPV", "ຊຳເໜືອ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("HXAY", "ຫ້ວຍຊາຍ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("KENT", "ແກ່ນທ້າວ", "ໃໝ່", "Online", "Internet exprired problem, Current problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("KERD", "ຄຳເກີດ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("KHAM", "ຄຳ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("KHNG", "ໂຂງ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("KHUA", "ຂວາ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("KXDD", "ຄົງເຊໂດນ", "ເກົ່າ", "Online", "none"),
                CORSStation("LKPD", "ລະຄອນເພັງ", "ໃໝ່", "Offline", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("LNTD", "ຫຼວງນໍ້າທາ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("LONG", "ລອງ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("LPBP", "ຫຼວງພະບາງ", "ເກົ່າ", "Online", "Normal"),
                CORSStation("LXAN", "ລ້ອງຊານ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("MEUN", "ໝື່ນ", "ໃໝ່", "Online", "none"),
                CORSStation("NGAR", "ງາ", "ໃໝ່", "Online", "none"),
                CORSStation("NGOY", "ງອຍ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("NHAD", "ໜອງແຮດ", "ໃໝ່", "Online", "Internet exprired problem, UPS problem", "ມີເນັດແລ້ວ"),
                CORSStation("NKAY", "ນາກາຍ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("NLAE", "ນາແລ", "ໃໝ່", "Online", "Receiver problem", "ແກ້ໄຂບັນຫາການຕັ້ງຄ່າສຳເລັດແລ້ວ"),
                CORSStation("NONG", "ນອງ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("PHIA", "ພຽງ", "ໃໝ່", "Online", "Internet exprired problem", "Replace Fan cooling motor + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 33$ + 300,000 LAK ເດືອນ"),
                CORSStation("PHIN", "ພີນ", "ເກົ່າ", "Online", "Normal"),
                CORSStation("PHTH", "ໂພນທອງ", "ໃໝ່", "Online", "Internet exprired problem", "Replace UPS + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 250$ + 300,000 LAK ເດືອນ"),
                CORSStation("PHXY", "ໂພນໄຊ", "ໃໝ່", "Offline", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("PKDD", "ປາກກະດິ່ງ", "ໃໝ່", "Online", "Battery problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("PKLY", "ປາກລາຍ", "ໃໝ່", "Offline", "Internet exprired problem"),
                CORSStation("PKNG", "ປາກງື່ມ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("PKSE", "ປາກເຊ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("PKSG", "ປາກຊ່ອງ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("PKUN", "ພູຄູນ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("PUDD", "ຜາອຸດົມ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("SANG", "ສັງທອງ", "ເກົ່າ", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("SGKH", "ສອງຄອນ", "ເກົ່າ", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("SKMD", "ສຸຂູມມາ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("SLVP", "ສາລະວັນ", "ເກົ່າ", "Online", "Normal"),
                CORSStation("SNXD", "ສະໜາມໄຊ", "ໃໝ່", "Offline", "Internet exprired problem"),
                CORSStation("SVNK", "ສະຫວັນນະເຂດ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("THKH", "ທ່າແຂກ", "ໃໝ່", "Offline", "Electrical problem", "Rebuild constructions due to Relocate New Office | ງົບປະມານ: 23,000$"),
                CORSStation("THOM", "ທ່າໂທມ", "ໃໝ່", "Online", "Electrical problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("TOAY", "ຕະໂອ້ຍ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("UDX2", "ອຸດົມໄຊ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("VLBL", "ວິລະບູລີ", "ໃໝ່", "Online", "Adapter problem, UPS problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("VTHG", "ວຽງທອງ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("VTPV", "ແຂວງວຽງຈັນ", "ເກົ່າ", "Online", "none"),
                CORSStation("VVNG", "ວັງວຽງ", "ໃໝ່", "Online", "none"),
                CORSStation("XAYY", "ໄຊຍະບູລີ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("XBFD", "ເຊບັ້ງໄຟ", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("XBTD", "ໄຊບົວທອງ", "ໃໝ່", "Online", "Normal"),
                CORSStation("XCPD", "ໄຊຈຳພອນ", "ໃໝ່", "Online", "Normal", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("XHND", "ຊຽງຮ່ອນ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("XIAN", "ຊຽງຂວາງ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("XKHO", "ຊຽງຄໍ້", "ໃໝ່", "Online", "Internet exprired problem"),
                CORSStation("XKXK", "ເຊກອງ", "ເກົ່າ", "Online", "Internet exprired problem"),
                CORSStation("XONE", "ຊ່ອນ", "ໃໝ່", "Online", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("XTAY", "ຊໍາໃຕ້", "ໃໝ່", "Offline", "Receiver problem", "Replace new (P5E-Net) + ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 4000$ + 300,000 LAK ເດືອນ"),
                CORSStation("XXAY", "ຊານໄຊ", "ໃໝ່", "Offline", "Internet exprired problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ"),
                CORSStation("YODU", "ຍອດອູ", "ໃໝ່", "Online", "Electrical problem", "ອິນເຕີເນັດຄວາມໄວສູງ (FTTH) 150Mbps | ງົບປະມານ: 300,000 LAK ເດືອນ")
            ))

            // Seed equipment (complete database from Equipment Info.html with real models mapped to respective districts)
            db.equipmentDao().insertAll(listOf(
                Equipment(1, "101", "ຈັນທະບູລີ", "CHANTHABOULI", "ນະຄອນຫຼວງວຽງຈັນ", "AA450", "SN-AA450-101", "ສະຖານະປົກກະຕິ"),
                Equipment(2, "102", "ສີໂຄດຕະບອງ", "Sikhottabong", "ນະຄອນຫຼວງວຽງຈັນ", "BB4Pro", "SN-BB4P-102", "ສະຖານະປົກກະຕິ"),
                Equipment(3, "103", "ໄຊເສດຖາ", "Xaisettha", "ນະຄອນຫຼວງວຽງຈັນ", "C3", "SN-C300-103", "ສະຖານະປົກກະຕິ"),
                Equipment(4, "104", "ສີສັດຕະນາກ", "Sisattanak", "ນະຄອນຫຼວງວຽງຈັນ", "C5", "SN-C500-104", "ກຳລັງສ້ອມແປງ"),
                Equipment(5, "105", "ນາຊາຍທອງ", "Naxaythong", "ນະຄອນຫຼວງວຽງຈັນ", "CB-H10", "SN-CB10-105", "ສະຖານະປົກກະຕິ"),
                Equipment(6, "106", "ໄຊທານີ", "Xaithani", "ນະຄອນຫຼວງວຽງຈັນ", "CTS-112R4", "SN-CTS1-106", "ສະຖານະປົກກະຕິ"),
                Equipment(7, "107", "ຫາດຊາຍຟອງ", "hatxayfong", "ນະຄອນຫຼວງວຽງຈັນ", "DL8", "SN-DL80-107", "ສະຖານະປົກກະຕິ"),
                Equipment(8, "108", "ສັງທອງ", "Sangthong", "ນະຄອນຫຼວງວຽງຈັນ", "E98", "SN-E980-108", "ສະຖານະປົກກະຕິ"),
                Equipment(9, "109", "ປາກງື່ມ", "Pakngum", "ນະຄອນຫຼວງວຽງຈັນ", "ESR-1", "SN-ESR1-109", "ສະຖານະປົກກະຕິ"),
                Equipment(10, "201", "ຜົ້ງສາລີ", "PHONGSALI", "ແຂວງຜົ້ງສາລີ", "F4", "SN-F400-201", "ສະຖານະປົກກະຕິ"),
                Equipment(11, "202", "ໃໝ່", "Mai", "ແຂວງຜົ້ງສາລີ", "F7", "SN-F700-202", "ສະຖານະປົກກະຕິ"),
                Equipment(12, "203", "ຂວາ", "Khoa", "ແຂວງຜົ້ງສາລີ", "F8", "SN-F800-203", "ສະຖານະປົກກະຕິ"),
                Equipment(13, "204", "ສຳພັນ", "Samphan", "ແຂວງຜົ້ງສາລີ", "FC2", "SN-FC20-204", "ສະຖານະປົກກະຕິ"),
                Equipment(14, "205", "ບຸນເໜືອ", "Boun-Nua", "ແຂວງຜົ້ງສາລີ", "HCE300", "SN-HCE3-205", "ສະຖານະປົກກະຕິ"),
                Equipment(15, "206", "ຍອດອູ", "Gnot-Ou", "ແວງຜົ້ງສາລີ", "HCE320", "SN-HCE3-206", "ສະຖານະປົກກະຕິ"),
                Equipment(16, "207", "ເມືອງບຸນໃຕ້", "Boun-Tai", "ແຂວງຜົ້ງສາລີ", "HCE600", "SN-HCE6-207", "ສະຖານະປົກກະຕິ"),
                Equipment(17, "301", "ເມືອງຫຼວງນໍ້້າທາ", "LOUANGNAMTHA", "ແຂວງຫຼວງນໍ້າທາ", "i30", "SN-I300-301", "ສະຖານະປົກກະຕິ"),
                Equipment(18, "302", "ສິງ", "Sing", "ແຂວງຫຼວງນໍ້າທາ", "i30IMU", "SN-I30I-302", "ສະຖານະປົກກະຕິ"),
                Equipment(19, "303", "ລອງ", "Long", "ແຂວງຫຼວງນໍ້າທາ", "i30VR", "SN-I30V-303", "ສະຖານະປົກກະຕິ"),
                Equipment(20, "304", "ວຽງພູຄາ", "Viangphoukha", "ແຂວງຫຼວງນໍ້າທາ", "i50", "SN-I500-304", "ສະຖານະປົກກະຕິ"),
                Equipment(21, "305", "ນາແລ", "Nale", "ແຂວງຫຼວງນໍ້າທາ", "i70", "SN-I700-305", "ສະຖານະປົກກະຕິ"),
                Equipment(22, "401", "ໄຊ", "XAI", "ແຂວງອຸດົມໄຊ", "i73", "SN-I730-401", "ສະຖານະປົກກະຕິ"),
                Equipment(23, "402", "ຫຼາ", "La", "ແຂວງອຸດົມໄຊ", "i76", "SN-I760-402", "ສະຖານະປົກກະຕິ"),
                Equipment(24, "403", "ນາໝໍ້", "Namo", "ແຂວງອຸດົມໄຊ", "i80", "SN-I800-403", "ສະຖານະປົກກະຕິ"),
                Equipment(25, "404", "ງາ", "Nga", "ແຂວງອຸດົມໄຊ", "i80Pro", "SN-I80P-404", "ສະຖານະປົກກະຕິ"),
                Equipment(26, "405", "ແບງ", "Beng", "ແຂວງອຸດົມໄຊ", "i83", "SN-I830-405", "ສະຖານະປົກກະຕິ"),
                Equipment(27, "406", "ຮຸນ", "Houn", "ແຂວງອຸດົມໄຊ", "i89", "SN-I890-406", "ສະຖານະປົກກະຕິ"),
                Equipment(28, "407", "ປາກແບ່ງ", "Pakbeng", "ແຂວງອຸດົມໄຊ", "i90", "SN-I900-407", "ສະຖານະປົກກະຕິ"),
                Equipment(29, "501", "ຫ້ວຍຊາຍ", "HOUYXAY", "ແຂວງບໍ່ແກ້ວ", "i90VR", "SN-I90V-501", "ສະຖານະປົກກະຕິ"),
                Equipment(30, "502", "ຕົ້ນເຜີ້ງ", "Tonpheung", "ແຂວງບໍ່ແກ้ວ", "i93", "SN-I930-502", "ສະຖານະປົກກະຕິ"),
                Equipment(31, "503", "ເມິງ", "Meung", "ແຂວງບໍ່ແກ້ວ", "i93UB", "SN-I93U-503", "ສະຖານະປົກກະຕິ"),
                Equipment(32, "504", "ຜາອຸດົມ", "Pha-Oudom", "ແຂວງບໍ່ແກ້ວ", "iBase", "SN-IBSA-504", "ສະຖານະປົກກະຕິ"),
                Equipment(33, "505", "ປາກທາ", "Paktha", "ແຂວງບໍ່ແກ້ວ", "iBaseUB", "SN-IBSU-505", "ສະຖານະປົກກະຕິ"),
                Equipment(34, "601", "ນະຄອນຫຼວງພະບາງ", "LUANG PRABANG CITY", "ແຂວງຫຼວງພະບາງ", "IC100", "SN-IC10-601", "ສະຖານະປົກກະຕິ"),
                Equipment(35, "602", "ຊຽງເງິນ", "Xiang-Ngeun", "ແຂວງຫຼວງພະບາງ", "LT60H", "SN-LT60-602", "ສະຖານະປົກກະຕິ"),
                Equipment(36, "603", "ນານ", "Nan", "ແຂວງຫຼວງພະບາງ", "LT700", "SN-LT70-603", "ສະຖານະປົກກະຕິ"),
                Equipment(37, "604", "ປាកອູ", "Pak-Ou", "ແຂວງຫຼວງພະບາງ", "LT800", "SN-LT80-604", "ສະຖານະປົກກະຕິ"),
                Equipment(38, "605", "ນໍ້າບາກ", "Nambak", "ແຂວງຫຼວງພະບາງ", "M3D", "SN-M3D0-605", "ສະຖານະປົກກະຕິ"),
                Equipment(39, "606", "ງອຍ", "Ngoy", "ແຂວງຫຼວງພະບາງ", "M6", "SN-M600-606", "ສະຖານະປົກກະຕິ"),
                Equipment(40, "607", "ປາກແຊງ", "Pakxeng", "ແຂວງຫຼວງພະບາງ", "NX200", "SN-NX20-607", "ສະຖານະປົກກະຕິ"),
                Equipment(41, "608", "ໂພນໄຊ", "Phonxai", "ແຂວງຫຼວງພະບາງ", "P330Pro", "SN-P330-608", "ສະຖານະປົກກະຕິ"),
                Equipment(42, "609", "ຈອມເພັດ", "Chomphet", "ແຂວງຫຼວງພະບາງ", "P5", "SN-P500-609", "ສະຖານະປົກກະຕິ"),
                Equipment(43, "610", "ວຽງຄຳ.", "Viangkham", "ແຂວງຫຼວງພະບາງ", "PA-3", "SN-PA30-610", "ສະຖານະປົກກະຕິ"),
                Equipment(44, "611", "ພູຄູນ", "Phoukhoun", "ແຂວງຫຼວງພະບາງ", "RS10", "SN-RS10-611", "ສະຖານະປົກກະຕິ"),
                Equipment(45, "612", "ໂພນທອງ", "Phonthong", "ແຂວງຫຼວງພະບາງ", "SG5", "SN-SG50-612", "ສະຖານະປົກກະຕິ"),
                Equipment(46, "701", "ຊຳເໜືອ", "XAM-NUA", "ແຂວງຫົວພັນ", "SG6", "SN-SG60-701", "ສະຖານະປົກກະຕິ"),
                Equipment(47, "702", "ຊຽງຄໍ້", "Xiangkho", "ແຂວງຫົວພັນ", "SG7", "SN-SG70-702", "ສະຖານະປົກກະຕິ"),
                Equipment(48, "703", "ຮ້ຽມ (ວຽງທອງ)", "Hiam (Viangthong)", "ແຂວງຫົວພັນ", "X900", "SN-X900-703", "ສະຖານະປົກກະຕິ"),
                Equipment(49, "704", "ວຽງໄຊ", "Viangxai", "ແຂວງຫົວພັນ", "X91+", "SN-X910-704", "ສະຖານະປົກກະຕິ"),
                Equipment(50, "705", "ຫົວເມືອງ", "Houamuang", "ແຂວງຫົວພັນ", "华微3号Pro", "SN-HW3P-705", "ສະຖານະປົກກະຕິ"),
                Equipment(51, "706", "ຊຳໃຕ້", "Xam-tai", "ແຂວງຫົວພັນ", "C220GR2", "SN-C220-706", "ສະຖານະປົກກະຕິ"),
                Equipment(52, "707", "ສົບເບົາ", "Sopbao", "ແຂວງຫົວພັນ", "P5E-Net", "SN-P5EN-707", "ສະຖານະປົກກະຕິ"),
                Equipment(53, "708", "ແອດ", "Et", "ແຂວງຫົວພັນ", "P5", "SN-P500-708", "ສະຖານະປົກກະຕິ"),
                Equipment(54, "709", "ກວັນ", "Quanh", "ແຂວງຫົວພັນ", "Computer", "SN-COMP-709", "ສະຖານະປົກກະຕິ"),
                Equipment(55, "710", "ຊ່ອນ", "Shon", "ແຂວງຫົວພັນ", "Primus", "SN-PRIM-710", "ສະຖານະປົກກະຕິ"),
                Equipment(56, "801", "ໄຊຍະບູລີ", "XAINGABOULI", "ແຂວງໄຊຍະບູລີ", "UPS 750VA", "SN-UPS7-801", "ສະຖານະປົກກະຕິ"),
                Equipment(57, "802", "ຄອບ", "Khop", "ແຂວງໄຊຍະບູລີ", "LandStar Software", "SN-LSST-802", "ສະຖານະປົກກະຕິ"),
                Equipment(58, "803", "ຫົງສາ", "Hongsa", "ແຂວງໄຊຍະບູລີ", "VIVO", "SN-VIVO-803", "ສະຖານະປົກກະຕິ"),
                Equipment(59, "804", "ເງິນ", "Ngeun", "ແຂວງໄຊຍະບູລີ", "HUAWEI", "SN-HUWA-804", "ສະຖານະປົກກະຕິ"),
                Equipment(60, "805", "ຊຽງຮ່ອນ", "Xianghon", "ແຂວງໄຊຍະບູລີ", "TECNO", "SN-TECN-805", "ສະຖານະປົກກະຕິ"),
                Equipment(61, "806", "ພຽງ", "Phiang", "ແຂວງໄຊຍະບູລີ", "GPSMAP64s", "SN-GPS6-806", "ສະຖານະປົກກະຕິ"),
                Equipment(62, "807", "ປາກລາຍ", "Paklay", "ແຂວງໄຊຍະບູລີ", "GPSMAP64s", "SN-GPS6-807", "ສະຖານະປົກກະຕິ"),
                Equipment(63, "808", "ແກ່ນທ້າວ", "Kenthao", "ແຂວງ\u200Bໄຊ\u200Bຍະ\u200Bບູ\u200Bລີ", "HUAWEI", "SN-HW90-808", "ສະຖານະປົກກະຕິ"),
                Equipment(64, "809", "ບໍ່ແຕນ", "Boten", "ແຂວງ\u200Bໄຊ\u200Bຍະ\u200Bບູ\u200Bລີ", "TECNO", "SN-TC03-809", "ສະຖານະປົກກະຕິ"),
                Equipment(65, "901", "ແປກ", "PEK", "ແຂວງຊຽງຂວາງ", "i80", "SN-I800-901", "ສະຖານະປົກກະຕິ"),
                Equipment(66, "902", "ຄຳ", "Kham", "ແຂວງຊຽງຂວາງ", "i70", "SN-I700-902", "ສະຖານະປົກກະຕິ"),
                Equipment(67, "1001", "ໂພນໂຮງ", "Phonhong", "ແຂວງວຽງຈັນ", "i90", "SN-I900-1001", "ສະຖານະປົກກະຕິ"),
                Equipment(68, "1005", "ວັງວຽງ", "Vangving", "ແຂວງວຽງຈັນ", "i30", "SN-I300-1005", "ສະຖານະປົກກະຕິ"),
                Equipment(69, "1101", "ປາກຊັນ", "PAKXAN", "ແຂວງບໍລິຄຳໄຊ", "iBase", "SN-IBSA-1101", "ສະຖານະປົກກະຕິ"),
                Equipment(70, "1201", "ທ່າແຂກ", "THAKEK", "ແຂວງຄຳມ່ວນ", "IC100", "SN-IC10-1201", "ສະຖານະປົກກະຕິ"),
                Equipment(71, "1301", "ນະຄອນໄກສອນ ພົມວິຫານ", "KAYSONE PHOMVIHANE CITY", "ແຂວງສະຫວັນນະເຂດ", "M6", "SN-M600-1301", "ສະຖານະປົກກະຕິ"),
                Equipment(72, "1401", "ສາລະວັນ", "SALAVAN", "ແຂວງສາລະວັນ", "P5", "SN-P500-1401", "ສະຖານະປົກກະຕິ"),
                Equipment(73, "1501", "ລະມາມ", "LAMAM", "ແຂວງເຊກອງ", "i83", "SN-I830-1501", "ສະຖານະປົກກະຕິ"),
                Equipment(74, "1601", "ນະຄອນປາກເຊ", "PAKXE CITY", "ແຂວງຈຳປາສັກ", "RS10", "SN-RS10-1601", "ສະຖານະປົກກະຕິ"),
                Equipment(75, "1701", "ໄຊເສດຖາ", "Xaisettha", "ແຂວງອັດຕະປື", "SG7", "SN-SG70-1701", "ສະຖານະປົກກະຕິ"),
                Equipment(76, "1801", "ອານຸວົງ", "Arnuvong", "ແຂວງໄຊສົມບູນ", "X900", "SN-X900-1801", "ສະຖານະປົກກະຕິ")
            ))

            // Seed quotations
            db.quotationDao().insertAll(listOf(
                Quotation(
                    id = "QT-2024-001",
                    refNo = "QT-2023-11004",
                    customerName = "Lao-China Railway Co., Ltd",
                    date = "2024-05-14",
                    validity = "30 ວັນ",
                    items = listOf(
                        QuotationItem("item-1", "Repair Service for Total Station (Leica TS16)", "Full calibration, lens cleaning, and firmware update.", 1, 2500000.0),
                        QuotationItem("item-2", "CORS Station Maintenance", "Quarterly site inspection and hardware diagnostic.", 2, 4200000.0)
                    ),
                    terms = "ລາຄານີ້ລວມຄ່າຂົນສົ່ງພາຍໃນນະຄອນຫຼວງວຽງຈັນ. ສໍາລັບຕ່າງແຂວງຈະມີຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມຕາມໄລຍະທາງຕົວຈິງ.",
                    subtotal = 10900000.0,
                    vat = 763000.0,
                    total = 11663000.0
                )
            ))

            // Seed notes
            db.internalNoteDao().insertAll(listOf(
                InternalNote("note-1", "REP-2024-0089", "ຊ່າງ ພອນ", "14/05/2024", "ຕ້ອງການອາໄຫຼ່ Prism Holder ໃໝ່ ເນື່ອງຈາກໂຕເກົ່າມີຮອຍແຕກ."),
                InternalNote("note-2", "REP-2024-0089", "Admin", "13/05/2024", "ລູກຄ້າແຈ້ງວ່າຕ້ອງການເຄື່ອງຄືນກ່ອນວັນທີ 20 ນີ້.")
            ))
        }
    }
}
