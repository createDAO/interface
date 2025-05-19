import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('faq');
  const availableNetworks = SUPPORTED_NETWORKS
    .filter((n) => n.isAvailable)
    .map((n) => n.name)
    .join(', ');

  const faqs = [
    {
      question: t('questions.isFree.question'),
      answer: t('questions.isFree.answer'),
    },
    {
      question: t('questions.isSecure.question'),
      answer: t('questions.isSecure.answer'),
    },
    {
      question: t('questions.supportedNetworks.question'),
      answer: t('questions.supportedNetworks.answer', { networks: availableNetworks }),
    },
    {
      question: t('questions.customization.question'),
      answer: t('questions.customization.answer'),
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t('contactText')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
