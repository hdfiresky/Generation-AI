import React from 'react';
import { marked } from 'https://esm.sh/marked@13.0.2';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileText: string;
  isLoading: boolean;
  theme: {
    bg: string;
    primary: string;
    text: string;
  };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profileText, isLoading, theme }) => {
  if (!isOpen) return null;

  const getHtmlContent = () => {
    if (isLoading) return { __html: '' };
    const rawMarkup = marked.parse(profileText, { breaks: true, gfm: true }) as string;
    return { __html: rawMarkup };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full max-w-2xl mx-4 my-8 p-6 md:p-8 rounded-2xl shadow-2xl ${theme.primary} ${theme.text} border border-white/10 transition-colors duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">User Intelligence Profile</h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <svg className="animate-spin h-8 w-8 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="opacity-70">Analyzing intelligence data...</p>
          </div>
        ) : (
          <div
            className="prose prose-invert prose-headings:font-bold prose-headings:border-b prose-headings:border-white/20 prose-headings:pb-2 max-h-[70vh] overflow-y-auto pr-4"
            dangerouslySetInnerHTML={getHtmlContent()}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileModal;