import _ from "lodash";
import React, { useState } from "react";
import { Divider } from "rsuite";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  width: 250px;
  height: 94%;
  border: 0.14rem solid #ccc;
  border-radius: 4px; /* borda levemente arredondada */
  flex-direction: column;
  transition: border 0.2s;
  padding: 6px;
  &.drag-over {
    border: 0.14rem dashed #3498db;
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

// Contexto com as funções de renderização para o cabeçalho e os itens
const Result = React.createContext();

const Card = ({ card, cardIndex, onDrop, style }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const allowDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    // Recupera o item arrastado (serializado em JSON)
    const data = event.dataTransfer.getData("text");
    let draggedItem;
    try {
      draggedItem = JSON.parse(data);
    } catch (e) {
      return;
    }
    // Passa o objeto do item e o índice do card de destino
    onDrop(draggedItem, cardIndex);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <Result.Consumer>
      {({ renderHeader, renderItem } = {}) => (
        <CardContainer
          className={isDraggingOver ? "drag-over" : ""}
          onDragOver={allowDrop}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          style={style}
        >
          {renderHeader ? renderHeader(card) : <span>{card.title}</span>}
          <Divider />
          {_.map(card.items, (item, idx) => (
            <Draggable key={item.id || idx} item={item} style={item.style}>
              {renderItem ? renderItem(item) : item.content}
            </Draggable>
          ))}
        </CardContainer>
      )}
    </Result.Consumer>
  );
};

const Draggable = ({ item, children, style }) => {
  const handleDrag = (event) => {
    // Serializa o objeto inteiro do item
    event.dataTransfer.setData("text", JSON.stringify(item));
  };

  return (
    <DraggableItem draggable onDragStart={handleDrag} style={style}>
      {children}
    </DraggableItem>
  );
};

const CustomDragAndDrop = ({ values, onChange, children }) => {
  // Se children for função, assume renderItem; se for objeto, espera renderHeader e renderItem.
  const renderFunctions =
    typeof children === "function" ? { renderItem: children } : children || {};

  const handleDrop = (draggedItem, targetCardIndex) => {
    // Atualiza os cards: remove o item de onde ele estava e adiciona no card de destino
    const newCards = values?.map((card, idx) => {
      let newItems = card.items?.filter((item) => item.id !== draggedItem.id);
      if (idx === targetCardIndex) {
        newItems = [...newItems, draggedItem];
      }
      return { ...card, items: newItems };
    });
    // onChange recebe o card de destino (objeto completo), o item arrastado e a nova lista
    onChange(newCards, {item: draggedItem, target: values[targetCardIndex]});
  };

  return (
    <Result.Provider value={renderFunctions}>
      <Container>
        {values.map((card, index) => (
          <Card key={index} card={card} cardIndex={index} onDrop={handleDrop} />
        ))}
      </Container>
    </Result.Provider>
  );
};

// Permite usar <CustomDragAndDrop.Result> na composição da UI
CustomDragAndDrop.Result = ({ children }) => <Result.Consumer>{children}</Result.Consumer>;

export default CustomDragAndDrop;
