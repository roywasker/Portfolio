package org.example.protolio.components.sections.NavHeader.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.silk.components.icons.HamburgerIcon
import org.example.protolio.components.widgets.IconButton

@Composable
fun HamburgerButton(onClick: () -> Unit) {
    IconButton(onClick) {
        HamburgerIcon()
    }
}