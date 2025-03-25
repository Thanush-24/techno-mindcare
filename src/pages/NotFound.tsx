
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center max-w-md flex flex-col items-center">
        <div className="text-9xl font-bold gradient-text">404</div>
        <h1 className="text-3xl font-bold mt-6 mb-2">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home size={16} />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
