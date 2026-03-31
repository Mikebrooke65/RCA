import Image from 'next/image';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  is_public: boolean;
}

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition">
      {announcement.image_url && (
        <div className="relative w-full h-48">
          <Image src={announcement.image_url} alt={announcement.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-rca-black">{announcement.title}</h3>
          {!announcement.is_public && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0 ml-2">Members only</span>
          )}
        </div>
        <p className="text-sm text-gray-600 whitespace-pre-line">{announcement.content}</p>
        <p className="text-xs text-gray-400 mt-3">
          {new Date(announcement.published_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
