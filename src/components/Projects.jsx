import { projects } from "../utils/Projects.js";

const Projects = () => {
  return (
    <div
      name="projects"
      className="bg-gradient-to-b from-black to-gray-800 w-full text-white py-18 px-4 sm:pt-28 pt-20 sm:pb-28"
    >
      <div className="max-w-screen-lg mx-auto flex flex-col justify-center w-full">
        <div className="pb-8 text-center">
          <h2 className="text-4xl font-bold inline border-b-4 border-white text-amber-200 ">
            Projects
          </h2>
          <p className="py-6 font-bold text-xl text-gray-300">
            Here are some of my best projects showcasing my development skills.
          </p>
        </div>

        {/* Responsive Project Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects.map(({ id, src, title, demo, code }) => (
            <div
              key={id}
              className="shadow-md shadow-gray-700 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={src}
                alt={title}
                className="rounded-t-lg w-full h-48 object-cover "
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center mb-4 text-green-500">
                  {title}
                </h3>

                {/* Separate Left & Right Buttons */}
                <div className="flex justify-between">
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black-800 hover:bg-pink-700 transition rounded-lg"
                  >
                    View
                  </a>
                  <a
                    href={code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black-800 hover:bg-pink-700 transition rounded-lg"
                  >
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
