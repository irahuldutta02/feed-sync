export const Logo = () => {
  return (
    <>
      <span className="flex items-center justify-center gap-2">
        <span>
          <img
            className="w-10 h-10"
            src="/logo/feedsync_logo (1).png"
            alt="feed_sync_logo"
          />
        </span>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600">
          FeedSync
        </span>
      </span>
    </>
  );
};
