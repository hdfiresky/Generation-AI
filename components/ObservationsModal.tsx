import React from 'react';

interface ObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: string[];
  onClearObservations: () => void;
  theme: {
    primary: string;
    text: string;
    secondary: string;
  };
}

const ObservationsModal: React.FC<ObservationsModalProps> = ({ isOpen, onClose, observations, onClearObservations, theme }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full max-w-lg mx-4 my-8 p-6 md:p-8 rounded-2xl shadow-2xl ${theme.primary} ${theme.text} border border-white/10 transition-colors duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close observations"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Raw Intelligence Data</h2>
             <button
                onClick={onClearObservations}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors ${theme.secondary} hover:brightness-110 active:brightness-95 disabled:opacity-50`}
                disabled={observations.length === 0}
            >
                Clear Data
            </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-3">
            {observations.length > 0 ? (
                observations.map((obs, index) => (
                    <div key={index} className={`p-3 rounded-lg bg-black/20 text-sm`}>
                       <span className="font-mono opacity-60 mr-2">{`${index + 1}.`}</span>{obs}
                    </div>
                ))
            ) : (
                <div className="text-center py-8 opacity-60">
                    <p>No observations recorded yet.</p>
                    <p className="text-sm">Chat with the persona to gather intelligence.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ObservationsModal;