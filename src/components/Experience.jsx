import { techs } from "../utils/Skills.js";
const Experience = () => {
  return (
    <div
      name="skills"
      className="bg-gradient-to-b from-gray-800 to-black w-full min-h-screen pt-20 sm:pt-32 sm:pb-32 "
    >
      <div className="max-w-screen-lg mx-auto p-4 flex flex-col text-center w-full h-full text-white">
        <div>
          <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline text-pink-600">
            Technical Expertise
          </p>
          <p className="py-6 font-bold text-xl ">
          Skilled in These Technologies & Frameworks I've Worked With
          </p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-8 text-center py-8 px-12 sm:px-0">
          {techs.map(({ id, src, title, style }) => (
            <div
              key={id}
              className={`shadow-md hover:scale-105 duration-500 py-2 rounded-lg ${style}`}
            >
              <img src={src} alt={title} className="w-20 mx-auto" />
              <p className="mt-4">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
