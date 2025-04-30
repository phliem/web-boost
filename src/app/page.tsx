import Header from '@/_components/Header';
import Hero from '@/_components/Hero';
import HowItWorks from '@/_components/HowItWorks';
import Footer from '@/_components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
}
