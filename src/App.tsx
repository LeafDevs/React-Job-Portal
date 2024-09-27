import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Library, Users } from "lucide-react"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [imageIndex, setImageIndex] = useState(0)
  const [expandedEvent, setExpandedEvent] = useState(false)
  const images = [
    'https://images.pexels.com/photos/5920740/pexels-photo-5920740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/4353585/pexels-photo-4353585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1557228/pexels-photo-1557228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="flex flex-col min-h-screen bg-[#341A00] text-white dark:bg-white dark:text-[#341A00]">
      <Nav />
      <main className="flex-grow">
        <section className="bg-gray-200 text-white py-20 relative items-center">
          <div className="container mx-auto px-4 text-center">
            <div className="relative w-4/5 bg-cover bg-center" style={{ backgroundImage: `url(${images[imageIndex]})`, height: '70vh', margin: '0 auto', transition: 'background-image 1s ease-in-out' }}>
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-[#341A00] dark:text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00] dark:text-white">Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#341A00] dark:text-white">Important Announcement {i}</CardTitle>
                    <CardDescription className="text-[#5A3000] dark:text-white">Posted on May {i + 14}, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#341A00] dark:text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="text-[#C7AC59] hover:text-[#A08339] dark:text-white dark:hover:text-[#C7AC59]">Read More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#F5F5F5] dark:bg-[#341A00] dark:text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00] dark:text-white">Featured Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: GraduationCap, title: "Academic Excellence", description: "At Highlands we strive for excellence in academics, providing a rigorous and supportive learning environment for all students." },
                { icon: Users, title: "Student Leadership", description: "At Highlands we encourage students to take on leadership roles and develop their leadership skills through various programs and activities."  },
                { icon: Library, title: "STEM Program", description: "Our STEM program offers students the opportunity to explore science, technology, engineering, and mathematics through hands-on activities and projects." },
                { icon: Calendar, title: "Arts & Culture", description: "We celebrate the arts and culture at Highlands, offering a variety of programs and activities that allow students to explore their creativity and express themselves." },
              ].map((program, index) => (
                <Card key={index} className="text-center border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <program.icon className="w-12 h-12 mx-auto mb-4 text-[#C7AC59]" />
                    <CardTitle className="text-[#341A00] dark:text-white">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#5A3000] dark:text-white">{program.description}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant="outline" className="border-[#C7AC59] text-[#341A00] hover:bg-[#C7AC59] hover:text-white dark:text-white dark:hover:bg-[#341A00]">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-[#341A00] dark:text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00] dark:text-white">Upcoming Events</h2>
            <div className="space-y-4">
              {[
                { date: "September 30th - October 4th", title: "Homecoming Spirit Week - All Schools!", description: "https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Domain/1/2024%20HoCo%20Spirit%20Week%20Facebook%20Post.jpg" },
                { date: "October 5th", title: "Homecoming Dance (Grades 9-12) (HS)", description: "Dress up and dance the night away!" },
                { date: "October 9th", title: "NO SCHOOL FOR STUDENTS - Teacher Professional Development Day", description: "No School For Students" },
                { date: "October 17th", title: "\"FALL FOLLIES\" HIGH SCHOOL TALENT SHOW (HS Aud.)", description: "Show your school spirit and enjoy the talent show!" },
              ].map((event, index) => (
                <Card key={index} className="border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#341A00] dark:text-white">{event.title}</CardTitle>
                      <span className="text-[#5A3000] dark:text-white">{event.date}</span>
                    </div>
                  </ CardHeader>
                  <CardContent>
                    {index === 0 ? (
                      <CardDescription className="text-[#5A3000] dark:text-white">
                        <a href={event.description} target="_blank" rel="noopener noreferrer" className="text-[#341A00] hover:text-[#C7AC59] hover:underline dark:text-white dark:hover:text-[#C7AC59]">
                          Click here for more information
                        </a>
                      </CardDescription>
                    ) : (
                      <CardDescription className="text-[#5A3000] dark:text-white">{event.description}</CardDescription>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}