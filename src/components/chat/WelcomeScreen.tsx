
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  handleSuggestionClick: (suggestion: string) => void;
}

export const WelcomeScreen = ({ handleSuggestionClick }: WelcomeScreenProps) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 px-4 text-center">
      <div className="max-w-md py-8">
        <h3 className="text-xl font-medium mb-2 text-gray-800">How can I help you today?</h3>
      </div>
    </div>
  );
};
