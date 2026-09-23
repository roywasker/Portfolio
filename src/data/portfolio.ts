export type Project = {
  title: string;
  label: string;
  description: string;
  stack: string[];
  href: string;
  poster: string;
  accent: string;
  lightAccent: string;
};

export const profile = {
  name: "Roy Wasker",
  role: "Android Engineer",
  currentTitle: "Android Developer",
  company: "Cellcom TV",
  employedSince: "August 2024",
  email: "royx520@gmail.com",
  resume: "https://drive.google.com/file/d/129A9hfTfpxAEefEkL9Yri1fT5SRcUv6g/view?usp=sharing",
  knowsAbout: ["Android", "Kotlin", "Jetpack Compose", "Kotlin Multiplatform", "Spring Boot"],
  socials: [
    { label: "GitHub", href: "https://github.com/roywasker" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/roy-wasker/" },
    { label: "Medium", href: "https://medium.com/@royx520" },
  ],
} as const;

export const navigation = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
] as const;

export const projects: Project[] = [
  {
    title: "Trendy",
    label: "Cross-platform product",
    description:
      "A Kotlin Multiplatform experience built for Android and iOS, with shared product logic and a Compose-first interface.",
    stack: ["Kotlin Multiplatform", "Compose", "iOS"],
    href: "https://github.com/roywasker/Trendy",
    poster: "/images/projects/trendy.avif",
    accent: "#c8ff36",
    lightAccent: "#ffb199",
  },
  {
    title: "Poker App",
    label: "Android application",
    description:
      "A focused game companion that calculates profit and loss, tracks daily sessions and keeps every player’s balance clear.",
    stack: ["Kotlin", "Jetpack Compose", "Coroutines"],
    href: "https://github.com/roywasker/Poker-App",
    poster: "/images/projects/poker-app.avif",
    accent: "#b6a6ff",
    lightAccent: "#b8c7ff",
  },
  {
    title: "YogaTime",
    label: "Mobile experience",
    description:
      "A calm, user-centered Android product for yoga practice, shaped around clear flows, account management and progress.",
    stack: ["Android", "Kotlin", "Firebase"],
    href: "https://github.com/roywasker/YogaTime",
    poster: "/images/projects/yoga-time.avif",
    accent: "#ffad78",
    lightAccent: "#ffd86b",
  },
  {
    title: "Factory Management",
    label: "Backend system",
    description:
      "A backend foundation for factory operations, designed around structured business logic and maintainable services.",
    stack: ["Spring Boot", "Java", "REST API"],
    href: "https://github.com/roywasker/Factory_Management_Backend",
    poster: "/images/projects/factory-management.avif",
    accent: "#76d7ff",
    lightAccent: "#83daca",
  },
  {
    title: "Portfolio",
    label: "Kobweb website",
    description:
      "The original portfolio, built in Kotlin for the web — an exploration of Compose patterns beyond mobile.",
    stack: ["Kotlin", "Kobweb", "Compose HTML"],
    href: "https://github.com/roywasker/Portfolio",
    poster: "/images/projects/portfolio-v1.avif",
    accent: "#ff7a9e",
    lightAccent: "#c9b6ff",
  },
];

export const skillGroups = [
  {
    title: "Android Core",
    number: "01",
    skills: ["Kotlin", "Jetpack Compose", "Android", "Coroutines"],
    angle: "0deg",
    angleReverse: "0deg",
  },
  {
    title: "Multi-platform",
    number: "02",
    skills: ["KMP", "Gradle", "Firebase"],
    angle: "90deg",
    angleReverse: "-90deg",
  },
  {
    title: "Backend",
    number: "03",
    skills: ["Java", "Spring Boot", "REST"],
    angle: "180deg",
    angleReverse: "-180deg",
  },
  {
    title: "Product craft",
    number: "04",
    skills: ["Git", "Figma", "Postman"],
    angle: "270deg",
    angleReverse: "-270deg",
  },
] as const;
