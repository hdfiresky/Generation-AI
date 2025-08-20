import React from 'react';
import { Theme } from '../types';
import ProfileIcon from './icons/ProfileIcon';
import EyeIcon from './icons/EyeIcon';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
  theme: Theme;
  onGenerateProfile: () => void;
  isGeneratingProfile: boolean;
  onShowObservations: () => void;
  observationCount: number;
  onLogout: () => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ theme, onGenerateProfile, isGeneratingProfile, onShowObservations, observationCount, onLogout, isLoggedIn }) => {
  return (
    <header className={`w-full p-4 ${theme.primary} shadow-md transition-colors duration-500`}>
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
            <div className="text-4xl">{theme.avatar}</div>
            <div>
              <h1 className={`text-xl font-bold ${theme.text} transition-colors duration-500`}>
                {theme.botName}
              </h1>
              <p className={`text-sm opacity-70 ${theme.text} transition-colors duration-500`}>
                {theme.name}
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={onShowObservations}
              className={`relative flex items-center justify-center gap-2 px-3 py-1.5 h-10 text-sm font-medium rounded-full transition-all duration-300 ${theme.primary} ${theme.text} hover:bg-white/20 active:brightness-95 w-28`}
            >
                <EyeIcon className="w-5 h-5" />
                <span>Intel</span>
                {observationCount > 0 && (
                    <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${theme.secondary}`}>
                        {observationCount}
                    </span>
                )}
            </button>
            <button
              onClick={onGenerateProfile}
              disabled={isGeneratingProfile}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 h-10 text-sm font-medium rounded-full transition-all duration-300 ${theme.secondary} text-white hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-wait w-36`}
            >
               {isGeneratingProfile ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Profiling...</span>
                </>
              ) : (
                 <>
                  <ProfileIcon className="w-5 h-5" />
                  <span>Get Profile</span>
                </>
              )}
            </button>
            {isLoggedIn && (
                <button
                onClick={onLogout}
                title="Logout"
                className={`flex items-center justify-center h-10 w-10 text-sm font-medium rounded-full transition-all duration-300 ${theme.primary} ${theme.text} hover:bg-white/20 active:brightness-95`}
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;