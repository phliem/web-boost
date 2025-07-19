import Image from "next/image";

type TabScreenshotProps = {
  screenshot: string;
};

export function TabScreenshot({ screenshot }: TabScreenshotProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Website Screenshot
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Full-page screenshot of the analyzed website
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="max-w-full overflow-auto">
          <Image
            src={screenshot}
            alt="Website screenshot"
            width={1200}
            height={4000}
            className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}