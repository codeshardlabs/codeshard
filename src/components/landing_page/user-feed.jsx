"use client";

import { Heart, MessageCircle, UserPlus, Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data for demo
const mockActivities = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Sarah Johnson",
      username: "sarahj",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    target: {
      name: "React Hooks Best Practices",
      url: "/shard/123"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "Alex Chen",
      username: "alexchen",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    target: {
      name: "TypeScript Tips and Tricks",
      url: "/shard/456"
    },
    content: "This is really helpful! I've been struggling with type inference.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Mike Wilson",
      username: "mikew",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
    },
    target: {
      name: "Emma Davis",
      url: "/profile/emma"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  },
  {
    id: 4,
    type: "shard",
    user: {
      name: "Emma Davis",
      username: "emma",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
    },
    target: {
      name: "Next.js 14 Server Components",
      url: "/shard/789"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];

const ActivityIcon = ({ type }) => {
  switch (type) {
    case "like":
      return <Heart className="h-5 w-5 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-5 w-5 text-blue-500" />;
    case "follow":
      return <UserPlus className="h-5 w-5 text-green-500" />;
    case "shard":
      return <Code className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

const FeedItem = ({ activity }) => {
  const timeAgo = new Date(activity.timestamp).toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
      <div className="flex-shrink-0">
        <Image
          src={activity.user.imageUrl}
          alt={activity.user.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Link href={`/profile/${activity.user.username}`} className="font-medium text-white hover:underline">
            {activity.user.name}
          </Link>
          <ActivityIcon type={activity.type} />
          <span className="text-gray-400">
            {activity.type === "like" && "liked"}
            {activity.type === "comment" && "commented on"}
            {activity.type === "follow" && "followed"}
            {activity.type === "shard" && "created"}
          </span>
          {activity.target && (
            <Link href={activity.target.url} className="text-blue-400 hover:underline">
              {activity.target.name}
            </Link>
          )}
        </div>
        {activity.content && (
          <p className="mt-1 text-gray-300">{activity.content}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {timeAgo}
        </p>
      </div>
    </div>
  );
};

export default function UserFeed() {
  return (
    <div className="max-w-2xl mx-auto bg-black">
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Activity Feed</h2>
          <p className="text-sm text-gray-400">Recent activities from people you follow</p>
        </div>
        {mockActivities.map((activity) => (
          <FeedItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}