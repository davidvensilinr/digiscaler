// services/jsonService.js
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');

// Helper function to read JSON file
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(dataPath, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Helper function to write JSON file
const writeJsonFile = (filename, data) => {
  try {
    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// User-related operations
export const getUsers = () => {
  return readJsonFile('users.json')?.users || [];
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const addUser = (newUser) => {
  const usersData = readJsonFile('users.json') || { users: [] };
  usersData.users.push(newUser);
  return writeJsonFile('users.json', usersData);
};

export const updateUser = (userId, updatedData) => {
  const usersData = readJsonFile('users.json') || { users: [] };
  const userIndex = usersData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return false;
  
  usersData.users[userIndex] = { 
    ...usersData.users[userIndex], 
    ...updatedData 
  };
  
  return writeJsonFile('users.json', usersData);
};

// Message-related operations
export const getMessages = () => {
  return readJsonFile('messages.json')?.conversations || [];
};

export const getConversation = (participant1, participant2) => {
  const conversations = getMessages();
  return conversations.find(conv => 
    conv.participants.includes(participant1) && 
    conv.participants.includes(participant2)
  );
};

export const sendMessage = (senderId, recipientId, messageText, attachment = null) => {
  const messagesData = readJsonFile('messages.json') || { conversations: [] };
  
  // Find or create conversation
  let conversation = messagesData.conversations.find(conv => 
    conv.participants.includes(senderId) && 
    conv.participants.includes(recipientId)
  );
  
  if (!conversation) {
    conversation = {
      id: Date.now().toString(),
      participants: [senderId, recipientId],
      messages: []
    };
    messagesData.conversations.push(conversation);
  }
  
  // Add new message
  const newMessage = {
    id: Date.now().toString(),
    senderId,
    timestamp: new Date().toISOString(),
    text: messageText,
    attachment
  };
  
  conversation.messages.push(newMessage);
  
  // Save to file
  const success = writeJsonFile('messages.json', messagesData);
  
  return success ? newMessage : null;
};

// Initialize files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  if (!fs.existsSync(path.join(dataPath, 'users.json'))) {
    writeJsonFile('users.json', { users: [] });
  }

  if (!fs.existsSync(path.join(dataPath, 'messages.json'))) {
    writeJsonFile('messages.json', { conversations: [] });
  }
};

initializeFiles();