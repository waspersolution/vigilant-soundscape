
interface UserStatusBadgeProps {
  isOnline: boolean;
}

export default function UserStatusBadge({ isOnline }: UserStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
      isOnline 
        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }`}>
      {isOnline ? 'online' : 'offline'}
    </span>
  );
}
