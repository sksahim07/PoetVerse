import type { ReactNode } from 'react';

// ==========================================
// PAGE IMPORTS
// ==========================================
import HomePage from '@/pages/HomePage';
import GeneratorPage from '@/pages/GeneratorPage';
import CardStudioPage from '@/pages/CardStudioPage';
import { AnalyzerPage } from '@/pages/AnalyzerPage';
import SurSuggestionPage from '@/pages/SurSuggestionPage';
import PoetDNAPage from '@/pages/PoetDNAPage';
import FavoritesPage from '@/pages/FavoritesPage';
import MyPoemsPage from '@/pages/MyPoemsPage';
import ShopPage from '@/pages/ShopPage'; 
import LanguagePage from '@/pages/LanguagePage';
import EmotionPage from '@/pages/EmotionPage';
import PoetryTypePage from '@/pages/PoetryTypePage';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  protected?: boolean;
}

// ==========================================
// ROUTE CONFIGURATION
// ==========================================
const routes: RouteConfig[] = [
  // --- Core Public Routes ---
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true,
    protected: false
  },

  // --- Core Application Routes (Protected) ---
  {
    name: 'Generate',
    path: '/generate',
    element: <GeneratorPage />,
    visible: true,
    protected: true
  },
  {
    name: 'Card Studio',
    path: '/card-studio',
    element: <CardStudioPage />,
    visible: false, // Hidden from main navbar, accessed via CTA
    protected: true // Requires auth for AI generation
  },
  {
    name: 'Analyzer',
    path: '/analyzer',
    element: <AnalyzerPage />,
    visible: true,
    protected: true
  },
  {
    name: 'Sur Suggestion',
    path: '/sur-suggestion',
    element: <SurSuggestionPage />,
    visible: true,
    protected: true
  },
  {
    name: 'Poet DNA',
    path: '/poet-dna',
    element: <PoetDNAPage />,
    visible: true,
    protected: true
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <FavoritesPage />,
    visible: true,
    protected: true
  },
  {
    name: 'My Poems',
    path: '/my-poems',
    element: <MyPoemsPage />,
    visible: true,
    protected: true
  },
  
  // --- Utility / Hidden Routes ---
  {
    name: 'Shop',
    path: '/shop',
    element: <ShopPage />,
    visible: false,
    protected: true 
  },
  {
    name: 'Language',
    path: '/language/:lang',
    element: <LanguagePage />,
    visible: false,
    protected: false
  },
  {
    name: 'Emotion',
    path: '/emotion/:emotion',
    element: <EmotionPage />,
    visible: false,
    protected: false
  },
  {
    name: 'Poetry Type',
    path: '/type/:type',
    element: <PoetryTypePage />,
    visible: false,
    protected: false
  }
];

export default routes;