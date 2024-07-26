export type SiteConfig = typeof siteConfig;
export const AppHost =
  process.env.NEXT_PUBLIC_HOST || "https://subtitlesinreal.life";
export const AppHostDomain =
  process.env.NEXT_PUBLIC_HOST_DOMAIN || "subtitlesinreal.life";

export const siteConfig = {
  name: "SubsIRL - Subtitles in Real Life",
  twitterHandle: "@s_r_x_9",
  description:
    "SubsIRL turns real life into a movie with live subtitles! Our easy-to-use app adds captions to everyday conversations, making life more accessible and fun for everyone. Perfect for learning languages, helping with hearing difficulties, or just adding a cool twist to your day.",
  ogImage: `${AppHost}/subsirl-banner.png`,
  url: AppHost,
  contact: {
    name: "Get in Touch",
    description: `Questions? Ideas? We're all ears! Reach out to the SubsIRL team.`,
    keywords: [
      "SubsIRL help",
      "Contact SubsIRL",
      "SubsIRL support",
      "Live subtitles help",
      "Real-time captions support",
    ],
  },
  aboutHome: {
    name: "About Us",
    description: `At SubsIRL, we're bringing movie magic to real life! Our smart app adds live subtitles to your world, making every conversation clearer and more fun. Whether you're learning a new language, need hearing support, or just love captions, SubsIRL is here to make your day easier and more exciting.`,
    keywords: [
      "Live subtitles app",
      "Real-time captions",
      "SubsIRL features",
      "Subtitle everything",
      "Accessibility tool",
      "Language learning app",
    ],
  },
  login: {
    name: "Start Subtitling",
    description:
      "Jump into a world with subtitles - log in and let the show begin!",
    keywords: [
      "SubsIRL login",
      "Start live subtitles",
      "Begin real-time captions",
      "Access SubsIRL",
    ],
  },
};
