package org.example.portfolio.components.sections.Experience.styles

import com.varabyte.kobweb.compose.css.FontSize
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fontSize
import com.varabyte.kobweb.compose.ui.modifiers.margin
import com.varabyte.kobweb.compose.ui.modifiers.minHeight
import com.varabyte.kobweb.compose.ui.modifiers.width
import com.varabyte.kobweb.silk.style.CssStyle
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.percent
import org.jetbrains.compose.web.css.vh

val ExperienceStyle = CssStyle {
    base {
        Modifier
            .width(100.percent)
            .fontSize(3.cssRem)
            .minHeight(100.vh)
    }
    Breakpoint.ZERO {
        Modifier
            .width(100.percent)
            .fontSize(2.5.cssRem)
    }
    Breakpoint.SM {
        Modifier
            .width(100.percent)
            .fontSize(2.5.cssRem)
    }
    Breakpoint.MD {
        Modifier
            .width(100.percent)
            .fontSize(2.75.cssRem)
    }
    Breakpoint.LG {
        Modifier
            .width(100.percent)
            .fontSize(3.cssRem)
    }
}

val WorkExperienceStyle = CssStyle {
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

val WorkExperienceItemRoleAndDurationStyle = CssStyle {
    base {
        Modifier.fontSize(FontSize.XXSmall)
    }
    Breakpoint.SM {
        Modifier.fontSize(FontSize.XSmall)
    }
    Breakpoint.MD {
        Modifier.fontSize(FontSize.Small)
    }
    Breakpoint.LG {
        Modifier.fontSize(FontSize.Small)
    }
}

val WorkExperienceItemOrgStyle = CssStyle {
    base {
        Modifier.fontSize(FontSize.Small)
    }
    Breakpoint.SM {
        Modifier.fontSize(FontSize.Medium)
    }
    Breakpoint.MD {
        Modifier.fontSize(FontSize.XLarge)
    }
    Breakpoint.LG {
        Modifier.fontSize(FontSize.XXLarge)
    }
}