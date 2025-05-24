package org.example.portfolio.components.sections.footer.ui

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.id
import com.varabyte.kobweb.compose.ui.modifiers.padding
import com.varabyte.kobweb.silk.style.toModifier
import org.example.portfolio.components.sections.footer.components.DeveloperInfoRow
import org.example.portfolio.components.sections.footer.components.FooterContactRow
import org.example.portfolio.components.sections.footer.components.GetInTouchColumn
import org.example.portfolio.components.sections.footer.style.FooterStyle
import org.jetbrains.compose.web.css.cssRem

@Composable
fun Footer() {
    Column(
        modifier = FooterStyle.toModifier()
            .fillMaxWidth()
            .id("contact")
    )
    {
        Column(
            modifier = Modifier
                .fillMaxWidth()

        ) {
            GetInTouchColumn()

            FooterContactRow(modifier = Modifier.padding { bottom(4.cssRem) })

            DeveloperInfoRow()
        }
    }
}
