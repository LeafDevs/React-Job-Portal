import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import Overlay from '../components/Overlay';

const Application = () => {
  const { jobId, applicationId } = useParams();
  const [formData, setFormData] = useState({});
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/prism/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/prism/applications/${jobId}/${applicationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        const parsedData = data.questions.reduce((acc, question) => {
          acc[question.id] = question.answer;
          return acc;
        }, {});
        setFormData(parsedData);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };

    fetchJob();
    if (applicationId) {
      fetchApplication();
    }
  }, [jobId, applicationId]);

  if (!job) {
    return <div>Loading...</div>;
  }

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
    const value = formData[question.id] || '';
    switch (question.type) {
      case 'text':
        return (
          <textarea
            className="w-full p-2 border-2 border-[#C7AC59] rounded"
            value={value}
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
                  checked={value === option}
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
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const updatedValue = Array.isArray(value) ? [...value] : [];
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
            value={value}
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
