import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Library, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#341A00] text-[#C7AC59]">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">Evergreen High School</Link>
            <ul className="flex space-x-4">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Athletics</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Students</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Parents</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-[#341A00] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#C7AC59]">Welcome to Evergreen High School</h1>
            <p className="text-xl md:text-2xl mb-8 text-[#E0C77D]">Empowering students to reach their full potential</p>
            <Button size="lg" variant="secondary" className="bg-[#C7AC59] text-[#341A00] hover:bg-[#E0C77D]">Learn More</Button>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00]">Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#341A00]">Important Announcement {i}</CardTitle>
                    <CardDescription className="text-[#5A3000]">Posted on May {i + 14}, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#341A00]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="text-[#C7AC59] hover:text-[#A08339]">Read More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00]">Featured Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: GraduationCap, title: "Academic Excellence" },
                { icon: Users, title: "Student Leadership" },
                { icon: Library, title: "STEM Program" },
                { icon: Calendar, title: "Arts & Culture" },
              ].map((program, index) => (
                <Card key={index} className="text-center border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <program.icon className="w-12 h-12 mx-auto mb-4 text-[#C7AC59]" />
                    <CardTitle className="text-[#341A00]">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#5A3000]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant="outline" className="border-[#C7AC59] text-[#341A00] hover:bg-[#C7AC59] hover:text-white">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#341A00]">Upcoming Events</h2>
            <div className="space-y-4">
              {[
                { date: "June 1", title: "End of Year Concert" },
                { date: "June 5", title: "Senior Graduation Ceremony" },
                { date: "June 10", title: "Summer School Registration Deadline" },
                { date: "August 15", title: "New Student Orientation" },
              ].map((event, index) => (
                <Card key={index} className="border-[#C7AC59] shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#341A00]">{event.title}</CardTitle>
                      <span className="text-[#5A3000]">{event.date}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#341A00] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Contact Us</h3>
              <p>123 School Street</p>
              <p>Anytown, ST 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@evergreenhs.edu</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-[#C7AC59] transition-colors">School Calendar</Link></li>
                <li><Link href="#" className="hover:text-[#C7AC59] transition-colors">Parent Portal</Link></li>
                <li><Link href="#" className="hover:text-[#C7AC59] transition-colors">Student Resources</Link></li>
                <li><Link href="#" className="hover:text-[#C7AC59] transition-colors">Staff Directory</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Stay Connected</h3>
              <p className="mb-4">Follow us on social media for the latest updates and news.</p>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-[#C7AC59] transition-colors">Facebook</Link>
                <Link href="#" className="hover:text-[#C7AC59] transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-[#C7AC59] transition-colors">Instagram</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Evergreen High School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}