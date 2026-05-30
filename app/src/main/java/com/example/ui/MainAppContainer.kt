package com.example.ui

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.viewmodel.EcoViewModel
import com.example.ui.viewmodel.PlantResult
import com.example.ui.viewmodel.DiseaseScanResult
import com.example.ui.viewmodel.GrowthPredictionResult
import com.example.ui.viewmodel.WaterSpec
import com.example.data.db.ChatMessage
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun MainAppContainer(
    viewModel: EcoViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val userProfile by viewModel.userProfile.collectAsState()
    
    // Bottom tab routing layout definition
    var currentTab by remember { mutableStateOf(NavTab.HOME) }

    // Floating Leaf Deco Animation
    val infiniteTransition = rememberInfiniteTransition(label = "leaves")
    val leafAngle by infiniteTransition.animateFloat(
        initialValue = -12f,
        targetValue = 12f,
        animationSpec = infiniteRepeatable(
            animation = tween(2800, easing = EaseInOutBack),
            repeatMode = RepeatMode.Reverse
        ),
        label = "leaf_rotation"
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("bottom_nav_bar")
                    .windowInsetsPadding(WindowInsets.navigationBars),
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                listOf(
                    NavTabItem(NavTab.HOME, "Home", Icons.Default.Home, "home_tab"),
                    NavTabItem(NavTab.RECOMMEND, "Recommend", Icons.Default.Eco, "recommend_tab"),
                    NavTabItem(NavTab.SCAN, "Scan", Icons.Default.CameraAlt, "scan_tab"),
                    NavTabItem(NavTab.GROWTH, "Growth", Icons.Default.TrendingUp, "growth_tab"),
                    NavTabItem(NavTab.CHATBOT, "Prakriti", Icons.Default.Forum, "chatbot_tab"),
                    NavTabItem(NavTab.PROFILE, "Profile", Icons.Default.Person, "profile_tab")
                ).forEach { item ->
                    val isSelected = currentTab == item.tab
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { currentTab = item.tab },
                        icon = {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = item.label,
                                tint = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                                modifier = Modifier.size(24.dp)
                            )
                        },
                        label = {
                            Text(
                                text = item.label,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            )
                        },
                        modifier = Modifier.testTag(item.testTag)
                    )
                }
            }
        }
    ) { innerPadding ->
        // Premium gradient background for the nature green vibe
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.background,
                            MaterialTheme.colorScheme.background.copy(alpha = 0.9f),
                            MaterialTheme.colorScheme.surface.copy(alpha = 0.15f)
                        )
                    )
                )
                .padding(innerPadding)
        ) {
            // Background Leaf Accents (Decorative only)
            Icon(
                imageVector = Icons.Default.Eco,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.05f),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = 40.dp, y = 20.dp)
                    .size(160.dp)
                    .rotate(leafAngle)
            )

            Icon(
                imageVector = Icons.Default.Yard,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.secondary.copy(alpha = 0.03f),
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .offset(x = (-30).dp, y = (-20).dp)
                    .size(180.dp)
                    .rotate(-leafAngle * 0.8f)
            )

            // Auth guard/Check: show registration first if not registered
            if (userProfile == null) {
                AuthScreen(
                    onRegister = { name, email ->
                        viewModel.registerOrLogin(name, email)
                    }
                )
            } else {
                AnimatedContent(
                    targetState = currentTab,
                    transitionSpec = {
                        fadeIn(animationSpec = tween(220)) with fadeOut(animationSpec = tween(220))
                    },
                    label = "main_router"
                ) { target ->
                    when (target) {
                        NavTab.HOME -> HomeScreen(viewModel, onNavigate = { currentTab = it })
                        NavTab.RECOMMEND -> RecommendScreen(viewModel)
                        NavTab.SCAN -> ScanScreen(viewModel)
                        NavTab.GROWTH -> GrowthScreen(viewModel)
                        NavTab.CHATBOT -> ChatbotScreen(viewModel)
                        NavTab.PROFILE -> ProfileScreen(viewModel)
                    }
                }
            }
        }
    }
}

// --- Navigation Enum / Models ---
enum class NavTab {
    HOME, RECOMMEND, SCAN, GROWTH, CHATBOT, PROFILE
}

data class NavTabItem(
    val tab: NavTab,
    val label: String,
    val icon: ImageVector,
    val testTag: String
)

