export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Enter URL</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simply paste the URL of the website you want to analyze into our input field.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI system thoroughly analyzes the website&apos;s design, performance, and user experience.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Get Results</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive detailed insights and recommendations to improve your website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 