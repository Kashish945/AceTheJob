const calculateATSScore = (resumeText, jobDescription = "") => {
  const resume = (resumeText || "").toLowerCase();
  const jd = (jobDescription || "").toLowerCase();

  const jdWords = jd.split(/\W+/).filter((w) => w.length > 4);
  const uniqueKeywords = [...new Set(jdWords)];

  let matched = 0;
  uniqueKeywords.forEach((word) => {
    if (resume.includes(word)) matched++;
  });

  const keywordScore =
    uniqueKeywords.length > 0 ? (matched / uniqueKeywords.length) * 100 : 50;

  let sectionScore = 0;
  const sections = ["experience", "education", "skills", "projects", "summary"];
  sections.forEach((sec) => {
    if (resume.includes(sec)) sectionScore += 10;
  });

  let lengthScore = 30;
  const wordCount = resume.split(/\s+/).length;
  if (wordCount < 150 || wordCount > 1000) {
    lengthScore = 15;
  }

  let atsScore = Math.round(
    0.5 * keywordScore + 0.3 * sectionScore + 0.2 * lengthScore
  );
  if (atsScore > 100) atsScore = 100;
  if (atsScore < 0) atsScore = 0;

  return atsScore;
};

const isATSFriendly = (score) => score >= 60;

module.exports = { calculateATSScore, isATSFriendly };
