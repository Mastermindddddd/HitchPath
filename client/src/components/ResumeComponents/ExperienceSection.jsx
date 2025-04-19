// components/sections/ExperienceSection.jsx
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import RichTextEditor from '../RichTextEditor';
import { LoaderCircle } from 'lucide-react';

const formField = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummery: ''
}

export default function ExperienceSection({ control, onChange, defaultValue = [] }) {
  const [experienceList, setExperienceList] = useState(defaultValue || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onChange && onChange(experienceList)
  }, [experienceList])

  const handleChange = (index, event) => {
    const updated = [...experienceList]
    const { name, value } = event.target
    updated[index][name] = value
    setExperienceList(updated)
  }

  const handleRichTextEditor = (e, name, index) => {
    const updated = [...experienceList]
    updated[index][name] = e.target.value
    setExperienceList(updated)
  }

  const addExperience = () => {
    setExperienceList([...experienceList, { ...formField }])
  }

  const removeExperience = () => {
    setExperienceList(experienceList.slice(0, -1))
  }

  const onSave = () => {
    setLoading(true)
    setTimeout(() => {
      console.log("Saved Experience:", experienceList)
      setLoading(false)
    }, 1000)
  }

  return (
    <Card>
    <div className='p-5 mt-2'>
      <h3 className="font-semibold text-lg">Professional Experience</h3>
      <p>Add your previous job experience</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label className='text-xs'>Position Title</label>
              <Input name="title" onChange={(e) => handleChange(index, e)} value={item.title} />
            </div>
            <div>
              <label className='text-xs'>Company Name</label>
              <Input name="companyName" onChange={(e) => handleChange(index, e)} value={item.companyName} />
            </div>
            <div>
              <label className='text-xs'>City</label>
              <Input name="city" onChange={(e) => handleChange(index, e)} value={item.city} />
            </div>
            <div>
              <label className='text-xs'>State</label>
              <Input name="state" onChange={(e) => handleChange(index, e)} value={item.state} />
            </div>
            <div>
              <label className='text-xs'>Start Date</label>
              <Input type="date" name="startDate" onChange={(e) => handleChange(index, e)} value={item.startDate} />
            </div>
            <div>
              <label className='text-xs'>End Date</label>
              <Input type="date" name="endDate" onChange={(e) => handleChange(index, e)} value={item.endDate} />
            </div>
            <div className='col-span-2'>
              <RichTextEditor
                index={index}
                defaultValue={item.workSummery}
                onRichTextEditorChange={(e) => handleRichTextEditor(e, 'workSummery', index)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between mt-10'>
  <div className='flex gap-2'>
    <Button variant="outline" onClick={addExperience} className="text-primary">+ Add More Experience</Button>
  </div>
  <div>
    <Button variant="outline" onClick={removeExperience} className="text-primary">- Remove</Button>
  </div>
</div>

    </div>
    </Card>
  )
}
