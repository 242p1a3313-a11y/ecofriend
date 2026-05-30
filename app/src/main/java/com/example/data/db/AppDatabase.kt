package com.example.data.db

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

// --- Room Entities ---

@Entity(tableName = "chat_messages")
data class ChatMessage(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val sender: String, // "user" or "model"
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "plant_recommendations")
data class PlantRecommend(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val location: String,
    val climate: String,
    val purpose: String,
    val plantName: String,
    val suitabilityScore: Int,
    val growthDifficulty: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "disease_scans")
data class DiseaseScan(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val imageUrl: String,
    val diseaseName: String,
    val confidence: Float,
    val treatment: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_profiles")
data class UserProfile(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val email: String,
    val points: Int = 0
)

// --- DAOs ---

@Dao
interface ChatDao {
    @Query("SELECT * FROM chat_messages ORDER BY timestamp ASC")
    fun getAllMessages(): Flow<List<ChatMessage>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessage)

    @Query("DELETE FROM chat_messages")
    suspend fun clearMessages()
}

@Dao
interface PlantRecommendDao {
    @Query("SELECT * FROM plant_recommendations ORDER BY timestamp DESC")
    fun getAllRecommendations(): Flow<List<PlantRecommend>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecommendation(recommendation: PlantRecommend)

    @Query("DELETE FROM plant_recommendations WHERE id = :id")
    suspend fun deleteRecommendation(id: Int)
}

@Dao
interface DiseaseScanDao {
    @Query("SELECT * FROM disease_scans ORDER BY timestamp DESC")
    fun getAllScans(): Flow<List<DiseaseScan>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertScan(scan: DiseaseScan)
}

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profiles LIMIT 1")
    fun getProfile(): Flow<UserProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveProfile(profile: UserProfile)

    @Query("DELETE FROM user_profiles")
    suspend fun clearProfile()
}

// --- App Database Holder ---

@Database(
    entities = [ChatMessage::class, PlantRecommend::class, DiseaseScan::class, UserProfile::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun chatDao(): ChatDao
    abstract fun plantRecommendDao(): PlantRecommendDao
    abstract fun diseaseScanDao(): DiseaseScanDao
    abstract fun userProfileDao(): UserProfileDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ecofriend_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}

// --- Repository Layer ---

class EcoRepository(private val db: AppDatabase) {
    val chatMessages: Flow<List<ChatMessage>> = db.chatDao().getAllMessages()
    val recommendations: Flow<List<PlantRecommend>> = db.plantRecommendDao().getAllRecommendations()
    val scans: Flow<List<DiseaseScan>> = db.diseaseScanDao().getAllScans()
    val userProfile: Flow<UserProfile?> = db.userProfileDao().getProfile()

    suspend fun insertChatMessage(message: ChatMessage) {
        db.chatDao().insertMessage(message)
    }

    suspend fun clearChatHistory() {
        db.chatDao().clearMessages()
    }

    suspend fun insertRecommendation(rec: PlantRecommend) {
        db.plantRecommendDao().insertRecommendation(rec)
    }

    suspend fun deleteRecommendation(id: Int) {
        db.plantRecommendDao().deleteRecommendation(id)
    }

    suspend fun insertScan(scan: DiseaseScan) {
        db.diseaseScanDao().insertScan(scan)
    }

    suspend fun saveUserProfile(profile: UserProfile) {
        db.userProfileDao().saveProfile(profile)
    }

    suspend fun logout() {
        db.userProfileDao().clearProfile()
    }
}
