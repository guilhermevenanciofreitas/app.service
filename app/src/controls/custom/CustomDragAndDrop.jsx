import _ from "lodash"
import React, { useState } from "react"
import { Divider } from "rsuite"
import styled from "styled-components"

const CardContainer = styled.div`
  display: flex;
  width: 250px;
  height: 94%;
  border: 0.14rem solid #ccc;
  border-radius: 5px;
  flex-direction: column;
  transition: border 0.2s;
  padding: 6px;
  &.drag-over {
    border: 0.14rem dashed #3498db;
  }
`

const DraggableItem = styled.div`
  padding: 10px;
  background-color: #3498db;
  color: white;
  cursor: grab;
  border-radius: 5px;
  margin: 4px 0;
`

const Container = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`

const Result = React.createContext()

const Card = ({ id, title, items, onDrop, style }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const allowDrop = (event) => {
    event.preventDefault()
    setIsDraggingOver(true)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDraggingOver(false)
    const itemId = event.dataTransfer.getData("text")
    onDrop(itemId, id)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  return (
    <CardContainer
      className={isDraggingOver ? "drag-over" : ""}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={style}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: '25px'
        }}
      >
        {title}
      </span>
      <Divider style={{margin: '15px'}} />
      <div style={{overflowX: 'hidden', overflowY: 'auto'}}>
        {_.map(items, (item) => (
          <Draggable key={item.id} id={item.id} style={item.style}>
            <Result.Consumer>
              {(renderFn) => (typeof renderFn === "function" ? renderFn(item) : item.content)}
            </Result.Consumer>
          </Draggable>
        ))}
      </div>
      
    </CardContainer>
  )
}

const Draggable = ({ id, children, style }) => {
  const handleDrag = (event) => {
    event.dataTransfer.setData("text", id)
  }

  return (
    <DraggableItem draggable onDragStart={handleDrag} style={style}>
      {children}
    </DraggableItem>
  )
}

const CustomDragAndDrop = ({ values, onChange, children }) => {
  // Extrai a função de renderização do elemento filho passado em <CustomDragAndDrop.Result>
  const renderFn = React.Children.only(children).props.children

  const handleDrop = (itemId, targetCardId) => {

    const draggedItem = values.flatMap((c) => c.items).find((item) => item.id === itemId)

    if (!draggedItem) return

    const newCards = values.map((card) => {
      let newItems = card.items.filter((item) => item.id !== itemId)
      if (card.id === targetCardId) {
        newItems = [...newItems, draggedItem]
      }
      return { ...card, items: newItems }
    })

    onChange(targetCardId, itemId, newCards)

  }

  return (
    <Result.Provider value={renderFn}>
      <Container>
        {values.map((card) => (
          <Card key={card.id} {...card} onDrop={handleDrop} />
        ))}
      </Container>
    </Result.Provider>
  )
}

CustomDragAndDrop.Result = ({ children }) => <Result.Consumer>{children}</Result.Consumer>

export default CustomDragAndDrop