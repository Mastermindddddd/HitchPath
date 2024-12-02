import { benefits } from "../constants";
import Heading from "./Heading";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  return (
    <section id="features" className="py-12">
      <div className="container mx-auto relative z-2 px-4 sm:px-6 lg:px-8">
        <Heading
          className="md:max-w-md lg:max-w-2xl mx-auto text-center mb-12"
          title="Chat Smarter, Not Harder with HitchPath"
        />

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="relative shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "30px",
                boxShadow: "0 0 20px rgba(30, 144, 255, 0.7)",
                backgroundSize: "200% 200%",
                animation: "shine 3s infinite linear",
              }}
            >
              <div className="relative z-2 flex flex-col min-h-[18rem]">
                <h5 className="text-lg font-semibold text-gray-400 mb-4">{item.title}</h5>
                <p className="text-sm text-gray-600 mb-6">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title}
                    className="mr-4"
                  />
                  <p className="ml-auto text-sm font-bold text-blue-600 uppercase tracking-wide">
                    Explore more
                  </p>
                  <Arrow />
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
