import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Overlay from '../components/Overlay';

const Application = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({});

  // Mock job data - in a real app, this would be fetched based on jobId
  const job = {
    id: jobId,
    title: 'Software Developer',
    company: 'Tech Innovators',
    questions: [
      { id: 1, type: 'text', question: 'What makes you a good fit for this position?' },
      { id: 2, type: 'multiChoice', question: 'How many years of experience do you have?', options: ['0-1', '1-3', '3-5', '5+'] },
      { id: 3, type: 'checkbox', question: 'Which programming languages are you proficient in?', options: ['JavaScript', 'Python', 'Java', 'C++'] },
      { id: 4, type: 'select', question: 'What is your preferred work environment?', options: ['Remote', 'In-office', 'Hybrid'] },
    ]
  };

  const handleInputChange = (questionId, value) => {
    setFormData(prevData => ({
      ...prevData,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted application:', formData);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            className="w-full p-2 border-2 border-[#C7AC59] rounded"
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        );
      case 'multiChoice':
        return (
          <div className="flex flex-col">
            {question.options.map((option) => (
              <label key={option} className="inline-flex items-center mt-2">
                <input
                  type="radio"
                  className="form-radio text-[#C7AC59]"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex flex-col">
            {question.options.map((option) => (
              <label key={option} className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-[#C7AC59]"
                  value={option}
                  onChange={(e) => {
                    const updatedValue = formData[question.id] || [];
                    if (e.target.checked) {
                      updatedValue.push(option);
                    } else {
                      const index = updatedValue.indexOf(option);
                      if (index > -1) updatedValue.splice(index, 1);
                    }
                    handleInputChange(question.id, updatedValue);
                  }}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <select
            className="w-full p-2 border-2 border-[#C7AC59] rounded"
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Overlay />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#C7AC59] mb-8">Application for {job.title}</h1>
        <h2 className="text-2xl font-semibold text-[#341A00] mb-4">{job.company}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {job.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className="block text-[#341A00] font-bold mb-2">{question.question}</label>
              {renderQuestion(question)}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#C7AC59] text-[#341A00] font-semibold py-2 px-4 rounded hover:bg-[#341A00] hover:text-white transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Application;
