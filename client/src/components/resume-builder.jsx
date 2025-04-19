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
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

// Custom functions
import { entriesToMarkdown } from "./helper";

// Forms
import EntryForm from "./entry-form";
import ExperienceSection from "./ResumeComponents/ExperienceSection";
import Education from "./ResumeComponents/EducationSection";
import Skills from "./ResumeComponents/SkillsSection";
import Projects from "./ResumeComponents/ProjectsSection";
import Certification from "./ResumeComponents/Certification";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [resumeMode, setResumeMode] = useState("preview");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);


  const {
    control,
    register,
    handleSubmit,
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
    const parts = [];
  
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);
    if (contactInfo.portfolio) parts.push(`🌐 [Portfolio](${contactInfo.portfolio})`);
    if (contactInfo.location) parts.push(`📍 ${contactInfo.location}`);
  
    return parts.length > 0
      ? `# ${user?.name || "Your Name"}\n\n${parts.join("  \n")}`
      : "";
  };
  
  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects, certifications } = formValues;
    return [
      getContactMarkdown(),
      summary && `## 💼 Professional Summary\n\n${summary}`,
      skills && `## 🛠️ Skills\n\n${skills}`,
      entriesToMarkdown(experience, "👔 Work Experience"),
      entriesToMarkdown(education, "🎓 Education"),
      entriesToMarkdown(projects, "📂 Projects"),
      entriesToMarkdown(certifications, "📜 Certifications"),
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");
  };
  
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      setActiveTab("preview");
  
      // Wait for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 200));
  
      const element = document.getElementById("resume-pdf");
      if (!element) throw new Error("Resume content not found for PDF generation.");
  
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      await html2pdf().set(opt).from(element).save();
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
    <Input {...register("contactInfo.twitter")} placeholder="Twitter" />
    <Input {...register("contactInfo.portfolio")} placeholder="Portfolio (optional)" />
    <Input {...register("contactInfo.location")} placeholder="Location (e.g. Cape Town, South Africa)" />
  </div>

  {/* Summary */}
  <SummarySection control={control} />


  {/* Skills */}
  <Skills control={control}/>

  {/* Work Experience */}
  <ExperienceSection />

  {/* Education */}
  <Education />

  {/* Projects */}
  <Projects />

  {/* Certifications */}
  <Certification />
</form>

        </TabsContent>

        <TabsContent value="preview">
        <div
          id="resume-pdf"
          className="prose max-w-none p-6 bg-white rounded-md shadow-md print:shadow-none print:bg-white print:p-0">
            <MDEditor.Markdown source={previewContent} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
