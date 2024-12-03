// Import necessary dependencies from React and UI components
import { useState, useEffect } from "react"
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      setCurrentDataIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Nav />
      <main>
        {/* Hero Section */}
        <section className="relative h-screen">
          {imageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-label={imageAltTexts[index]}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className={`max-w-2xl ${
                imageData[currentDataIndex].alignment === 'right' ? 'ml-auto' : ''
              }`}>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  {imageData[currentDataIndex].title}
                </h1>
                <p className="text-xl md:text-2xl text-zinc-200 mb-8">
                  {imageData[currentDataIndex].description}
                </p>
                <button 
                  onClick={() => {
                    window.location.href = imageData[currentDataIndex].redirect;
                  }}
                  className="px-8 py-4 bg-[#C7AC59] text-white text-lg font-semibold rounded-lg
                    hover:bg-[#341A00] transition-colors duration-300"
                >
                  {imageData[currentDataIndex].buttonText}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentDataIndex(index);
                  setCurrentImageIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentDataIndex === index ? 'bg-[#C7AC59]' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Switch to image ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-20 bg-white dark:bg-zinc-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-[#C7AC59]">
              Latest Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              }].map((announcement, index) => (
                <div key={index} className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <time className="text-[#C7AC59] font-medium">{announcement.date}</time>
                  <h3 className="text-xl font-bold mt-2 mb-4 text-zinc-900 dark:text-[#C7AC59]">{announcement.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">{announcement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-[#C7AC59]">
              Featured Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: GraduationCap, title: "Career Development", description: "We provide resources and guidance to help students navigate their career paths and achieve their professional goals.", redirect: "/training#resume" },
                { icon: Users, title: "Networking Opportunities", description: "Students can connect with industry professionals and peers to build valuable relationships and enhance their career prospects.", redirect: "/training#networking" },
                { icon: Library, title: "Skill Building Workshops", description: "Our workshops focus on essential skills such as resume writing, interview preparation, and job search strategies to empower students.", redirect: "/training#interview" },
                { icon: Calendar, title: "Job Posting Platform", description: "Employers can easily upload job opportunities, allowing students to access a wide range of career options tailored to their interests.", redirect: "/postings" },
              ].map((program, index) => (
                <div key={index} className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <program.icon className="w-12 h-12 text-[#C7AC59] mb-6" />
                  <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-[#C7AC59]">{program.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-6">{program.description}</p>
                  <button 
                    onClick={() => {
                      window.location.href = program.redirect;
                    }}
                    className="text-[#C7AC59] font-semibold hover:text-[#341A00] transition-colors duration-300"
                  >
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20 bg-white dark:bg-zinc-800" id="events">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-[#C7AC59]">
              Upcoming Events
            </h2>
            <div className="space-y-8">
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
                <div key={index} className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-[#C7AC59]">{event.title}</h3>
                    <time className="text-[#C7AC59] font-medium mt-2 md:mt-0">{event.date}</time>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-6">{event.description.text}</p>
                  
                  {event.description.type === "both" && (
                    <div className="mt-6">
                      <img 
                        src={event.description.imageUrl} 
                        alt={event.description.imageCaption}
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(event.description.imageUrl)}
                      />
                      <p className="text-sm text-center mt-4 text-zinc-500 dark:text-zinc-400">
                        {event.description.imageCaption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer string={"blocky"} />
      <ImageOverlay image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  )
}