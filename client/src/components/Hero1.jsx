import { brainwaveSymbol, smallSphere, benefitImage2 } from "../assets";


const Hero = () => {
  return (
    <section className="pt-20 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip">
      <div className="container">
        <div className="md:flex items-center">
        <div className="md:w-[478px]">
          <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">Version 2.0 is here</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">Pathway to productivity</h1>
          <p className="text-xl text-[#010D3E] tracking-tight mt-6">
            Unleash the power of AI within Brainwave. Upgrade your productivity
            with Brainwave, the open AI chat app.
          </p>
          <div className="flex gap-1 items-center mt-[30px]">
            <button>Get for free</button>
            <button>Learn more</button>
          </div>
        </div>
        <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
        <img src={brainwaveSymbol} width={190} height={40} alt="Brainwave" className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"/>
        <img 
          src={smallSphere} 
          width={220} 
          height={220} 
          alt="4.small" 
          className="hidden md:block -top-8 -left-32 md:absolute"
        />
        <img 
          src="/src/assets/roadmap/image-2.png" 
          width={220} 
          alt="Cool"
          className=" hidden lg:block absolute top-[524px] left-[448px]"/>
       
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
