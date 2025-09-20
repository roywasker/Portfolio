package org.example.portfolio.components.sections.Home.ui

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.css.FontWeight
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.animation
import com.varabyte.kobweb.compose.ui.modifiers.background
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxHeight
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.fontWeight
import com.varabyte.kobweb.compose.ui.modifiers.id
import com.varabyte.kobweb.core.rememberPageContext
import com.varabyte.kobweb.framework.annotations.DelicateApi
import com.varabyte.kobweb.silk.components.forms.Button
import com.varabyte.kobweb.silk.components.forms.ButtonSize
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.animation.toAnimation
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.breakpoint.rememberBreakpoint
import org.example.portfolio.SitePalette
import org.example.portfolio.components.sections.Home.components.SocialLinksRow
import org.example.portfolio.components.sections.Home.style.DescriptionStyle
import org.example.portfolio.components.sections.Home.style.HelloImStyle
import org.example.portfolio.components.sections.Home.style.HeroContainerKeyFrames
import org.example.portfolio.components.sections.Home.style.HeroSectionStyle
import org.example.portfolio.components.sections.Home.style.NameStyle
import org.example.portfolio.components.styles.MainButtonStyle
import org.example.portfolio.components.utils.Res
import org.jetbrains.compose.web.css.AnimationTimingFunction
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.s

@OptIn(DelicateApi::class)
@Composable
fun Home(
    currentPalette: SitePalette
){
    val ctx = rememberPageContext()

    val breakpoint = rememberBreakpoint()

    Row(
        modifier = HeroSectionStyle.toModifier()
            .fillMaxWidth().id("home"),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {

        Column(
            modifier = Modifier
                .fillMaxHeight()
                .animation(HeroContainerKeyFrames.toAnimation(
                    duration = 1.5.s,
                    timingFunction = AnimationTimingFunction.cubicBezier(
                        0.4, 0.0, 1.0, 1.0
                    ),

                    )),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.Center,
        ) {

            SpanText(
                text = Res.Constants.HELLO,
                modifier = HelloImStyle.toModifier()
                    .fontWeight(FontWeight.Lighter)
            )

            SpanText(
                text = Res.Constants.NAME,
                modifier = NameStyle.toModifier()
            )

            SpanText(
                text = Res.Constants.DESCRIPTION,
                modifier = DescriptionStyle.toModifier()
                    .color(currentPalette.subHeadLine)
            )

            SocialLinksRow(breakpoint)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                ,
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(2.cssRem)
            ) {
                Button(
                    onClick = {
                        ctx.router.navigateTo(Res.Url.RESUME_URL)
                    },
                    size = ButtonSize.LG,
                    modifier = MainButtonStyle.toModifier()
                        .background(currentPalette.buttonBackground)

                ) {
                    SpanText(
                        text = Res.Constants.RESUME,
                        modifier = Modifier
                            .color(currentPalette.buttonText)
                    )
                }
                Button(
                    onClick = {
                        ctx.router.navigateTo(Res.Url.GMAIL_URL)
                    },
                    size = ButtonSize.LG,
                    modifier = MainButtonStyle.toModifier()
                        .background(currentPalette.buttonBackground)

                ) {
                    SpanText(
                        text = Res.Constants.GMAIL,
                        modifier = Modifier
                            .color(currentPalette.buttonText)
                    )
                }
            }
        }
    }
}