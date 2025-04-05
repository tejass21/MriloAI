import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoogleAuth } from "./GoogleAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-[#2A2A2A] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent">
            Welcome to MRILO AI
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to access your personalized experience
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#2A2A2A]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1A1A] px-2 text-gray-500">Continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleAuth onSuccess={onClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 