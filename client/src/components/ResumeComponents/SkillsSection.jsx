import { Input } from '../ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
function Skills() {

    const [skillsList,setSkillsList]=useState([{
        name:'',
        rating:0
    }])
   
   
   
    const handleChange=(index,name,value)=>{
        const newEntries=skillsList.slice();
      
        newEntries[index][name]=value;
        setSkillsList(newEntries);
    }

    const AddNewSkills=()=>{
        setSkillsList([...skillsList,{
            name:'',
        rating:0 
        }])
    }
    const RemoveSkills=()=>{
        setSkillsList(skillsList=>skillsList.slice(0,-1))
    }


  return (
    <Card>
    <div className='p-5 mt-3'>
    <h2 className='font-bold text-lg'>Skills</h2>
    <p>Add Your top professional key skills</p>

    <div>
        {skillsList.map((item,index)=>(
            <div className='flex justify-between mb-2 border rounded-lg p-3 mt-6'>
                <div>
                    <label className='text-xs'>Name</label>
                    <Input className="w-full"
                    defaultValue={item.name}
                    onChange={(e)=>handleChange(index,'name',e.target.value)} />
                </div>
                <Rating style={{ maxWidth: 120 }} value={item.rating} 
                onChange={(v)=>handleChange(index,'rating',v)}/>

            </div>
        ))}
    </div>
    <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewSkills} className="text-primary"> + Add More Skill</Button>
            <Button variant="outline" onClick={RemoveSkills} className="text-primary"> - Remove</Button>

            </div>
        </div>
    </div>
    </Card>
  )
}

export default Skills