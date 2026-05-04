import type { ReactNode } from 'react';
import HomePage from '@/pages/HomePage';
import GeneratorPage from '@/pages/GeneratorPage';
import LanguagePage from '@/pages/LanguagePage';
import EmotionPage from '@/pages/EmotionPage';
import PoetryTypePage from '@/pages/PoetryTypePage';
import FavoritesPage from '@/pages/FavoritesPage';
import MyPoemsPage from '@/pages/MyPoemsPage';
import { AnalyzerPage } from '@/pages/AnalyzerPage';
import PoetDNAPage from '@/pages/PoetDNAPage';
import SurSuggestionPage from '@/pages/SurSuggestionPage';
import ShopPage from '@/pages/ShopPage'; 

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  protected?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true,
    protected: false
  },
  {
    name: 'Generate',
    path: '/generate',
    element: <GeneratorPage />,
    visible: true,
    protected: true
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
  }
];

export default routes;