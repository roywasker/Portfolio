package org.example.portfolio.pages

import androidx.compose.runtime.*
import com.varabyte.kobweb.compose.foundation.layout.Column
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.compose.ui.Modifier
import com.varabyte.kobweb.compose.ui.modifiers.fillMaxSize
import com.varabyte.kobweb.core.Page
import com.varabyte.kobweb.silk.theme.colors.ColorMode
import org.example.portfolio.components.layouts.PageLayout
import org.example.portfolio.components.sections.Home.ui.Home
import org.example.portfolio.components.sections.About.ui.About
import org.example.portfolio.components.sections.Experience.ui.Experience
import org.example.portfolio.components.sections.Project.ui.Projects
import org.example.portfolio.components.sections.footer.ui.Footer
import org.example.portfolio.toSitePalette

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

            Projects()

            Footer()
        }
    }
}
