// components/ChatBox/ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import './ChatBox.css';
<<<<<<< HEAD
import { fetchConversation, sendMessage, fetchUsers } from '../../services/api';

// Utility to get user details for agreements (brand/influencer names)
const getUserByEmail = async (email) => {
  const creatorsRes = await fetchUsers('creator');
  const brandsRes = await fetchUsers('brand');
  const all = [...creatorsRes.users, ...brandsRes.users];
  return all.find((u) => u.email === email);
=======
import messagesSeed from '../../data/messages.json';
import usersData from '../../data/users.json';

// Helpers to persist conversations in localStorage (front-end demo)
const loadConversations = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('conversations'));
    if (stored && Array.isArray(stored)) return stored;
  } catch (_) {}
  return messagesSeed.conversations;
};

const saveConversations = (convs) => {
  localStorage.setItem('conversations', JSON.stringify(convs));
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
};

const ChatBox = ({ currentUserId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachmentType, setAttachmentType] = useState(null); // 'picture' | 'agreement' | 'payment'
  const [attachmentData, setAttachmentData] = useState(null); // { url, name }
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

<<<<<<< HEAD
  // Load messages for current conversation from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchConversation(currentUserId, recipientId);
        setMessages(res.conversation.messages);
      } catch (err) {
        console.error(err);
      }
    };
    load();
=======
  // Load messages for current conversation
  useEffect(() => {
    const conversation = loadConversations().find(
      (c) => c.participants.includes(currentUserId) && c.participants.includes(recipientId)
    );
    setMessages(conversation ? conversation.messages : []);
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
  }, [currentUserId, recipientId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ---------------- Attachment Helpers ---------------- */
  const addPictureAttachment = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachmentType('picture');
      setAttachmentData({ url: e.target.result, name: file.name });
      setNewMessage((prev) => `${prev} [Picture attached]`);
    };
    reader.readAsDataURL(file);
  };

<<<<<<< HEAD
  const addDealRequest = () => {
    setAttachmentType('deal');
    setAttachmentData({ status: 'pending' });
    setNewMessage('[Deal done request]');
  };

