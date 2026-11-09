package com.example.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ThemeRed = Color(0xFFD32F2F)      // Elegant Red
val ThemeBlueSea = Color(0xFF006994)  // Blue Sea
val ThemeBlack = Color(0xFF000000)    // Black Font
val ThemeWhite = Color(0xFFFFFFFF)    // White
val BackgroundLight = Color(0xFFFAFAFA) // Very clean off-white
val SurfaceLight = Color(0xFFFFFFFF)    // Pure White surface
val SuccessGreen = Color(0xFF10B981)
val WarningAmber = Color(0xFFF59E0B)

private val LightColorScheme = lightColorScheme(
    primary = ThemeRed,
    onPrimary = ThemeWhite,
    primaryContainer = Color(0xFFFFEAEA),
    onPrimaryContainer = Color(0xFF7F0000),
    secondary = ThemeBlueSea,
    onSecondary = ThemeWhite,
    background = BackgroundLight,
    onBackground = ThemeBlack,
    surface = SurfaceLight,
    onSurface = ThemeBlack,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = ThemeBlack,
    outline = ThemeBlueSea
)

private val DarkColorScheme = darkColorScheme(
    primary = ThemeRed,
    onPrimary = ThemeWhite,
    primaryContainer = Color(0xFF490000),
    onPrimaryContainer = Color(0xFFFFD6D6),
    secondary = ThemeBlueSea,
    onSecondary = ThemeWhite,
    background = Color(0xFF0B132B), // Deep sea/midnight blue background
    onBackground = ThemeWhite,
    surface = Color(0xFF1C2541),
    onSurface = ThemeWhite,
    surfaceVariant = Color(0xFF3A506B),
    onSurfaceVariant = ThemeWhite,
    outline = ThemeBlueSea
)

@Composable
fun UniqTekTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
