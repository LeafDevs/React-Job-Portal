import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Library, Calendar, Bell, FileText, Settings, Briefcase } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';

export default function Dashboard() {
  const [userName, setUserName] = useState("John Doe");
  const [userRole, setUserRole] = useState("Student");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = "/dash";
    }
  }, []);

  useEffect(() => {
    function run() {
      const queryParams = new URLSearchParams(window.location.search);
      const t = queryParams.get('token');
      if(t) {
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data);
          if(data.code === 401) {
            throw new Error('Unauthorized Access.')
          }
          setUserName(data.name);
          setUserRole(data.type.charAt(0).toUpperCase() + data.type.slice(1)); // Capitalize the first letter of data.type
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      };

      fetchData();
    }
    run();
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow container mx-auto px-4 py-8 mt-24 mb-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
              <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-zinc-950 dark:text-white" data-notranslate>{userName}</h1>
              <p className="text-zinc-500 dark:text-zinc-400" data-notranslate>{userRole}</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Homecoming Spirit Week", date: "September 30th - October 4th" },
                  { title: "NO SCHOOL - Teacher Professional Development Day", date: "October 9th" },
                  { title: "\"FALL FOLLIES\" HIGH SCHOOL TALENT SHOW", date: "October 17th" },
                ].map((announcement, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{announcement.date}</p>
                    </div>
                    <Bell className="h-5 w-5 text-zinc-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FileText, label: "Messages" },
                  { icon: Calendar, label: "Schedule" },
                  { icon: Briefcase, label: "Postings" },
                  { icon: Settings, label: "Settings" },
                ].map((item, index) => (
                  <Button key={index} variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <item.icon className="h-8 w-8 mb-2" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 text-zinc-950 dark:text-white">Featured Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: GraduationCap, title: "Career Development", description: "Explore career paths and opportunities." },
            { icon: Users, title: "Networking", description: "Connect with peers and professionals." },
            { icon: Library, title: "Skill Building", description: "Enhance your skills with workshops." },
            { icon: Calendar, title: "Events", description: "Stay updated on upcoming events." },
          ].map((program, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <program.icon className="w-12 h-12 mb-4 text-[#C7AC59]" />
                <CardTitle>{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{program.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer string={'blocky'} />
    </div>
  );
}