=======
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
  const addAgreementAttachment = async () => {
    const amount = prompt('Enter agreed payment amount (USD):');
    if (!amount) return;

<<<<<<< HEAD
    const sender = await getUserByEmail(currentUserId);
    const receiver = await getUserByEmail(recipientId);
=======
    const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...usersData.users, ...localUsers];
    const sender   = allUsers.find((u) => u.email === currentUserId);
    const receiver = allUsers.find((u) => u.email === recipientId);
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db

    const brandName      = sender?.type === 'brand' ? sender.name : receiver?.name;
    const influencerName = sender?.type === 'creator' ? sender.name : receiver?.name;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Collaboration Agreement', 10, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(
      `On ${new Date().toLocaleDateString()}, brand ${brandName} has decided that influencer ${influencerName} will be paid $${amount} if the required content is delivered on or before 3 days from the signing date.`,
      180
    );
    doc.text(lines, 10, 40);

    const blob = doc.output('blob');
    const url  = URL.createObjectURL(blob);
    const name = `agreement_${Date.now()}.pdf`;

    setAttachmentType('agreement');
    setAttachmentData({ url, name });
    setNewMessage((prev) => `${prev} [Agreement attached]`);
  };

  /* ---------------- Main Actions ---------------- */
  const handleAttachmentClick = (type) => {
    if (type === 'picture') {
      fileInputRef.current?.click();
      return;
    }
<<<<<<< HEAD
    if (type === 'deal') {
      addDealRequest();
=======
    if (type === 'agreement') {
      addAgreementAttachment();
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
      return;
    }
    if (type === 'payment') {
      const amount = prompt('Enter payment amount (USD) to request:');
      if (!amount) return;
      setAttachmentType('payment');
      setAttachmentData({ amount, status: 'pending' });
      setNewMessage((prev) => `${prev} [Payment request $${amount}]`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachmentData) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      text: newMessage.trim(),
      attachment: attachmentData ? { type: attachmentType, ...attachmentData } : null,
    };

    // Update UI immediately
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    setAttachmentType(null);
    setAttachmentData(null);

<<<<<<< HEAD
    // Persist to backend
    sendMessage({ senderId: currentUserId, recipientId, text: newMessage.trim(), attachment: attachmentData ? { type: attachmentType, ...attachmentData } : null })
      .catch((err) => console.error(err));
  };

  // Accept payment request
  const acceptPayment = async (requestMsg) => {
    // mark the original request as accepted in local state
    setMessages(prev => prev.map(m => m.id === requestMsg.id ? { ...m, attachment: { ...m.attachment, status: 'accepted' } } : m));

    const amount = requestMsg.attachment.amount;
    const sender = await getUserByEmail(currentUserId);
    const receiver = await getUserByEmail(recipientId);
=======
    // Persist conversation
    const convs = loadConversations();
    let conv = convs.find(
      (c) => c.participants.includes(currentUserId) && c.participants.includes(recipientId)
    );
    if (!conv) {
      conv = { id: Date.now().toString(), participants: [currentUserId, recipientId], messages: [] };
      convs.push(conv);
    }
    conv.messages.push(newMsg);
    saveConversations(convs);
  };

  // Accept payment request
  const acceptPayment = (requestMsg) => {
    // update original message status
    const convs = loadConversations();
    const conv = convs.find((c) => c.participants.includes(currentUserId) && c.participants.includes(recipientId));
    if (!conv) return;
    const msgIndex = conv.messages.findIndex((m) => m.id === requestMsg.id);
    if (msgIndex === -1) return;
    conv.messages[msgIndex].attachment.status = 'accepted';

    // create agreement message
    const amount = requestMsg.attachment.amount;
    const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...usersData.users, ...localUsers];
    const sender   = allUsers.find((u) => u.email === currentUserId);
    const receiver = allUsers.find((u) => u.email === recipientId);
    const brandName      = sender?.type === 'brand' ? sender.name : receiver?.name;
    const influencerName = sender?.type === 'creator' ? sender.name : receiver?.name;
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Collaboration Agreement', 10, 20);
    doc.setFontSize(12);
<<<<<<< HEAD
    const agreementText = doc.splitTextToSize(
  `BUSINESS AGREEMENT

This Agreement ("Agreement") is made and entered into as of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by and between:

${receiver.name} ("Brand"), and
${sender.name} ("Influencer")

1. ENGAGEMENT TERMS
1.1 The Brand hereby engages the Influencer to create and deliver content as specified in Exhibit A (attached).
1.2 The Influencer agrees to create and deliver the Content in accordance with the Brand's guidelines.

2. COMPENSATION
2.1 In consideration for the services rendered, the Brand shall pay the Influencer the sum of USD ${amount} (the "Fee").
2.2 The Fee shall be payable within 14 business days following:
   (a) Delivery of the Content; and
   (b) The Brand's written approval of the Content.

3. DELIVERY REQUIREMENTS
3.1 The Influencer shall deliver the completed Content to the Brand on or before ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ("Delivery Date").
3.2 Time is of the essence with respect to the Delivery Date.

4. GENERAL PROVISIONS
4.1 This Agreement constitutes the entire understanding between the parties.
4.2 Any modifications must be made in writing and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

___________________________      ___________________________
Brand Representative               Influencer
${receiver.name}                      ${sender.name}`, 
  180
);
doc.text(agreementText, 10, 40);
=======
    const lines = doc.splitTextToSize(
      `On ${new Date().toLocaleDateString()}, brand ${brandName} has decided that influencer ${influencerName} will be paid $${amount} as per the rate set by the brand.`,
      180
    );
    doc.text(lines, 10, 40);
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
    const blob = doc.output('blob');
    const url  = URL.createObjectURL(blob);
    const name = `agreement_${Date.now()}.pdf`;

    const agreementMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      text: '',
      attachment: { type: 'agreement', url, name },
    };

