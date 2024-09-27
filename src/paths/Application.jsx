import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Nav from "@/components/ui/nav";
import Footer from "@/components/ui/footer";
import Raleway from "../fonts/Raleway.ttf";

// Example JSON for application questions
const applicationQuestions = [
  {
    id: 'fullName',
    type: 'short',
    question: 'What is your full name?',
    required: true,
  },
  {
    id: 'email',
    type: 'short',
    question: 'What is your email address?',
    required: true,
  },
  {
    id: 'experience',
    type: 'long',
    question: 'Describe your relevant work experience.',
    required: true,
  },
  {
    id: 'education',
    type: 'select',
    question: 'What is your highest level of education?',
    options: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'],
    required: true,
  },
  {
    id: 'skills',
    type: 'checkbox',
    question: 'Select all skills that apply:',
    options: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    required: false,
  },
  {
    id: 'availability',
    type: 'radio',
    question: 'What is your availability?',
    options: ['Full-time', 'Part-time', 'Contract'],
    required: true,
  },
  {
    id: 'salary',
    type: 'short',
    question: 'What is your expected salary?',
    required: false,
  },
  {
    id: 'startDate',
    type: 'short',
    question: 'When can you start?',
    required: true,
  },
  {
    id: 'relocation',
    type: 'radio',
    question: 'Are you willing to relocate?',
    options: ['Yes', 'No'],
    required: true,
  },
  {
    id: 'additionalInfo',
    type: 'long',
    question: 'Is there anything else you would like us to know?',
    required: false,
  },
];

// Create a schema based on the questions
const schema = z.object(
  applicationQuestions.reduce((acc, question) => {
    if (question.type === 'checkbox') {
      acc[question.id] = z.array(z.string()).optional();
    } else if (question.required) {
      acc[question.id] = z.string().min(1, { message: "This field is required" });
    } else {
      acc[question.id] = z.string().optional();
    }
    return acc;
  }, {})
);

function Application() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: applicationQuestions.reduce((acc, question) => {
      acc[question.id] = question.type === 'checkbox' ? [] : '';
      return acc;
    }, {}),
  });

  function onSubmit(data) {
    console.log(data);
    // Handle form submission
  }

  return (
    <div className={`bg-[#f7efd7] text-[#341A00] min-h-screen flex flex-col items-center justify-center w-full`}>
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <CardHeader className="bg-[#341A00] text-[#C7AC59] p-6">
            <CardTitle className="text-3xl font-bold text-center">Job Application</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {applicationQuestions.map((question) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id}
                    render={({ field }) => (
                      <FormItem className="bg-[#f9f5e8] p-4 rounded-lg shadow-md">
                        <FormLabel className="text-[#341A00] font-semibold text-lg mb-2">{question.question}</FormLabel>
                        {question.type === 'short' && (
                          <FormControl>
                            <Input {...field} className="border-2 border-[#C7AC59] focus:ring-2 focus:ring-[#341A00] rounded-md p-2 w-full transition duration-300 ease-in-out" />
                          </FormControl>
                        )}
                        {question.type === 'long' && (
                          <FormControl>
                            <Textarea {...field} className="border-2 border-[#C7AC59] focus:ring-2 focus:ring-[#341A00] rounded-md p-2 w-full min-h-[100px] transition duration-300 ease-in-out" />
                          </FormControl>
                        )}
                        {question.type === 'select' && (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 border-[#C7AC59] focus:ring-2 focus:ring-[#341A00] rounded-md p-2 w-full transition duration-300 ease-in-out">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-2 border-[#C7AC59] rounded-md shadow-lg">
                              {question.options.map((option) => (
                                <SelectItem key={option} value={option} className="p-2 hover:bg-[#f7efd7] transition duration-200">{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {question.type === 'checkbox' && (
                          <FormControl>
                            <div className="space-y-2">
                              {question.options.map((option) => (
                                <div key={option} className="flex items-center bg-white p-2 rounded-md hover:bg-[#f7efd7] transition duration-200">
                                  <Checkbox
                                    id={`${question.id}-${option}`}
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option])
                                        : field.onChange(field.value?.filter((value) => value !== option))
                                    }}
                                    className="border-2 border-[#C7AC59] text-[#341A00] focus:ring-2 focus:ring-[#341A00]"
                                  />
                                  <label htmlFor={`${question.id}-${option}`} className="ml-2 text-sm font-medium">{option}</label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                        )}
                        {question.type === 'radio' && (
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                              {question.options.map((option) => (
                                <div key={option} className="flex items-center bg-white p-2 rounded-md hover:bg-[#f7efd7] transition duration-200">
                                  <RadioGroupItem value={option} id={`${question.id}-${option}`} className="border-2 border-[#C7AC59] text-[#341A00] focus:ring-2 focus:ring-[#341A00]" />
                                  <label htmlFor={`${question.id}-${option}`} className="ml-2 text-sm font-medium">{option}</label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        )}
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" className="w-full bg-[#341A00] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-[#341A00] py-3 rounded-md font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105">
                  Submit Application
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default Application;
