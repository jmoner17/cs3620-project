import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from 'next/image';
import PropTypes from 'prop-types';

const UserHeader = ({ user, loading, wiki }) => {
  const { supabase } = useSupabase();
  const [mcUUID, setMcUUID] = useState(null);
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [loadingTheme, setLoadingTheme] = useState(true);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (resolvedTheme) {
      setLoadingTheme(false);
    }
  }, [resolvedTheme]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      setName(profile?.first_name + " " + profile?.last_name);

    } catch (error) {
      setError(error.message);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const Skeleton = () => (
    <div className="flex items-center justify-center space-x-4 text-xs">
      <div className="skeleton bg-accent dark:bg-dark-accent opacity-50 rounded" style={{ width: "2.188rem", height: "2.188rem" }} />
      <div className="flex flex-col items-start">
        <div className="skeleton bg-accent dark:bg-dark-accent opacity-50 rounded whitespace-pre mb-1" style={{ width: "7.5rem", height: "0.85rem" }} />
        <div className="skeleton bg-accent dark:bg-dark-accent opacity-50 rounded whitespace-pre " style={{ width: "3.75rem", height: "0.85rem" }} />
      </div>
    </div>
  );

  const UserDisplay = ({ statusText, statusColor, loginLinkText, linkText, loginHref, src }) => (
    <div className="flex items-center justify-center space-x-4 text-xs">
      <div className="flex flex-col items-start">
        <div className="space-x-0">
        <p className={statusColor === "red" ? "text-red-500" : "text-green-500"}>{statusText}</p>
        {!user ? (
          <>
            <Link
              className="hover:underline"
              href={loginHref}
              rel="prefetch"
            >
              {loginLinkText}
            </Link>
          </>
        ) : (
          <Link
            className="hover:underline"
            href="/account"
          >
            {linkText}
          </Link>
        )}
        </div>
      </div>
    </div>
  );

  const NotLoggedIn = ({ imageLoader }) => (
    <UserDisplay
      statusText="Currently not logged in:"
      statusColor="red"
      loginLinkText="Log in"
      loginHref="/login"
      //imageLoader={imageLoader}
      src="null"
    />
  );

  const LoggedIn = ({ name, imageLoader }) => (
    <UserDisplay
      statusText="Currently logged in as:"
      statusColor="green"
      linkText={name ? name : ' '}
      href="/account"
      loginHref="/login"
      //imageLoader={imageLoader}
      src={name}
      
    />
  );

  const accountDisplay = () => {
    if (loading) {
      return <Skeleton />;
    } else if (!user) {
      return <NotLoggedIn />;
    } else {
      if (!name) {
        return <Skeleton />;
      } else {
        return <LoggedIn name={name}/>;
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative z-40 px-6 text-text-color dark:text-dark-text-color bg-secondary dark:bg-dark-secondary">
      <div className="container mx-auto flex items-center space-x-4 justify-between">
        {/* Account Display */}
        {accountDisplay()}

        {/* Light/Dark Mode Toggle */}
        <div className="flex items-center">
          {wiki && (
            <Link
              className="mr-8 font-semibold relative cursor-pointer inline-flex items-center space-x-2 text-center font-regular transition ease-out duration-200 rounded outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1   text-scale-1200 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none focus-visible:outline-scale-700  text-xs px-2.5 py-1"
              href="/home"
              rel="prefetch"
            >
              Dashboard
            </Link>
          )}

          {!loadingTheme && (
            <button
              onClick={toggleTheme}
              className="slide-in-right focus:ring-0 h-12 hover:text-yellow-500 transition-color duration-300"
            >
              {(resolvedTheme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-8 h-6"
                  fill="currentColor"
                >
                  <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-8 h-6"
                  fill="currentColor"
                >
                  <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                </svg>
              ))}
            </button>
          )}
          {loadingTheme && (
            <div className="h-12"/>
          )}
        </div>
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  wiki: PropTypes.bool,
};

export default UserHeader;