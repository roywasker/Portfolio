package org.example.portfolio.components.skill

import org.example.portfolio.components.utils.Res

enum class Skill(
    val skillName: String,
    val iconResLight: String,
    val iconResDark: String,
) {
    AndroidStudio(
        skillName = "Android Studio",
        iconResLight = Res.Images.ANDROID_STUDIO_DARK_LOGO,
        iconResDark = Res.Images.ANDROID_STUDIO_LIGHT_LOGO,
    ),
    IntellijIdea(
        skillName = "IntelliJ IDEA",
        iconResLight = Res.Images.INTELLIJ_IDEA_LOGO,
        iconResDark = Res.Images.INTELLIJ_IDEA_LOGO,
    ),

    Kotlin(
        skillName = "Kotlin",
        iconResLight = Res.Images.KOTLIN_LOGO,
        iconResDark = Res.Images.KOTLIN_LOGO,
    ),

    Java(
        skillName = "Java",
        iconResLight = Res.Images.JAVA_LOGO,
        iconResDark = Res.Images.JAVA_LOGO,
    ),

    CPP(
        skillName = "C++",
        iconResLight = Res.Images.CPP_LOGO,
        iconResDark = Res.Images.CPP_LOGO,
    ),

    Compose(
        skillName = "Compose",
        iconResLight = Res.Images.COMPOSE_LOGO,
        iconResDark = Res.Images.COMPOSE_LOGO,
    ),

    SpringBoot(
        skillName = "Spring Boot",
        iconResLight = Res.Images.SPRINGBOOT_LOGO,
        iconResDark = Res.Images.SPRINGBOOT_LOGO,
    ),

    Jetpack(
        skillName = "Jetpack",
        iconResLight = Res.Images.JETPACK_DARK_LOGO,
        iconResDark = Res.Images.JETPACK_LIGHT_LOGO,
    ),

    Firebase(
        skillName = "Firebase",
        iconResLight = Res.Images.FIREBASE_LOGO,
        iconResDark = Res.Images.FIREBASE_LOGO,
    ),

    Github(
        skillName = "GitHub",
        iconResLight = Res.Images.GITHUB_DARK_LOGO,
        iconResDark = Res.Images.GITHUB_LIGHT_LOGO,
    ),

    Gradle(
        skillName = "Gradle",
        iconResLight = Res.Images.GRADLE_DARK_LOGO,
        iconResDark = Res.Images.GRADLE_LIGHT_LOGO,
    ),

    Git(
        skillName = "Git",
        iconResLight = Res.Images.GIT_LOGO,
        iconResDark = Res.Images.GIT_LOGO,
    ),

    Figma(
        skillName = "Figma",
        iconResLight = Res.Images.FIGMA_LOGO,
        iconResDark = Res.Images.FIGMA_LOGO,
    ),

    Python(
        skillName = "Python",
        iconResLight = Res.Images.PYTHON_LOGO,
        iconResDark = Res.Images.PYTHON_LOGO,
    ),

    Postman(
        skillName = "Postman",
        iconResLight = Res.Images.POSTMAM,
        iconResDark = Res.Images.POSTMAM,
    ),
}