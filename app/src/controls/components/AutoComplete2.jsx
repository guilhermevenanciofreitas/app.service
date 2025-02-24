/*import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import styled from 'styled-components';

const AutocompleteContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SuggestionsBox = styled.div`
  max-height: 300px;
  overflow-y: auto;
  position: fixed;
  background-color: white;
  z-index: 9999;
  border: 1px solid #ccc;
  border-top: none;
`;

const Suggestion = styled.div`
  padding: 6px;
  cursor: pointer;
  &:hover,
  &.selected {
    color: white;
    background-color: dodgerblue;
  }
`;

const Autocomplete = ({ data }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [boxStyle, setBoxStyle] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef(null);
  const suggestionsBoxRef = useRef(null);
  const selectedItemRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setBoxStyle({
          width: rect.width
        });
      }
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [query]);

  useEffect(() => {
    if (query) {
      const results = data.filter(item => item.toLowerCase().includes(query.toLowerCase()));
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [query, data]);

  useEffect(() => {
    if (selectedItemRef.current && suggestionsBoxRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'center',
        //behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < filteredData.length - 1 ? prev + 1 : prev));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      e.preventDefault();
    } else if (e.key === 'Enter' && selectedIndex !== -1) {
      setQuery(filteredData[selectedIndex]);
      setFilteredData([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setQuery(item);
    setFilteredData([]);
  };

  return (
    <AutocompleteContainer>
      <div className="textfield-filled right-inner-addon">
        <span className="right">
            {loading ? <FaSyncAlt className='animated rotate' color='#696969' /> : value ? <div style={{cursor: 'pointer'}} onClick={onClear}>&#x2715;</div> : <FaSearch style={{cursor: 'pointer'}} onClick={() => onInuptChange('')} /> }
        </span>
        <input ref={inputRef} value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <span>Label</span>
      </div>
      {filteredData.length > 0 && (
        <SuggestionsBox ref={suggestionsBoxRef} style={{ 
          top: `${boxStyle.top}px`, 
          left: `${boxStyle.left}px`, 
          width: `${boxStyle.width}px` 
        }}>
          {filteredData.map((item, index) => (
            <Suggestion
              key={index}
              ref={index === selectedIndex ? selectedItemRef : null}
              className={index === selectedIndex ? 'selected' : ''}
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </Suggestion>
          ))}
        </SuggestionsBox>
      )}
    </AutocompleteContainer>
  );
};

export default Autocomplete;
*/

import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import styled from 'styled-components';
import _ from 'lodash'

const AutocompleteContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SuggestionsBox = styled.div`
  max-height: 300px;
  overflow-y: auto;
  position: fixed;
  background-color: white;
  z-index: 9999;
  border: 1px solid #ccc;
  border-top: none;
`;

const Suggestion = styled.div`
  padding: 6px;
  cursor: pointer;
  &:hover,
  &.selected {
    color: white;
    background-color: dodgerblue;
  }
`;

const Result = React.createContext()

const Autocomplete = ({label, text, value = undefined, onSearch, onChange, children}) => {

    const [loading, setLoading] = useState(false)

    const [data, setData] = useState([])
    
  const [query, setQuery] = useState('');
  //const [filteredData, setFilteredData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [boxStyle, setBoxStyle] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef(null);
  const suggestionsBoxRef = useRef(null);
  const selectedItemRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setBoxStyle({
          width: rect.width
        });
      }
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [query]);

  useEffect(() => {
    if (selectedItemRef.current && suggestionsBoxRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'center',
        //behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleInputChange = async (e) => {
    try {

        setSelectedIndex(-1)

        setQuery(e?.target?.value);

        setLoading(true)

        const data = await onSearch(e?.target?.value || '')

        setData(data)

        inputRef.current?.focus()

    } catch (error) {

    } finally {
        setLoading(false)
    }

    //setQuery(e.target.value);
    //setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < data.length - 1 ? prev + 1 : prev));
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        e.preventDefault();
    } else if (e.key === 'Enter' && selectedIndex !== -1) {
        handleSuggestionClick(data[selectedIndex]);
        setData([]);
    }
  }

  const handleSuggestionClick = (item) => {
    setQuery('')
    setData([])
    onChange(item)
  }

  const onClear = () => {
    setQuery('')
    onChange(undefined)
    inputRef.current?.focus()
}

  return (
    <AutocompleteContainer>
      <div className="textfield-filled right-inner-addon">
        <span className="right">
            {loading ? <FaSyncAlt className='animated rotate' color='#696969' /> : value ? <div style={{cursor: 'pointer'}} onClick={onClear}>&#x2715;</div> : <FaSearch style={{cursor: 'pointer'}} onClick={handleInputChange} /> }
        </span>
        <input ref={inputRef} placeholder={!value ? '' : text(value)} value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onBlur={() => setData([])} />
        <span>{label}</span>
      </div>
      {_.size(data) > 0 && (
        <SuggestionsBox ref={suggestionsBoxRef} style={{width: `${boxStyle.width}px`}}>
          {_.map(data, (item, index) => (
            <Suggestion key={index} ref={index === selectedIndex ? selectedItemRef : null} className={index === selectedIndex ? 'selected' : ''} onClick={() => handleSuggestionClick(item)}>
                <Result.Provider value={item}>
                    {children}
                </Result.Provider>
            </Suggestion>
          ))}
        </SuggestionsBox>
      )}
    </AutocompleteContainer>
  );
};

Autocomplete.Result = Result.Consumer

export default Autocomplete;
