import { Input } from '../ui/input';
import React from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useFieldArray, Controller } from 'react-hook-form';

function Skills({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  return (
    <Card>
      <div className="p-5 mt-3">
        <h2 className="font-bold text-lg">Skills</h2>
        <p>Add your top professional key skills</p>

        <div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center mb-2 border rounded-lg p-3 mt-6"
            >
              <div className="mr-3 mb-4">
                <label className="text-xs">Skill</label>
                <Input
                  {...register(`skills.${index}.name`)}
                  className="w-full"
                />
              </div>
              <Controller
                control={control}
                name={`skills.${index}.rating`}
                render={({ field }) => (
                  <Rating
                    style={{ maxWidth: 120 }}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: '', rating: 0 })}
              className="text-primary"
            >
              + Add More Skill
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

export default Skills;
