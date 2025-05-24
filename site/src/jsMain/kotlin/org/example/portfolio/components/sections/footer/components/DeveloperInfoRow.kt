package org.example.portfolio.components.sections.footer.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.css.TextAlign
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.graphics.Colors
import com.varabyte.kobweb.compose.ui.modifiers.*
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import com.varabyte.kobweb.silk.style.breakpoint.displayIfAtLeast
import com.varabyte.kobweb.silk.style.breakpoint.displayUntil
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.sections.footer.style.FooterTextStyle
import org.example.portfolio.components.utils.Res
import org.jetbrains.compose.web.css.cssRem
import kotlin.js.Date

@Composable
fun DeveloperInfoRow(
    modifier: Modifier = Modifier
) {

    // For Size SM
    Column(
        modifier = modifier
            .fillMaxWidth()
            .displayUntil(Breakpoint.MD),
        verticalArrangement = Arrangement.spacedBy(3.cssRem)
    ) {
        FooterSpanText(
            text = getCopyrightText(),
            modifier = modifier
                .fillMaxWidth()
                .textAlign(TextAlign.Center)
        )
    }

    // For Size MD & Above
    Row (
        modifier = modifier
            .displayIfAtLeast(Breakpoint.MD)
            .fillMaxWidth()
        ,
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ){
        FooterSpanText(
            text = getCopyrightText(),
            modifier = modifier.fillMaxWidth()
        )
    }
}

@Composable
fun FooterSpanText(text: String, modifier: Modifier = Modifier) {
    SpanText(
        text = text,
        modifier = FooterTextStyle.toModifier().then(modifier)

            .color(
                when (ColorMode.current) {
                    ColorMode.LIGHT -> Colors.Gray
                    ColorMode.DARK -> Colors.LightGray
                }
            )
    )
}


fun getCopyrightText(): String {
    val currentYear = Date().getFullYear().toString()
    return "© $currentYear | ${Res.Constants.COPYRIGHT}"
}