package org.example.portfolio.components.sections.footer.style

import com.varabyte.kobweb.compose.css.ColorInterpolationMethod
import com.varabyte.kobweb.compose.css.FontSize
import com.varabyte.kobweb.compose.css.TextAlign
import com.varabyte.kobweb.compose.css.backgroundImage
import com.varabyte.kobweb.compose.css.functions.LinearGradient
import com.varabyte.kobweb.compose.css.functions.linearGradient
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.fontSize
import com.varabyte.kobweb.compose.ui.modifiers.padding
import com.varabyte.kobweb.compose.ui.modifiers.textAlign
import com.varabyte.kobweb.compose.ui.styleModifier
import com.varabyte.kobweb.silk.style.CssStyle
import com.varabyte.kobweb.silk.style.breakpoint.Breakpoint
import org.example.portfolio.toSitePalette
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.percent

val FooterStyle = CssStyle {
    base {
        Modifier
            .padding(top = 5.cssRem, bottom = 2.cssRem, leftRight = 10.percent)
            .styleModifier {
                backgroundImage(
                    linearGradient(
                        from = colorMode.toSitePalette().subHeadLine,
                        to = colorMode.toSitePalette().nearBackground,
                        dir = LinearGradient.Direction.ToBottom,
                        interpolation = ColorInterpolationMethod.DisplayP3
                    )

                )
            }
    }

}

val FooterDescriptionStyle = CssStyle {

    base {
        Modifier
            .textAlign(TextAlign.Justify)
    }

    Breakpoint.ZERO {
        Modifier
            .fontSize(FontSize.Small)
    }

    Breakpoint.SM {
        Modifier
            .fontSize(FontSize.Small)
    }

    Breakpoint.MD {
        Modifier
            .fontSize(FontSize.Large)
    }

    Breakpoint.LG {
        Modifier
            .fontSize(FontSize.Large)
    }

    Breakpoint.XL {
        Modifier
            .fontSize(FontSize.Large)
    }
}

val FooterTextStyle = CssStyle {

    base {
        Modifier
            .color(colorMode.toSitePalette().discription)
    }

    Breakpoint.ZERO {

        Modifier
            .fontSize(FontSize.Small)
    }

    Breakpoint.SM {

        Modifier
            .fontSize(FontSize.Small)
    }

    Breakpoint.MD {

        Modifier
            .fontSize(FontSize.Large)
    }

    Breakpoint.XL {

        Modifier
            .fontSize(FontSize.Medium)
    }

    Breakpoint.LG {

        Modifier
            .fontSize(FontSize.Medium)
    }

}