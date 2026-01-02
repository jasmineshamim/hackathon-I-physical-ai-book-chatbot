# Testing the RAG Chatbot Integration

## Prerequisites

Before testing the integration, ensure both servers are running:

1. Backend (FastAPI): Should be running on http://127.0.0.1:8000
2. Frontend (Docusaurus): Should be running on http://localhost:3000

## Testing Steps

### 1. Start the Backend Server

First, ensure your FastAPI backend is running:

```bash
cd backend
# Activate your Python environment if needed
python main.py  # or however you start your FastAPI server
```

Verify the backend is working by visiting:
- http://127.0.0.1:8000/health (should return health status)
- http://127.0.0.1:8000/docs (should show API documentation)

### 2. Start the Frontend Server

In a separate terminal, start your Docusaurus frontend:

```bash
cd physical-ai-book
npm install  # if dependencies haven't been installed
npm start
```

### 3. Access the Chatbot Page

Navigate to: http://localhost:3000/hackathon-I-physical-ai-book

### 4. Test the Chatbot Functionality

1. Type a question in the input field at the bottom of the chat interface
2. Click "Send" or press Enter
3. Verify that:
   - The question appears in the chat window with "user" styling
   - The loading indicator appears briefly
   - The response from the backend appears with "bot" styling
   - No errors are displayed in the console

### 5. Test the Selected Text Feature

1. Select some text on the page
2. Click the "Use Selected Text" button
3. Verify that the selected text appears in the input field
4. Send the question and verify the response

### 6. Test Error Handling

1. Try submitting an empty message (should be disabled)
2. Temporarily stop the backend server and try sending a message
3. Verify that appropriate error messages appear in the chat

### 7. Verify CORS Configuration

Check the browser's developer tools Network tab to ensure:
- Requests to http://127.0.0.1:8000/api/query are successful
- No CORS-related errors appear in the console

## Expected Behavior

- Messages should appear in the chat window with different styling for user vs bot
- The chat should scroll automatically to show the latest message
- Loading indicators should appear when waiting for responses
- Error messages should be displayed if the backend is unreachable
- The interface should be responsive and user-friendly
- The "Use Selected Text" button should populate the input field with selected text

## Troubleshooting Common Issues

### CORS Errors
- Ensure the backend has proper CORS configuration as described in cors-setup.md
- Check that the backend server is running on the expected port

### Network Errors
- Verify the backend server is running and accessible
- Check that the API endpoint URL in the Chatbot component matches your backend

### Styling Issues
- Verify that the CSS module is properly linked
- Check for any CSS conflicts with existing styles

### Docusaurus Integration Issues
- Make sure the page is properly integrated with the Docusaurus layout
- Verify that the Layout component is being used correctly

## Next Steps

Once testing is complete and the integration is working properly, you can:
- Deploy the frontend and backend to production
- Update the API endpoint URLs for production
- Add additional features or styling as needed