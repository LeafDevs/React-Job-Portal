// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { HelpCircle } from 'lucide-react';

// Define the Application interface to type-check the application data
interface Application {
  id: string;
  applicantName: string;
  jobTitle: string;
  company: string;
  location: string;
  description: string;
  payrate: number;
  tags: string[];
  icon: string;
  requirements: string[];
  status: 'pending' | 'accepted' | 'rejected';
  questions: string[];
  answers: string[];
  createdAt: string;
  jobCreatedAt: string;
  accepted: boolean;
  profile_picture?: string;
}

export default function EmployerApplications() {
  // State management for applications and UI controls
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appPage, setAppPage] = useState(1);

  // Set page title on component mount
  useEffect(() => {
    document.title = 'Applications | HHS';
  }, []);

  // Fetch applications data on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      // Redirect to auth if no token exists
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      try {
        // Fetch applications from API
        const response = await fetch(`https://api.lesbians.monster/applications/job`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        // Handle error responses
        if (data.code === 401) {
          throw new Error('Unauthorized');
        }
        
        if (data.code === 500) {
          throw new Error(data.error);
        }

        setApplications(data);
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Function to update application status (accept/reject)
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://api.lesbians.monster/applications/${applicationId}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.code === 400 || data.code === 500) {
        throw new Error(data.error);
      }

      // Update local state with new status
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as 'pending' | 'accepted' | 'rejected' } 
            : app
        )
      );
    } catch (error) {
      setError('Failed to update application status');
    }
  };

  // Filter applications based on selected status
  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' ? true : app.status === statusFilter
  );

  // Get appropriate badge color based on application status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show application answers in dialog
  const showAnswers = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow container mx-auto px-4 py-8 mt-24 mb-28">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applications for {applications[0]?.jobTitle || 'Job'}</CardTitle>
            {/* Status filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[180px] border border-gray-300 rounded-md p-2 bg-[#C7AC59] text-white shadow-lg hover:bg-[#C7AC59]/80 transition-all duration-300">
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Applications
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setStatusFilter('all')}>All Applications</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter('accepted')}>Accepted</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {/* Loading and error states */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
              // Applications table
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={application.profile_picture} />
                          <AvatarFallback>
                            {application.applicantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {application.applicantName}
                      </TableCell>
                      <TableCell>{application.jobTitle}</TableCell>
                      <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {/* Accept/Reject buttons only shown for pending applications */}
                          {application.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"/>
                                  <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-transparent"
                            onClick={() => showAnswers(application)}
                          >
                            <HelpCircle className="h-5 w-5 text-[#C7AC59]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Dialog for showing application answers */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Application Responses</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedApplication?.questions
              .slice((appPage - 1) * 2, appPage * 2)
              .map((question, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Question {(appPage - 1) * 2 + index + 1}:
                    <span className="font-normal ml-2">{question}</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-primary">
                    {selectedApplication.answers[(appPage - 1) * 2 + index] || 'No response provided'}
                  </p>
                </div>
            ))}
          </div>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setAppPage(p => Math.max(1, p - 1))}
              disabled={appPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {appPage} of {Math.ceil((selectedApplication?.questions.length || 0) / 2)}
            </span>
            <Button
              variant="outline" 
              onClick={() => setAppPage(p => p + 1)}
              disabled={!selectedApplication || appPage >= Math.ceil(selectedApplication.questions.length / 2)}
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer string={'blocky'} />
    </div>
  );
}