package org.example.portfolio.components.utils


data class WorkExperience(
    val sequenceNumber: String,
    val role: String,
    val organization: String,
    val duration: String
)

fun getAllWorkExperience() = listOf(
    WorkExperience(
        sequenceNumber = "01",
        role = "Android Developer",
        organization = "Cellcom TV",
        duration = "August 24 - Present"
    )
)