import Image from 'next/image';

interface Image {
  src: string;
  alt: string;
}

interface ImagesTabProps {
  images: Image[];
}

export function ImagesTab({ images }: ImagesTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="relative aspect-video mb-2">
                <Image
                  src={image.src}
                  alt={image.alt || 'Image'}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {image.alt || 'No alt text'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 