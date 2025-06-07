import { brainwaveSymbol, check } from "../assets";
import { collabApps, collabContent, collabText } from "../constants";
import { LeftCurve, RightCurve } from "./design/Collaboration";

const Collaboration = () => {
  return (
    <section className="py-4 sm:py-6 md:py-8">
      <div className="container px-4 sm:px-6 lg:flex">
        {/* Text content - order 2 on mobile, order 1 on desktop */}
        <div className="max-w-full sm:max-w-[25rem] order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-8 leading-tight">
            Your AI Guide to Career Success
          </h2>
          <ul className="max-w-full sm:max-w-[22rem] mb-6 sm:mb-8 md:mb-10 lg:mb-14">
            {collabContent.map((item) => (
              <li className="mb-2 sm:mb-3 py-2 sm:py-3" key={item.id}>
                <div className="flex items-center">
                  <img src={check} width={20} height={20} className="sm:w-6 sm:h-6 flex-shrink-0" alt="check" />
                  <h6 className="text-sm sm:text-base ml-3 sm:ml-5">{item.title}</h6>
                </div>
                {item.text && (
                  <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-n-4 ml-8 sm:ml-11">{item.text}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Circular diagram - order 1 on mobile, order 2 on desktop */}
        <div className="lg:ml-auto xl:w-[38rem] mt-2 sm:mt-4 order-1 lg:order-2 mb-6 lg:mb-0">
          <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 lg:mb-16 xl:mb-20 text-n-4 lg:w-[22rem] lg:mx-auto">
          </p>
          {/* Made the diagram bigger on mobile screens */}
          <div className="relative left-1/2 flex w-[20rem] sm:w-[22rem] md:w-[24rem] lg:w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale-90 sm:scale-100 md:scale-110 lg:scale-100">
            <div className="flex w-[12rem] sm:w-[14rem] md:w-[16rem] lg:w-60 aspect-square m-auto border border-n-6 rounded-full">
              <div className="w-[5rem] sm:w-[6rem] md:w-[6.5rem] lg:w-[6rem] aspect-square m-auto p-[0.15rem] sm:p-[0.2rem] bg-conic-gradient rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                  <img
                    src={"/ai-robot.png"}
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    alt="brainwave"
                  />
                </div>
              </div>
            </div>
            <ul>
              {collabApps.map((app, index) => (
                <li
                  key={app.id}
                  className={`absolute top-0 left-1/2 h-1/2 -ml-[1.2rem] sm:-ml-[1.4rem] md:-ml-[1.6rem] lg:-ml-[1.6rem] origin-bottom rotate-${
                    index * 45
                  }`}
                >
                  <div
                    className={`relative -top-[1.2rem] sm:-top-[1.4rem] md:-top-[1.6rem] lg:-top-[1.6rem] flex w-[2.4rem] h-[2.4rem] sm:w-[2.8rem] sm:h-[2.8rem] md:w-[3.2rem] md:h-[3.2rem] lg:w-[3.2rem] lg:h-[3.2rem] bg-n-7 border border-n-1/15 rounded-lg sm:rounded-xl -rotate-${
                      index * 45
                    }`}
                  >
                    <img
                      className="m-auto w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                      width={app.width}
                      height={app.height}
                      alt={app.title}
                      src={app.icon}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;