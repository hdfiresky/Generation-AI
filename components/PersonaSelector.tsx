import React from 'react';
import { Generation, Gender, Persona } from '../types';
import { GENERATIONS, GENDERS } from '../constants';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  theme: { primary: string, secondary: string, text: string };
  onPersonaRefresh: () => void;
  isRefreshingPersona: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaChange, theme, onPersonaRefresh, isRefreshingPersona }) => {
  const handleGenerationChange = (generation: Generation) => {
    onPersonaChange({ ...selectedPersona, generation });
  };

  const handleGenderChange = (gender: Gender) => {
    onPersonaChange({ ...selectedPersona, gender });
  };

  return (
    <div className={`p-4 ${theme.primary} shadow-sm transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2 gap-4">
            <h3 className={`text-sm font-semibold ${theme.text} transition-colors duration-500`}>Generation</h3>
             <button
              onClick={onPersonaRefresh}
              disabled={isRefreshingPersona}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${theme.secondary} text-white hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-wait w-36`}
            >
              {isRefreshingPersona ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <span>✨ New Persona</span>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENERATIONS.map((gen) => (
              <button
                key={gen}
                onClick={() => handleGenerationChange(gen)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedPersona.generation === gen
                    ? `${theme.secondary} text-white shadow-md`
                    : `${theme.primary} ${theme.text} hover:bg-white/20`
                }`}
              >
                {gen}
              </button>
            ))}
          </div>
        </div>
        <div>
           <h3 className={`text-sm font-semibold mb-2 ${theme.text} transition-colors duration-500`}>Gender</h3>
          <div className="flex gap-2">
            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                 className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedPersona.gender === gender
                    ? `${theme.secondary} text-white shadow-md`
                    : `${theme.primary} ${theme.text} hover:bg-white/20`
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;