package org.example.protolio.components.sections.Experience.ui

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.graphics.Colors
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.id
import com.varabyte.kobweb.compose.ui.modifiers.lineHeight
import com.varabyte.kobweb.compose.ui.modifiers.margin
import com.varabyte.kobweb.silk.components.layout.SimpleGrid
import com.varabyte.kobweb.silk.components.layout.numColumns
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.protolio.components.sections.Experience.styles.ExperienceStyle
import org.example.protolio.components.sections.Experience.styles.WorkExperienceStyle
import org.example.protolio.components.utils.Res
import org.example.protolio.components.utils.getAllWorkExperience
import org.example.protolio.components.widgets.SectionTitle
import org.example.protolio.components.widgets.WorkExperienceBlock
import org.jetbrains.compose.web.css.cssRem

@Composable
fun Experience() {

    Column(
        modifier = ExperienceStyle.toModifier().id("experience"),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        SectionTitle(Res.Title.EXPERIENCE)

        SpanText(
            text = Res.Constants.WORK_EXPERIENCE,
            modifier = WorkExperienceStyle.toModifier()
                .color(
                    when (ColorMode.current) {
                        ColorMode.LIGHT -> Colors.Gray
                        ColorMode.DARK -> Colors.LightGray
                    }
                )
                .lineHeight(2)
        )

        SimpleGrid(
            numColumns = numColumns(base = 1, md = 1),
            modifier = Modifier.margin(topBottom = 2.cssRem)
        ) {
            val workExperiences = getAllWorkExperience()

            for (workExperience in workExperiences) {
                WorkExperienceBlock(workExperience = workExperience)
            }
        }
    }
}