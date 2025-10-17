import React from 'react';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}


