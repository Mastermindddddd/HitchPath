import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

function Education({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <Card>
      <div className="p-5 mt-3">
        <h2 className="font-bold text-lg">🎓 Education</h2>
        <p>Add your educational details</p>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
            <div className="col-span-2">
              <label>Institution Name</label>
              <Input {...register(`education.${index}.universityName`)} />
            </div>
            <div>
              <label>Degree</label>
              <Input {...register(`education.${index}.degree`)} />
            </div>
            <div>
              <label>Major</label>
              <Input {...register(`education.${index}.major`)} />
            </div>
            <div>
              <label>Start Date</label>
              <Input type="date" {...register(`education.${index}.startDate`)} />
            </div>
            <div>
              <label>End Date</label>
              <Input type="date" {...register(`education.${index}.endDate`)} />
            </div>
            <div className="col-span-2">
              <label>Description</label>
              <Textarea {...register(`education.${index}.description`)} />
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-10">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  universityName: "",
                  degree: "",
                  major: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
              className="text-primary"
            >
              + Add More Education
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(fields.length - 1)}
              disabled={fields.length === 1}
              className="text-primary"
            >
              - Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Education;
