package org.example.portfolio.components.layouts

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import com.varabyte.kobweb.compose.css.PointerEvents
import com.varabyte.kobweb.compose.foundation.layout.Box
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxSize
import com.varabyte.kobweb.compose.ui.modifiers.minWidth
import com.varabyte.kobweb.compose.ui.modifiers.pointerEvents
import com.varabyte.kobweb.compose.ui.modifiers.position
import com.varabyte.kobweb.compose.ui.modifiers.width
import com.varabyte.kobweb.compose.ui.styleModifier
import kotlinx.browser.document
import org.example.portfolio.components.sections.NavHeader.ui.NavHeader
import org.example.portfolio.components.utils.Res
import org.example.portfolio.components.widgets.AppearanceAwareImage
import org.example.portfolio.components.widgets.BackToTopButton
import org.jetbrains.compose.web.css.Position
import org.jetbrains.compose.web.ExperimentalComposeWebApi
import org.jetbrains.compose.web.css.percent
import org.jetbrains.compose.web.css.vw


@Composable
fun PageLayout(
    title: String,
    content: @Composable () -> Unit,
) {

    LaunchedEffect(title) {
        document.title = title
    }

    Box(Modifier.fillMaxSize()
        .position(position = Position.Relative)
    ) {

        SVGBackroundCircle(Modifier.align(Alignment.TopEnd).pointerEvents(PointerEvents.None).width(40.percent)
            .minWidth(50.vw).styleModifier { property("height", "auto") })

        Column(Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally)
        {
            NavHeader()
            content()
            //footer
        }
        BackToTopButton()
    }
}

@OptIn(ExperimentalComposeWebApi::class)
@Composable
fun SVGBackroundCircle(modifier: Modifier) {
    AppearanceAwareImage(
        src = Res.Images.BACKGROUND_CIRCLES,
        modifier = modifier
    )
}