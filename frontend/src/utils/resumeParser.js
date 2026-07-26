
export const extractResumeData = (resumeText) => {
    if (!resumeText) return { skills: [], education: [] };

    // Simple heuristic to extract sections
    // This is NOT perfect but serves as a fallback since backend doesn't return them
    const lines = resumeText.split('\n');
    let section = '';
    const skills = [];
    const education = [];

    lines.forEach((line) => {
        const lower = line.toLowerCase().trim();
        if (lower.includes('skill') || lower.includes('technologies')) {
            section = 'skills';
        } else if (lower.includes('education') || lower.includes('academic')) {
            section = 'education';
        } else if (
            lower.includes('experience') ||
            lower.includes('project') ||
            lower.includes('can')
        ) {
            // Switch out of section if we hit another main header
            if (section === 'skills' || section === 'education') section = '';
        }

        if (section === 'skills' && line.trim().length > 3 && !lower.includes('skill')) {
            // Extract comma separated or bullet points
            const items = line.split(/[,•|]/).filter((s) => s.trim().length > 2);
            skills.push(...items.map((s) => s.trim()));
        } else if (section === 'education' && line.trim().length > 10 && !lower.includes('education')) {
            education.push(line.trim());
        }
    });

    // Deduplicate and limit
    return {
        skills: [...new Set(skills)].slice(0, 15),
        education: [...new Set(education)].slice(0, 4),
    };
};
