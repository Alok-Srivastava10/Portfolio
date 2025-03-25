import React from "react";

const About = () => {
  return (
    <div
      name="about"
      className="w-full min-h-screen bg-gradient-to-b from-gray-800 to-black text-white flex items-center px-4 sm:pt-28 pt-20 sm:pb-28"
    >
      <div className="max-w-screen-lg mx-auto flex flex-col justify-center w-full">
        {/* Section Heading */}
        <div className="pb-8 text-center ">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500 text-green-400">
            About Me
          </p>
        </div>

        {/* Intro Section */}
        <p className="text-lg sm:text-xl mt-4 text-center md:text-left">
            I am a dedicated MERN Stack Developer with expertise in building dynamic, scalable, and user-centric web applications. Proficient in MongoDB, Express.js, React.js, Redux.js, and Node.js, 
            I specialize in developing seamless MERN Stack solutions that address real-world challenges effectively.
        </p>

        {/* Skills Section */}
        <div className="mt-6">
          <p className="text-2xl font-semibold text-pink-400 text-center md:text-left">
          🛠️ Technical Skills
          </p>

          <ul className="list-disc mt-4 space-y-3 text-lg sm:text-xl ml-6 md:ml-10">
            <li>
              <span className="text-green-400 font-semibold">
                Frontend Development:{" "}
              </span>
              Proficient in React.js, HTML, CSS, and JavaScript, with a focus on building responsive and user-friendly interfaces.
            </li>
            <li>
              <span className="text-green-400 font-semibold">
                Backend Development:{" "}
              </span>
              Experienced in Node.js and Express.js, developing scalable and efficient server-side applications.
            </li>
            <li>
              <span className="text-green-400 font-semibold">
                Database Management:{" "}
              </span>
              Skilled in MongoDB (NoSQL) and MySQL (SQL) for optimized data storage and retrieval.
            </li>
            <li>
              <span className="text-green-400 font-semibold">
                Data Structures & Algorithms:{" "}
              </span>
              Strong foundation in DSA, ensuring performance-driven application development.
            </li>
            <li>
              <span className="text-green-400 font-semibold">
                Java Programming:{" "}
              </span>
              Proficient in Java, with expertise in object-oriented programming (OOP) and software development best practices.
            </li>
          </ul>
        </div>

        {/* Mission Section */}
        <div className="mt-8">
          <p className="text-2xl font-semibold text-pink-400 text-center md:text-left">
          💼 Professional Statement
          </p>
          <p className="text-lg sm:text-xl mt-4 text-center md:text-left">
          My mission is to design and deploy innovative applications that not only meet technical requirements but also enhance user experiences and drive business value. I am committed to leveraging technology to create scalable, efficient, and impactful solutions that solve real-world challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
