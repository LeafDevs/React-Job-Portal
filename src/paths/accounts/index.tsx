// Import necessary dependencies and UI components
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import { Input } from "@/components/ui/input";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { MoreHorizontal, UserCheck, Trash, Search } from 'lucide-react';

// Define the Account interface for type checking
interface Account {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  profile_picture?: string;
}

export default function AdminAccounts() {
  // State management for accounts and UI controls
  const [accounts, setAccounts] = useState<Account[]>([]); // All accounts
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]); // Filtered accounts based on search
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error messages
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [showResetDialog, setShowResetDialog] = useState(false); // Password reset dialog visibility
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null); // Selected account for actions

  // Set page title and fetch accounts on component mount
  useEffect(() => {
    document.title = 'Accounts Management | HHS';
    fetchAccounts();
    isLoading;  
  }, []);

  // Filter accounts when search query or accounts list changes
  useEffect(() => {
    filterAccounts();
  }, [searchQuery, accounts]);

  // Filter accounts based on search query
  const filterAccounts = () => {
    const filtered = accounts.filter(account => 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(data.accounts);
      setFilteredAccounts(data.accounts);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Handle account actions (make admin, employer, reset password, delete)
  const handleAccountAction = async (accountId: string, action: string) => {
    const token = localStorage.getItem('token');
    try {
      if (action === 'temp-password') {
        setSelectedAccountId(accountId);
        setShowResetDialog(true);
        return;
      }

      const response = await fetch(`http://localhost:3000/admin/accounts/${accountId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} account`);
      }

      fetchAccounts(); // Refresh the accounts list
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  // Handle password reset confirmation
  const handlePasswordReset = async () => {
    if (!selectedAccountId) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/admin/accounts/${selectedAccountId}/temp-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setError('Password has been reset to "password"');
      setShowResetDialog(false);
      setSelectedAccountId(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  // Render the admin accounts management interface
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Nav />
      {/* Password reset confirmation dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Reset Password</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              This will reset the user's password to "password". They will be required to change it on their next login.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordReset}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Reset Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Main content area */}
      <div className="flex-grow container mx-auto px-4 py-8 mt-24">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Account Management</CardTitle>
              {/* Search input */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Error message display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {/* Accounts table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account.profile_picture} />
                        <AvatarFallback>{account.name[0]}</AvatarFallback>
                      </Avatar>
                      {account.name}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        account.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* Account actions dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {account.type !== 'admin' && (
                            <DropdownMenuItem 
                              onClick={() => handleAccountAction(account.id, 'admin')}
                              className="text-blue-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          {account.type !== 'employer' && (
                            <DropdownMenuItem
                              onClick={() => handleAccountAction(account.id, 'employer')} 
                              className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Make Employer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleAccountAction(account.id, 'temp-password')}
                            className="text-yellow-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAccountAction(account.id, 'delete')}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Footer string="blocky" />
    </div>
  );
}