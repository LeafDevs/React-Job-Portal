import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Library, Calendar, Bell, FileText, Settings, Briefcase } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import t from "@/lib/translate"

export default function Dashboard() {
  const [userName, setUserName] = useState("John Doe");
  const [userRole, setUserRole] = useState("Student");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://github.com/shadcn.png");
  const [imagePreview, setImagePreview] = useState("");
  const [quickLinks, setQuickLinks] = useState<any[]>([]); // Fix type error
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = "/dash";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const q = queryParams.get('token');
      if (q) return;

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/auth";
        return;
      }

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
        if(data.code === 401) {
          throw new Error('Unauthorized Access.')
        }
        setUserName(data.name);
        setUserRole(data.type.charAt(0).toUpperCase() + data.type.slice(1));
        setProfileImage(data.profile_info.profile_picture || profileImage);

        const language = localStorage.getItem("language") || "en";
        const links = data.type === 'student' ? [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("View your messages", language), redirect: true, location: "/messages" },
          { icon: Calendar, label: await t("Schedule", language), tooltip: await t("Check your schedule", language), redirect: false, menu: "calendar" },
          { icon: Briefcase, label: await t("Postings", language), tooltip: await t("View job postings", language), redirect: true, location: "/postings" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Manage your settings", language), redirect: true, location: "/settings" },
        ] : data.type === 'admin' ? [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("View your messages", language), redirect: true, location: "/messages" },
          { icon: Briefcase, label: await t("Accounts", language), tooltip: await t("View all Accounts", language), redirect: true, location: "/admin/accounts" },
          { icon: Briefcase, label: await t("Posts", language), tooltip: await t("View all Posts.", language), redirect: true, location: "/admin/posts" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Modify your account settings", language), redirect: true, location: "/settings"},
        ] : [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("View your messages", language), redirect: true, location: "/messages" },
          { icon: Briefcase, label: await t("Applications", language), tooltip: await t("View all applications", language), redirect: true, location: "/employer/applications" },
          { icon: Briefcase, label: await t("Posts", language), tooltip: await t("View all Posts.", language), redirect: false, menu: "posts" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Modify your account settings", language), redirect: true, location: "/settings"},
        ];

        setQuickLinks(links);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [profileImage]);

  const updateProfilePicture = async (base64Image: string) => {
    const token = localStorage.getItem('token');
    const imageData = base64Image.split(',')[1];
    const body = {
      imageData
    }

    console.log(body);
      const response = await fetch('http://localhost:3000/update_pfp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProfileImage(base64Image);
      setIsDialogOpen(false);
  }

  const handleImageChange = (e: { target: { files: FileList | null; }; }) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          setImagePreview(result);
          setSelectedFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow container mx-auto px-4 py-8 mt-24 mb-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={profileImage} alt={userName} />
              <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-zinc-950 dark:text-white" data-notranslate>{userName}</h1>
              <p className="text-zinc-500 dark:text-zinc-400" data-notranslate>{userRole}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Edit Profile</Button>
        </div>

        <Separator className="my-8" />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#F5F5F5] dark:bg-zinc-800 border-[#C7AC59]">
            <DialogHeader>
              <DialogTitle className="text-[#341A00] dark:text-white">Edit Profile</DialogTitle>
              <DialogDescription className="text-[#5A3000] dark:text-zinc-300">
                Update your profile picture and details.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <Avatar className="mt-2 h-24 w-24">
                <AvatarImage src={imagePreview || profileImage} alt="Preview" />
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <label className="block text-sm font-medium mb-1 text-[#341A00] dark:text-white">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="border border-[#C7AC59] p-2" />
            </div>
            <DialogFooter className="flex justify-start">
              <Button variant="outline" className="mr-2">Become an Employer</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (imagePreview) {
                    updateProfilePicture(imagePreview);
                  }
                }}
                className="border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white"
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                {quickLinks.map((item, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-24 flex flex-col items-center justify-center" 
                          onClick={() => {
                            if (item.redirect && item.location) {
                              window.location.href = item.location;
                            }
                          }}
                        >
                          <item.icon className="h-8 w-8 mb-2" />
                          <span>{item.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
