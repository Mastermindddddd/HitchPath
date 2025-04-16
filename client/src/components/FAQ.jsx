import React from 'react';

const FAQ = () => {
  return (
    <div className="relative w-full pt-10 pb-8 mt-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-5xl sm:rounded-lg">
      <div className="flex flex-col lg:flex-row items-center lg:space-x-10 px-5">
        {/* FAQ Section */}
        <div className="lg:w-1/2">
        <div className="flex flex-col items-center">
  <h2 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
    FAQ
  </h2>
  <p className="mt-3 text-lg text-neutral-500 md:text-xl text-center">
    Frequently Asked Questions
  </p>
</div>

          <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
            {[
              {
                question: 'What is HitchPath?',
                answer:
                  'HitchPath is an AI-powered platform designed to help you generate personalized career, learning, or studying paths. It also features a chatbot, GuideMate, to assist with career advice or academic guidance.',
              },
              {
                question: 'How does HitchPath generate a learning or career path?',
                answer:
                  'Our platform analyzes your goals, skills, and preferences to create a tailored path. Simply provide your information, and HitchPath will outline the steps and resources needed to achieve your objectives.',
              },
              {
                question: 'How can I create a custom learning path?',
                answer:
                  'You can create a custom path by navigating to the Custom Path section. Provide details about your goals, and HitchPath will generate a personalized plan.',
              },
              {
                question: 'Do I need to log in to use HitchPath?',
                answer:
                  'While you can explore some features without logging in, creating a personalized learning or career path requires an account. This helps save your progress and preferences for future sessions.',
              },
              {
                question: 'What should I do if I encounter errors while generating a path?',
                answer:
                  'If you experience issues, ensure you are logged in and your internet connection is stable. You can also retry by clicking the "Retry" button. For persistent issues, contact us through the Contact Us section.',
              },
              {
                question: 'Is HitchPath suitable for career changers or beginners?',
                answer:
                  'Absolutely! Whether you’re just starting out or transitioning to a new field, HitchPath adapts to your specific needs and provides actionable guidance.',
              },
            ].map((faq, index) => (
              <div className="py-5" key={index}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                    {faq.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Pixel Image - Always Centered */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 w-full flex justify-center">
          <img
            src={"/pixel.webp"}
            width={190}
            height={40}
            alt="pixel"
            className="h-[300px] w-auto max-w-xs md:max-w-md lg:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
