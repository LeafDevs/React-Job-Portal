import { Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer({ string: className }: { string: string }) {
    return className === "blocky" ? (
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
                <div className='mt-4 text-center bg-[#341A00]'></div>
                <div className="mt-8 text-center">
                    <p>&copy; 2024 Highlands School District. All rights reserved.</p>

                    <Separator className='mt-4 bg-[#C7AC59]'></Separator>
                    <p className="mt-2 text-sm text-[#C7AC59]">Site Designed by <span className="font-semibold">Aaron Schriver & Vincent Rossetti</span></p>
                </div>
            </div>
        </footer>
    ) : (
        <footer className="relative bg-[#341A00] text-white py-8">
            <svg
                className="absolute inset-x-0 bottom-0 w-full"
                viewBox="0 0 1923.4 972.3"
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                style={{ fill: '#341A00', bottom: '30px' }}
            >
                <path d="M28.8,564.5C14,562,0,562.5,0,562.5v409.8h961.7V700.7C543.5,693.9,139,583.3,28.8,564.5z"/>
                <path d="M1894.6,564.5c14.8-2.5,28.8-2,28.8-2v409.8H961.7V700.7C1379.9,693.9,1784.4,583.3,1894.6,564.5z"/>
            </svg>
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
            <div className="mt-8 text-center relative z-10">
                <p>&copy; 2023 Highlands School District. All rights reserved.</p>
            </div>
        </footer>
    );
}
