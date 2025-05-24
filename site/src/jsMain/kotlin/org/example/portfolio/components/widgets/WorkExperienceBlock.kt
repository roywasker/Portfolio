package org.example.portfolio.components.widgets

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.css.FontWeight
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Box
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.graphics.Colors
import com.varabyte.kobweb.compose.ui.modifiers.*
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.sections.Experience.styles.WorkExperienceItemOrgStyle
import org.example.portfolio.components.sections.Experience.styles.WorkExperienceItemRoleAndDurationStyle
import org.example.portfolio.components.utils.WorkExperience
import org.jetbrains.compose.web.css.LineStyle
import org.jetbrains.compose.web.css.cssRem
import org.jetbrains.compose.web.css.px

@Composable
fun WorkExperienceBlock(
    modifier: Modifier = Modifier,
    workExperience: WorkExperience
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.fillMaxWidth().padding(leftRight = 0.5.cssRem).fontFamily("lexend").margin(leftRight = 0.5.cssRem).then(modifier)
    ) {

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(leftRight = 0.5.cssRem)
                .border(
                    width = 1.px, style = LineStyle.Solid, color = when (ColorMode.current) {
                        ColorMode.LIGHT -> Colors.Gray
                        ColorMode.DARK -> Colors.DimGray
                    }
                )
                .borderRadius(10.px)
                .margin(top = 2.cssRem)
                .padding(top = 30.px, bottom = 24.px, leftRight = 24.px),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.Start
        ) {
            SpanText(
                text = workExperience.role,
                modifier = WorkExperienceItemRoleAndDurationStyle.toModifier()
                    .fillMaxWidth()
                    .color(
                        when (ColorMode.current) {
                            ColorMode.LIGHT -> Colors.Gray
                            ColorMode.DARK -> Colors.DimGray
                        }
                    )
                    .fontWeight(FontWeight.Bold)
            )
            SpanText(
                text = workExperience.organization,
                modifier = WorkExperienceItemOrgStyle.toModifier()
                    .fillMaxWidth()
                    .color(
                        when (ColorMode.current) {
                            ColorMode.LIGHT -> Colors.Black
                            ColorMode.DARK -> Colors.White
                        }
                    )
                    .fontFamily("lexend")
                    .fontWeight(FontWeight.Bold)
            )
            SpanText(
                text = workExperience.duration,
                modifier = WorkExperienceItemRoleAndDurationStyle.toModifier()
                    .fillMaxWidth()
                    .color(
                        when (ColorMode.current) {
                            ColorMode.LIGHT -> Colors.Gray
                            ColorMode.DARK -> Colors.DimGray
                        }
                    )
                    .fontWeight(FontWeight.Bold)
            )
        }

        SpanText(
            text = workExperience.sequenceNumber,
            modifier = Modifier.fontSize(3.cssRem)
                .color(
                    when (ColorMode.current) {
                        ColorMode.LIGHT -> Colors.Black
                        ColorMode.DARK -> Colors.White
                    }
                )
                .margin(left = 2.cssRem)
                .align(Alignment.TopStart)
                .fontWeight(FontWeight.Bold)
                .fontFamily("lexend")
        )
    }
}