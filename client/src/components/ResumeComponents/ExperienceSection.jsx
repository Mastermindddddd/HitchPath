import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import RichTextEditor from '../RichTextEditor';

export default function ExperienceSection({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  return (
    <Card>
      <div className='p-5 mt-3'>
        <h3 className="font-semibold text-lg">Professional Experience</h3>
        <p>Add your previous job experience</p>

        {fields.map((field, index) => (
          <div key={field.id} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label className='text-xs'>Position Title</label>
              <Input {...register(`experience.${index}.title`)} />
            </div>
            <div>
              <label className='text-xs'>Company Name</label>
              <Input {...register(`experience.${index}.companyName`)} />
            </div>
            <div>
              <label className='text-xs'>City</label>
              <Input {...register(`experience.${index}.city`)} />
            </div>
            <div>
              <label className='text-xs'>State</label>
              <Input {...register(`experience.${index}.state`)} />
            </div>
            <div>
              <label className='text-xs'>Start Date</label>
              <Input type="date" {...register(`experience.${index}.startDate`)} />
            </div>
            <div>
              <label className='text-xs'>End Date</label>
              <Input type="date" {...register(`experience.${index}.endDate`)} />
            </div>
            <div className='col-span-2'>
              <label className="text-xs">Work Summary</label>
              <Controller
                control={control}
                name={`experience.${index}.workSummery`}
                render={({ field }) => (
                  <RichTextEditor
                    index={index}
                    defaultValue={field.value}
                    onRichTextEditorChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        ))}

        <div className='flex justify-between mt-10'>
          <div className='flex gap-2'>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  title: '',
                  companyName: '',
                  city: '',
                  state: '',
                  startDate: '',
                  endDate: '',
                  workSummery: ''
                })
              }
              className="text-primary"
            >
              + Add More Experience
            </Button>
          </div>
          <div>
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
