
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Choose the gift you want to give",
      description: "Select the perfect gift for your special occasion",
      color: "emerald",
      icon: (
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
        </svg>
      )
    },
    {
      number: 2,
      title: "Get the direct payment link",
      description: "Receive an instant payment link to share",
      color: "yellow",
      icon: (
        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      )
    },
    {
      number: 3,
      title: "Share the link with friends and family",
      description: "Send to your group via WhatsApp, SMS, or any app",
      color: "blue",
      icon: (
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      )
    },
    {
      number: 4,
      title: "The amount is collected automatically",
      description: "No chasing payments or forgotten contributions",
      color: "green",
      icon: (
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      )
    },
    {
      number: 5,
      title: "The gift will be delivered elegantly wrapped",
      description: "Beautiful presentation, delivered on time",
      color: "purple",
      icon: (
        <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            💡 How does Hadawi work?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to create the perfect group gift experience
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-yellow-200 via-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className={`w-20 h-20 bg-${step.color}-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg relative z-10`}>
                      {step.icon}
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-${step.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-4 lg:hidden">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
