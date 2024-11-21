// Import necessary dependencies and UI components
import { useEffect } from 'react';
import Nav from '@/components/ui/nav';
import Footer from '@/components/ui/footer';
import interviewImg from '@/assets/pexels-nappy-935977.jpg';
import resumeImg from '@/assets/AdobeStock_208753444.jpeg';
import networkingImg from '@/assets/AdobeStock_1065539842.jpeg';

export default function TrainingResources() {
  // Set page title on component mount
  useEffect(() => {
    document.title = 'Career Training Resources | HHS';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Nav />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl pt-24">
        <header className="text-center mb-20">
          <h1 className="text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300">
            Career Preparation Guide
          </h1>
          <div className="text-zinc-600 dark:text-zinc-400 text-xl font-serif italic mb-10 max-w-2xl mx-auto">
            Essential resources and strategies for launching your professional career
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 mx-auto rounded-full"></div>
        </header>

        <article className="prose dark:prose-invert prose-lg max-w-none">
          <section className="mb-24" id="interview">
            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={interviewImg} 
                alt="Job Interview" 
                className="w-full h-80 object-cover"
              />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-8 text-zinc-800 dark:text-zinc-100">Mastering the Job Interview</h2>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              The job interview represents a crucial moment in your career journey - it's your opportunity to bring your 
              resume to life and demonstrate why you're the ideal candidate. Success in interviews isn't just about 
              having the right qualifications; it's about preparation, presentation, and authentic communication. The way you 
              present yourself in these critical moments can make all the difference in landing your dream job. Understanding 
              the psychology of interviews and how to effectively communicate your value proposition is essential for success.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              Before your interview, thoroughly research the company's mission, values, recent projects, and industry position. 
              This knowledge demonstrates genuine interest and helps you align your responses with the organization's goals.
              Practice the STAR method (Situation, Task, Action, Result) to structure your responses to behavioral questions.
              Additionally, prepare examples that highlight your problem-solving abilities, leadership experience, and adaptability.
              Understanding the company's culture and values will help you demonstrate how you'll fit into their team and contribute
              to their success. Research recent news, developments, and challenges in the industry to show your broader awareness.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              During the interview, maintain good eye contact, listen actively, and provide specific examples from your experience.
              Remember to prepare thoughtful questions about the role and company - this shows initiative and engagement.
              Pay attention to your body language, maintain a positive attitude, and show enthusiasm for the opportunity.
              Consider preparing a brief portfolio or presentation to showcase your work, if appropriate for the role.
              Your non-verbal communication is just as important as your verbal responses - maintain good posture, offer a firm
              handshake, and demonstrate confidence through your body language.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              Post-interview follow-up is crucial and often overlooked. Within 24 hours, send a personalized thank-you note
              that references specific points from your conversation. This demonstrates professionalism and reinforces your
              interest in the position. Use this opportunity to address any points you feel you could have explained better
              during the interview or to provide additional information that supports your candidacy. Keep the momentum going
              by continuing your job search while waiting for a response, and maintain a professional demeanor in all
              follow-up communications.
            </p>
            <div className="my-10 pl-6 border-l-4 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-r-xl">
              <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
                <li>Research the company thoroughly before the interview - review their website, recent news, and social media presence</li>
                <li>Prepare STAR method responses for at least 10 common behavioral questions</li>
                <li>Practice common interview questions with a friend or record yourself to improve delivery</li>
                <li>Dress professionally and arrive 10-15 minutes early - plan your route in advance</li>
                <li>Bring extra copies of your resume, a notepad, and work samples if relevant</li>
                <li>Send a personalized thank-you note within 24 hours highlighting key discussion points</li>
                <li>Follow up appropriately if you haven't heard back within the specified timeframe</li>
                <li>Practice virtual interview etiquette if the interview is remote</li>
              </ul>
            </div>
            <div className="aspect-video mb-8 rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/HG68Ymazo18"
                title="Interview Tips"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent my-20"></div>

          <section className="mb-24" id="resume">
            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={resumeImg} 
                alt="Resume Writing" 
                className="w-full h-80 object-cover"
              />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-8 text-zinc-800 dark:text-zinc-100">Crafting an Effective Resume</h2>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              Your resume serves as your professional narrative, a carefully curated document that opens doors to 
              opportunities. In today's competitive job market, a well-crafted resume isn't just a summary of your 
              experience—it's a strategic marketing tool that positions you as the solution to an employer's needs.
              Think of it as your personal branding document that needs to capture attention within seconds. Modern
              resumes must be optimized not only for human readers but also for Applicant Tracking Systems (ATS)
              that screen candidates before human eyes ever see the document.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              Start with a compelling professional summary that highlights your key strengths and career objectives.
              This summary should be tailored to each position, incorporating relevant keywords and highlighting your
              most impressive achievements. The professional summary sets the tone for your entire resume and should
              grab the reader's attention immediately. Consider this section your "elevator pitch" - it should clearly
              communicate your value proposition and what makes you unique as a candidate.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              The body of your resume should tell a compelling story of your professional growth and achievements.
              Each role should be described with strong action verbs and specific, quantifiable results. Instead of
              simply listing job duties, focus on how you contributed to your previous organizations' success. Use
              metrics whenever possible - percentages, dollar amounts, team sizes, and other concrete numbers help
              paint a clear picture of your impact. Remember to highlight both technical skills and soft skills
              that are relevant to your target role.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              In the digital age, your resume should be complemented by a strong online presence. Include links to
              your LinkedIn profile, professional portfolio, or relevant social media accounts. Consider creating
              different versions of your resume for different purposes - a traditional PDF version, a web-based
              version, and perhaps even a video resume for creative fields. Keep your formatting clean and
              professional, ensuring your resume is easily readable on both desktop and mobile devices.
            </p>
            <div className="my-10 pl-6 border-l-4 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-r-xl">
              <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
                <li>Tailor your resume for each position using keywords from the job description</li>
                <li>Use powerful action verbs and quantifiable achievements with specific metrics</li>
                <li>Keep formatting consistent and professional - stick to 1-2 fonts maximum</li>
                <li>Proofread multiple times and have others review it for feedback</li>
                <li>Include relevant skills, certifications, and professional development</li>
                <li>Update your resume regularly with new achievements and skills</li>
                <li>Create different versions for different types of roles or industries</li>
                <li>Include a link to your professional portfolio or GitHub if relevant</li>
              </ul>
            </div>
            <div className="aspect-video mb-8 rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/Tt08KmFfIYQ"
                title="Resume Writing"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent my-20"></div>

          <section className="mb-24" id="networking">
            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={networkingImg} 
                alt="Professional Networking" 
                className="w-full h-80 object-cover"
              />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-8 text-zinc-800 dark:text-zinc-100">Professional Networking</h2>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              In the modern professional landscape, your network can be as valuable as your skills and qualifications. 
              Building and maintaining professional relationships opens doors to opportunities that might never be 
              publicly advertised and provides crucial support throughout your career journey. Studies show that up to 
              80% of jobs are filled through networking, making it an essential skill for career advancement. Successful
              networking isn't about collecting contacts - it's about building genuine, mutually beneficial relationships
              that can last throughout your career.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              LinkedIn has become an essential platform for professional networking in the digital age. Your profile
              should tell your professional story effectively, with a compelling headline, professional photo, and
              detailed experience section. Engage regularly with industry content, share valuable insights, and
              participate in relevant group discussions. Build your personal brand by publishing articles, sharing
              industry news, and commenting thoughtfully on others' posts. Remember that your online presence is
              often the first impression potential employers or connections will have of you.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              In-person networking remains invaluable despite the digital age. Industry events, conferences, and
              professional meetups provide opportunities to make meaningful connections. Approach these events with
              a strategy - research attendees beforehand, prepare talking points, and follow up promptly afterward.
              Consider volunteering for professional organizations or industry events to gain visibility and demonstrate
              your commitment to your field. Remember that effective networking is about quality over quantity.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-zinc-700 dark:text-zinc-300">
              Maintaining and nurturing your network is just as important as building it. Regular check-ins, sharing
              relevant opportunities, and offering support to others helps keep your network strong and active. Consider
              creating a system to track your networking activities and follow-ups. Remember that networking is a
              two-way street - look for ways to add value to your connections' professional lives, not just what
              they can do for you. Building a reputation as a helpful and knowledgeable professional will make
              others more likely to think of you when opportunities arise.
            </p>
            <div className="my-10 pl-6 border-l-4 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-r-xl">
              <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
                <li>Maintain an updated LinkedIn profile with regular activity and engagement</li>
                <li>Attend industry events, conferences, and career fairs - both virtual and in-person</li>
                <li>Join and actively participate in professional associations in your field</li>
                <li>Follow up with connections regularly through personalized messages</li>
                <li>Share relevant industry insights and contribute to professional discussions</li>
                <li>Offer help and support to others before asking for favors</li>
                <li>Develop an elevator pitch for different networking scenarios</li>
                <li>Create a system to track and nurture your professional relationships</li>
                <li>Consider starting a professional blog or podcast to showcase expertise</li>
              </ul>
            </div>
            <div className="aspect-video mb-8 rounded-2xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/IO5Ht7yV_0A"
                title="Networking Tips"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        </article>
      </main>

      <Footer string="blocky" />
    </div>
  );
}
