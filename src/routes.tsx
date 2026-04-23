import type { ReactNode } from 'react';
import HomePage from './pages/HomePage';
import GeneratorPage from './pages/GeneratorPage';
import LanguagePage from './pages/LanguagePage';
import EmotionPage from './pages/EmotionPage';
import PoetryTypePage from './pages/PoetryTypePage';
import FavoritesPage from './pages/FavoritesPage';
import MyPoemsPage from './pages/MyPoemsPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import PoetDNAPage from './pages/PoetDNAPage';
import SurSuggestionPage from './pages/SurSuggestionPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: 'Generate',
    path: '/generate',
    element: <GeneratorPage />,
    visible: true
  },
  {
    name: 'Analyzer',
    path: '/analyzer',
    element: <AnalyzerPage />,
    visible: true
  },
  {
    name: 'Sur Suggestion',
    path: '/sur-suggestion',
    element: <SurSuggestionPage />,
    visible: true
  },
  {
    name: 'Poet DNA',
    path: '/poet-dna',
    element: <PoetDNAPage />,
    visible: true
  },
  {
    name: 'Language',
    path: '/language/:lang',
    element: <LanguagePage />,
    visible: false
  },
  {
    name: 'Emotion',
    path: '/emotion/:emotion',
    element: <EmotionPage />,
    visible: false
  },
  {
    name: 'Poetry Type',
    path: '/type/:type',
    element: <PoetryTypePage />,
    visible: false
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <FavoritesPage />,
    visible: true
  },
  {
    name: 'My Poems',
    path: '/my-poems',
    element: <MyPoemsPage />,
    visible: true
  }
];

export default routes;
