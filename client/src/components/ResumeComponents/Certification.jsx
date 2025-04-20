import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import React, { useState, useEffect } from 'react';

function Certification({ onChange }) {
  const [certifications, setCertifications] = useState([
    {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      description: '',
    },
  ]);
  useEffect(() => {
    onChange(certifications);
  }, [certifications]);


  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCerts = [...certifications];
    updatedCerts[index][name] = value;
    setCertifications(updatedCerts);
  };

  const addNewCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        description: '',
      },
    ]);
  };

  const removeCertification = () => {
    setCertifications((prevList) => prevList.slice(0, -1));
  };

  return (
    <Card>
      <div className="p-5 mt-3">
        <h2 className="font-bold text-lg">Certifications</h2>
        <p>Add any certifications, licenses, or formal recognitions you've received.</p>

        <div>
          {certifications.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div className="col-span-2">
                  <label>Certification Name</label>
                  <Input
                    name="name"
                    value={item.name}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2">
                  <label>Issuing Organization</label>
                  <Input
                    name="issuer"
                    onChange={(e) => handleChange(e, index)}
                    value={item.issuer}
                  />
                </div>
                <div>
                  <label>Issue Date</label>
                  <Input
                    type="date"
                    name="issueDate"
                    onChange={(e) => handleChange(e, index)}
                    value={item.issueDate}
                  />
                </div>
                <div>
                  <label>Expiry Date (optional)</label>
                  <Input
                    type="date"
                    name="expiryDate"
                    onChange={(e) => handleChange(e, index)}
                    value={item.expiryDate}
                  />
                </div>
                <div className="col-span-2">
                  <label>Description</label>
                  <Textarea
                    name="description"
                    onChange={(e) => handleChange(e, index)}
                    value={item.description}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <div className="flex gap-2">
            <Button variant="outline" onClick={addNewCertification} className="text-primary">
              + Add Certification
            </Button>
            <Button variant="outline" onClick={removeCertification} className="text-primary">
              - Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Certification;
