import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const GoBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoBack = () => {
    if (pathname === '/register' || pathname === '/reset-password') {
      router.push('/login');
      return;
    } else if (pathname === '/update-password') {
      router.push('/account');
      return;
    } else {
      router.push('/home');
      return;
    }
  };

  return (
    <div className="relative z-20 flex justify-between items-center">
      <div className="flex justify-center items-center">
      <button
          onClick={handleGoBack}
          className="m-2 px-4 py-2 font-semibold bg-primary border border-accent-color rounded hover:bg-secondary hover:border-accent-color transition-colors duration-200 dark:bg-dark-primary dark:border-dark-accent-color dark:hover:bg-dark-secondary dark:hover:border-dark-accent-color text-text-color dark:text-dark-text-color hover:text-light-text dark:hover:text-dark-light-text"
        >
          <span
            role="img"
            aria-label="Go back"
            className="w-5 h-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </span>
        </button>

        <div className="text-text-color dark:text-dark-text-color hover:text-light-text dark:hover:text-dark-light-text font-bold">
          Go Back
        </div>
      </div>

      <div className="flex justify-center items-center">
        <Link
          className="pr-4 text-text-color dark:text-dark-text-color font-bold text-xl hover:text-light-text dark:hover:text-dark-light-text"
          href="/home"
          rel="prefetch"
        >
          Respirator
        </Link>
      </div>
    </div>
  );
};

export default GoBackButton;