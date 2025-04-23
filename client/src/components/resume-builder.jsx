import { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Download, Loader2 } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "../AuthContext"; 
import SummarySection from "./ResumeComponents/SummarySection";

// UI components (replace with your own if needed)
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

// Custom functions
import { entriesToMarkdown } from "./helper";

// Forms
import ExperienceSection from "./ResumeComponents/ExperienceSection";
import Education from "./ResumeComponents/EducationSection";
import Skills from "./ResumeComponents/SkillsSection";
import Projects from "./ResumeComponents/ProjectsSection";
import Certification from "./ResumeComponents/Certification";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useContext(AuthContext);


  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
      certifications: []
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent || initialContent);
    }
  }, [formValues, activeTab]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const name = user?.name || "Your Name";
    const jobTitle = contactInfo?.jobTitle || "";
    const address = contactInfo?.location || "";
  
    const mobile = contactInfo?.mobile ? `📞 ${contactInfo.mobile}` : "";
    const email = contactInfo?.email ? `✉️ ${contactInfo.email}` : "";
  
    const contactLine =
      email && mobile
        ? `${email} | ${mobile}`
        : email || mobile;
  
    const links = [];
  
    // Use a small PNG icon for LinkedIn
    if (contactInfo.linkedin) {
      links.push(
        `<img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="16" style="vertical-align: middle;" /> ${contactInfo.linkedin}`
      );
    }
  
    if (contactInfo.portfolio) {
      links.push(`🌐 ${contactInfo.portfolio}`);
    }
  
    return `
  # <div align="center"><strong>${name}</strong></div>
  
  ${jobTitle ? `<div align="center"><em>${jobTitle}</em></div>` : ""}
  
  ${address ? `<div align="center">${address}</div>` : ""}
  
  ${contactLine ? `<div align="center">${contactLine}</div>` : ""}
  
  ${
    links.length > 0
      ? `<div align="center">${links.join(" &nbsp;&nbsp;•&nbsp;&nbsp; ")}</div>`
      : ""
  }
  
  ---
  `.trim();
  };
  
  
  const getSkillsMarkdown = () => {
    const skills = formValues.skills;
    if (!skills || skills.length === 0) return "";
  
    const stars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
  
    return `
  ## 🛠️ Skills
  
  <div style="column-count: 2; column-gap: 40px;">
  
  ${skills
    .map(
      (skill) =>
        `<p><strong>- ${skill.name}</strong>: ${stars(skill.rating || 0)}</p>`
    )
    .join("")}
  
  </div>
    `.trim();
  };
  
  

  function generateEducationMarkdown(educationArray) {
    if (!educationArray || educationArray.length === 0) return "";
  
    return `## 🎓 Education\n\n${educationArray
      .map((edu) => {
        const university = edu.universityName || "University Name";
        const degree = edu.degree || "Degree";
        const major = edu.major || "Major";
        const start = edu.startDate || "Start Date";
        const end = edu.endDate || "End Date";
        const description = edu.description || "";
  
        return `### ${university}
  ***${degree} in ${major} -*** 
  ${start} – ${end}\n
  ${description}`;
      })
      .join("\n\n")}`;
  }
  

  const generateProjectsMarkdown = (projectsArray) => {
    if (!projectsArray || projectsArray.length === 0) return "";
  
    return `## 📂 Projects & Initiatives\n\n${projectsArray
      .map((project) => {
        const title = project.title || "Project Title";
        const organization = project.organization || "Organization";
        const start = project.startDate || "Start Date";
        const end = project.endDate || "End Date";
        const description = project.description || "";
  
        return `### ${title}\n**${organization}**\n${start} – ${end}\n${description}`;
      })
      .join("\n\n")}`;
  };

  const generateCertificationsMarkdown = (certs) => {
    if (!certs || certs.length === 0) return "";
  
    return `## 📜 Certifications\n\n${certs
      .map((cert) => {
        const name = cert.name || "Certification";
        const issuer = cert.issuer || "Issuer";
        const issueDate = cert.issueDate || "";
        const expiryDate = cert.expiryDate ? ` – ${cert.expiryDate}` : "";
        const description = cert.description || "";
  
        return `### ${name}\n**${issuer}**\n${issueDate}${expiryDate}\n${description}`.trim();
      })
      .join("\n\n")}`;
  };  
  
  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects, certifications } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      getSkillsMarkdown(),
      entriesToMarkdown(experience, "👔 Work Experience"),
      generateEducationMarkdown(education),
      generateProjectsMarkdown(projects),
      generateCertificationsMarkdown(certifications),
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");
  };
  
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      setActiveTab("preview");
  
      await new Promise((resolve) => setTimeout(resolve, 300));
  
      const element = document.getElementById("resume-pdf");
      if (!element) throw new Error("Resume content not found for PDF generation.");
  
      // Inject clean PDF styles
      const styleTag = document.createElement("style");
      styleTag.innerHTML = `
        #resume-pdf {
          font-family: 'Georgia', serif;
          background-color: white !important;
          color: black !important;
          padding: 32px;
          line-height: 1.6;
        }

        body {
        background: white !important;
        }

        #resume-pdf h1, #resume-pdf h2, #resume-pdf h3 {
          color: #333;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
        }
  
        #resume-pdf h1 {
          font-size: 24px;
        }
  z
        #resume-pdf h2 {
          font-size: 20px;
        }
  
        #resume-pdf h3 {
          font-size: 16px;
        }
  
        #resume-pdf p, #resume-pdf li {
          font-size: 14px;
        }
  
        #resume-pdf ul {
          padding-left: 20px;
        }
  
        #resume-pdf hr {
          border-top: 1px solid #ddd;
          margin: 24px 0;
        }
  
        #resume-pdf a {
          color: #0046be;
          text-decoration: none;
        }
  
        #resume-pdf a:hover {
          text-decoration: underline;
        }
      `;
      document.head.appendChild(styleTag);
  
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff", // 👈 Critical
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      await html2pdf().set(opt).from(element).save();
  
      // Clean up
      document.head.removeChild(styleTag);
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("You must be logged in to save your resume.");
      setIsSaving(false);
      return;
    }
  
    try {
      const formattedContent = getCombinedContent();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/save-resume`,
        { ...data, content: formattedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };  

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold text-4xl md:text-5xl">Resume Builder</h1>
        <div className="space-x-2">
          <Button onClick={() => handleSubmit(onSubmit)()} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            {isGenerating ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
  {/* Contact Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input {...register("contactInfo.email")} placeholder="Email" />
    <Input {...register("contactInfo.mobile")} placeholder="Mobile" />
    <Input {...register("contactInfo.linkedin")} placeholder="LinkedIn" />
    {/*<Input {...register("contactInfo.twitter")} placeholder="Twitter" />*/}
    <Input {...register("contactInfo.portfolio")} placeholder="Portfolio (optional)" />
    <Input {...register("contactInfo.location")} placeholder="Location (e.g. Cape Town, South Africa)" />
  </div>

  {/* Summary */}
  <SummarySection control={control} />


  {/* Skills */}
  <Skills control={control} register={register} />

  {/* Work Experience */}
  <ExperienceSection control={control} register={register} />

  {/* Education */}
  <Education control={control} register={register} />


  {/* Projects */}
  <Projects control={control} register={register} />


  {/* Certifications */}
  <Certification onChange={(certData) => setValue("certifications", certData)} />

</form>

        </TabsContent>

        <TabsContent value="preview">
        <div
          id="resume-pdf"
          className="prose max-w-none p-6 bg-white rounded-md shadow-md print:shadow-none print:bg-white print:p-0"
          style={{ backgroundColor: "white" }} // ✅ Inline style fallback
        >
          <MDEditor.Markdown 
            source={previewContent}
            style={{
              background: "white",
              color: "black",
            }} />
        </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
