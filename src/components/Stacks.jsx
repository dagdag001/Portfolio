import reactLogo from "../assets/icons/react-svgrepo-com.svg";
import nodeLogo from "../assets/icons/node-js-svgrepo-com.svg";
import expressLogo from "../assets/icons/express-svgrepo-com.svg";
import ejsLogo from "../assets/icons/ejs-svgrepo-com.svg";
import postgresLogo from "../assets/icons/postgresql-logo-svgrepo-com.svg";
import tailwindLogo from "../assets/icons/tailwindcss-icon-svgrepo-com.svg";
import dockerLogo from "../assets/icons/docker-svgrepo-com.svg";
import mongoLogo from "../assets/icons/mongo-svgrepo-com.svg";
import htmlLogo from "../assets/icons/html-5-svgrepo-com.svg";
import cssLogo from "../assets/icons/css-3-svgrepo-com.svg";
import jsLogo from "../assets/icons/js-svgrepo-com.svg";
import jenkinsLogo from "../assets/icons/jenkins-svgrepo-com.svg";

const techs = [
  { name: "React", icon: reactLogo },
  { name: "Node.js", icon: nodeLogo },
  { name: "Express.js", icon: expressLogo },
  { name: "EJS", icon: ejsLogo },
  { name: "PostgreSQL", icon: postgresLogo },
  { name: "MongoDB", icon: mongoLogo },
  { name: "TailwindCSS", icon: tailwindLogo },
  { name: "Docker", icon: dockerLogo },
  { name: "HTML5", icon: htmlLogo },
  { name: "CSS3", icon: cssLogo },
  { name: "JavaScript", icon: jsLogo },
  { name: "Jenkins", icon: jenkinsLogo },
];

const Stacks = () => {
  return (
    <div>
      <h2 className="pt-3 mt-3 text-xs font-normal uppercase tracking-wider text-gray-400 dark:text-gray-400">
        Stacks
      </h2>

      <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-7">
        {techs.map((tech) => (
          <div
            key={tech.name}
            className="border text-card-foreground shadow overflow-hidden rounded-md border-zinc-200 bg-zinc-100/30 transition-all backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30"
            style={{ transform: "translateY(20px)" }}
          >
            <div className="group flex aspect-square select-none flex-col items-center justify-center p-3">
              <img
                src={tech.icon}
                alt={tech.name}
                className="group-hover:-translate-y-1 size-8 transition-all duration-300"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {tech.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stacks;