// --- 🔐 Simple Authentication / Session Screen ---
@Composable
fun AuthScreen(onRegister: (String, String) -> Unit) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isSigningUp by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // App Identity Header
        Icon(
            imageVector = Icons.Default.Eco,
            contentDescription = "EcoFriend Logo",
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier
                .size(72.dp)
                .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f), CircleShape)
                .padding(12.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Welcome to EcoFriend",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 28.sp,
                color = MaterialTheme.colorScheme.primary
            ),
            textAlign = TextAlign.Center
        )
        Text(
            text = "Your AI-Powered Green Companion 🌱",
            style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.secondary
            ),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Glassmorphism login panel
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(2.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f)
            ),
            shape = RoundedCornerShape(24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = if (isSigningUp) "Create New Account" else "Sign In to Continue",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                if (isSigningUp) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Display Name") },
                        leadingIcon = { Icon(Icons.Default.Person, null) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("name_input"),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                }

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    leadingIcon = { Icon(Icons.Default.Email, null) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("email_input"),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Secret Password") },
                    leadingIcon = { Icon(Icons.Default.Lock, null) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("password_input"),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    shape = RoundedCornerShape(12.dp)
                )

                if (errorMessage.isNotBlank()) {
                    Text(
                        text = errorMessage,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        if (email.isBlank() || password.isBlank() || (isSigningUp && name.isBlank())) {
                            errorMessage = "Please enter all required credentials."
                        } else {
                            errorMessage = ""
                            val cleanName = if (isSigningUp) name else email.substringBefore("@")
                            onRegister(cleanName, email)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("login_submit_button"),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text(
                        text = if (isSigningUp) "Sign Up 🌱" else "Secure Login 🔑",
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                TextButton(
                    onClick = { isSigningUp = !isSigningUp }
                ) {
                    Text(
                        text = if (isSigningUp) "Already have an account? Sign In" else "New to EcoFriend? Create Account",
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

// --- 🏠 Home Dashboard screen ---
@Composable
fun HomeScreen(
    viewModel: EcoViewModel,
    onNavigate: (NavTab) -> Unit
) {
    val user by viewModel.userProfile.collectAsState()
    val scans by viewModel.diseaseScans.collectAsState()
    val listState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(listState)
    ) {
        // Welcoming Headline with user points card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.9f)
            ),
            shape = RoundedCornerShape(20.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Hello, ${user?.name ?: "Gardener"}!",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                            fontSize = 22.sp
                        )
                    )
                    Text(
                        text = "Your gardening points level looks high today! Keep gardening.",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .background(MaterialTheme.colorScheme.primary, CircleShape)
                            .size(52.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${user?.points ?: 0}",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        )
                    }
                    Text(
                        text = "XP Points",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Trilingual commands cheat box for accessibility
        Text(
            text = "🌐 Trilingual Quick Assist Commands",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                listOf(
                    TrilingualCmd("Recommend Plant", "మొక్క సూచించు", "पौधा सुझाओ", NavTab.RECOMMEND),
                    TrilingualCmd("Detect Disease", "வ్యాధి గుర్తించు", "रोग पहचानो", NavTab.SCAN),
                    TrilingualCmd("Growth Prediction", "పెరుగుదల అంచనా", "वृद्धि अनुमान", NavTab.GROWTH)
                ).forEach { item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onNavigate(item.targetTab) }
                            .padding(vertical = 10.dp, horizontal = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Eco, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(item.en, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
                        }
                        Text(
                            text = "${item.te} • ${item.hi}",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = MaterialTheme.colorScheme.secondary,
                                fontWeight = FontWeight.Medium
                            )
                        )
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.06f))
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Quick feature navigators
        Text(
            text = "🌿 Smart Care Modules",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ModuleCard(
                title = "Disease Scan",
                description = "Scan leaf spots via AI",
                icon = Icons.Default.CameraAlt,
                color = MaterialTheme.colorScheme.secondary,
                modifier = Modifier.weight(1f),
                onClick = { onNavigate(NavTab.SCAN) }
            )

            ModuleCard(
                title = "Water Calc",
                description = "Seasonal schedules",
                icon = Icons.Default.WaterDrop,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f),
                onClick = { onNavigate(NavTab.RECOMMEND) }
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // History logs
        Text(
            text = "📅 Plant Diagnostics History (${scans.size})",
            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        if (scans.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.CloudQueue, null, tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "No diagnostics run yet. Tap Scan to detect diseases!",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
                    )
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                scans.take(4).forEach { scan ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .background(
                                        if (scan.confidence > 90) MaterialTheme.colorScheme.error.copy(alpha = 0.1f)
                                        else MaterialTheme.colorScheme.secondary.copy(alpha = 0.1f),
                                        CircleShape
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.BugReport,
                                    contentDescription = null,
                                    tint = if (scan.confidence > 90) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.secondary
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(scan.diseaseName, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                                Text(
                                    text = "Confidence Level: ${scan.confidence}%",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

data class TrilingualCmd(val en: String, val te: String, val hi: String, val targetTab: NavTab)

@Composable
fun ModuleCard(
    title: String,
    description: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(130.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .background(color.copy(alpha = 0.12f), CircleShape)
                    .size(42.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = color)
            }

            Column {
                Text(title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                Text(
                    description,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                )
            }
        }
    }
}

// --- 🌿 Plant Recommendations & Calculations Screen ---
@Composable
fun RecommendScreen(viewModel: EcoViewModel) {
    var location by remember { mutableStateOf("") }
    var climate by remember { mutableStateOf("Humid / Subtropical") }
    var purpose by remember { mutableStateOf("Medicinal & Air Purification") }
    
    // Water requirement calculator state variables
    var cropType by remember { mutableStateOf("Vegetables") }
    var temperature by remember { mutableStateOf("26") }
    var soilType by remember { mutableStateOf("Loamy (Balanced Organic)") }
    var seasonChoice by remember { mutableStateOf("Summer") }

    val recResults by viewModel.recommendationResult.collectAsState()
    val isRecLoading by viewModel.isRecommendationLoading.collectAsState()

    val climates = listOf("Dry & Arid desert", "Humid / Subtropical", "Cool & Temperate", "Tropical Rain forest")
    val purposes = listOf("Medicinal & Air Purification", "Food Production (Kitchen Garden)", "Ornamental / Colorful Landscaping")
    
    val crops = listOf("Vegetables", "Succulents/Cacti", "Fruits", "Medicinal plants", "Flowering plants")
    val soils = listOf("Clay (Dense & Moisture Wet)", "Loamy (Balanced Organic)", "Sandy (Highly Drained)")
    val seasons = listOf("Summer", "Monsoon", "Winter")

    var expandedClimate by remember { mutableStateOf(false) }
    var expandedPurpose by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "🌿 Plant Recommendation Engine",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        )
        Text(
            text = "Match ideal crops to your regional weather profile instantly using AI analysis.",
            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary),
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = { Text("Your Location (e.g. Hyderabad, India)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("location_input"),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Climate selector drop down
                Box {
                    OutlinedButton(
                        onClick = { expandedClimate = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Climate: $climate", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null, tint = MaterialTheme.colorScheme.primary)
                        }
                    }
                    DropdownMenu(expanded = expandedClimate, onDismissRequest = { expandedClimate = false }) {
                        climates.forEach { c ->
                            DropdownMenuItem(text = { Text(c) }, onClick = { climate = c; expandedClimate = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Purpose selector drop down
                Box {
                    OutlinedButton(
                        onClick = { expandedPurpose = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Purpose: $purpose", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null, tint = MaterialTheme.colorScheme.primary)
                        }
                    }
                    DropdownMenu(expanded = expandedPurpose, onDismissRequest = { expandedPurpose = false }) {
                        purposes.forEach { p ->
                            DropdownMenuItem(text = { Text(p) }, onClick = { purpose = p; expandedPurpose = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        if (location.isNotBlank()) {
                            viewModel.requestPlantRecommendation(location, climate, purpose)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("submit_recommend_btn"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    if (isRecLoading) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Analyze & Recommend Smart Plants 🌱", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Recommendation Results Display
        if (recResults.isNotEmpty()) {
            Text(
                text = "🎯 Match recommendations:",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(vertical = 8.dp)
            )

            recResults.forEach { result ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = result.name,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            )
                            Box(
                                modifier = Modifier
                                    .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    "Score: ${result.suitability}%",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                "Difficulty level: ",
                                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                            )
                            Text(
                                result.difficulty,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = if (result.difficulty.lowercase(Locale.ROOT) == "easy") Color(0xFF2D6A4F) else Color(0xFF6B581B),
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = result.careTip,
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // smart irrigation calculator section
        Text(
            text = "💧 Smart Water Calculator",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        )
        Text(
            text = "Accurate irrigation scheduling tailored to regional evaporation rates.",
            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        var cropExpanded by remember { mutableStateOf(false) }
        var soilExpanded by remember { mutableStateOf(false) }
        var seasonExpanded by remember { mutableStateOf(false) }
        var calculatedScheduledSpec by remember { mutableStateOf<WaterSpec?>(null) }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Crop Select
                Box {
                    OutlinedButton(onClick = { cropExpanded = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Plant Crop: $cropType", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null)
                        }
                    }
                    DropdownMenu(expanded = cropExpanded, onDismissRequest = { cropExpanded = false }) {
                        crops.forEach { c ->
                            DropdownMenuItem(text = { Text(c) }, onClick = { cropType = c; cropExpanded = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Temp input
                OutlinedTextField(
                    value = temperature,
                    onValueChange = { temperature = it },
                    label = { Text("Ambient Temperature (°C)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Soil select
                Box {
                    OutlinedButton(onClick = { soilExpanded = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Soil Profile: $soilType", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null)
                        }
                    }
                    DropdownMenu(expanded = soilExpanded, onDismissRequest = { soilExpanded = false }) {
                        soils.forEach { s ->
                            DropdownMenuItem(text = { Text(s) }, onClick = { soilType = s; soilExpanded = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Season Select
                Box {
                    OutlinedButton(onClick = { seasonExpanded = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Active Season: $seasonChoice", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null)
                        }
                    }
                    DropdownMenu(expanded = seasonExpanded, onDismissRequest = { seasonExpanded = false }) {
                        seasons.forEach { s ->
                            DropdownMenuItem(text = { Text(s) }, onClick = { seasonChoice = s; seasonExpanded = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        val tempVal = temperature.toFloatOrNull() ?: 25f
                        calculatedScheduledSpec = viewModel.calculateWaterRequirement(cropType, tempVal, soilType, seasonChoice)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Calculate Water Budget 💧", fontWeight = FontWeight.Bold)
                }

                calculatedScheduledSpec?.let { spec ->
                    Spacer(modifier = Modifier.height(16.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Column {
                            Text("⚡ Calculated Irrigation Budget", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary))
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("• Daily Water Volume: ${spec.dailyMl} ml/day", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                            Text("• Ideal Frequency: ${spec.weeklyInterval}", style = MaterialTheme.typography.bodySmall)
                            Text("• Seasonal Care Adjustments: ${spec.specialAdvice}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary))
                        }
                    }
                }
            }
        }
    }
}

// --- 📷 Leaf Disease scanning screen ---
@Composable
fun ScanScreen(viewModel: EcoViewModel) {
    val context = LocalContext.current
    val selectedUri by viewModel.selectedLeafUri.collectAsState()
    val selectedPresetIndex by viewModel.selectedPresetLeafIndex.collectAsState()
    val isScanLoading by viewModel.isScanLoading.collectAsState()
    val scanResult by viewModel.scanResult.collectAsState()

    // Activity picker
    val imageLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
        onResult = { uri ->
            viewModel.selectLeafUri(uri)
        }
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "🍃 Leaf Disease Scanner",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        )
        Text(
            text = "Upload leaf scans or select a simulation preset below to diagnose issues.",
            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary),
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Upload and Action buttons
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Leaf Image Display Preview
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .background(
                            MaterialTheme.colorScheme.background,
                            RoundedCornerShape(12.dp)
                        )
                        .clip(RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    if (selectedUri != null) {
                        AsyncImage(
                            model = selectedUri,
                            contentDescription = "Selected leaf to diagnose",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    } else if (selectedPresetIndex != null) {
                        val leafName = viewModel.presetLeaves[selectedPresetIndex!!].title
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(16.dp)) {
                            Icon(
                                imageVector = Icons.Default.FilterVintage,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(64.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "Preset Simulated Leaf: $leafName",
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.Image,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f),
                                modifier = Modifier.size(56.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "No plant leaf selected.",
                                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = { imageLauncher.launch("image/*") },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                            .testTag("upload_leaf_btn"),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.CloudUpload, null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Upload Leaf")
                    }

                    Button(
                        onClick = { viewModel.scanLeafDisease(context) },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                            .testTag("run_scan_btn"),
                        shape = RoundedCornerShape(12.dp),
                        enabled = (selectedUri != null || selectedPresetIndex != null) && !isScanLoading
                    ) {
                        if (isScanLoading) {
                            CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(20.dp))
                        } else {
                            Icon(Icons.Default.Search, null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Diagnose Leaf")
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Preset leaf simulations selector
        Text(
            text = "🌱 Diagnostics Simulation Presets",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            viewModel.presetLeaves.forEachIndexed { index, leaf ->
                val isSelected = selectedPresetIndex == index
                Card(
                    modifier = Modifier
                        .width(140.dp)
                        .clickable { viewModel.selectPresetLeaf(index) },
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
                    ),
                    border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Icon(
                            imageVector = Icons.Default.Eco,
                            contentDescription = null,
                            tint = if (index != 3) Color(0xFFC17E17) else Color(0xFF2E6342)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = leaf.title,
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                            maxLines = 2
                        )
                        Text(
                            text = if (index == 3) "Healthy Crop" else "Infection Scan",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Analysis presentation
        scanResult?.let { result ->
            Text(
                text = "⚡ Real-time AI Plant Diagnosis",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .animateContentSize(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = result.diseaseName,
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        )
                        Text(
                            text = "${result.confidence.toInt()}% Match",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (result.confidence > 80f) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.secondary
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        "Clinical Treatment Suggestions:",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = result.treatment,
                        style = MaterialTheme.typography.bodySmall.copy(lineHeight = 18.sp)
                    )
                }
            }
        }
    }
}

// --- 📈 Growth Timeline prediction Screen ---
@Composable
fun GrowthScreen(viewModel: EcoViewModel) {
    var plantName by remember { mutableStateOf("Tomato") }
    var soilPh by remember { mutableStateOf("6.5") }
    var wateringFrequency by remember { mutableStateOf(2) } // default 2 times/wk

    val growthResult by viewModel.predictedGrowth.collectAsState()

    val plantOptions = listOf("Tomato", "Spinach", "Rose", "Basil")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "📈 Growth & Harvest Predictor",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        )
        Text(
            text = "Estimate harvesting timelines and physiological expansion using agricultural formulas.",
            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary),
            modifier = Modifier.padding(bottom = 16.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Plant Dropdown Select
                var expanded by remember { mutableStateOf(false) }
                Box {
                    OutlinedButton(onClick = { expanded = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Plant Varieties: $plantName", color = MaterialTheme.colorScheme.onSurface)
                            Icon(Icons.Default.ArrowDropDown, null)
                        }
                    }
                    DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        plantOptions.forEach { p ->
                            DropdownMenuItem(text = { Text(p) }, onClick = { plantName = p; expanded = false })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = soilPh,
                    onValueChange = { soilPh = it },
                    label = { Text("Soil pH level (Ideal: 6.0 - 7.0)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Water Frequency Schedule per Week:", style = MaterialTheme.typography.bodySmall)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    listOf(1, 2, 3, 5).forEach { times ->
                        FilterChip(
                            selected = wateringFrequency == times,
                            onClick = { wateringFrequency = times },
                            label = { Text("$times Times") }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        val ph = soilPh.toFloatOrNull() ?: 6.5f
                        viewModel.predictPlantGrowth(plantName, ph, wateringFrequency)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("submit_growth_btn"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Predict Growth Timeline 📈", fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Prediction details
        growthResult?.let { result ->
            Text(
                text = "⚡ Crop Physiological Prediction",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "${result.plantName} Prediction Metrics",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("• Estimated Physiological Mature Height: ${"%.2f".format(result.heightCm)} cm")
                    Text("• Estimated Harvest Window: ${result.harvestTimeline}")

                    Spacer(modifier = Modifier.height(16.dp))
                    Text("🚀 Physiological Phase Stages Timeline:", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))

                    Spacer(modifier = Modifier.height(8.dp))
                    result.stages.forEach { stage ->
                        Column(modifier = Modifier.padding(vertical = 4.dp)) {
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Text(stage.name, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                                Text(stage.timeline, style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold))
                            }
                            Text(stage.details, style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)))
                            Spacer(modifier = Modifier.height(4.dp))
                            HorizontalDivider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                        }
                    }
                }
            }
        }
    }
}

// --- 🤖 PrakritiMitra Chatbot Screen ---
@Composable
fun ChatbotScreen(viewModel: EcoViewModel) {
    val messages by viewModel.chatMessages.collectAsState()
    val isBotLoading by viewModel.isChatbotLoading.collectAsState()
    val activeLang by viewModel.chatbotLanguage.collectAsState()
    var userMessageText by remember { mutableStateOf("") }
    
    val listState = rememberLazyListState()

    // Scroll to bottom when messages list size changes
    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    val languages = listOf("English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Chat Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "🤖 PrakritiMitra AI",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 20.sp, color = MaterialTheme.colorScheme.primary)
                )
                Text(
                    text = "Your Multilingual Gardening Companion 🌱",
                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary)
                )
            }

            // Quick reset
            IconButton(onClick = { viewModel.clearChatHistory() }) {
                Icon(Icons.Default.DeleteSweep, "Clear history", tint = MaterialTheme.colorScheme.error)
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Language Select Horizonal Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            languages.forEach { l ->
                FilterChip(
                    selected = activeLang == l,
                    onClick = { viewModel.switchChatbotLanguage(l) },
                    label = { Text(l) }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Chat conversation history bubble area
        Box(modifier = Modifier.weight(1f)) {
            if (messages.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Forum,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                            modifier = Modifier.size(56.dp)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            "Type your farming or care inquiries below. PrakritiMitra will aid you instantly!",
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)),
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(messages) { msg ->
                        val isUser = msg.sender == "user"
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                        ) {
                            Box(
                                modifier = Modifier
                                    .background(
                                        color = if (isUser) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.5f),
                                        shape = RoundedCornerShape(
                                            topStart = 16.dp,
                                            topEnd = 16.dp,
                                            bottomStart = if (isUser) 16.dp else 2.dp,
                                            bottomEnd = if (isUser) 2.dp else 16.dp
                                        )
                                    )
                                    .padding(12.dp)
                                    .widthIn(max = 280.dp)
                            ) {
                                Text(
                                    text = msg.message,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = if (isUser) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSecondaryContainer,
                                        lineHeight = 20.sp
                                    )
                                )
                            }
                        }
                    }

                    if (isBotLoading) {
                        item {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.Start
                            ) {
                                Box(
                                    modifier = Modifier
                                        .background(
                                            MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.5f),
                                            RoundedCornerShape(16.dp)
                                        )
                                        .padding(12.dp)
                                ) {
                                    CircularProgressIndicator(
                                        color = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(18.dp),
                                        strokeWidth = 2.dp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Input Box Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = userMessageText,
                onValueChange = { userMessageText = it },
                placeholder = { Text("Ask PrakritiMitra in $activeLang...") },
                modifier = Modifier
                    .weight(1f)
                    .testTag("chatbot_message_input"),
                shape = RoundedCornerShape(20.dp),
                maxLines = 2,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (userMessageText.isNotBlank()) {
                        viewModel.sendMessageToChatbot(userMessageText)
                        userMessageText = ""
                    }
                },
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.primary, CircleShape)
                    .size(48.dp)
                    .testTag("chatbot_submit_btn")
            ) {
                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Send message",
                    tint = MaterialTheme.colorScheme.onPrimary
                )
            }
        }
    }
}

// --- 👤 User profile screen ---
@Composable
fun ProfileScreen(viewModel: EcoViewModel) {
    val user by viewModel.userProfile.collectAsState()
    val scans by viewModel.diseaseScans.collectAsState()
    val recommendations by viewModel.recommendations.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Cover badge
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.AccountCircle,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(80.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = user?.name ?: "Professional Gardener",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                )
                Text(
                    text = user?.email ?: "gardener@ecofriend.com",
                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    ProfileStatIndicator("${user?.points ?: 0}", "XP Score")
                    ProfileStatIndicator("${scans.size}", "Scans Run")
                    ProfileStatIndicator("${recommendations.size}", "Saved Plants")
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Badge achievements list
        Text(
            text = "🏆 Green Gardener Achievements",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            textAlign = TextAlign.Start
        )

        AchievementBadgeItem("Seed Sower", "Completed profile setup for smart plantations.", true)
        AchievementBadgeItem("Sprout Scout", "Successfully registered 1 leaf scan diagnostic.", scans.isNotEmpty())
        AchievementBadgeItem("Harvest Hero", "Accumulate over 200 activity experience points.", (user?.points ?: 0) >= 200)

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = { viewModel.logout() },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("logout_button"),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Logout, null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Logout & Reset Session data", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ProfileStatIndicator(score: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(score, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary))
        Text(label, style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.secondary))
    }
}

@Composable
fun AchievementBadgeItem(title: String, desc: String, achieved: Boolean) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (achieved) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f) else MaterialTheme.colorScheme.surface.copy(alpha = 0.4f)
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (achieved) Icons.Default.WorkspacePremium else Icons.Default.Lock,
                contentDescription = null,
                tint = if (achieved) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f),
                modifier = Modifier.size(36.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = if (achieved) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                )
                Text(
                    text = desc,
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = if (achieved) MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                    )
                )
            }
        }
    }
}
