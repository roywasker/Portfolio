package org.example.portfolio.components.sections.footer.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.background
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.fontFamily
import com.varabyte.kobweb.core.rememberPageContext
import com.varabyte.kobweb.silk.components.forms.Button
import com.varabyte.kobweb.silk.components.forms.ButtonSize
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import com.varabyte.kobweb.silk.style.breakpoint.displayIfAtLeast
import com.varabyte.kobweb.silk.style.breakpoint.displayUntil
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.styles.MainButtonStyle
import org.example.portfolio.components.utils.Res
import org.example.portfolio.toSitePalette


@Composable
fun FooterContactRow(modifier: Modifier = Modifier) {

    // Contact Row If At Least SM Size
    Row (
        modifier = modifier
            .displayUntil(Breakpoint.MD)
            .fillMaxWidth()

        ,
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ){

        ContactLinksRow(displayEmail = true)
    }

    // Contact Row If At Least MD Size
    Row (
        modifier = modifier
            .displayIfAtLeast(Breakpoint.MD)
            .fillMaxWidth()
        ,
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ){

        val ctx = rememberPageContext()
        val currentPalette = ColorMode.current.toSitePalette()
        Button(
            onClick = {
                ctx.router.navigateTo(Res.Url.GMAIL_URL)
            },
            size = ButtonSize.LG,
            modifier = MainButtonStyle.toModifier()
                .background(currentPalette.buttonBackground)

        ) {
            SpanText(
                text = Res.Constants.GMAIL,
                modifier = Modifier
                    .color(currentPalette.buttonText)
                    .fontFamily("Lexend")
            )
        }

        ContactLinksRow()
    }
}