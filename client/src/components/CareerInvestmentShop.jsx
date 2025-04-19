import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ShoppingBag, GraduationCap, BookOpenCheck, Laptop2, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Learn & Certify',
    icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
    description: 'Courses, certifications, and study materials to upskill fast.',
    link: '/shop/learning',
  },
  {
    title: 'Career Toolkit',
    icon: <BookOpenCheck className="w-8 h-8 text-green-600" />,
    description: 'Resumes, interview prep, and productivity templates.',
    link: '/shop/toolkit',
  },
  {
    title: 'Work Essentials',
    icon: <Laptop2 className="w-8 h-8 text-blue-600" />,
    description: 'Top tech gear for remote work and deep learning focus.',
    link: '/shop/gear',
  },
  {
    title: 'Mindset & Wellness',
    icon: <Mic className="w-8 h-8 text-pink-600" />,
    description: 'Apps, journals, and wellness kits to stay motivated.',
    link: '/shop/wellness',
  },
];

export default function CareerInvestmentShop() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1 
        className="text-4xl font-extrabold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        🚀 Invest in Your Future
      </motion.h1>

      <p className="text-center text-gray-600 mb-10">
        Explore powerful tools, apps, and courses curated to accelerate your career.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="rounded-2xl shadow-md p-4">
              <CardContent className="flex flex-col items-center gap-4">
                {cat.icon}
                <h2 className="text-xl font-semibold text-center">{cat.title}</h2>
                <p className="text-gray-500 text-sm text-center">{cat.description}</p>
                <Button className="mt-2 w-full" asChild>
                  <a href={cat.link}>Explore</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button variant="outline" className="rounded-full px-6 py-3 text-lg">
          <ShoppingBag className="mr-2" /> View All Products
        </Button>
      </div>
    </div>
  );
}
