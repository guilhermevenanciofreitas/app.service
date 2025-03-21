import _ from "lodash";
import React, { useState } from "react";
import { Divider } from "rsuite";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  width: 250px;
  height: 95%;
  border: 2px solid #ccc;
  flex-direction: column;
  transition: border 0.2s;
  padding: 6px;
  &.drag-over {
    border: 2px dashed #ccc;
  }
`;

const DraggableItem = styled.div`
  padding: 10px;
  background-color: #3498db;
  color: white;
  cursor: grab;
  border-radius: 5px;
  margin: 4px 0;
`;

const Container = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`;

const Card = ({ id, title, items, onDrop, style }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const allowDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const itemId = event.dataTransfer.getData("text");
    onDrop(itemId, id);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <CardContainer
      className={isDraggingOver ? "drag-over" : ""}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={style}
    >
        {title}
        <Divider />
      {_.map(items, (item) => (
        <Draggable key={item.id} id={item.id} text={item.text} style={item.style} />
      ))}
    </CardContainer>
  );
};

const Draggable = ({ id, text, style }) => {
  const handleDrag = (event) => {
    event.dataTransfer.setData("text", id);
  };

  return (
    <DraggableItem draggable onDragStart={handleDrag} style={style}>
      {text}
    </DraggableItem>
  );
};

const DragDropContainer = ({ cards, onChange }) => {

    const handleDrop = (itemId, targetCardId) => {
      const draggedItem = cards.flatMap((c) => c.items).find((item) => item.id === itemId);
      if (!draggedItem) return;
  
      const newCards = cards.map((card) => {
        let newItems = card.items.filter((item) => item.id !== itemId);
        if (card.id === targetCardId) {
          newItems = [...newItems, draggedItem];
        }
        return { ...card, items: newItems };
      });
  
      onChange(newCards)

    };
  
    return (
      <Container>
        {cards.map((card) => (
          <Card key={card.id} {...card} onDrop={handleDrop} />
        ))}
      </Container>
    );
};

export default DragDropContainer