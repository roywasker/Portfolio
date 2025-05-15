package org.example.protolio.components.sections.NavHeader.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.silk.components.icons.CloseIcon
import org.example.protolio.components.widgets.IconButton

@Composable
fun CloseButton(onClick: () -> Unit) {
    IconButton(onClick) {
        CloseIcon()
    }
}