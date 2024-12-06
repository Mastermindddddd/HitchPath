import React, { useState } from "react";
import axios from "axios";

const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    location: "",
    preferredLearningStyle: "",
    primaryLanguage: "",
    preferredStudyHours: "",
    paceOfLearning: "",
    shortTermGoals: "",
    longTermGoals: "",
    careerPath: "",
    currentSkillLevel: "",
    certifications: "",
    focusAreas: "",
    dailyAvailability: "",
    preferredResourceType: "",
    feedbackOnResources: "",
    rewardPreferences: "",
    reminderTone: "",
    devicePreference: "",
    accessibilityNeeds: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        console.error("Token not found.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:3000/api/user/update",
        formData, // Your form data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );
      console.log("User information updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Your Information</h2>
      
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Date of Birth:
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
      </label>
      <label>
        Location:
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </label>
      <label>
        Preferred Learning Style:
        <select name="preferredLearningStyle" value={formData.preferredLearningStyle} onChange={handleChange}>
          <option value="">Select</option>
          <option value="visual">Visual</option>
          <option value="auditory">Auditory</option>
          <option value="reading">Reading/Writing</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>
      </label>
      <label>
        Primary Language:
        <input type="text" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} />
      </label>
      <label>
        Preferred Study Hours:
        <input type="text" name="preferredStudyHours" value={formData.preferredStudyHours} onChange={handleChange} />
      </label>
      <label>
        Pace of Learning:
        <select name="paceOfLearning" value={formData.paceOfLearning} onChange={handleChange}>
          <option value="">Select</option>
          <option value="fast">Fast</option>
          <option value="moderate">Moderate</option>
          <option value="slow">Slow</option>
        </select>
      </label>
      <label>
        Short-Term Goals:
        <textarea name="shortTermGoals" value={formData.shortTermGoals} onChange={handleChange}></textarea>
      </label>
      <label>
        Long-Term Goals:
        <textarea name="longTermGoals" value={formData.longTermGoals} onChange={handleChange}></textarea>
      </label>
      <label>
        Desired Career Path or Skills:
        <input type="text" name="careerPath" value={formData.careerPath} onChange={handleChange} />
      </label>
      <label>
        Current Skill Level:
        <select name="currentSkillLevel" value={formData.currentSkillLevel} onChange={handleChange}>
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </label>
      <label>
        Certifications or Achievements:
        <textarea name="certifications" value={formData.certifications} onChange={handleChange}></textarea>
      </label>
      <label>
        Preferred Focus Areas:
        <input type="text" name="focusAreas" value={formData.focusAreas} onChange={handleChange} />
      </label>
      <label>
        Daily Availability:
        <input type="text" name="dailyAvailability" value={formData.dailyAvailability} onChange={handleChange} />
      </label>
      <label>
        Preferred Resource Type:
        <input type="text" name="preferredResourceType" value={formData.preferredResourceType} onChange={handleChange} />
      </label>
      <label>
        Feedback on Resources:
        <textarea name="feedbackOnResources" value={formData.feedbackOnResources} onChange={handleChange}></textarea>
      </label>
      <label>
        Reward Preferences:
        <textarea name="rewardPreferences" value={formData.rewardPreferences} onChange={handleChange}></textarea>
      </label>
      <label>
        Reminder Tone:
        <input type="text" name="reminderTone" value={formData.reminderTone} onChange={handleChange} />
      </label>
      <label>
        Device Preference:
        <input type="text" name="devicePreference" value={formData.devicePreference} onChange={handleChange} />
      </label>
      <label>
        Accessibility Needs:
        <textarea name="accessibilityNeeds" value={formData.accessibilityNeeds} onChange={handleChange}></textarea>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserInfoForm;
