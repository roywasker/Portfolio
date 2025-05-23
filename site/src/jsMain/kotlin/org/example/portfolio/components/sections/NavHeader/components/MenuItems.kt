package org.example.portfolio.components.sections.NavHeader.components

import androidx.compose.runtime.Composable

@Composable
fun MenuItems(activeSection: String) {
    NavLink("#home", "Home", activeSection == "home")
    NavLink("#about", "About", activeSection == "about")
    NavLink("#experience", "experience", activeSection == "experience")
    NavLink("#projects", "Projects", activeSection == "projects")
    NavLink("#contact", "Contact", activeSection == "contact")
}