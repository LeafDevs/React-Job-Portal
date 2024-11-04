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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { useParams } from 'react-router-dom';

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
  questions: any[];
  jobQuestions: any[];
  createdAt: string;
  jobCreatedAt: string;
  accepted: boolean;
  profile_picture?: string;
}

export default function EmployerApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/applications/job?jobId=${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
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

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/applications/${applicationId}/status`, {
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

      // Update local state
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

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' ? true : app.status === statusFilter
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow container mx-auto px-4 py-8 mt-24 mb-28">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applications for {applications[0]?.jobTitle || 'Job'}</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
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
                        <div className="flex gap-2">
                          {application.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
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
      <Footer string={'blocky'} />
    </div>
  );
}