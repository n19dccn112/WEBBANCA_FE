import React, { useState, useEffect } from 'react';
import { getPython } from "../../api/callAPI";
import SearchProductIds from "../../services/SearchProductIds";

const placeholders = ['bạn muốn tìm gì?', 'cá', 'phụ kiện'];

export default function SearchInput() {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
          prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Thay đổi placeholder sau mỗi 3 giây (3000ms)

    return () => clearInterval(interval);
  }, []);

  const handleSearchProduct = () => {
    SearchProductIds.setquery(query)
    setQuery('');
    const targetUrl = '/products';

    if (window.location.pathname === targetUrl) {
      window.location.reload();
    } else {
      window.location.href = targetUrl;
    }
  };

  return (
      <div className="css-search" style={{ width: '350px' }}>
        <input
            className="search-input"
            style={{ width: '300px' }}
            type="text"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholders[currentPlaceholderIndex]}
            id="search"
        />
        <a className="title btn btn-secondary search-button" onClick={(handleSearchProduct)}>
          <i className="fas fa-search"></i>
        </a>
      </div>
  );
}