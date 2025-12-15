import { useEffect, useState } from "react";

const Profile = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className="transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <h2 className="text-xs mb-3 sm:mb-4 font-normal uppercase tracking-wider text-gray-400 dark:text-gray-400">
        CURRENTLY
      </h2>
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="mb-1 sm:mb-2">
            <h3 className="text-md md:text-2xl font-bold bg-gradient-to-br from-black/30 to-black/50 dark:from-white/30 dark:to-white/50 bg-clip-text">
              FullStack Developer
            </h3>
            <p className="text-xs font-normal uppercase tracking-wider text-gray-400 dark:text-gray-400">
              2024 - Present
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 dark:text-gray-400">Remote</p>
          </div>
        </div>
        <p className="text-xs font-normal mb-2 sm:mb-3 text-gray-400 dark:text-gray-400">
          React based application development with a strong backend focus, emphasizing 
          security, performance, and building reliable, user focused digital solutions.
        </p>
      </div>
    </div>
  );
};

export default Profile;
