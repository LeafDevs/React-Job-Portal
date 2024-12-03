// Import necessary dependencies from React and UI components
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Library, Users } from "lucide-react"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { AnimatePresence, motion } from "framer-motion"

// Import background images and textures
import bgImage from '@/assets/AdobeStock_303970286.jpeg'
import bgImage2 from '@/assets/AdobeStock_208777709.jpeg'
import bgImage3 from '@/assets/AdobeStock_235889550.jpeg'
import bgImage4 from '@/assets/AdobeStock_570507998.jpeg'
import bgImage5 from '@/assets/AdobeStock_759720772.jpeg'
import bgImage6 from '@/assets/AdobeStock_883493509.jpeg'
import texture from '@/assets/girth.jpg'
import text from '@/lib/translate'

const ImageOverlay = ({ image, onClose }: { image: string | null; onClose: () => void }) => {
  if (!image) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          src={image}
          alt="Enlarged view"
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default function HomePage() {
  // Arrays to store image URLs and their corresponding alt texts
  const imageUrls = [bgImage, bgImage2, bgImage3, bgImage6, bgImage5, bgImage4];
  const imageAltTexts = [
    'A person handing you a coffee showcasing the possibility of getting a job as a barista',
    'An image showing someone having an intervie showcasing the training you can go under.',
    'A visual of someone filling out an application.',
    'An image of a delivery driver delivering food to someone.',
    'An image depicting a student undergoing interview training',
    'An image of employers talking showcasing them submitting a posting.'
  ];

  // Set page title on component mount
  useEffect(() => {
    document.title = 'Highlands Career Center | HHS';
  }, []);
  
  // Initial state for image carousel data
  const [imageData, setImageData] = useState([
    {
      title: 'Discover Your Path',
      description: 'Explore diverse career opportunities and find your perfect fit.',
      buttonText: 'Start Exploring',
      alignment: 'left',
      color: 'normal',
      redirect: "/postings"
    },
    {
      title: 'Enhance Your Skills',
      description: 'Access comprehensive training programs to boost your career.',
      buttonText: 'Start Training',
      alignment: 'left',
      color: 'normal',
      redirect: "/training"
    },
    {
      title: 'Effortless Job Posting',
      description: 'Employers can easily create and manage job listings.',
      buttonText: 'Post a Job',
      alignment: 'left',
      color: 'normal',
      redirect: "/auth"
    }
  ]);

  // Effect to handle text translation based on selected language
  useEffect(() => {
    const translateData = async () => {
      const language = localStorage.getItem('language') || 'en';
      const translatedData = await Promise.all(imageData.map(async (item) => ({
        ...item,
        title: await text(item.title, language),
        description: await text(item.description, language),
        buttonText: await text(item.buttonText, language),
      })));
      setImageData(translatedData);
    };

    translateData();
  }, []);

  // State for tracking current image and data indices in carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  // Effect to handle automatic carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      setCurrentDataIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Add this state inside the HomePage component
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Main component render
  return (
    <div className="flex flex-col min-h-screen bg-[rgba(39,39,42,.5)] text-white dark:bg-zinc-800 dark:text-[#C7AC59]">
      <Nav />
      <main className="flex-grow">
        {/* Hero section with image carousel */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          {imageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={imageAltTexts[index]}
            />
          ))}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-4 md:p-24">
            <div 
              className="w-full md:w-2/3 max-w-xl font-poppins transition-all duration-1000 ease-in-out"
              style={{
                alignSelf: imageData[currentDataIndex].alignment === 'right' ? 'flex-end' : 'flex-start',
                textAlign: imageData[currentDataIndex].alignment === 'right' ? 'right' : 'left'
              }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-[#f5f5f5] whitespace-normal break-words drop-shadow-[0_4px_2px_rgba(0,0,0,1)]">
                {imageData[currentDataIndex].title}
              </h2>
              <p className="text-lg md:text-2xl mt-4 md:mt-6 text-[#f5f5f5] whitespace-normal break-words drop-shadow-[0_4px_2px_rgba(0,0,0,0.5)]">
                {imageData[currentDataIndex].description}
              </p>
              <Button 
                className={`
                  rounded-md bg-[#C7AC59] mt-4 md:mt-8 px-4 md:px-6 py-2 md:py-4 text-base md:text-xl text-[#f5f5f5] 
                  transition-colors duration-300 cursor-pointer
                  hover:bg-[#341A00] hover:text-[#C7AC59]
                  whitespace-nowrap overflow-hidden text-ellipsis
                  min-w-[120px] md:min-w-[150px] max-w-[200px] md:max-w-[300px]
                  z-10 relative
                `}
                onClick={() => {
                  window.location.href = imageData[currentDataIndex].redirect;
                }}
              >
                {imageData[currentDataIndex].buttonText}
              </Button>
              {/* Carousel navigation dots */}
              <div className={`flex mt-4 md:mt-8 space-x-4 relative z-10`}>
                {[0, 1, 2].map((index) => (
                  <svg
                    key={index}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    onClick={() => {
                      setCurrentDataIndex(index);
                      setCurrentImageIndex(index === 0 ? 0 : index === 1 ? 1 : 2);
                    }}
                    className="cursor-pointer"
                    aria-label={`Switch to image ${index + 1}`}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      fill={currentDataIndex === index ? '#C7AC59' : 'rgba(255,255,255,0.5)'}
                      className="transition-colors duration-300 hover:fill-opacity-75"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Decorative divider with texture */}
        <div className="relative">
          <svg className="absolute top-0 left-0 w-full h-1/4 z-10" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1366 192" style={{ top: '0', transform: 'translateY(-50%)' }}>
            <defs>
              <pattern id="dividerPattern" patternUnits="userSpaceOnUse" width="1366" height="192">
                <image href={texture} x="0" y="0" width="1366" height="192" preserveAspectRatio="xMidYMid slice" opacity="0.25" />
              </pattern>
            </defs>
            <path d="M1365.47,142.315C666.01,76.815.53,142.315.53,142.315l-.07-76.42s669.52-68.04,1365.09,0l-.08,76.42Z" fill="currentColor" stroke="currentColor" strokeWidth="0" className="dark:fill-[#C7AC59] fill-[#f5f5f5] drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"/>
            <path d="M1365.47,142.315C666.01,76.815.53,142.315.53,142.315l-.07-76.42s669.52-68.04,1365.09,0l-.08,76.42Z" fill="url(#dividerPattern)" fillOpacity="0.5" stroke="none"/>
          </svg>
          <div className="py-8 md:py-16 relative">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('@/assets/bg-white-4-seamless.png')] bg-repeat bg-center dark:bg-[url('@/assets/bg.png')] backdrop-filter backdrop-blur-[30px] border-t-25 border-b-25 border-stone-400 rounded-t-25 rounded-b-25"></div>
            <div className="relative">
              {/* Announcements section */}
              <section className="mb-8 md:mb-16">
                <div className="container mx-auto px-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-zinc-950 dark:text-[#C7AC59]">Announcements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[{
                        date: "September 30th",
                        title: "Homecoming Dance",
                        description: "On October 5th, we will be hosting a homecoming dance for grades 9-12. Dress in appropriate attire and enjoy the night! The event will conclude at 10:00pm, so make sure to plan your evening accordingly."
                      },
                      {
                        date: "September 23rd",
                        title: "School Calendars",
                        description: "The 2024-25 Highlands Activities Calendar was mailed to the homes of Highlands families. Extras are available at all school buildings. Access the online version of the calendar here: 2024-25 Highlands Activities Calendar"
                    },
                    {
                        date: "September 19th",
                        title: "Picture Day!",
                        description: "It's that time of the year again! School picture season is here. You can order your child's picture here. This is a great opportunity to capture their school year memories. Don't miss out! Order your pictures today!"
                    }
                    ].map((announcement, index) => (
                      <Card key={index} className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-400 dark:bg-zinc-800'} flex flex-col`}>
                        <CardHeader>
                          <CardTitle className="text-lg md:text-xl text-[#341A00] dark:text-[#C7AC59]">{announcement.title}</CardTitle>
                          <CardDescription className="text-sm md:text-base text-[#5A3000] dark:text-[#C7AC59]">Posted on {announcement.date}, 2023</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm md:text-base text-[#5A3000] dark:text-[#C7AC59]">{announcement.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                    </div>
                  </div>
                </section>

                {/* Featured Programs section */}
                <section className="mb-8 md:mb-16">
                  <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-zinc-950 dark:text-[#C7AC59]">Featured Programs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {[
                        { icon: GraduationCap, title: "Career Development", description: "We provide resources and guidance to help students navigate their career paths and achieve their professional goals.", redirect: "/training#resume" },
                        { icon: Users, title: "Networking Opportunities", description: "Students can connect with industry professionals and peers to build valuable relationships and enhance their career prospects.", redirect: "/training#networking" },
                        { icon: Library, title: "Skill Building Workshops", description: "Our workshops focus on essential skills such as resume writing, interview preparation, and job search strategies to empower students.", redirect: "/training#interview" },
                        { icon: Calendar, title: "Job Posting Platform", description: "Employers can easily upload job opportunities, allowing students to access a wide range of career options tailored to their interests.", redirect: "/postings" },
                      ].map((program, index) => (
                        <Card key={index} className={`border-1.5 border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-400 dark:bg-zinc-800'} flex flex-col h-full`}>
                          <CardHeader>
                            <program.icon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 text-[#341A00] dark:text-[#C7AC59]" />
                            <CardTitle className="text-lg md:text-xl text-[#341A00] dark:text-[#C7AC59]">{program.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-sm md:text-base text-[#5A3000] dark:text-[#C7AC59]">{program.description}</p>
                          </CardContent>
                          <CardFooter className="mt-auto">
                            <Button variant="outline" className="w-full text-sm md:text-base border-[#341A00] hover:border-[#341A00] text-[#341A00] hover:bg-[#341A00] hover:text-white dark:border-[#C7AC59] dark:text-[#C7AC59] dark:hover:bg-[#C7AC59] dark:hover:text-white" onClick={() => {
                              window.location.href = program.redirect;
                            }}>Learn More</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="mb-8 md:mb-16" id="events">
                  <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-zinc-950 dark:text-white">Upcoming Events</h2>
                    <div className="space-y-4">
                      {[
                        { 
                          date: "September 30th - October 4th", 
                          title: "Homecoming Spirit Week - All Schools!", 
                          description: {
                            type: "both",
                            text: "Get ready for an exciting week of school spirit! Check out our daily themes and activities in the schedule below.",
                            imageUrl: "https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Domain/1/2024%20HoCo%20Spirit%20Week%20Facebook%20Post.jpg",
                            imageCaption: "Spirit Week Schedule and Activities"
                          }
                        },
                        { 
                          date: "October 5th", 
                          title: "Homecoming Dance (Grades 9-12) (HS)", 
                          description: {
                            type: "text",
                            text: "Join us for an unforgettable evening of dancing, music, and memories! The Homecoming Dance is a cherished tradition where students can celebrate school spirit in style. Dress code is formal/semi-formal. Tickets will be available for purchase in advance."
                          }
                        },
                        { 
                          date: "October 9th", 
                          title: "NO SCHOOL FOR STUDENTS - Teacher Professional Development Day", 
                          description: {
                            type: "text",
                            text: "Students will have the day off while teachers participate in professional development activities to enhance their teaching skills and curriculum planning."
                          }
                        },
                        { 
                          date: "October 17th", 
                          title: "\"FALL FOLLIES\" HIGH SCHOOL TALENT SHOW (HS Aud.)", 
                          description: {
                            type: "text",
                            text: "Come witness the incredible talents of our high school students! From musical performances to comedy acts, dance routines to magic shows - this evening promises entertainment for everyone. Tickets available at the door."
                          }
                        },
                      ].map((event, index) => (
                        <Card key={index} className={`border-1.5 border-[#341A00] dark:border-[#C7AC59] drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'bg-zinc-300 dark:bg-zinc-800' : 'bg-zinc-400 dark:bg-zinc-900'}`}>
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <CardTitle className="text-lg md:text-xl text-[#341A00] dark:text-[#C7AC59]">{event.title}</CardTitle>
                              <span className="text-sm md:text-base text-[#341A00] dark:text-[#C7AC59] mt-2 md:mt-0" data-notranslate>{event.date}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <CardDescription className="text-sm md:text-base text-[#341A00] dark:text-[#C7AC59]">
                                {event.description.text}
                              </CardDescription>
                              
                              {event.description.type === "both" && (
                                <div className="mt-4">
                                  <div className="flex flex-col items-end mb-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs border-[#341A00] hover:border-[#341A00] text-[#341A00] hover:bg-[#341A00] hover:text-white dark:border-[#C7AC59] dark:text-[#C7AC59] dark:hover:bg-[#C7AC59] dark:hover:text-white"
                                      onClick={() => {
                                        const img = document.getElementById(`event-image-${index}`);
                                        if (img) {
                                          img.style.display = img.style.display === 'none' ? 'block' : 'none';
                                        }
                                      }}
                                    >
                                      Toggle Image
                                    </Button>
                                  </div>
                                  <img 
                                    id={`event-image-${index}`}
                                    src={event.description.imageUrl} 
                                    alt={event.description.imageCaption}
                                    className="w-full max-w-md mx-auto rounded-lg shadow-lg object-contain cursor-pointer"
                                    style={{ maxHeight: '300px', display: 'none' }}
                                    onClick={() => event.description.imageUrl && setSelectedImage(event.description.imageUrl)}
                                  />
                                  <p className="text-xs text-center mt-2 text-[#341A00] dark:text-[#C7AC59]">
                                    {event.description.imageCaption}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      <Footer string={"blocky"} />
      <ImageOverlay image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  )
}