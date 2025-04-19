import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import React, { useState } from 'react';

function Education() {

  const [educationalList,setEducationalList]=useState([
    {
      universityName:'',
      degree:'',
      major:'',
      startDate:'',
      endDate:'',
      description:''
    }
  ])

  const AddNewEducation=()=>{
    setEducationalList([...educationalList,
      {
        universityName:'',
        degree:'',
        major:'',
        startDate:'',
        endDate:'',
        description:''
      }
    ])
  }
  const RemoveEducation=()=>{
    setEducationalList(educationalList=>educationalList.slice(0,-1))

  }
  return (
    <Card>
    <div className='p-5 mt-10'>
    <h2 className='font-bold text-lg'>Education</h2>
    <p>Add Your educational details</p>

    <div>
      {educationalList.map((item,index)=>(
        <div>
          <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input name="universityName" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.universityName}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input name="degree" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.degree} />
            </div>
            <div>
              <label>Major</label>
              <Input name="major" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.major} />
            </div>
            <div>
              <label>Start Date</label>
              <Input type="date" name="startDate" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.startDate} />
            </div>
            <div>
              <label>End Date</label>
              <Input type="date" name="endDate" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.endDate} />
            </div>
            <div className='col-span-2'>
              <label>Description</label>
              <Textarea name="description" 
              onChange={(e)=>handleChange(e,index)}
              defaultValue={item?.description} />
            </div>

          </div>
       
        </div>
      ))}
    </div>
    <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewEducation} className="text-primary"> + Add More Education</Button>
            <Button variant="outline" onClick={RemoveEducation} className="text-primary"> - Remove</Button>

            </div>
        </div>
    </div>
    </Card>
  )
}

export default Education