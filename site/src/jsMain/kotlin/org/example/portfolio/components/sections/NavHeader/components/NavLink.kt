package org.example.portfolio.components.sections.NavHeader.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.silk.components.navigation.Link
import com.varabyte.kobweb.silk.components.navigation.UncoloredLinkVariant
import com.varabyte.kobweb.silk.components.navigation.UndecoratedLinkVariant
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.sections.NavHeader.styles.MenuStyle
import org.example.portfolio.toSitePalette

@Composable
fun NavLink(path: String, text: String, isActive: Boolean) {
    Link(
        path,
        text,
        variant = UndecoratedLinkVariant.then(UncoloredLinkVariant),
        modifier = MenuStyle.toModifier()
            .then(if (isActive) Modifier.color(ColorMode.current.toSitePalette().subHeadLine)
            else Modifier)
    )
}