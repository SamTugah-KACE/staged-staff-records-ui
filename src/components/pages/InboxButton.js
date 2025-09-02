// src/components/InboxButton.js
import React, { useState } from 'react';
import InboxModal from './InboxModal';
import './InboxButton.css';

const InboxButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="inbox-button" onClick={() => setOpen(true)}>Inbox</button>
      {open && <InboxModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default InboxButton;
