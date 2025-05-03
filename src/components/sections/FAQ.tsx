import React, { useState } from 'react';
import { SUPPORTED_NETWORKS } from '../../config/networks';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-5">
      <button
        className="flex justify-between items-center w-full text-left cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
        <svg
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`mt-2 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-gray-600 dark:text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const availableNetworks = SUPPORTED_NETWORKS
    .filter((n) => n.isAvailable)
    .map((n) => n.name)
    .join(', ');

  const faqs = [
    {
      question: 'Is it really free?',
      answer: 'Yes! CreateDAO is completely free to use. You only pay the blockchain\'s network gas fees when deploying your DAO.',
    },
    {
      question: 'Is the code secure?',
      answer: 'Our smart contracts have not been audited yet, but audits by leading security firms are planned soon. The code is open source for full transparency in the meantime.',
    },
    {
      question: 'Which networks are supported?',
      answer: (
        <>
          We currently support {availableNetworks}. More networks are coming soon based on community feedback.
        </>
      ),
    },
    {
      question: 'Can I customize my DAO?',
      answer: 'Not yet, but in the future you\'ll be able to customize voting periods, proposal thresholds, and other governance parameters to fit your community\'s needs.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Common Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about CreateDAO.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Have more questions? Contact our community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
