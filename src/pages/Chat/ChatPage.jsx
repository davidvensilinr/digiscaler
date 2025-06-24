import { useParams } from 'react-router-dom';
import ChatBox from '../../components/ChatBox/ChatBox';

const ChatPage = ({ user }) => {
  const { recipientId } = useParams();
  if (!user) return null; // or redirect handled by parent
  return (
    <div style={{marginTop: '80px'}}>
      <ChatBox currentUserId={user.id} recipientId={recipientId} />
    </div>
  );
};

export default ChatPage; 