package com.example.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke

@Composable
fun UniqTekLogo(
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color(0xFFE21B23),
    symbolColor: Color = Color.White,
    cornerRadiusPercent: Int = 25
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadiusPercent))
            .background(backgroundColor)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height
            val strokeWidth = w * 0.11f // Proportional stroke width

            // Continuous "un" path
            val path = Path().apply {
                // Left vertical line of "u"
                moveTo(w * 0.27f, h * 0.42f)
                lineTo(w * 0.27f, h * 0.56f)

                // Bottom curve of "u"
                cubicTo(
                    w * 0.27f, h * 0.68f,
                    w * 0.48f, h * 0.68f,
                    w * 0.48f, h * 0.56f
                )

                // Center vertical rise
                lineTo(w * 0.48f, h * 0.52f)

                // Top curve of "n"
                cubicTo(
                    w * 0.48f, h * 0.40f,
                    w * 0.69f, h * 0.40f,
                    w * 0.69f, h * 0.52f
                )

                // Right vertical decline
                lineTo(w * 0.69f, h * 0.68f)
            }

            drawPath(
                path = path,
                color = symbolColor,
                style = Stroke(
                    width = strokeWidth,
                    cap = StrokeCap.Round,
                    join = StrokeJoin.Round
                )
            )

            // Stylized arrow pointing up-right at the top-right of the "n" curve
            val arrowPath = Path().apply {
                moveTo(w * 0.62f, h * 0.37f)
                lineTo(w * 0.72f, h * 0.31f)
                lineTo(w * 0.72f, h * 0.41f)
                close()
            }

            drawPath(
                path = arrowPath,
                color = symbolColor,
                style = Fill
            )
        }
    }
}
