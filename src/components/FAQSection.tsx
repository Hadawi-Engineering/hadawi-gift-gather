
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How does Hadawi work?",
      answer: "Simply choose your gift, get a payment link, share it with your group, and we handle the rest. Once payments are collected, we deliver the beautifully wrapped gift to your chosen address."
    },
    {
      question: "Do contributors need to download an app?",
      answer: "No! Contributors can pay directly through the web link without downloading any app. This makes it super easy for everyone to participate."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely! We use bank-level security and encryption to protect all payment information. Your financial data is never stored on our servers."
    },
    {
      question: "What if not everyone pays?",
      answer: "We send automatic reminders to contributors and provide you with real-time tracking. You can set a deadline and choose whether to proceed with partial payments or wait for full collection."
    },
    {
      question: "Can I customize the gift message?",
      answer: "Yes! You can add a personalized message that will be included with the gift. All contributors can also add their names to show who participated in the gift."
    },
    {
      question: "How much does Hadawi cost?",
      answer: "Hadawi charges a small service fee for organizing the collection and delivery. The exact fee structure will be announced before our official launch. Register your interest to be notified!"
    },
    {
      question: "Which areas do you deliver to?",
      answer: "We currently serve Saudi Arabia and are expanding to other GCC countries. Check our coverage area when you create your gift collection to see if we deliver to your location."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Hadawi
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible key={index} open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <CollapsibleTrigger className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
