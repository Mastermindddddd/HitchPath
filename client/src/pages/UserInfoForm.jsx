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

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handlePrev = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.error("Token not found.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User information updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-4">
              Step 1: Basic Information
            </h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Step 2: Learning Preferences</h3>
            <label>
              Preferred Learning Style:
              <select name="preferredLearningStyle" value={formData.preferredLearningStyle} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white
">
                <option value="">Select</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="reading">Reading/Writing</option>
                <option value="kinesthetic">Kinesthetic</option>
              </select>
            </label>
            <label>
              Primary Language:
              <input type="text" name="primaryLanguage" value={formData.primaryLanguage} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"/>
            </label>
            <label>
              Preferred Study Hours:
              <input type="text" name="preferredStudyHours" value={formData.preferredStudyHours} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800
"/>
            </label>
            <label>
              Pace of Learning:
              <select name="paceOfLearning" value={formData.paceOfLearning} onChange={handleChange} 
                className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white">
                <option value="">Select</option>
                <option value="fast">Fast</option>
                <option value="moderate">Moderate</option>
                <option value="slow">Slow</option>
              </select>
            </label>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Step 3: Goals & Career</h3>
            <label>
              Short-Term Goals:
              <textarea name="shortTermGoals" value={formData.shortTermGoals} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
            <label>
              Long-Term Goals:
              <textarea name="longTermGoals" value={formData.longTermGoals} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
            <label>
              Desired Career Path:
              <input type="text" name="careerPath" value={formData.careerPath} onChange={handleChange} className="w-full p-2 rounded-lg border-2 borde-gray-300 focus:border-purple-600 bg-white text-gray-800
"/>
            </label>
            <label>
              Current Skill Level:
              <select name="currentSkillLevel" value={formData.currentSkillLevel} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white">
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
        );
      case 4:
        return (
          <div>
            <h3>Step 4: Availability & Focus</h3>
            <label>
              Certifications or Achievements:
              <textarea name="certifications" value={formData.certifications} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
            <label>
              Preferred Focus Areas:
              <input type="text" name="focusAreas" value={formData.focusAreas} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"/>
            </label>
            <label>
              Daily Availability:
              <input type="text" name="dailyAvailability" value={formData.dailyAvailability} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"/>
            </label>
          </div>
        );
      case 5:
        return (
          <div>
            <h3>Step 5: Preferences & Feedback</h3>
            <label>
              Preferred Resource Type:
              <input type="text" name="preferredResourceType" value={formData.preferredResourceType} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"/>
            </label>
            <label>
              Feedback on Resources:
              <textarea name="feedbackOnResources" value={formData.feedbackOnResources} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
            <label>
              Reward Preferences:
              <textarea name="rewardPreferences" value={formData.rewardPreferences} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
            <label>
              Reminder Tone:
              <input type="text" name="reminderTone" value={formData.reminderTone} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"/>
            </label>
            <label>
              Device Preference:
              <input type="text" name="devicePreference" value={formData.devicePreference} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800"/>
            </label>
            <label>
              Accessibility Needs:
              <textarea name="accessibilityNeeds" value={formData.accessibilityNeeds} onChange={handleChange} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-purple-600 bg-white text-gray-800">
              </textarea>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (  
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-r from-blue-900 to-purple-700 rounded-lg shadow-xl text-white mb-20">
      <h2 className="text-2xl font-bold text-center mb-6">
        Update Your Information
      </h2>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-300 rounded-full mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>
      <p className="text-center font-semibold mb-4">
        Step {step} of {totalSteps}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            >
              Previous
            </button>
          )}
          {step < totalSteps && (
            <button
              type="button"
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            >
              Next
            </button>
          )}
          {step === totalSteps && (
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          )}
        </div>
      </form>

      {/* Gamification */}
      {step < totalSteps && (
        <div className="text-center mt-6">
          🎉 <strong>Complete Step {step}</strong> to unlock more insights!
        </div>
      )}
      {step === totalSteps && (
        <div className="text-center mt-6">
          🎊 <strong>Congratulations!</strong> You're all set to save your information.
        </div>
      )}
    </div>
  );
};

export default UserInfoForm;