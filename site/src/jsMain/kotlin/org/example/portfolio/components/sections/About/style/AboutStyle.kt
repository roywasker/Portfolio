package org.example.portfolio.components.sections.About.style

import com.varabyte.kobweb.compose.css.FontSize
import com.varabyte.kobweb.compose.css.TextAlign
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.fontSize
import com.varabyte.kobweb.compose.ui.modifiers.gap
import com.varabyte.kobweb.compose.ui.modifiers.gridAutoRows
import com.varabyte.kobweb.compose.ui.modifiers.height
import com.varabyte.kobweb.compose.ui.modifiers.margin
import com.varabyte.kobweb.compose.ui.modifiers.maxWidth
import com.varabyte.kobweb.compose.ui.modifiers.padding
import com.varabyte.kobweb.compose.ui.modifiers.size
import com.varabyte.kobweb.compose.ui.modifiers.textAlign
import com.varabyte.kobweb.compose.ui.modifiers.topBottom
import com.varabyte.kobweb.silk.components.graphics.ImageStyle
import com.varabyte.kobweb.silk.style.CssStyle
import com.varabyte.kobweb.silk.style.addVariant
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import com.varabyte.kobweb.silk.style.extendedBy
import org.example.portfolio.components.styles.SectionContainerStyle
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.fr
import org.jetbrains.compose.web.css.keywords.auto
import org.jetbrains.compose.web.css.percent
import org.jetbrains.compose.web.css.vh

val AboutStyle = SectionContainerStyle.extendedBy {
    base {
        Modifier
            .fillMaxWidth()
            .height(auto)
            .padding { topBottom(10.cssRem) }

    }
}

val AboutDiscriptionStyle = CssStyle {

    Breakpoint.ZERO {
        Modifier.fontSize(FontSize.Small)
            .margin(topBottom = 0.75.cssRem)
            .textAlign(TextAlign.Justify)
    }

    Breakpoint.SM {
        Modifier.fontSize(FontSize.Small)
            .margin(topBottom = 0.75.cssRem)
            .textAlign(TextAlign.Justify)
    }
    Breakpoint.MD {
        Modifier.fontSize(FontSize.Small)
            .margin(topBottom = 2.cssRem)
            .textAlign(TextAlign.Center)
    }
    Breakpoint.LG {
        Modifier.fontSize(FontSize.Medium)
            .margin(topBottom = 2.cssRem)
            .textAlign(TextAlign.Center)
    }

    Breakpoint.XL {
        Modifier.fontSize(FontSize.Large)
            .margin(topBottom = 2.cssRem)
            .textAlign(TextAlign.Center)
    }
}

val SkillsGridStyle = CssStyle {
    base {
        Modifier
            .fillMaxWidth()
            .padding( top = 6.5.cssRem, left = 3.cssRem)
            .gridAutoRows { size(1.fr) }
    }
    Breakpoint.ZERO {
        Modifier.gap(
            columnGap = 1.cssRem,
            rowGap = 1.5.cssRem
        )
    }
    Breakpoint.MD {
        Modifier.gap(
            columnGap = 5.cssRem,
            rowGap = 2.5.cssRem
        )
    }

    Breakpoint.LG {
        Modifier.gap(
            columnGap = 5.cssRem,
            rowGap = 2.5.cssRem
        )
    }

    Breakpoint.XL {
        Modifier.gap(
            columnGap = 5.cssRem,
            rowGap = 5.cssRem
        )
    }
}

val SkillItemImageVariant = ImageStyle.addVariant {
    Breakpoint.ZERO {
        Modifier.size(1.65.cssRem)
    }
    Breakpoint.SM {
        Modifier.size(1.75.cssRem)
    }
    Breakpoint.MD {
        Modifier.size(2.cssRem)
    }
    Breakpoint.LG {
        Modifier.size(3.cssRem)
    }
    Breakpoint.XL {
        Modifier.size(3.5.cssRem)
    }
}

val SkillsSectionStyle = CssStyle {
    base {
        Modifier
            .height(30.vh)
    }
    Breakpoint.ZERO {
        Modifier
            .maxWidth(100.percent)

    }
    Breakpoint.SM {
        Modifier.maxWidth(100.percent)
    }
    Breakpoint.MD {
        Modifier
            .maxWidth(100.percent)

    }
    Breakpoint.LG {
        Modifier.maxWidth(100.percent)
    }
    Breakpoint.XL {
        Modifier.maxWidth(70.percent)
    }
}