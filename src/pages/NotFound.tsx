import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/50">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Hey ! You came to wrong place</h1>
        <p className="mb-4 text-xl text-gray-600">You can go back to home</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Hit me Bro Let's go back to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
