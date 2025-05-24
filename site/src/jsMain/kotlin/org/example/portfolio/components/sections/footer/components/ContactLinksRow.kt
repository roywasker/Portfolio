package org.example.portfolio.components.sections.footer.components

import androidx.compose.runtime.Composable
import com.varabyte.kobweb.compose.foundation.layout.Arrangement
import com.varabyte.kobweb.compose.foundation.layout.Row
import com.varabyte.kobweb.compose.ui.Alignment
import com.varabyte.kobweb.silk.components.icons.fa.*
import org.example.portfolio.components.sections.Home.components.SocialLinkButton
import org.example.portfolio.components.utils.Res
import org.jetbrains.compose.web.css.cssRem

@Composable
fun ContactLinksRow(
    displayEmail: Boolean = false
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(1.cssRem),
        verticalAlignment = Alignment.CenterVertically,
    ) {

        if (displayEmail) {
            SocialLinkButton(
                Res.Url.GMAIL_URL
            ) { FaEnvelope(size = IconSize.XXL) }
        }

        SocialLinkButton(
            Res.Url.LINKEDIN_URL
        ) { FaLinkedinIn(size = IconSize.XXL) }

        SocialLinkButton(
            Res.Url.GITHUB_URL
        ) { FaGithub(size = IconSize.XXL) }

        SocialLinkButton(
            Res.Url.MEDIUM_URL
        ) { FaMedium(size = IconSize.XXL) }
    }
}