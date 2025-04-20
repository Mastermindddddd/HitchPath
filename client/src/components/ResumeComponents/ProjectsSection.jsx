import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { useFieldArray } from 'react-hook-form';

function Projects({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  return (
    <Card>
      <div className="p-5 mt-3">
        <h2 className="font-bold text-lg">Projects / Initiatives</h2>
        <p>Include relevant projects, campaigns, or initiatives you've been part of.</p>

        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>Title</label>
                <Input {...register(`projects.${index}.title`)} />
              </div>
              <div className="col-span-2">
                <label>Organization / Affiliation</label>
                <Input {...register(`projects.${index}.organization`)} />
              </div>
              <div>
                <label>Start Date</label>
                <Input type="date" {...register(`projects.${index}.startDate`)} />
              </div>
              <div>
                <label>End Date</label>
                <Input type="date" {...register(`projects.${index}.endDate`)} />
              </div>
              <div className="col-span-2">
                <label>Description</label>
                <Textarea {...register(`projects.${index}.description`)} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  title: '',
                  organization: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                })
              }
              className="text-primary"
            >
              + Add More Projects
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

export default Projects;
