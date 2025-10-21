import React from 'react'
import logo from '../assets/navbar_logo.png';
import { FaFacebookF, FaLinkedin, FaTwitter } from 'react-icons/fa';


  const footerLinks = {
    company: [
      { name: 'About', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'How it Works', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    getHelp: [
      { name: 'Support Carrer', href: '#' },
      { name: '24h Service', href: '#' },
      { name: 'Quick Chat', href: '#' },
    ],
    support: [
      { name: 'FAQ', href: '#' },
      { name: 'Policy', href: '#' },
      { name: 'Business', href: '#' },
    ],
    contact: [
      { name: 'WhatsApp', href: '#' },
      { name: 'Support 24', href: '#' },
    ],
  }
const Footer = () => {
  return (
    <footer className='bg-[#eff9fb]'>
        <div className='container mx-auto sm:px-6 lg:px-8 py-16 pb-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12'>
                {/* Brand Column */}
                <div className='lg:col-span-4 '>
                    <div className='flex gap-1 items-center mb-6'>
                        <div className='flex items-center gap-1 cursor-pointer'>
                        <img src={logo} alt="CozyCabin Logo" className="h-20 w-auto object-contain" />
                        </div>
                        <span className='text-xl font-medium ml-1'>Cozy Tom`s Cabin</span>
                    </div>
                    <p className='text-gray-600 mb-6 md:w-3/4'>The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and used in a variety of ways.

                    </p>
                    <div className='flex gap-4'> 
                        <a href="#" className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-200'><FaFacebookF className='size-5'/></a>
                        <a href="#" className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-200'><FaTwitter className='size-5'/></a>
                        <a href="#" className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-200'><FaLinkedin className='size-5'/></a>

                    </div>
                </div>
                {/* Footer Nav Items */}
                <div className='lg:col-span-8'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                        {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                            <div key={categoryIndex}>
                                <h3 className='text-lg font-medium mb-4 uppercase'>{category}</h3>
                                <ul className='space-y-3'>
                                    {links.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.href} className='text-gray-600 hover:text-blue-600 transition-colors duration-200'>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}     
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className='border-t border-gray-200 mt-12 pt-8'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-gray-600 text-sm'>Copyright © {new Date().getFullYear()} Cozy Tom's Cabin. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer