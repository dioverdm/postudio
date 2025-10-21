import React, {useState} from 'react'
import logo from '../../public/1761023546919.jpg';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from "framer-motion";
import { fadeIn } from '../utils/motion';
import QuoteModal from './QuoteModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activelink, setActiveLink] = useState('#home')
  
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Our Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
  ]; 
  return (
    <>
    <motion.nav
      variants={fadeIn('down', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm'>
      <div className='w-full container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 h-16'>
        {/* Logo Section */}
        <div className='flex items-center gap-1 cursor-pointer'>
          <img src={logo} alt="CozyCabin Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden p-2'>
          {
            isMenuOpen ? <HiX className='size-6'/> : <HiMenu className='size-6'/>
          }
        </button>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-10'>
          {
            navLinks.map((link, index) => (
              <a href={link.href} key={index} className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all ${activelink === link.href ? 'text-blue-600 after:w-full' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveLink(link.href)}>
                {link.name}
              </a>
            ))
          }
        </div>

        {/* Get in Touch Button */}
        <button
            onClick={() => setIsModalOpen(true)}
            className='hidden md:block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100'
          >
            Get A Quote
        </button>

      </div>

      {/* Mobile  Menu Items*/}
      {
        isMenuOpen && (
          <div className='md:hidden bg-white border-t border-gray-100 py-4'>
            <div className='container mx-auto px-4 space-y-3'>
              {navLinks.map((link, index) => (
                <a 
                key={index}
                onclick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-medium py-2 ${activelink === link.href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`} href={link.href} onClick={() => setActiveLink(link.href)}>
                  {link.name}
                </a>
              ))}

              <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false); // close mobile menu
                  }}
                  className='w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100'
                >
                  Get A Quote
              </button>
            </div>
          </div>
        )
      }
    </motion.nav>
    <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Navbar
