import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Book, Calendar, Users, Bell, Settings, UserCog, FileText, ChartBar, GraduationCap } from 'lucide-react';
import Nav from "@/components/ui/nav";
import Footer from "@/components/ui/footer";
import Raleway from "../fonts/Raleway.ttf";

function Dash({ userType = 'student' }) {
  const [notifications, setNotifications] = useState(1);

  const cardData = {
    student: [
      { icon: <Briefcase className="w-6 h-6 mr-2" />, title: "Job Applications", content: "5 active applications", buttonText: "View Applications" },
      { icon: <Calendar className="w-6 h-6 mr-2" />, title: "Upcoming Events", content: "2 events this week", buttonText: "View Calendar" },
      { icon: <Bell className="w-6 h-6 mr-2" />, title: "Messages", content: `${notifications} unread messages`, buttonText: "View Messages", onClick: () => setNotifications(0) },
      { icon: <Settings className="w-6 h-6 mr-2" />, title: "Settings", content: "Manage your account settings", buttonText: "Go to Settings" },
    ],
    admin: [
      { icon: <UserCog className="w-6 h-6 mr-2" />, title: "User Management", content: "Manage 500+ users", buttonText: "Manage Users" },
      { icon: <FileText className="w-6 h-6 mr-2" />, title: "Reports", content: "10 new reports", buttonText: "View Reports" },
      { icon: <Calendar className="w-6 h-6 mr-2" />, title: "Upcoming Events", content: "5 events to approve", buttonText: "Manage Events" },
      { icon: <Bell className="w-6 h-6 mr-2" />, title: "Notifications", content: `${notifications} system alerts`, buttonText: "View Alerts", onClick: () => setNotifications(0) },
      { icon: <Settings className="w-6 h-6 mr-2" />, title: "System Settings", content: "Configure system parameters", buttonText: "Open Settings" },
    ],
    employer: [
      { icon: <Briefcase className="w-6 h-6 mr-2" />, title: "Job Postings", content: "3 active job postings", buttonText: "Manage Postings" },
      { icon: <Users className="w-6 h-6 mr-2" />, title: "Applicants", content: "15 new applicants", buttonText: "Review Applicants" },
      { icon: <Calendar className="w-6 h-6 mr-2" />, title: "Interviews", content: "5 scheduled interviews", buttonText: "View Schedule" },
      { icon: <Bell className="w-6 h-6 mr-2" />, title: "Notifications", content: `${notifications} unread messages`, buttonText: "View Messages", onClick: () => setNotifications(0) },
      { icon: <Settings className="w-6 h-6 mr-2" />, title: "Company Settings", content: "Manage company profile", buttonText: "Edit Profile" },
    ],
  };

  const cards = cardData[userType] || cardData.student;

  return (
    <div className={`bg-[#f7efd7] text-[#341A00] min-h-screen flex flex-col items-center justify-center`}>
      <Nav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card key={index} className="bg-white text-[#341A00] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  {card.icon}
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">{card.content}</p>
                <Button 
                  className="w-full bg-[#341A00] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-[#341A00] transition duration-200"
                  onClick={card.onClick}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dash;
