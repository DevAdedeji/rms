export const useCalculator = () => {
  const calculateGrade = (score: number) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 40) return "D";
    if (score >= 30) return "D";
    return "F";
  };

  const calculatePoint = (grade: string, units: number) => {
    switch (grade) {
      case "A":
        return 5 * units;
      case "B":
        return 4 * units;
      case "C":
        return 3 * units;
      case "D":
        return 2 * units;
      case "E":
        return 1 * units;
      default:
        return 0;
    }
  };

  const calculateClass = (gpa: number) => {
    if (gpa >= 4.5) return "First Class";
    if (gpa >= 3.5 && gpa < 4.5) return "Second Class Upper";
    if (gpa >= 2.4 && gpa < 3.5) return "Second Class Lower";
    if (gpa >= 1.5 && gpa < 2.4) return "Third Class";
    return "Pass";
  };

  return { calculateGrade, calculatePoint, calculateClass };
};
