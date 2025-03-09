'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './gardens.module.css';
import { FiSearch, FiMapPin, FiFilter, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { MdOutlineAccessTime } from "react-icons/md";
import Link from 'next/link';

const Page = ({ gardens }) => {
  // State management
  const [toggleBorough, setToggleBorough] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');
  const [isClient, setIsClient] = useState(false);
  const gardensPerPage = 36;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [openFilter, setOpenFilter] = useState('Open and Closed');

  // Client-side check
  useEffect(() => { 
    setIsClient(true);
  }, []);

  // Don't render anything during SSR
  if (!isClient) return null;

  // Show loading state if gardens not loaded yet
  if (!gardens) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}>🌱</div>
          <p>Loading gardens...</p>
        </div>
      </div>
    );
  }

  // Borough translation function
  const boroughRender = (borough) => {
    switch (borough) {
      case 'X': return 'Bronx';
      case 'B': return 'Brooklyn';
      case 'M': return 'Manhattan';
      case 'Q': return 'Queens';
      case 'R': return 'Staten Island';
      default: return 'All';
    }
  };

  // Event handlers
  const handleBoroughToggle = (e) => setToggleBorough(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchFilterChange = (e) => setSearchFilter(e.target.value);
  const handleFilterChange = (e) => {
    setOpenFilter(e.target.value);
  };

  const isGardenOpen = (garden) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().substring(0, 2);
    const hoursKey = `openhrs${day}`;
    const hours = garden[hoursKey];
    
    if (!hours) return false;
    
    const [openTime, closeTime] = hours.split(' - ').map(time => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || 0));
      return date;
    });
  
    return now >= openTime && now <= closeTime;
  };

  // Filter and paginate gardens
  const filteredGardens = gardens
    .filter(garden => 
      toggleBorough === 'All' ? true : boroughRender(garden.borough) === toggleBorough
    )
    .filter(garden => 
      statusFilter === 'All' ? true : 
      garden.status.toLowerCase().includes(statusFilter.toLowerCase()) ? true :
      false
    )
    .filter(garden => {
      if (openFilter === 'Open and Closed') return true;
      const isOpen = isGardenOpen(garden);
      return openFilter === 'Open' ? isOpen : !isOpen;
    })
    .filter(garden => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      switch (searchFilter) {
        case 'name': return garden.gardenname.toLowerCase().includes(lowerQuery);
        case 'address': return garden.address.toLowerCase().includes(lowerQuery);
        case 'zipcode': return garden.zipcode.toLowerCase().includes(lowerQuery);
        default: return true;
      }
    });

  const totalPages = Math.ceil(filteredGardens.length / gardensPerPage);
  const paginatedGardens = filteredGardens.slice(
    (currentPage - 1) * gardensPerPage,
    currentPage * gardensPerPage
  );
  const Map = dynamic(
    () => import('../../components/Map'),
    { 
      ssr: false,
      loading: () => <div className={styles.mapPlaceholder}>Loading map...</div>
    }
  );

  return (
    <div className={styles.container}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h4 className={styles.heroTitle}>NYC Community Gardens</h4>
          <p className={styles.heroSubtitle}>Discover and explore urban green spaces across the five boroughs</p>
        </div>
      </header>

      <div className={styles.controlsContainer}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterCard1}>
            <label className={styles.filterLabel}>
              <FiFilter className={styles.filterIcon} />
              Borough
            </label>
            <select 
              className={styles.filterSelect}
              onChange={handleBoroughToggle} 
              value={toggleBorough}
            >
              <option value="All">All Boroughs</option>
              <option value="Manhattan">Manhattan</option>
              <option value="Brooklyn">Brooklyn</option>
              <option value="Bronx">Bronx</option>
              <option value="Queens">Queens</option>
              <option value="Staten Island">Staten Island</option>
            </select>
          </div>
<div className={styles.filterCard}>
  <label className={styles.filterLabel}>
    <FiFilter className={styles.filterIcon} />
    Status
  </label>
  <select 
    className={styles.filterSelect}
    onChange={(e) => setStatusFilter(e.target.value)}
    value={statusFilter}
  >
    <option value="All">All Statuses</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
    <option value="Not Greenthumb">Not Greenthumb</option>
  </select>
</div>
<div className="filter-controls">
  <MdOutlineAccessTime/>
  Open?
<select 
              className={styles.filterSelect}
              onChange={handleFilterChange} 
              value={openFilter}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Open and Closed">Open and Closed</option>
            </select>
      </div>
          <div className={styles.filterCard}>
            <label className={styles.filterLabel}>
              <FiSearch className={styles.filterIcon} />
              Search By
            </label>
            <div className={styles.searchGroup}>
              <select 
                className={styles.filterSelect}
                onChange={handleSearchFilterChange} 
                value={searchFilter}
              >
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="zipcode">Zip Code</option>
              </select>
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder="Enter search..." 
                onChange={handleSearchChange} 
                value={searchQuery} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <Map 
          gardens={paginatedGardens} 
          position={[40.7128, -74.006]} 
          zoom={12} 
          className={styles.map}
        />
      </div>

      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          Showing {paginatedGardens.length} of {filteredGardens.length} Gardens
          {toggleBorough !== 'All' && (
            <span className={styles.resultsBorough}> in {toggleBorough}</span>
          )}
        </h2>
      </div>

      <div className={styles.gardenGrid}>
        {paginatedGardens.length > 0 ? (
          paginatedGardens.map((garden) => (
            <Link 
              href={`/gardens/${garden.id}`} 
              key={garden.id} 
              passHref
              legacyBehavior
            >
              <a className={styles.gardenCard}>
                <div className={styles.cardContent}>
                  <h3 className={styles.gardenName}>{garden.gardenname}</h3>
                  <div className={styles.gardenMeta}>
                    <div className={styles.metaItem}>
                      <FiMapPin className={styles.metaIcon} />
                      <span>{garden.address}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.boroughTag}>
                        {boroughRender(garden.borough)}
                      </span>
                      <div className={styles.metaItem}>
  <span className={styles.hours}>
    {garden.opening_time} - {garden.closing_time}
  </span>
</div>
                      {/* <span className={styles.zipCode}>
                        {garden.zipcode}
                      </span> */}
                      <div className={`${styles.statusBadge} ${
          garden.status === 'Active' ? styles.active : 
          garden.status.toLowerCase().includes('Not Greenthumb'.toLowerCase()) ? styles.notgreenthumb : 
          styles.defaultStatus
        }`}>
          {garden.status}
        </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>🌱</div>
            <h3>No Gardens Found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {filteredGardens.length > gardensPerPage && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton}
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            <FiArrowLeft /> Previous
          </button>
          <span className={styles.pageIndicator}>
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button 
            className={styles.paginationButton}
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next <FiArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;