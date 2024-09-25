import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Nav from "@/components/ui/nav";
import { Tag, Coffee, ShoppingBag, Package, Briefcase, Truck, Hotel, Shield, Scissors, Headphones, ShoppingCart, Dumbbell, Car, Film, Dog, Utensils, IceCream, Flower, Activity, Droplet, Popcorn, BookOpen, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/ui/footer';
const jobPostings = [
  {
    id: 1,
    title: "Fast Food Crew Member",
    description: "Join our team in a fast-paced restaurant environment. Learn customer service skills and food preparation.",
    tags: ["Fast Food", "Customer Service", "Entry Level"],
    payPerHour: 12,
    employerId: "FF001",
    location: "Downtown",
    requirements: "No experience necessary, willingness to learn",
    icon: <Utensils className="w-5 h-5 mr-2" />,
  },
  {
    id: 2,
    title: "Retail Associate",
    description: "Assist customers, organize merchandise, and learn about retail operations in our clothing store.",
    tags: ["Retail", "Customer Service", "Entry Level"],
    payPerHour: 11,
    employerId: "RT002",
    location: "Mall",
    requirements: "Friendly demeanor, basic math skills",
    icon: <ShoppingBag className="w-5 h-5 mr-2" />,
  },
  {
    id: 3,
    title: "Library Assistant",
    description: "Help organize books, assist patrons, and maintain a quiet study environment in the local library.",
    tags: ["Library", "Customer Service", "Organization"],
    payPerHour: 11,
    employerId: "LB003",
    location: "Community Library",
    requirements: "Good organizational skills, love for books",
    icon: <BookOpen className="w-5 h-5 mr-2" />,
  },
  {
    id: 4,
    title: "Office Helper",
    description: "Assist with basic office tasks like filing, data entry, and answering phones.",
    tags: ["Office", "Administrative", "Entry Level"],
    payPerHour: 12,
    employerId: "OF004",
    location: "Business District",
    requirements: "Basic computer skills, attention to detail",
    icon: <Briefcase className="w-5 h-5 mr-2" />,
  },
  {
    id: 5,
    title: "Car Wash Attendant",
    description: "Clean and detail cars, providing excellent customer service in a fast-paced environment.",
    tags: ["Automotive", "Customer Service", "Physical Labor"],
    payPerHour: 11,
    employerId: "CW005",
    location: "Various Locations",
    requirements: "Ability to work outdoors, attention to detail",
    icon: <Car className="w-5 h-5 mr-2" />,
  },
  {
    id: 6,
    title: "Cafe Server",
    description: "Take orders, serve food and beverages, and maintain a clean dining area in a local cafe.",
    tags: ["Food Service", "Customer Service", "Entry Level"],
    payPerHour: 11,
    employerId: "CF006",
    location: "Various Locations",
    requirements: "Friendly attitude, basic math skills",
    icon: <Coffee className="w-5 h-5 mr-2" />,
  },
  {
    id: 7,
    title: "Movie Theater Usher",
    description: "Assist moviegoers, check tickets, and maintain cleanliness in theater auditoriums.",
    tags: ["Entertainment", "Customer Service", "Evening Shift"],
    payPerHour: 11,
    employerId: "MT007",
    location: "Movie Theaters",
    requirements: "Ability to work evenings and weekends",
    icon: <Film className="w-5 h-5 mr-2" />,
  },
  {
    id: 8,
    title: "Grocery Store Bagger",
    description: "Bag groceries, assist customers with carryout, and maintain store cleanliness.",
    tags: ["Retail", "Customer Service", "Entry Level"],
    payPerHour: 11,
    employerId: "GS008",
    location: "Various Locations",
    requirements: "Ability to lift up to 25 lbs, friendly demeanor",
    icon: <ShoppingCart className="w-5 h-5 mr-2" />,
  },
  {
    id: 9,
    title: "Pet Store Associate",
    description: "Care for animals, assist customers with pet supplies, and maintain a clean store environment.",
    tags: ["Retail", "Animal Care", "Customer Service"],
    payPerHour: 11,
    employerId: "PS009",
    location: "Pet Stores",
    requirements: "Love for animals, basic animal care knowledge",
    icon: <PawPrint className="w-5 h-5 mr-2" />,
  },
  {
    id: 10,
    title: "Ice Cream Shop Server",
    description: "Scoop ice cream, prepare sundaes, and provide friendly service to customers.",
    tags: ["Food Service", "Customer Service", "Entry Level"],
    payPerHour: 11,
    employerId: "IC010",
    location: "Various Locations",
    requirements: "Food handler's permit, friendly attitude",
    icon: <IceCream className="w-5 h-5 mr-2" />,
  },
  {
    id: 11,
    title: "Garden Center Helper",
    description: "Assist customers with plant selection, water plants, and maintain outdoor displays.",
    tags: ["Retail", "Gardening", "Customer Service"],
    payPerHour: 11,
    employerId: "GC011",
    location: "Garden Centers",
    requirements: "Ability to work outdoors, basic plant knowledge",
    icon: <Flower className="w-5 h-5 mr-2" />,
  },
  {
    id: 12,
    title: "Recreation Center Attendant",
    description: "Monitor facilities, assist patrons, and maintain cleanliness in a community recreation center.",
    tags: ["Recreation", "Customer Service", "Entry Level"],
    payPerHour: 11,
    employerId: "RC012",
    location: "Community Centers",
    requirements: "CPR certification (training provided), friendly demeanor",
    icon: <Activity className="w-5 h-5 mr-2" />,
  },
  {
    id: 13,
    title: "Concession Stand Worker",
    description: "Prepare and serve snacks and beverages at local sports events or movie theaters.",
    tags: ["Food Service", "Customer Service", "Evening Shift"],
    payPerHour: 11,
    employerId: "CS014",
    location: "Sports Venues, Theaters",
    requirements: "Food handler's permit, ability to work evenings and weekends",
    icon: <Popcorn className="w-5 h-5 mr-2" />,
  },
  {
    id: 14,
    title: "Dog Walker",
    description: "Walk dogs for local pet owners, ensuring their pets get exercise and care.",
    tags: ["Animal Care", "Physical Activity", "Flexible Schedule"],
    payPerHour: 12,
    employerId: "DW015",
    location: "Various Neighborhoods",
    requirements: "Love for dogs, responsible and reliable",
    icon: <Dog className="w-5 h-5 mr-2" />,
  },
];

const allTags = [
  "Fast Food", "Retail", "Warehouse", "Office", "Delivery", "Food Service",
  "Hospitality", "Security", "Landscaping", "Customer Service", "Grocery",
  "Fitness", "Automotive", "Entertainment", "Animal Care", "Management",
  "Sales", "Logistics", "Administrative", "Driving"
];

function Postings() {
  const [sortBy, setSortBy] = useState("default");
  const [filteredPostings, setFilteredPostings] = useState(jobPostings);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...filteredPostings];
    if (value === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === "payHighToLow") {
      sorted.sort((a, b) => b.payPerHour - a.payPerHour);
    } else if (value === "payLowToHigh") {
      sorted.sort((a, b) => a.payPerHour - b.payPerHour);
    }
    setFilteredPostings(sorted);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTagFilter = (tag) => {
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags);
    filterPostings(newSelectedTags, searchTerm);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterPostings(selectedTags, term);
  };

  const filterPostings = (tags, term) => {
    let filtered = jobPostings;
    if (tags.length > 0) {
      filtered = filtered.filter(job => 
        tags.some(tag => job.tags.includes(tag))
      );
    }
    if (term) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
      );
    }
    setFilteredPostings(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7efd7] text-[#341A00]">
      <Nav />
      <div className="flex-grow p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center"></h1>
        
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <Select onValueChange={handleSort}>
              <SelectTrigger className="bg-white w-full md:w-[180px] hover:bg-[#f0f0f0] transition-colors duration-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="default" className="hover:bg-[#C7AC59] hover:text-[#341A00] transition-colors duration-200">Default</SelectItem>
                <SelectItem value="title" className="hover:bg-[#C7AC59] hover:text-[#341A00] transition-colors duration-200">Title</SelectItem>
                <SelectItem value="payHighToLow" className="hover:bg-[#C7AC59] hover:text-[#341A00] transition-colors duration-200">Pay: High to Low</SelectItem>
                <SelectItem value="payLowToHigh" className="hover:bg-[#C7AC59] hover:text-[#341A00] transition-colors duration-200">Pay: Low to High</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Search jobs..."
              onChange={handleSearch}
              className="bg-white w-full md:w-auto flex-grow mr-0 md:mr-4 hover:border-[#C7AC59] hover:bg-[#FFFDF7] transition-colors duration-200 focus:ring-2 focus:ring-[#C7AC59] focus:border-transparent"
              aria-label="Search job postings"
              autoComplete="off"
              spellCheck="false"
              minLength={2}
              maxLength={100}
              required
              onFocus={(e) => e.target.select()}
              onBlur={(e) => e.target.value = e.target.value.trim()}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
          <div className="text-sm mt-4 md:mt-0">
            Showing {filteredPostings.length} of {jobPostings.length} postings
          </div>
        </div>

        <div className="mb-4 md:mb-6 flex items-center space-x-4">
          <motion.button
            onClick={() => setShowTags(!showTags)}
            className={`rounded-full p-2 ${
              showTags ? 'bg-[#341A00]' : 'bg-[#C7AC59]'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tag className={`w-6 h-6 ${
              showTags ? 'text-[#C7AC59]' : 'text-[#341A00]'
            }`} />
          </motion.button>
          <AnimatePresence>
            {showTags && (
              <motion.div 
                className="flex flex-wrap gap-2"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {allTags.map((tag, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Badge 
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag) 
                          ? "bg-[#341A00] text-[#C7AC59]" 
                          : "bg-[#C7AC59] text-[#341A00]"
                      } hover:bg-[#341A00] hover:text-[#C7AC59]`}
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPostings.map((job) => (
            <Card key={job.id} className="bg-white text-[#341A00] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-semibold flex items-center justify-center">
                  {job.icon}
                  {job.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">{job.description}</p>
                <div className="mb-4 text-sm">
                  <p><strong>Pay:</strong> ${job.payPerHour}/hour</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Requirements:</strong> {job.requirements}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {job.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer text-xs bg-[#C7AC59] text-[#341A00] hover:bg-[#341A00] hover:text-[#C7AC59]"
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-[#C7AC59] text-[#341A00] hover:bg-[#341A00] hover:text-[#C7AC59] transition-colors duration-300">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Postings;