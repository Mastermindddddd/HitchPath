export function entriesToMarkdown(entries, sectionTitle) {
  if (!entries || entries.length === 0) return "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return `## ${sectionTitle}\n\n${entries
    .map((entry) => {
      const {
        title,
        companyName,
        city,
        state,
        startDate,
        endDate,
        workSummery,
      } = entry;

      return `### ${title || "Job Title"} — *${companyName || "Company"}*\n` +
        `${formatDate(startDate)} – ${formatDate(endDate)} | ${city || ""}${
          state ? `, ${state}` : ""
        }\n\n` +
        `${workSummery || ""}\n`;
    })
    .join("\n---\n\n")}`;
}
