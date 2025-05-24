package org.example.portfolio.components.sections.Project.style

import com.varabyte.kobweb.compose.css.FontSize
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.fontSize
import com.varabyte.kobweb.compose.ui.modifiers.height
import com.varabyte.kobweb.compose.ui.modifiers.margin
import com.varabyte.kobweb.compose.ui.modifiers.padding
import com.varabyte.kobweb.compose.ui.modifiers.topBottom
import com.varabyte.kobweb.silk.style.CssStyle
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import com.varabyte.kobweb.silk.style.extendedBy
import org.example.portfolio.components.styles.SectionContainerStyle
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.keywords.auto

val ProjectStyle = SectionContainerStyle.extendedBy {
    base {
        Modifier
            .fillMaxWidth()
            .height(auto)
            .padding { topBottom(10.cssRem) }
    }
}

val SectionDiscriptionStyle = CssStyle {
    base {
        Modifier.fontSize(FontSize.Medium)
            .margin(topBottom = 0.75.cssRem)

    }
    Breakpoint.SM {
        Modifier.fontSize(FontSize.Small)
            .margin(topBottom = 0.75.cssRem)
    }
    Breakpoint.MD {
        Modifier.fontSize(FontSize.Small)
            .margin(topBottom = 2.cssRem)
    }
    Breakpoint.LG {
        Modifier.fontSize(FontSize.Medium)
            .margin(topBottom = 2.cssRem)
    }

    Breakpoint.XL {
        Modifier.fontSize(FontSize.Large)
            .margin(topBottom = 2.cssRem)
    }
}