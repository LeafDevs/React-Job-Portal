// Import necessary React hooks and UI components
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Library, Calendar, Bell, FileText, Settings, Briefcase, AlertCircle, BookOpen, LogOut, Music, Star, User, PartyPopper } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
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
  // State variables for user data and UI controls
  const [userName, setUserName] = useState("John Doe");
  const [userRole, setUserRole] = useState("Student");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://github.com/leafdevs.png"); // Default profile picture
  const [imagePreview, setImagePreview] = useState("");
  const [quickLinks, setQuickLinks] = useState<any[]>([]); // Array to store quick access links
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userBackground, setUserBackground] = useState('bg-black/40')
  const [bannerPreview, setBannerPreview] = useState("");
  const [isPostingDialogOpen, setIsPostingDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [showEmployerInfo, setShowEmployerInfo] = useState(false);
  
  // State for job posting form data
  const [postingData, setPostingData] = useState({
    title: '',
    payrate: '',
    description: '',
    requirements: '',
    location: '',
    tags: [] as string[],
    questions: [] as string[],
  });

  // Effect to handle authentication token from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = "/dash";
      selectedFile;
    }
  }, []);

  // Effect to set page title
  useEffect(() => {
    document.title = 'Dashboard | HHS';
  }, []);

  // Effect to fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      const queryParams = new URLSearchParams(window.location.search);
      const q = queryParams.get('token');
      if (q) return;

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      try {
        // Fetch user data from API
        const response = await fetch('https://api.lesbians.monster/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Invalid JSON response:', text);
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        // Handle unauthorized access
        if (data.code === 401) {
          localStorage.removeItem('token');
          window.location.href = "/auth";
          return;
        }

        // Update user interface with fetched data
        console.log(data);
        setUserName(data.name);
        setUserRole(data.type.charAt(0).toUpperCase() + data.type.slice(1));
        setProfileImage(data.profile_info?.profile_picture || profileImage);
        setUserBackground(data.profile_info?.banner || userBackground);
        if (data.profile_info?.banner) {
          const bannerElement = document.getElementById('banner');
          if (bannerElement) {
            bannerElement.style.backgroundImage = `url(${data.profile_info.banner})`;
          }
        }
        console.log(userBackground);

        // Set up quick links based on user type
        const language = localStorage.getItem("language") || "en";
        const links = data.type === 'student' ? [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("This is not implemented yet, BUT the page exists.", language), redirect: true, location: "/messages" },
          { icon: Calendar, label: await t("Training", language), tooltip: await t("View training resources", language), redirect: true, menu: "/training" },
          { icon: Briefcase, label: await t("Postings", language), tooltip: await t("View job postings", language), redirect: true, location: "/postings" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Change your settings", language), redirect: true, location: "/settings"},
        ] : data.type === 'admin' ? [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("This is not implemented yet, BUT the page exists.", language), redirect: true, location: "/messages" },
          { icon: Briefcase, label: await t("Accounts", language), tooltip: await t("View Accounts", language), redirect: true, location: "/admin/accounts" },
          { icon: Briefcase, label: await t("Posts", language), tooltip: await t("View all Posts.", language), redirect: true, location: "/admin/posts" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Change your settings", language), redirect: true, location: "/settings"},
          { icon: Briefcase, label: await t("Profile", language), tooltip: await t("View your profile", language), redirect: true, location: "/profile/" + data.id},
        ] : data.type === 'employer' ? [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("This is not implemented yet, BUT the page exists.", language), redirect: true, location: "/messages" },
          { icon: Briefcase, label: await t("Applications", language), tooltip: await t("View all applications", language), redirect: true, location: "/employer/applications" },
          { icon: Briefcase, label: await t("New Post", language), tooltip: await t("Create a new job posting", language), redirect: false, onClick: () => setIsPostingDialogOpen(true) },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Change your settings", language), redirect: true, location: "/settings"},
          { icon: Briefcase, label: await t("Profile", language), tooltip: await t("View your profile", language), redirect: true, location: "/profile/" + data.id},
        ] : [
          { icon: FileText, label: await t("Messages", language), tooltip: await t("This is not implemented yet, BUT the page exists.", language), redirect: true, location: "/messages" },
          { icon: Briefcase, label: await t("Applications", language), tooltip: await t("View all applications", language), redirect: true, location: "/employer/applications"},
          { icon: Briefcase, label: await t("Posts", language), tooltip: await t("View all Posts.", language), redirect: false, menu: "posts" },
          { icon: Settings, label: await t("Settings", language), tooltip: await t("Change your settings", language), redirect: true, location: "/settings"},
        ];

        // Remove duplicate quick links
        const uniqueLinks = Array.from(new Set(links.map(link => link.label)))
          .map(label => links.find(link => link.label === label));
        
        setQuickLinks(uniqueLinks);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [profileImage]);

  // Function to update profile picture
  const updateProfilePicture = async (base64Image: string) => {
    const token = localStorage.getItem('token');
    const imageData = base64Image.split(',')[1];
    const body = {
      imageData
    }

    try {
      const response = await fetch('https://api.lesbians.monster/update_pfp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setProfileImage(base64Image);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile picture');
    }
  }

  // Function to update banner image
  const updateBanner = async (base64Image: string) => {
    const token = localStorage.getItem('token');
    const imageData = base64Image.split(',')[1];
    const body = {
      imageData
    }

    try {
      const response = await fetch('https://api.lesbians.monster/update_banner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setUserBackground(`url(${base64Image})`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating banner:', error);
      setError(error instanceof Error ? error.message : 'Failed to update banner');
    }
  }

  // Handler for profile image file selection
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

  // Handler for banner image file selection
  const handleBannerChange = (e: { target: { files: FileList | null; }; }) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          setBannerPreview(result);
          setUserBackground(`url(${result})`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle job posting creation
  const handleCreatePosting = async () => {
    const token = localStorage.getItem('token');
    try {
      // Filter out empty questions
      const filteredQuestions = questions.filter(q => q.trim() !== '');
      
      const payload = {
        ...postingData,
        questions: filteredQuestions // Use the questions array directly
      };

      console.log('Submitting payload:', payload);

      const response = await fetch('https://api.lesbians.monster/create_post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create posting');
      
      // Reset form after successful submission
      setIsPostingDialogOpen(false);
      setQuestions([]); // Reset questions array
      setPostingData({
        title: '',
        payrate: '',
        description: '',
        requirements: '',
        location: '',
        tags: [],
        questions: [], // Reset questions in posting data
      });
    } catch (error) {
      console.error('Error creating posting:', error);
      setError(error instanceof Error ? error.message : 'Failed to create posting');
    }
  };

  // Render the dashboard UI
  return (
    <div className="flex flex-col bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 min-h-screen">
      <Nav />
      <div className="flex-grow container mx-auto px-4 py-8 mt-24 mb-28">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Profile Banner Section */}
        <div className="relative mb-8">
          <div className="relative h-40 rounded-lg overflow-hidden">
            <div id='banner' 
              className={`absolute inset-0 opacity-90 rounded-lg transition-all duration-300 ${userBackground.startsWith('bg-') ? userBackground : ''}`} 
              style={!userBackground.startsWith('bg-') ? { backgroundImage: userBackground, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} 
            />
            <div className={`absolute inset-0 bg-black/${userBackground.startsWith('bg-gradient') ? '30' : '0'} rounded-lg`} />
            
            {/* Profile Settings Button */}
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="bg-black/30 hover:bg-black/50 transition-colors">
                    <Settings className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700">
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)} className="text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/logout"} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Profile Info */}
          <div className="absolute -bottom-4 left-8 right-8 flex justify-between items-end">
            <div className="flex items-end">
              {isLoading ? (
                <div className="h-24 w-24 bg-gray-200 animate-pulse rounded-full border-4 border-white dark:border-zinc-800"></div>
              ) : (
                <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-800 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}>
                  <AvatarImage src={profileImage} alt={userName} />
                  <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              )}
              <div className="ml-4 mb-6">
                <h1 className="text-2xl font-bold text-white drop-shadow-md" data-notranslate>{userName}</h1>
                <p className="text-gray-100 drop-shadow-md" data-notranslate>{userRole}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements Card */}
          <Card className="col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Bell className="h-5 w-5 text-[#C7AC59]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { title: "Homecoming Spirit Week", date: "September 30th - October 4th", icon: PartyPopper },
                  { title: "NO SCHOOL - Teacher Professional Development Day", date: "October 9th", icon: BookOpen },
                  { title: "\"FALL FOLLIES\" HIGH SCHOOL TALENT SHOW", date: "October 17th", icon: Music },
                ].map((announcement, index) => (
                  <div key={index} className="flex items-center p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <announcement.icon className="h-8 w-8 text-[#C7AC59] mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{announcement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <div className="grid grid-cols-2 gap-4 h-full">
                {quickLinks.map((item, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-full flex flex-col items-center justify-center hover:bg-[#C7AC59]/10 hover:border-[#C7AC59] transition-colors" 
                          onClick={() => {
                            if (item.redirect && item.location) {
                              window.location.href = item.location;
                            } else if (item.onClick) {
                              item.onClick();
                            }
                          }}
                        >
                          <item.icon className="h-16 w-16 mb-2 text-[#C7AC59]" style={{ height: '50%', width: '50%' }} />
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

        {/* Featured Programs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8 text-zinc-950 dark:text-white flex items-center">
            <Star className="h-6 w-6 text-[#C7AC59] mr-2" />
            Featured Programs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: "Career Development", description: "Explore career paths and opportunities.", redirect: "/training" },
              { icon: Users, title: "Networking", description: "Connect with peers and professionals.", redirect: "/training#networking" },
              { icon: Library, title: "Skill Building", description: "Enhance your skills with workshops.", redirect: "/training#interview" },
              { icon: Calendar, title: "Events", description: "Stay updated on upcoming events.", redirect: "/#events" },
            ].map((program, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.href = program.redirect}>
                <CardHeader>
                  <program.icon className="w-12 h-12 mb-4 text-[#C7AC59] group-hover:scale-110 transition-transform" />
                  <CardTitle>{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{program.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full group-hover:bg-[#C7AC59] group-hover:text-white transition-colors">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer string={'blocky'} />
    </div>
  );
}
