# 🔑 User Gemini API Key Setup

## Overview
MriloAI now supports user-configurable Gemini API keys! Users can input their own Google Gemini API key and use it directly in the app, ensuring privacy and flexibility.

## 🚀 How It Works

### 1. **User Provides Their Own API Key**
- Users visit your web app
- They see a Gemini API key input field on the welcome screen
- They enter their own API key from Google AI Studio
- The key is validated and stored locally in their browser

### 2. **Direct API Calls**
- When users chat, the app checks if they have a Gemini key
- If yes: Makes direct API calls to Gemini using their key
- If no: Falls back to the Hugging Face API (via Supabase Edge Function)

### 3. **Privacy & Security**
- **No hardcoded API keys** in your code
- **User keys are stored locally** in their browser (localStorage)
- **You never see or store** user API keys on your servers
- **Each user uses their own quota** and billing

## 📱 User Experience

### Welcome Screen
```
┌─────────────────────────────────────┐
│ 🔑 Gemini API Key                   │
│ Enter your Gemini API key to use   │
│ Google's AI in this app            │
│                                     │
│ [AIzaSy...________________] [👁️]   │
│                                     │
│ [Save & Validate] [Remove]         │
│                                     │
│ ✅ API key is configured and ready  │
│                                     │
│ • Your API key is stored locally    │
│ • We never see or store your key    │
│ • Get your key from Google AI Studio│
└─────────────────────────────────────┘
```

### Features
- **Show/Hide Password**: Eye icon to toggle key visibility
- **Real-time Validation**: Tests the API key before saving
- **Local Storage**: Key persists across browser sessions
- **Easy Removal**: Users can remove their key anytime
- **Fallback Support**: Works even without Gemini key

## 🔧 Technical Implementation

### Frontend Components
- `GeminiKeyInput.tsx` - API key input and validation
- Updated `use-chat.tsx` - Handles both Gemini and fallback APIs
- Updated `Index.tsx` - Shows key input on welcome screen

### API Flow
```
User Message → Check for Gemini Key → 
├─ If Gemini Key exists: Call Gemini API directly
└─ If no key: Call Supabase Edge Function (Hugging Face)
```

### Key Storage
- **Location**: `localStorage.getItem('gemini_api_key')`
- **Validation**: Tests with simple "Hello" request
- **Security**: Never sent to your servers

## 🌐 Getting a Gemini API Key

### For Users:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key (starts with `AIzaSy...`)
5. Paste it in your app's Gemini key input

### API Key Format:
```
AIzaSyDVQERtyIVwOSOEYgI_GFMnSSeUKyvlyCM
```

## 💡 Benefits

### For Users:
- **Privacy**: Their API key stays on their device
- **Control**: Use their own Google account and quota
- **Flexibility**: Can use multiple accounts or keys
- **Cost Control**: Manage their own API usage

### For You (App Owner):
- **No API Costs**: Users pay for their own Gemini usage
- **No Key Management**: Don't need to manage API keys
- **Scalability**: App works for unlimited users
- **Privacy Compliance**: No user data storage concerns

## 🚨 Error Handling

### No API Key:
- App gracefully falls back to Hugging Face
- Users see helpful message about setting up Gemini
- No functionality is lost

### Invalid API Key:
- Real-time validation shows error
- Users can retry or get help
- Clear error messages guide users

### API Limits:
- Users see their own quota limits
- App handles rate limiting gracefully
- Fallback ensures continued service

## 🔄 Migration from Hardcoded Key

### What Changed:
- ❌ Removed hardcoded `GEMINI_API_KEY` constant
- ❌ Removed backend Gemini integration
- ✅ Added frontend user key input
- ✅ Added direct Gemini API calls
- ✅ Maintained fallback to Hugging Face

### Backend Simplification:
- Edge Function now only handles Hugging Face
- Simpler, more focused code
- Better error handling
- Reduced complexity

## 📊 Usage Statistics

### What You Can Track:
- How many users have set up Gemini keys
- Usage patterns (Gemini vs Hugging Face)
- User engagement with the feature

### What You Cannot Track:
- Individual API keys
- User's Gemini API usage
- Personal conversation content
- API call details

## 🎯 Next Steps

1. **Deploy the updated code**
2. **Test the Gemini key input**
3. **Verify fallback to Hugging Face works**
4. **Monitor user adoption**
5. **Consider adding key management features**

## 🔐 Security Notes

- **Never log API keys** in console or server logs
- **Validate keys** before storing them
- **Handle errors gracefully** without exposing sensitive info
- **Use HTTPS** for all API communications
- **Consider key rotation** features for enterprise users

---

This system gives your users full control over their AI experience while keeping your app secure and scalable! 🚀
