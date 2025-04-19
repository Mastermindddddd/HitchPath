import { Controller } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Brain, LoaderCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from "react";

export default function SummarySection({ control }) {
  const [loading, setLoading] = useState(false);

  const GenerateSummeryFromAI = async (onChange) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Generate a concise and professional resume summary for a general user based on common strengths, achievements, and professionalism.",
        }),
      });

      const data = await res.json();
      onChange(data?.result || "Unable to generate summary.");
    } catch (error) {
      console.error("AI summary error:", error);
      onChange("⚠️ Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-end mb-4'>
        <h3 className="font-semibold text-lg">💼 Professional Summary</h3>
        <Controller
          name="summary"
          control={control}
          render={({ field: { onChange } }) => (
            <Button
              variant="outline"
              onClick={() => GenerateSummeryFromAI(onChange)}
              type="button"
              size="sm"
              disabled={loading}
              className="border-primary text-primary flex gap-2"
            >
              {loading ? <LoaderCircle className='h-4 w-4 animate-spin' /> : <Brain className='h-4 w-4' />}
              {loading ? "Generating..." : "Generate from AI"}
            </Button>
          )}
        />
      </div>

      <Controller
        name="summary"
        control={control}
        render={({ field }) => (
          <Textarea {...field} className="h-28" placeholder="Write a professional summary here..." />
        )}
      />
    </div>
  );
}
