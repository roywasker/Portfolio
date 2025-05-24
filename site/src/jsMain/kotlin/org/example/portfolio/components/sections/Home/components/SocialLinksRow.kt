package org.example.portfolio.components.sections.Home.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.graphics.Colors
import com.varabyte.kobweb.compose.ui.modifiers.backgroundColor
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.padding
import com.varabyte.kobweb.silk.components.icons.fa.FaGithub
import com.varabyte.kobweb.silk.components.icons.fa.FaLinkedin
import com.varabyte.kobweb.silk.components.icons.fa.FaMedium
import com.varabyte.kobweb.silk.components.icons.fa.IconSize
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.styles.SocialLinkStyle
import org.example.portfolio.components.utils.Res
import org.example.portfolio.components.widgets.LinkButton
import org.jetbrains.compose.web.css.cssRem


@Composable
fun SocialLinksRow(
    breakpoint: Breakpoint
) {

    val bottomPadding = when (breakpoint) {
        Breakpoint.ZERO, Breakpoint.SM, Breakpoint.MD -> 3.cssRem
        else -> 3.cssRem
    }

    val spaceBetweenIcons = when (breakpoint) {
        Breakpoint.ZERO, Breakpoint.SM, Breakpoint.MD -> 3.cssRem
        else -> 4.cssRem
    }

    Row(
        modifier = Modifier
            .padding {
                top(1.cssRem)
                bottom(bottomPadding)
            },
        horizontalArrangement = Arrangement.spacedBy(spaceBetweenIcons),
        verticalAlignment = Alignment.CenterVertically
    ){
        val iconSize = when (breakpoint) {
            Breakpoint.ZERO, Breakpoint.SM, Breakpoint.MD -> IconSize.X3
            else -> IconSize.X3
        }

        SocialLinkButton(
            Res.Url.LINKEDIN_URL,
            { FaLinkedin(size = iconSize) }
        )

        SocialLinkButton(
            Res.Url.GITHUB_URL,
            { FaGithub(size = iconSize) }
        )

        SocialLinkButton(
            Res.Url.MEDIUM_URL,
            { FaMedium(size = iconSize) }
        )
    }
}


@Composable
internal fun SocialLinkButton(
    url: String,
    icon: @Composable () -> Unit
) {
    LinkButton(
        url,
        modifier =  SocialLinkStyle.toModifier()
            .color(
                when (ColorMode.current) {
                    ColorMode.LIGHT -> Colors.Black
                    ColorMode.DARK -> Colors.White
                }
            )
            .backgroundColor(
                when (ColorMode.current) {
                    ColorMode.LIGHT -> Colors.Transparent
                    ColorMode.DARK -> Colors.Transparent
                }
            )
    ) {
        icon()
    }
}