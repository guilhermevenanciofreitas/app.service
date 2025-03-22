import _ from "lodash";
import React, { useState } from "react";
import { Divider } from "rsuite";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  width: 270px;
  height: 98%;
  border: 0.12rem solid #ccc;
  border-radius: 5px;
  flex-direction: column;
  transition: border 0.2s;
  padding: 6px;
  overflow
  &.drag-over {
    border: 0.12rem dashed #3498db;
  }
`;

const ItemsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 8px;
`;

const DraggableItem = styled.div`
  padding: 10px;
  background-color: Gainsboro;
  color: Black;
  cursor: grab;
  border-radius: 5px;
  margin: 4px 0;
`;

const Container = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`;

const Result = React.createContext();

const Card = ({ card, cardIndex, onDrop, style, itemsKey = "items" }) => {

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const allowDrop = (event) => {

    event.preventDefault()
    setIsDraggingOver(true)

  }

  const handleDrop = (event) => {

    event.preventDefault()
    setIsDraggingOver(false)

    const data = event.dataTransfer.getData("item")
    let draggedItem

    try {
      draggedItem = JSON.parse(data)
    } catch (e) {
      return
    }

    onDrop(draggedItem, cardIndex)

  }

  const handleDragLeave = () => {

    setIsDraggingOver(false)

  }

  return (
    <Result.Consumer>
      {({ renderHeader, renderItem } = {}) => {

        return (
          <CardContainer className={isDraggingOver ? "drag-over" : ""} onDragOver={allowDrop} onDrop={handleDrop} onDragLeave={handleDragLeave} style={style}>
            {renderHeader(card)}
            <Divider style={{margin: '12px'}} />
            <ItemsContainer>
              {_.map(card[itemsKey] || [], (item, key) => (
                <Draggable key={key} item={item} style={style}>
                  {renderItem(item)}
                </Draggable>
              ))}
            </ItemsContainer>
          </CardContainer>
        )
      }}
    </Result.Consumer>
  )
}

const Draggable = ({ item, children, style }) => {

  const [isDragging, setIsDragging] = useState(false)
  
  const handleDrag = (event) => {
    event.dataTransfer.setData("item", JSON.stringify(item))
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  };

  return (
    <DraggableItem draggable onDragStart={handleDrag} onDragEnd={handleDragEnd} style={{ ...style, opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </DraggableItem>
  )
  
}

const CustomDragAndDrop = ({values, onChange, items: renderItems, itemsKey = "items", children}) => {
  
  const renderFunctions = typeof children === "function" ? { renderItem: children } : children || {}

  if (renderItems) {
    renderFunctions.renderItems = renderItems
  }

  const handleDrop = (draggedItem, targetCardIndex) => {
    
    const newCards = values.map((card, idx) => {

      const currentItems = card[itemsKey] || []

      let newItems = _.filter(currentItems, (item) => item.id !== draggedItem.id)

      if (idx === targetCardIndex) {
        newItems = [...newItems, draggedItem]
      }

      return { ...card, [itemsKey]: newItems }

    })
    
    onChange(newCards, {item: draggedItem, target: values[targetCardIndex]})

  }

  return (
    <Result.Provider value={renderFunctions}>
      <Container>
        {_.map(values, (card, index) => (
          <Card key={index} card={card} cardIndex={index} onDrop={handleDrop} itemsKey={itemsKey} />
        ))}
      </Container>
    </Result.Provider>
  )
}

CustomDragAndDrop.Result = ({ children }) => <Result.Consumer>{children}</Result.Consumer>

export default CustomDragAndDrop
