import Heading from "./Heading";
import { service1, service2, service3, check } from "../assets";
import { brainwaveServices, brainwaveServicesIcons } from "../constants";
import {
  PhotoChatMessage,
} from "./design/Services";
import Generating from "./Generating";
import FAQ from "./FAQ";

const Services = () => {
  return (
    <section id="how-to-use">
      <div className="container mt-10 sm:mt-16 lg:mt-20">
        <Heading
          title="Generative AI Tailored for Growth."
          text="HitchPath unlocks the potential of AI-driven learning and career paths for everyone."
        />
        <div className="relative">
          <div className="relative z-1 grid gap-3 sm:gap-4 lg:gap-5 lg:grid-cols-2">
            <div className="relative z-1 flex items-center h-[28rem] sm:h-[35rem] lg:h-[39rem] xl:h-[46rem] mb-3 sm:mb-4 lg:mb-5 p-4 sm:p-6 lg:p-8 xl:p-20 border border-n-1/10 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none sm:w-4/5 md:w-3/5 xl:w-auto">
                <img
                  className="w-full h-full object-cover md:object-right"
                  width={800}
                  alt="Smartest AI"
                  height={730}
                  src={"/service-1.jpg"}
                />
              </div>
              <div className="relative z-1 max-w-[12rem] sm:max-w-[15rem] lg:max-w-[17rem] ml-auto">
                <h4 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-4">Unlock Potential</h4>
                <p className="text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-[3rem] text-n-3 leading-relaxed">
                  HitchPath empowers you with AI-driven learning and career paths, unlocking your true potential.
                </p>
                <ul className="text-xs sm:text-sm lg:text-base">
                  {brainwaveServices.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start py-2 sm:py-3 lg:py-4 border-t border-n-6"
                    >
                      <img width={16} height={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0 mt-0.5" src={check} />
                      <p className="ml-2 sm:ml-3 lg:ml-4 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <Generating className="absolute left-2 right-2 bottom-2 sm:left-4 sm:right-4 sm:bottom-4 border-n-1/10 border lg:left-1/2 lg:right-auto lg:bottom-8 lg:-translate-x-1/2" />
            </div>
            
            <div className="relative z-1 flex items-center h-[28rem] sm:h-[35rem] lg:h-[39rem] xl:h-[46rem] mb-3 sm:mb-4 lg:mb-5 p-4 sm:p-6 lg:p-8 xl:p-20 border border-n-1/10 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={"/service-2.jpg"}
                  className="h-full w-full object-cover"
                  width={630}
                  height={750}
                  alt="robot"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 xl:p-15 bg-gradient-to-b from-n-8/0 to-n-8/90">
                <h4 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-4">Career Path</h4>
                <p className="text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-[3rem] text-n-3 leading-relaxed">
                  Discover tailored career paths designed to match your unique skills, interests, and goals.
                  HitchPath provides AI-driven insights to help you navigate your professional journey with
                  confidence and clarity.
                </p>
              </div>
              <PhotoChatMessage />
            </div>
          </div>
        </div>
      </div>
      <FAQ />
    </section>
  );
};

export default Services;