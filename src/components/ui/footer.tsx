import { Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#341A00] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Contact Us</h3>
              <p>1500 Pacific Avenue</p>
              <p>Natrona Heights, PA 15084</p>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <p>Phone: (724) 226 2400</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <p>Email: admin@placeholder.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="https://www.goldenrams.com/Page/2" className="text-[#C7AC59] hover:text-white transition-colors">School Calendar</a></li>
                <li><a href="#" className="text-[#C7AC59] hover:text-white transition-colors">Grades Portal</a></li>
                <li><a href="#" className="text-[#C7AC59] hover:text-white transition-colors">Student Resources</a></li>
                <li><a href="#" className="text-[#C7AC59] hover:text-white transition-colors">Staff Directory</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C7AC59]">Stay Connected</h3>
              <p className="mb-4">Follow us on social media for the latest updates and news.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-[#C7AC59] hover:text-white transition-colors">
                  <Facebook className="h-8 w-8" />
                </a>
                <a href="#" className="text-[#C7AC59] hover:text-white transition-colors">
                  <Twitter className="h-8 w-8" />
                </a>
                <a href="#" className="text-[#C7AC59] hover:text-white transition-colors">
                  <Instagram className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Highlands School District. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