<<<<<<< HEAD
    sendMessage({ senderId: currentUserId, recipientId, text: '', attachment: { type: 'agreement', url, name } })
      .then(() => {
        // Optimistically update UI
        setMessages(prev => [...prev, agreementMsg]);
      })
      .catch(err => console.error(err));
  };

  // Decline payment request
  const declinePayment = async (requestMsg) => {
    // mark declined locally
    setMessages(prev => prev.map(m => m.id === requestMsg.id ? { ...m, attachment: { ...m.attachment, status: 'declined' } } : m));

    // Persist decline status to backend (optional simple message flag)
    sendMessage({ senderId: currentUserId, recipientId, text: '', attachment: { type: 'payment', amount: requestMsg.attachment.amount, status: 'declined' } }).catch(err => console.error(err));
  };

  /* ---------------- Accept / Decline Deal ---------------- */
  const acceptDeal = async (requestMsg) => {
    // mark accepted
    setMessages(prev => prev.map(m => m.id === requestMsg.id ? { ...m, attachment: { ...m.attachment, status: 'accepted' } } : m));

    // Build PDF saying payment done today
    const amount = requestMsg.attachment.amount || 'agreed amount';
    const sender = await getUserByEmail(currentUserId);
    const receiver = await getUserByEmail(recipientId);

    const doc = new jsPDF();
    doc.setFont('Times', 'Normal');
doc.setFontSize(14);

// Title
doc.setFontSize(16);
doc.setFont('Times', 'Bold');
doc.text('Payment Confirmation Statement', 105, 30, { align: 'center' });

// Body
doc.setFontSize(12);
doc.setFont('Times', 'Normal');

const leftMargin = 25;
const bodyText = `This document serves as an official confirmation that on ${new Date().toLocaleDateString()}, 
brand ${sender?.name} affirms the successful completion of payment 
for a collaborative engagement with influencer ${receiver?.name}. 
This payment pertains to the agreed promotional services as outlined in the collaboration agreement.`;

// Split and render body text
const lines = doc.splitTextToSize(bodyText, 160);
doc.text(lines, leftMargin, 50);

// Footer
doc.setFont('Times', 'Italic');
doc.setFontSize(11);
doc.text('Authorized by:', leftMargin, 110);
doc.text(`${sender?.name}`, leftMargin, 117);
doc.text('Brand Representative', leftMargin, 123);

doc.text('Acknowledged by:', 120, 110);
doc.text(`${receiver?.name}`, 120, 117);
doc.text('Influencer', 120, 123);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const name = `deal_${Date.now()}.pdf`;

    const dealMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      text: '',
      attachment: { type: 'deal-doc', url, name },
    };

    sendMessage({ senderId: currentUserId, recipientId, text: '', attachment: { type: 'deal-doc', url, name } })
      .then(() => setMessages(prev => [...prev, dealMsg]))
      .catch(err => console.error(err));
  };

  const declineDeal = async (requestMsg) => {
    setMessages(prev => prev.map(m => m.id === requestMsg.id ? { ...m, attachment: { ...m.attachment, status: 'declined' } } : m));
    sendMessage({ senderId: currentUserId, recipientId, text: '', attachment: { type: 'deal', status: 'declined' } }).catch(err => console.error(err));
=======
    conv.messages.push(agreementMsg);
    saveConversations(convs);

    // update local state UI
    setMessages([...conv.messages]);
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
  };

  /* ---------------- Render helpers ---------------- */
  const renderAttachment = (msg) => {
    const att = msg?.attachment;
    if (!att) return null;
    if (att.type === 'picture') {
      return <img src={att.url} alt="attachment" className="chat-image" />;
    }
<<<<<<< HEAD
    if (att.type === 'deal-doc') {
      return (
        <a href={att.url} target="_blank" rel="noopener noreferrer" className="attachment-link">📄 Deal Document</a>
      );
    }
    if (att.type === 'deal') {
      return (
        <span className="attachment-link">
          🤝 Deal Done Request
          {att.status === 'pending' && msg.senderId !== currentUserId && (
            <>
              <button className="accept-btn" onClick={() => acceptDeal(msg)}>Accept</button>
              <button className="decline-btn" onClick={() => declineDeal(msg)}>Decline</button>
            </>
          )}
          {att.status === 'accepted' && <span> (accepted)</span>}
          {att.status === 'declined' && <span> (declined)</span>}
        </span>
      );
    }
=======
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
    if (att.type === 'agreement') {
      return (
        <a href={att.url} target="_blank" rel="noopener noreferrer" className="attachment-link">
          📄 Agreement
        </a>
      );
    }
    if (att.type === 'payment') {
      return (
        <span className="attachment-link">
          💳 Payment Request ${att.amount}
          {att.status === 'pending' && msg.senderId !== currentUserId && (
<<<<<<< HEAD
            <>
              <button className="accept-btn" onClick={() => acceptPayment(msg)}>Accept</button>
              <button className="decline-btn" onClick={() => declinePayment(msg)}>Decline</button>
            </>
          )}
          {att.status === 'accepted' && <span> (accepted)</span>}
          {att.status === 'declined' && <span> (declined)</span>}
=======
            <button className="accept-btn" onClick={() => acceptPayment(msg)}>Accept</button>
          )}
          {att.status === 'accepted' && <span> (accepted)</span>}
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
        </span>
      );
    }
    return null;
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
              <div className="message-content">
                {msg.text && <p className="message-text">{msg.text}</p>}
                {renderAttachment(msg)}
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="message-form" onSubmit={handleSendMessage}>
        <div className="attachment-buttons">
<<<<<<< HEAD
          <button type="button" className="attachment-btn" onClick={() => handleAttachmentClick('deal')}>
            🤝 Deal Done
=======
          <button type="button" className="attachment-btn" onClick={() => handleAttachmentClick('agreement')}>
            📄 Agreement
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
          </button>
          <button type="button" className="attachment-btn" onClick={() => handleAttachmentClick('picture')}>
            📷 Picture
          </button>
          <button type="button" className="attachment-btn" onClick={() => handleAttachmentClick('payment')}>
            💳 Payment
          </button>
          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) addPictureAttachment(file);
              e.target.value = '';
            }}
          />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;