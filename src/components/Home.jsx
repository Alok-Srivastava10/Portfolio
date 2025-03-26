import React from "react";
import { motion } from "framer-motion";
import HeroImage from "../assets/alok_professional.jpg";
import { MdKeyboardArrowRight } from "react-icons/md";

import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaInstagram, FaDownload } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { SiLeetcode } from "react-icons/si";

const socialLinks = [
  {
    id: 1,
    name: "LinkedIn",
    icon: <FaLinkedin className="text-blue-600" size={45} />,
    href: "https://www.linkedin.com/in/alok-srivastava-28d/",
  },
  {
    id: 2,
    name: "Github",
    icon: <FaGithub className="text-gray-300" size={45} />,
    href: "https://github.com/Alok-Srivastava10",
  },
  {
    id: 3,
    name: "LeetCode",
    icon: <SiLeetcode className="text-orange-500" size={45} />,
    href: "https://leetcode.com/u/ALOK_SRIVASTAVA/",
  },
  {
    id: 4,
    name: "Instagram",
    icon: <FaInstagram className="text-pink-500" size={45} />,
    href: "https://www.instagram.com/alok___1018/",
  },
  {
    id: 5,
    name: "Mail",
    icon: <HiOutlineMail className="text-red-500" size={45} />,
    href: "mailto:alok27141@gmail.com",
  },
];

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const Home = () => {
  return (
    <div
      name="home"
      className="min-h-screen w-full bg-gradient-to-b from-black via-black to-gray-800 flex flex-col justify-center px-4"
    >
      {/* Main Container */}
      <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center h-full md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex flex-col justify-center h-full text-center md:text-left md:mr-10">
          {/* Animated Text */}
          <motion.h2
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl sm:text-4xl font-bold text-white pt-4"
          >
            Hello,
          </motion.h2>

          <motion.h2
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-5xl font-bold text-green-400 mt-2"
          >
            I'm Alok Srivastava,
          </motion.h2>

          <motion.h2
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl sm:text-4xl font-bold text-pink-400 mt-2"
          >
            A MERN Stack Developer
          </motion.h2>

          <p className="text-gray-200 py-4 text-sm max-w-md lg:text-lg">
            A passionate MERN-Stack developer skilled in Node.js, React.js, Redux.js, MySQL, Java, and DSA. 
            Continuously learning, solving challenges, and thriving in collaborative environments to build innovative web applications.
          </p>

          {/* Portfolio Button */}
          <div className="flex justify-center md:justify-start">
            <Link to="contact" smooth={true} duration={500}>
              <button className="group text-white w-fit px-5 py-2 flex mt-4 items-center font-bold rounded-full bg-gradient-to-r from-pink-500 to-violet-600 cursor-pointer">
                Contact Me
                <span className="group-hover:rotate-90 duration-300">
                  <MdKeyboardArrowRight size={22} />
                </span>
              </button>
            </Link>
          </div>

          {/* Social Links Under Portfolio */}
          <div className="flex flex-wrap w-full justify-center md:justify-start gap-6 my-7">
            {socialLinks.map(({ id, icon, href }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-white transition-transform transform hover:scale-125 text-xl sm:text-2xl md:text-3xl"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Get Resume Button */}
          <div className="flex justify-center md:justify-start mt-4">
            <a
              href="https://drive.google.com/uc?export=download&id=1TJBD2GztHx9PTC4vch0cBc4eYUAjPiYt

"
              className="flex justify-center items-center px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold rounded-full hover:scale-105 transition-transform w-fit"
            >
              Get Resume <FaDownload className="ml-2" size={18} />
            </a>
          </div>

        </div>

        {/* Right Section (Image) */}
        <div className="mt-8 md:mt-0 flex justify-center md:ml-10">
          <img
            src={HeroImage}
            alt="My Profile"
            className="rounded-2xl w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
