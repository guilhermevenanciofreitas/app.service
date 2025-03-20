import { useState, useRef, useEffect } from "react";

export default function Popover({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const adjustPosition = () => {
      if (popoverRef.current && triggerRef.current) {
        const popover = popoverRef.current;
        const trigger = triggerRef.current;
        const triggerRect = trigger.getBoundingClientRect();
        
        popover.style.left = `${triggerRect.left}px`;
        popover.style.top = `${triggerRect.bottom}px`;
        
        const popoverRect = popover.getBoundingClientRect();
        
        if (popoverRect.right > window.innerWidth) {
          popover.style.left = `${window.innerWidth - popoverRect.width}px`;
        }
        if (popoverRect.bottom > window.innerHeight) {
          popover.style.top = `${triggerRect.top - popoverRect.height}px`;
        }
      }
    };
    adjustPosition();
    window.addEventListener("resize", adjustPosition);
    return () => window.removeEventListener("resize", adjustPosition);
  }, [isOpen]);

  return (
    <div className="popover-container">
      <button
        ref={triggerRef}
        className="popover-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>
      {isOpen && (
        <div ref={popoverRef} className="popover-content">
          {content}
        </div>
      )}
    </div>
  );
}