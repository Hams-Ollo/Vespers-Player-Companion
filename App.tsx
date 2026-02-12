import React from 'react';
import LoginScreen from './components/LoginScreen';
import CharacterSelection from './components/CharacterSelection';
import Dashboard from './components/Dashboard';
import DMDashboard from './components/DMDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CharacterProvider, useCharacters } from './contexts/CharacterContext';
import { CampaignProvider, useCampaign } from './contexts/CampaignContext';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDM, activeCampaign, setActiveCampaignId } = useCampaign();
  const {
    characters,
    activeCharacter,
    activeCharacterId,
    setActiveCharacterId,
    createCharacter,
    updateCharacter,
    updatePortrait,
    deleteCharacter,
    isLoading: charsLoading,
  } = useCharacters();

  if (authLoading || charsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="font-display text-xs tracking-widest uppercase animate-pulse">Loading Hall...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  if (activeCharacter) {
    return (
      <ErrorBoundary fallbackTitle="The Dashboard has collapsed">
        <Dashboard 
          data={activeCharacter}
          onUpdatePortrait={(url) => updatePortrait(url)}
          onUpdateData={(newData) => updateCharacter(newData)}
          onExit={() => setActiveCharacterId(null)}
        />
      </ErrorBoundary>
    );
  }

  if (!activeCharacter && isDM && activeCampaign) {
    return (
      <ErrorBoundary fallbackTitle="The DM Screen has collapsed">
        <DMDashboard onExit={() => setActiveCampaignId(null)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="The Hall has collapsed">
      <CharacterSelection 
        characters={characters}
        onSelect={(id) => setActiveCharacterId(id)}
        onCreate={(newChar) => createCharacter(newChar)}
        onDelete={(id) => deleteCharacter(id)}
      />
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <CharacterProvider>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </CharacterProvider>
  </AuthProvider>
);

export default App;