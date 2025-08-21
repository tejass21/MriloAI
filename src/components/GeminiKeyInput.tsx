import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';

interface GeminiKeyInputProps {
  onKeySet: (key: string) => void;
}

export function GeminiKeyInput({ onKeySet }: GeminiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already has a key stored
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      onKeySet(storedKey);
    }
  }, [onKeySet]);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Gemini API key",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Test the API key with a simple request
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: "Hello" }]
            }
          ],
          generation_config: {
            temperature: 0.6,
            maxOutputTokens: 10,
          }
        }),
      });

      if (response.ok) {
        // Save the key locally
        localStorage.setItem('gemini_api_key', apiKey.trim());
        onKeySet(apiKey.trim());
        
        toast({
          title: "Success!",
          description: "Gemini API key validated and saved successfully",
        });
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid Gemini API key. Please check and try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removeKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    onKeySet('');
    toast({
      title: "Key Removed",
      description: "Gemini API key has been removed",
    });
  };

  const hasStoredKey = localStorage.getItem('gemini_api_key');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔑</span>
          Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Gemini API key to use Google's AI in this app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={isVisible ? "text" : "password"}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-20"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? "🙈" : "👁️"}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={validateAndSaveKey} 
            disabled={isValidating || !apiKey.trim()}
            className="flex-1"
          >
            {isValidating ? "Validating..." : "Save & Validate"}
          </Button>
          
          {hasStoredKey && (
            <Button 
              variant="outline" 
              onClick={removeKey}
              className="flex-shrink-0"
            >
              Remove
            </Button>
          )}
        </div>

        {hasStoredKey && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            ✅ API key is configured and ready to use
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Your API key is stored locally in your browser</p>
          <p>• We never see or store your key on our servers</p>
          <p>• Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></p>
        </div>
      </CardContent>
    </Card>
  );
}
