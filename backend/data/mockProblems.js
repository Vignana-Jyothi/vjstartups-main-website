const mockProblems = [
  {
    problemId: "problem-001",
    title: "Campus Environmental Impact & Sustainability Awareness",
    description: "Students and faculty lack visibility into their environmental impact on campus, making it difficult to adopt sustainable practices and reduce carbon footprint.",
    category: "Environment",
    severity: "High",
    affectedUsers: 15000,
    location: "University Campus",
    tags: ["sustainability", "environment", "awareness", "carbon-footprint"],
    createdAt: new Date("2024-01-01T00:00:00Z")
  },
  {
    problemId: "problem-002", 
    title: "Ineffective Study Methods & Poor Academic Performance",
    description: "Many students struggle with inefficient study techniques, lack of personalized learning approaches, and difficulty tracking their academic progress effectively.",
    category: "Education",
    severity: "High", 
    affectedUsers: 25000,
    location: "University Campus",
    tags: ["education", "study-methods", "academic-performance", "personalization"],
    createdAt: new Date("2024-01-02T00:00:00Z")
  }
];

module.exports = mockProblems;
