"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/features/Counter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { NewsCarousel } from "@/components/features/NewsCarousel";
import { ArrowRight, GraduationCap, Users, Trophy, Building2, Globe, Cpu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const programs = [
  {
    title: "Computer Science",
    icon: <Cpu className="h-6 w-6 text-accent" />,
    description: "Excellence in AI, Machine Learning, and Cloud Computing.",
    path: "/academics/cse"
  },
  {
    title: "Mechanical Engineering",
    icon: <Building2 className="h-6 w-6 text-accent" />,
    description: "Cutting-edge research in robotics and automation.",
    path: "/academics/mech"
  },
  {
    title: "Management Studies",
    icon: <Globe className="h-6 w-6 text-accent" />,
    description: "Developing future business leaders for the global economy.",
    path: "/academics/mba"
  }
];

const mockNews = [
  {
    id: 1,
    tag: "Achievement",
    title: "SKCET Ranked Among Top 100 Engineering Colleges in India",
    description: "The NIRF 2024 rankings have recognized our commitment to academic excellence.",
    image: "/achievement.svg"
  },
  {
    id: 2,
    tag: "Placements",
    title: "95% Placement Record Achieved for 2024 Batch",
    description: "Global giants like Google, Amazon, and Microsoft visited our campus.",
    image: "/placements.svg"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-bold text-sm uppercase tracking-widest">
              Sri Krishna College of Engineering & Technology
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Crafting <span className="text-accent underline decoration-4 underline-offset-8">Engineers</span> of the Future
            </h1>
            <p className="text-xl text-blue-100/90 max-w-xl leading-relaxed">
              Empowering students through innovation, technology, and character-building. Join a legacy of excellence in engineering.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                Apply Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Explore Programs
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] rounded-bl-[100px] rounded-tr-[100px] overflow-hidden border-4 border-white/10 shadow-2xl"
          >
            <Image
              src="/hero-campus.svg"
              alt="SKCET Campus"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </div>

        {/* Floating Achievements Ticker */}
        <div className="absolute bottom-0 w-full bg-accent/90 backdrop-blur-md py-4 overflow-hidden border-t border-white/10">
          <div className="whitespace-nowrap flex animate-infinite-scroll gap-12 font-bold text-white uppercase tracking-widest text-sm">
            <span>🎓 NBA Accredited Programs</span>
            <span>⭐ NAAC A+ Grade Instituion</span>
            <span>🚀 500+ Top Recruiters Yearly</span>
            <span>🏆 Ranked among NIRF TOP 100</span>
            <span>🌍 25,000+ Global Alumni</span>
            <span>🎓 NBA Accredited Programs</span>
            <span>⭐ NAAC A+ Grade Instituion</span>
            <span>🚀 500+ Top Recruiters Yearly</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Counter end={25} suffix="+" label="Years of Excellence" />
            <Counter end={5000} suffix="+" label="Active Students" />
            <Counter end={350} suffix="+" label="Elite Faculty" />
            <Counter end={95} suffix="%" label="Placement Record" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-zinc-50 dark:bg-black" id="academics">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">Academic Excellence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our diverse academic portfolio is designed to meet the demands of a rapidly evolving global industry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg">
                  <CardHeader>
                    <div className="p-3 rounded-2xl bg-accent/5 w-fit mb-4">
                      {prog.icon}
                    </div>
                    <CardTitle className="text-2xl">{prog.title}</CardTitle>
                    <CardDescription className="text-base pt-2">
                      {prog.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <Link href={prog.path} className="inline-flex items-center text-accent font-bold group">
                      Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-zinc-100 dark:bg-zinc-900/50" id="facilities">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">World-Class Facilities</h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                Explore our sprawling 100-acre smart campus equipped with state-of-the-art infrastructure.
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex">Virtual Tour</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Smart Classrooms", desc: "ICT enabled learning spaces", img: "/smart-classroom.svg" },
              { title: "Research Labs", desc: "Advanced specialized labs", img: "/research-lab.svg" },
              { title: "Digital Library", desc: "Exhaustive digital resources", img: "/digital-library.svg" },
              { title: "Sports Complex", desc: "Olympic standard facilities", img: "/sports-complex.svg" }
            ].map((facility, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={facility.img}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-xl font-bold text-white">{facility.title}</h4>
                  <p className="text-sm text-zinc-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    {facility.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Achievements Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">Campus Highlights</h2>
              <Link href="/news" className="hidden md:flex items-center text-accent font-bold group">
                View All News <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <NewsCarousel slides={mockNews} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-primary text-blue-100">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h4 className="text-2xl font-bold text-white">SKCET</h4>
            <p className="text-blue-100/70 leading-relaxed">
              Sri Krishna College of Engineering and Technology is one of the premier institutions in the country.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/admissions" className="hover:text-accent transition-colors">Admissions</Link></li>
              <li><Link href="/academics" className="hover:text-accent transition-colors">Academic Programs</Link></li>
              <li><Link href="/placements" className="hover:text-accent transition-colors">Placement Cell</Link></li>
              <li><Link href="/faculty" className="hover:text-accent transition-colors">Faculty Directory</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">YouTube</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">Contact</h4>
            <p className="text-blue-100/70">
              Kuniamuthur, Coimbatore,<br />
              Tamil Nadu 641008
            </p>
            <p className="text-blue-100/70">
              info@skcet.ac.in<br />
              +91 422 2678001
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-white/10 text-center text-sm text-blue-100/50">
          © {new Date().getFullYear()} Sri Krishna College of Engineering and Technology. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
