package org.example.portfolio.components.sections.About.ui

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.graphics.Colors
import com.varabyte.kobweb.compose.ui.modifiers.color
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxWidth
import com.varabyte.kobweb.compose.ui.modifiers.id
import com.varabyte.kobweb.compose.ui.modifiers.lineHeight
import com.varabyte.kobweb.compose.ui.modifiers.margin
import com.varabyte.kobweb.silk.components.graphics.Image
import com.varabyte.kobweb.silk.components.layout.SimpleGrid
import com.varabyte.kobweb.silk.components.layout.numColumns
import com.varabyte.kobweb.silk.components.text.SpanText
import com.varabyte.kobweb.silk.style.toModifier
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.sections.About.style.AboutDiscriptionStyle
import org.example.portfolio.components.sections.About.style.AboutStyle
import org.example.portfolio.components.sections.About.style.SkillItemImageVariant
import org.example.portfolio.components.sections.About.style.SkillsGridStyle
import org.example.portfolio.components.skill.Skill
import org.example.portfolio.components.styles.SkillTextStyle
import org.example.portfolio.components.utils.Res
import org.example.portfolio.components.widgets.SectionTitle
import org.jetbrains.compose.web.css.cssRem

@Composable
fun About() {
    Column(
        modifier = AboutStyle.toModifier().id("about"),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ){

        SectionTitle(Res.Title.ABOUT)

        SpanText(
            text = Res.Constants.ABOUT,
            modifier = AboutDiscriptionStyle.toModifier()
                .color(
                    when (ColorMode.current) {
                        ColorMode.LIGHT -> Colors.Gray
                        ColorMode.DARK -> Colors.LightGray
                    }
                )
                .lineHeight(2)
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            SimpleGrid(
                modifier = SkillsGridStyle.toModifier()
                ,
                numColumns = numColumns(base = 2, md = 5, lg = 5)
            ) {
                Skill.entries.forEach { skill ->
                    SkillItem(
                        skill = skill,
                    )
                }
            }
        }
    }
}


@Composable
fun SkillItem(
    skill: Skill,
    colorMode: ColorMode = ColorMode.current,
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
) {
    Row(
        modifier = modifier,
        horizontalArrangement = horizontalArrangement,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            src = if (colorMode.isLight) skill.iconResLight else skill.iconResDark,
            variant = SkillItemImageVariant,
        )
        Column(
            modifier = Modifier.margin(left = 0.75.cssRem),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.SpaceBetween
        ) {

            SpanText(
                text = skill.skillName,
                modifier = SkillTextStyle.toModifier()
            )
        }
    }
}