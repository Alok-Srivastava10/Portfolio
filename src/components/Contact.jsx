import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { SiLeetcode } from "react-icons/si";
import toast from "react-hot-toast";

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://getform.io/f/apjnrgpa", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((response) => {
        toast.success("Thank you for reaching out!");
        setFormData({ name: "", email: "", message: "" }); // Clear form fields

        // Navigate back after a slight delay
        setTimeout(() => {
          window.history.back();
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.message);
      })
  };

  return (
    <div
      name="contact"
      className="w-full min-h-[110vh] bg-gradient-to-b from-black to-gray-800 p-6 pt-20 sm:pt-32 pb-6 sm:pb-10 text-white flex justify-center"
    >
      <div className="max-w-screen-lg w-full flex flex-col items-center text-center ">
        <p className="text-5xl font-bold border-b-4 border-gray-500 text-cyan-400 mb-4 w-fit ">
          Contact Me
        </p>
        <p className="text-gray-300 text-lg mb-10 font-bold">
          If you have any questions or would like to discuss potential opportunities, feel free to reach out. I am open to roles that align with my skills and interests and look forward to connecting with you.
        </p>

        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0 md:space-x-12">
          {/* Contact Form */}
          <div className="w-full md:w-3/5 lg:w-2/3">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="p-4 text-lg w-full bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="p-4 text-lg w-full bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="p-4 text-lg w-full bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
              ></textarea>

              <button className="text-white text-lg bg-gradient-to-r from-pink-600 to-violet-600 px-8 py-4 mt-4 mx-auto md:mx-0 flex items-center justify-center rounded-md hover:scale-105 transition-transform duration-300 shadow-md">
                Send Message
                <FaPaperPlane className="ml-3 text-xl" />
              </button>
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col space-y-8 text-xl">
            <div className="flex items-center space-x-5">
              <FaEnvelope className="text-cyan-400 text-2xl" />
              <p className="text-gray-300">alok27141@gmail.com</p>
            </div>

            <div className="flex items-center space-x-5">
              <FaMapMarkerAlt className="text-cyan-400 text-2xl" />
              <p className="text-gray-300">Lucknow, India</p>
            </div>

            <div className="mt-6">
              <p className="text-xl text-gray-300 mb-4">Connect with me:</p>
              <div className="flex flex-wrap w-full justify-center md:justify-start gap-6 my-7">
                {socialLinks.map(({ id, icon, href }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-transform transform hover:scale-125 text-xl sm:text-2xl md:text-3xl"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
