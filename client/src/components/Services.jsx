import Heading from "./Heading";
import { service1, service2, service3, check } from "../assets";
import { brainwaveServices, brainwaveServicesIcons } from "../constants";
import {
  PhotoChatMessage,
  Gradient,
} from "./design/Services";

import Generating from "./Generating";
import FAQ from "./FAQ";

const Services = () => {
  return (
    <section id="how-to-use">
      <div className="container mt-20">
        <Heading
          title="Generative AI Tailored for Growth."
          text="HitchPath unlocks the potential of AI-driven learning and career paths for everyone."
        />

        <div className="relative">
         

          <div className="relative z-1 grid gap-5 lg:grid-cols-2">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-cover md:object-right"
                width={800}
                alt="Smartest AI"
                height={730}
                src={"/service-1.jpg"}
              />
            </div>

            <div className="relative z-1 max-w-[17rem] ml-auto">
              <h4 className="h4 mb-4">Unlock Potential</h4>
              <p className="body-2 mb-[3rem] text-n-3">
              HitchPath empowers you with AI-driven learning and career paths, unlocking your true potential.
              </p>
              <ul className="body-2">
                {brainwaveServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start py-4 border-t border-n-6"
                  >
                    <img width={24} height={24} src={check} />
                    <p className="ml-4">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <Generating className="absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" />
          </div>
            <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
              <div className="absolute inset-0">
                <img
                  src={"/service-2.jpg"}
                  className="h-full w-full object-cover"
                  width={630}
                  height={750}
                  alt="robot"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
                <h4 className="h4 mb-4">Career Path</h4>
                <p className="body-2 mb-[3rem] text-n-3">
                Discover tailored career paths designed to match your unique skills, interests, and goals. 
                HitchPath provides AI-driven insights to help you navigate your professional journey with 
                confidence and clarity.
                </p>
              </div>

              <PhotoChatMessage />
            </div>

          </div>

          <Gradient />
        </div>
      </div>
      <FAQ />
    </section>
  );
};

export default Services;
