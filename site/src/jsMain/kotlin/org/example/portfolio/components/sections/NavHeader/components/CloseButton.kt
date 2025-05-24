package org.example.portfolio.components.sections.NavHeader.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.silk.components.icons.CloseIcon
import org.example.portfolio.components.widgets.IconButton

@Composable
fun CloseButton(onClick: () -> Unit) {
    IconButton(onClick) {
        CloseIcon()
    }
}