import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import React, { useState } from 'react';

function Projects() {
  const [projectList, setProjectList] = useState([
    {
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProjects = [...projectList];
    updatedProjects[index][name] = value;
    setProjectList(updatedProjects);
  };

  const addNewProject = () => {
    setProjectList([
      ...projectList,
      {
        title: '',
        organization: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const removeProject = () => {
    setProjectList((prevList) => prevList.slice(0, -1));
  };

  return (
    <Card>
      <div className="p-5 mt-10">
        <h2 className="font-bold text-lg">Projects / Initiatives</h2>
        <p>Include relevant projects, campaigns, or initiatives you've been part of.</p>

        <div>
          {projectList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div className="col-span-2">
                  <label>Title</label>
                  <Input
                    name="title"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.title}
                  />
                </div>
                <div className="col-span-2">
                  <label>Organization / Affiliation</label>
                  <Input
                    name="organization"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.organization}
                  />
                </div>
                <div>
                  <label>Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.startDate}
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.endDate}
                  />
                </div>
                <div className="col-span-2">
                  <label>Description</label>
                  <Textarea
                    name="description"
                    onChange={(e) => handleChange(e, index)}
                    defaultValue={item?.description}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={addNewProject} className="text-primary">
              + Add More Projects
            </Button>
            <Button variant="outline" onClick={removeProject} className="text-primary">
              - Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Projects;
