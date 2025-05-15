package org.example.protolio.pages

import androidx.compose.runtime.*
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxSize
import com.varabyte.kobweb.core.Page
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.protolio.components.layouts.PageLayout
import org.example.protolio.components.sections.Home.ui.Home
import org.example.protolio.components.sections.About.ui.About
import org.example.protolio.components.sections.Experience.ui.Experience
import org.example.protolio.toSitePalette

@Page
@Composable
fun HomePage() {

    PageLayout("Roy Wasker") {
        Column (
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ){
            val currentPalette = ColorMode.current.toSitePalette()
            Home(currentPalette)

            About()

            Experience()
        }
    }
}
