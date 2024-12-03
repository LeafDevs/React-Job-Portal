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
  const imageUrls = [bgImage, bgImage2, bgImage3, bgImage6, bgImage5, bgImage4];
  const imageAltTexts = [
    'A person handing you a coffee showcasing the possibility of getting a job as a barista',
    'An image showing someone having an intervie showcasing the training you can go under.',
    'A visual of someone filling out an application.',
    'An image of a delivery driver delivering food to someone.',
    'An image depicting a student undergoing interview training',
    'An image of employers talking showcasing them submitting a posting.'
  ];

  useEffect(() => {
    document.title = 'Highlands Career Center | HHS';
  }, []);
  
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      setCurrentDataIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <Nav />
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          {imageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
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
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {imageData[currentDataIndex].title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                {imageData[currentDataIndex].description}
              </p>
              <Button 
                className="bg-[#C7AC59] hover:bg-[#341A00] text-white px-8 py-3 rounded-lg text-lg"
                onClick={() => {
                  window.location.href = imageData[currentDataIndex].redirect;
                }}
              >
                {imageData[currentDataIndex].buttonText}
              </Button>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {/* Announcements */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-white">Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                date: "September 30th",
                title: "Homecoming Dance",
                description: "On October 5th, we will be hosting a homecoming dance for grades 9-12. Dress in appropriate attire and enjoy the night!"
              },
              {
                date: "September 23rd",
                title: "School Calendars",
                description: "The 2024-25 Highlands Activities Calendar was mailed to the homes of Highlands families. Access the online version here."
              },
              {
                date: "September 19th",
                title: "Picture Day!",
                description: "School picture season is here! Order your child's pictures online. Don't miss out on capturing these memories."
              }].map((announcement, index) => (
                <Card key={index} className="bg-white dark:bg-zinc-800 border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>{announcement.date}, 2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">{announcement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Programs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-white">Featured Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: GraduationCap, title: "Career Development", description: "Resources and guidance for professional growth", redirect: "/training#resume" },
                { icon: Users, title: "Networking", description: "Connect with industry professionals", redirect: "/training#networking" },
                { icon: Library, title: "Skill Building", description: "Essential professional development workshops", redirect: "/training#interview" },
                { icon: Calendar, title: "Job Platform", description: "Access career opportunities", redirect: "/postings" },
              ].map((program, index) => (
                <Card key={index} className="bg-white dark:bg-zinc-800 border-none shadow-lg">
                  <CardHeader>
                    <program.icon className="w-12 h-12 mx-auto mb-4 text-[#C7AC59]" />
                    <CardTitle className="text-center">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-zinc-600 dark:text-zinc-300">{program.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-[#C7AC59] hover:bg-[#341A00] text-white"
                      onClick={() => {
                        window.location.href = program.redirect;
                      }}
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Events */}
          <section id="events">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-white">Upcoming Events</h2>
            <div className="space-y-4">
              {[
                { 
                  date: "September 30th - October 4th",
                  title: "Homecoming Spirit Week",
                  description: {
                    type: "both",
                    text: "Get ready for an exciting week of school spirit! Check out our daily themes and activities.",
                    imageUrl: "https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Domain/1/2024%20HoCo%20Spirit%20Week%20Facebook%20Post.jpg",
                    imageCaption: "Spirit Week Schedule"
                  }
                },
                {
                  date: "October 5th",
                  title: "Homecoming Dance",
                  description: {
                    type: "text",
                    text: "Join us for an unforgettable evening of dancing and memories! Formal/semi-formal attire required."
                  }
                }
              ].map((event, index) => (
                <Card key={index} className="bg-white dark:bg-zinc-800 border-none shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.date}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">{event.description.text}</p>
                    {event.description.type === "both" && (
                      <div className="mt-4">
                        <img
                          src={event.description.imageUrl}
                          alt={event.description.imageCaption}
                          className="w-1/4 mx-auto rounded-lg cursor-pointer"
                          onClick={() => {
                            if (event.description.imageUrl) {
                              setSelectedImage(event.description.imageUrl);
                            }
                          }}
                        />
                        <p className="text-sm text-center mt-2 text-zinc-500 dark:text-zinc-400">
                          {event.description.imageCaption}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer string={"blocky"} />
      <ImageOverlay image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  )
}