// components/sections/SummarySection.jsx
import { Controller } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Brain, LoaderCircle } from 'lucide-react';
import { Button } from '../ui/button';

export default function SummarySection({ control }) {
  const GenerateSummeryFromAI=async()=>{
    
  }

  return (
    <div>
      <div className='flex justify-between items-end mb-4'>
        <h3 className="font-semibold text-lg">💼 Professional Summary</h3>
        <Button variant="outline" onClick={()=>GenerateSummeryFromAI()} 
        type="button" size="sm" className="border-primary text-primary flex gap-2"> 
        <Brain className='h-4 w-4' />  Generate from AI</Button>
      </div>
      <Controller
        name="summary"
        control={control}
        render={({ field }) => <Textarea {...field} className="h-28" />}
      />
    </div>
  );
}
