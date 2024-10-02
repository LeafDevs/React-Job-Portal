import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { SetStateAction, useState } from 'react'
import { CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, DollarSign, TagIcon, ShoppingBasket, ForkKnife, Coffee, User, Home, Truck } from 'lucide-react' // Importing icons from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu" // Importing dropdown components

const jobListings = [
  {
    title: "Retail Cashier",
    company: "Walmart",
    location: "Natrona Heights, PA",
    description: "As a Retail Cashier at Walmart, you will provide excellent customer service while processing transactions and assisting customers with their purchases.",
    payrate: 12,
    tags: ["Retail", "Customer Service"],
    icon: ShoppingBasket // Default icon
  },
  {
    title: "Fast Food Crew Worker",
    company: "McDonald's",
    location: "Natrona Heights, PA",
    description: "Join our vibrant team at McDonald's, where your positive attitude and enthusiasm will help create a welcoming environment for our customers. Be part of a fast-paced team that values service and smiles!",
    payrate: 11,
    tags: ["Food Service", "Teamwork"],
    icon: ForkKnife // Default icon
  },
  {
    title: "Cafe Worker",
    company: "Harvest Moon Coffee & Chocolates",
    location: "Tarentum, PA",
    description: "Join our friendly team at Harvest Moon Coffee & Chocolates, where you'll serve delicious coffee and pastries while providing excellent customer service.",
    payrate: 13,
    tags: ["Food Service", "Customer Service"],
    icon: Coffee // Default icon
  },
  {
    title: "Delivery Driver",
    company: "Pizza Hut",
    location: "Natrona Heights, PA",
    description: "As a Delivery Driver at Pizza Hut, you will be responsible for delivering pizzas and ensuring customer satisfaction.",
    payrate: 10,
    tags: ["Delivery", "Customer Service"],
    icon: Truck // Icon for delivery
  },
  {
    title: "Sales Associate",
    company: "Target",
    location: "Natrona Heights, PA",
    description: "Join our team at Target as a Sales Associate, where you will assist customers and maintain store presentation.",
    payrate: 14,
    tags: ["Retail", "Sales"],
    icon: Briefcase // Icon for sales
  },
  {
    title: "Warehouse Worker",
    company: "Amazon",
    location: "Pittsburgh, PA",
    description: "As a Warehouse Worker at Amazon, you will be responsible for picking, packing, and shipping orders.",
    payrate: 15,
    tags: ["Warehouse", "Logistics"],
    icon: Home // Icon for warehouse
  },
];

export default function JobPostings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Changed to an array for multiple tags

  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.payrate.toString().includes(searchTerm)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag))) // Updated to check for multiple tags
  );

  const tags = Array.from(new Set(jobListings.flatMap(job => job.tags)));

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('@/assets/bg-white-4.png')] text-zinc-950 dark:bg-[url('@/assets/bg.png')] dark:text-white bg-no-repeat bg-cover">
      <Nav />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-3xl font-bold mb-6 text-center">Jobs Portal</h1>
          <div className="mb-6 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 rounded-lg p-2 w-10 h-10 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <TagIcon className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag} 
                    checked={selectedTags.includes(tag)} 
                    onClick={() => toggleTag(tag)} // Updated to toggle multiple tags
                    stayOpen // Keep the dropdown open
                  >
                    <TagIcon className="mr-2" /> {/* Icon for each tag */}
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetTags} className="bg-red-500 text-white">Reset Tags</DropdownMenuItem> {/* Reset Tags Button inside dropdown */}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mx-1" /> {/* Added margin between button and input */}
            <Input 
              type="text" 
              placeholder="Search for jobs..." 
              className="flex-grow bg-[#f5f5f5] dark:bg-zinc-800 focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300"
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <Card key={index} className="border-1.5 border-[#C7AC59] bg-[#F5F5F5] dark:bg-zinc-800 flex flex-col drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                  <CardHeader>
                    <CardTitle className="text-[#341A00] dark:text-white flex items-center">
                      {job.icon ? <job.icon className="mr-2" /> : <Briefcase className="mr-2" />} {/* Job icon with default */}
                      {job.title}
                    </CardTitle>
                    <p className="text-[#5A3000] dark:text-white flex items-center">
                      <MapPin className="mr-2" /> {/* Location icon */}
                      {job.company} - {job.location}
                    </p>
                    <CardDescription className="flex items-center">
                      <DollarSign className="mr-2" /> {/* Pay rate icon */}
                      Pay Rate: ${job.payrate}/hr
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-[#341A00] dark:text-white">{job.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center mb-4">
                    <Button variant="outline" className="border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white">Apply Now</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-400">No job postings found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
