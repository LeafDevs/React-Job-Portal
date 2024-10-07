import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Library, Users } from "lucide-react"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import bgImage from '@/assets/Untitled-1.png'

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-[rgba(39,39,42,.5)] text-white dark:bg-zinc-950 dark:text-[#341A00]">
      <Nav />
      <main className="flex-grow">
        <section className="bg-gray-200 text-white py-20 relative items-center" style={{ backgroundImage: `url(${bgImage})`, height: '70vh', margin: '0 auto', transition: 'background-image 1s ease-in-out', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
          <div className="flex flex-col justify-center items-left h-full p-12 w-2/3 max-w-xl font-poppins">
              <h2 className="text-6xl text-left whitespace-normal break-words font-poppins font-bold">Find Your Job</h2>
              <p className="text-2xl mt-6 text-left whitespace-normal break-words font-poppins">Discover exciting career opportunities in the Highlands School District.</p>
              <Button className="rounded-md bg-[#C7AC59] mt-8 w-2/3 max-h-lg text-xl py-4 hover:bg-[#341A00] text-white">Find Jobs!</Button>
          </div>
        </section>
        <div className="relative">
          <svg className="absolute top-0 left-0 w-full h-1/4 z-10" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1366 192" style={{ top: '0', transform: 'translateY(-50%)' }}>
            <defs>
              <pattern id="dividerPattern" patternUnits="userSpaceOnUse" width="1366" height="192">
                <image href="/src/assets/Texture.webp" x="0" y="0" width="1366" height="192" preserveAspectRatio="xMidYMid slice" opacity="0.25" />
              </pattern>
            </defs>
            <path d="M1365.47,142.315C666.01,76.815.53,142.315.53,142.315l-.07-76.42s669.52-68.04,1365.09,0l-.08,76.42Z" fill="currentColor" stroke="currentColor" strokeWidth="0" className="dark:fill-[#1f1f1f] fill-[#f5f5f5] drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"/>
            <path d="M1365.47,142.315C666.01,76.815.53,142.315.53,142.315l-.07-76.42s669.52-68.04,1365.09,0l-.08,76.42Z" fill="url(#dividerPattern)" fillOpacity="0.5" stroke="none"/>
          </svg>
          <div className="py-16 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('@/assets/bg-white-4.png')] bg-repeat-y bg-cover bg-center dark:bg-[url('@/assets/bg.png')] backdrop-filter backdrop-blur-[20px] border-t-25 border-b-25 border-stone-400 rounded-t-25 rounded-b-25"></div>
            <div className="relative">
              <section className="mb-16">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold mb-8 text-center text-zinc-950 dark:text-white">Announcements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[{
                        date: "September 30th",
                        title: "Homecoming Dance",
                        description: "On October 5th, we will be hosting a homecoming dance for grades 9-12. Dress in appropriate attire and enjoy the night! The event will conclude at 10:00pm, so make sure to plan your evening accordingly."
                      },
                      {
                        date: "September 23rd",
                        title: "School Calendars",
                        description: "The 2024-25 Highlands Activities Calendar was mailed to the homes of Highlands families. Extras are available at all school buildings. Access the online version of the calendar here: 2024-25 Highlands Activities Calendar"
                    },
                    {
                        date: "September 19th",
                        title: "Picture Day!",
                        description: "It's that time of the year again! School picture season is here. You can order your child's picture here. This is a great opportunity to capture their school year memories. Don't miss out! Order your pictures today!"
                    }
                    ].map((announcement, index) => (
                      <Card key={index} className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-[#F5F5F5] dark:bg-zinc-800' : 'bg-[#E5E5E5] dark:bg-zinc-900'}`}>
                        <CardHeader>
                          <CardTitle className="text-[#341A00] dark:text-white">{announcement.title}</CardTitle>
                          <CardDescription className="text-[#5A3000] dark:text-white">Posted on {announcement.date}, 2023</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[#341A00] dark:text-white">{announcement.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="link" className={`text-[#C7AC59] hover:border-[#C7AC59] hover:text-[#A08339] dark:text-white dark:hover:text-[#C7AC59] ${index % 2 === 0 ? 'bg-zinc-700 dark:bg-zinc-950' : 'bg-zinc-800 dark:bg-zinc-800'}`}>Read More</Button>
                        </CardFooter>
                      </Card>
                    ))}
                    </div>
                  </div>
                </section>

                <section className="mb-16">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center text-zinc-950 dark:text-white">Featured Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { icon: GraduationCap, title: "Academic Excellence", description: "At Highlands we strive for excellence in academics, providing a rigorous and supportive learning environment for all students." },
                        { icon: Users, title: "Student Leadership", description: "At Highlands we encourage students to take on leadership roles and develop their leadership skills through various programs and activities."  },
                        { icon: Library, title: "STEM Program", description: "Our STEM program offers students the opportunity to explore science, technology, engineering, and mathematics through hands-on activities and projects." },
                        { icon: Calendar, title: "Arts & Culture", description: "We celebrate the arts and culture at Highlands, offering a variety of programs and activities that allow students to explore their creativity and express themselves." },
                      ].map((program, index) => (
                        <Card key={index} className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-stone-200 dark:bg-zinc-800' : 'bg-stone-100 dark:bg-zinc-900'}`}>
                          <CardHeader>
                            <program.icon className="w-12 h-12 mx-auto mb-4 text-[#C7AC59]" />
                            <CardTitle className="text-[#341A00] dark:text-white">{program.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-[#5A3000] dark:text-white">{program.description}</p>
                          </CardContent>
                          <CardFooter className="justify-center">
                            <Button variant="outline" className="border-[#C7AC59] hover:border-[#C7AC59] text-[#341A00] hover:bg-[#C7AC59] hover:text-white dark:text-white">Learn More</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="mb-16">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center text-zinc-950 dark:text-white">Upcoming Events</h2>
                    <div className="space-y-4">
                      {[
                        { date: "September 30th - October 4th", title: "Homecoming Spirit Week - All Schools!", description: "https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Domain/1/2024%20HoCo%20Spirit%20Week%20Facebook%20Post.jpg" },
                        { date: "October 5th", title: "Homecoming Dance (Grades 9-12) (HS)", description: "Dress up and dance the night away!" },
                        { date: "October 9th", title: "NO SCHOOL FOR STUDENTS - Teacher Professional Development Day", description: "No School For Students" },
                        { date: "October 17th", title: "\"FALL FOLLIES\" HIGH SCHOOL TALENT SHOW (HS Aud.)", description: "Show your school spirit and enjoy the talent show!" },
                      ].map((event, index) => (
                        <Card key={index} className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-stone-200 dark:bg-zinc-800' : 'bg-stone-100 dark:bg-zinc-900'}`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-[#341A00] dark:text-white">{event.title}</CardTitle>
                              <span className="text-[#5A3000] dark:text-white">{event.date}</span>
                            </div>
                          </CardHeader>
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
              </div>
            </div>
          </div>
        </main>
      <Footer />
    </div>
  )
}