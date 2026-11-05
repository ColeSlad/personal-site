type Experience = {
  company: string;
  role: string;
  date?: string;
  description?: string;
};

export const workExperience: Experience[] = [
  {
    company: "Amazon Leo",
    role: "Software Engineer (Contract)",
    description: "Building 3D satellite visualizations.",
  },
  {
    company: "Visa",
    role: "Software Engineer Intern",
    date: "May – Aug 2026",
    description: "Built an AI researcher to surface $3 million in fraud and counting.",
  },
  {
    company: "MITRE",
    role: "Software Engineer (Contract)",
    date: "Jan – May 2026",
    description: "Built a NIST compliance search platform.",
  },
  {
    company: "Children’s National",
    role: "Software Engineer Intern",
    date: "Sep – Dec 2025",
    description: "Built an AI brain MRI segmentation platform.",
  },
  {
    company: "RU Residence",
    role: "Software Engineer Intern",
    date: "Jun – Aug 2024",
    description: "Built a finance tracking system.",
  },
  {
    company: "Ingredion Idea Lab",
    role: "Machine Learning Research",
    date: "Sep 2023 – Jun 2024",
    description: "Researched CNNs to predict popcorn pop times.",
  },
  {
    company: "Game-U",
    role: "Instructional Intern",
    date: "Jun 2023 – Mar 2024",
    description: "Taught game development and coding.",
  },
];
