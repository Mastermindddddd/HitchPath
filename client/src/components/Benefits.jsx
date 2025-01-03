import { benefits } from "../constants";
import Heading from "./Heading";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import FAQ from "./FAQ";

const Benefits = () => {
  return (
    <section id="features" className="py-12 sm:py-18">
      <div className="container mx-auto relative z-2 px-4 sm:px-6 lg:px-8">
        <Heading
          className="md:max-w-md lg:max-w-2xl mx-auto text-center mb-8 sm:mb-12"
          title="Turn Your Aspirations into Reality with AI."
        />

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className="relative shadow-md rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "20px",
                boxShadow: "0 0 15px rgba(30, 144, 255, 0.5)",
                backgroundSize: "200% 200%",
                animation: "shine 3s infinite linear",
              }}
            >
              <div className="relative z-2 flex flex-col min-h-[14rem] sm:min-h-[18rem]">
                <h5 className="text-base sm:text-lg font-semibold text-gray-400 mb-2 sm:mb-4">
                  {item.title}
                </h5>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  {item.text}
                </p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={36}
                    height={36}
                    alt={item.title}
                    className="mr-3 sm:mr-4"
                  />
                  <span className="ml-auto text-xs sm:text-sm font-bold text-gray-500 italic">
                    {index === 0
                      ? "Discover limitless potential"
                      : index === 1
                      ? "Grow every day"
                      : "Stay connected and inspired"}
                  </span>
                </div>
              </div>

              {/* Decorative Background */}
              {item.light && <GradientLight />}
              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
