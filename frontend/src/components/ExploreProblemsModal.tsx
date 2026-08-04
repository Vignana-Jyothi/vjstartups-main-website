import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle } from 'lucide-react';
import { useUser } from '@/pages/UserContext';

interface ExploreProblemsModalProps {
  children?: React.ReactNode;
}

// Component that wraps children with automatic login check
const ExploreProblemsModal = ({ children }: ExploreProblemsModalProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/problems');
    }
    // If not logged in, the Dialog will open automatically
  };

  if (user) {
    // User is logged in, just navigate directly
    return <div onClick={handleClick}>{children}</div>;
  }

  // User is not logged in, show the modal
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Login Required</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Please login to explore problems and join the innovation community.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800 min-h-[44px]"
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Submit a Problem
          </Button>
        </div>
        <p className="text-xs text-zinc-500 text-center mt-2">
          Both options require authentication to ensure quality submissions
        </p>
      </DialogContent>
    </Dialog>
  );
};

// Standalone dialog component for programmatic control
interface ExploreProblemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExploreProblemsDialog = ({ open, onOpenChange }: ExploreProblemsDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Login Required</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Please login to explore problems and join the innovation community.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/login');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/login');
            }}
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800 min-h-[44px]"
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Submit a Problem
          </Button>
        </div>
        <p className="text-xs text-zinc-500 text-center mt-2">
          Both options require authentication to ensure quality submissions
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreProblemsModal;
