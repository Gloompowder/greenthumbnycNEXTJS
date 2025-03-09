'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './VisitScheduler.module.css';
import { FiCalendar } from "react-icons/fi";

const VisitScheduler = ({ garden, onScheduleSuccess }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedDayHours, setSelectedDayHours] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    console.log('Raw time string:', timeStr);

    const [openPart, closePart] = timeStr
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single
    .split(/\s*-\s*|–| to /i) // Split on hyphen with any spacing
    .map(p => p ? p.trim().replace(/\./g, '') : ''); // Handle undefined

    console.log('Split parts:', { openPart, closePart });

    const parseSingleTime = (timeString) => {
        try {
          if (!timeString) return null;
          
          // Normalize string
          const cleaned = timeString
            .toLowerCase()
            .replace(/(\d)(am|pm)/, '$1 $2') // Add space between time and period
            .replace(/\s+/g, ' ')            // Collapse multiple spaces
            .trim();
    
          console.log('Cleaned time:', cleaned);
    
          // Match 12h format with flexible syntax
          const match = cleaned.match(
            /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/
          );
    
          if (!match) {
            console.warn('Time format not recognized:', cleaned);
            return null;
          }
    
          let [, hours, minutes, period] = match;
          hours = parseInt(hours);
          minutes = parseInt(minutes) || 0;
          
          // Convert 12h to 24h format
          if (period === 'pm' && hours !== 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
    
          // Validate final values
          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn('Invalid time values:', { hours, minutes });
            return null;
          }
    
          return { hours, minutes };
        } catch (error) {
          console.error('Time parsing error:', error);
          return null;
        }
      };
    
      try {
        // Additional check for valid parts
        if (!openPart || !closePart) return null;
    
        const open = parseSingleTime(openPart);
        const close = parseSingleTime(closePart);
        
        if (!open || !close) {
          console.warn('Failed to parse open/close times');
          return null;
        }
    
        console.log('Parsed times:', { open, close });
        return { open, close };
      } catch (error) {
        console.error('Time range parsing error:', error);
        return null;
      }};


  const handleDateChange = (date) => {
    setSelectedDate(date);
    setError(null);
    setSelectedDayHours(null);
    setStartTime(null);
    setEndTime(null);

    if (!garden) {
      setError('No garden information available');
      return;
    }

    const dayAbbreviations = {
      sunday: 'su',
      monday: 'm',
      tuesday: 'tu',
      wednesday: 'w',
      thursday: 'th',
      friday: 'f',
      saturday: 'sa'
    };

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const abbreviation = dayAbbreviations[dayName];

    const possibleKeys = [
      `openhrs${abbreviation}`,
      `hrs_${abbreviation}`
    ];

    let hoursString;
    for (const key of possibleKeys) {
      if (garden[key]) {
        hoursString = garden[key];
        break;
      }
    }

    if (!hoursString || hoursString.toLowerCase() === 'closed') {
      setError('Garden is closed on this day');
      return;
    }

    const timeComponents = parseTimeString(hoursString);
    if (!timeComponents) {
      setError('Invalid opening hours format');
      return;
    }

    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);

    const openDate = new Date(baseDate);
    openDate.setHours(timeComponents.open.hours, timeComponents.open.minutes);
    
    const closeDate = new Date(baseDate);
    closeDate.setHours(timeComponents.close.hours, timeComponents.close.minutes);

    if (closeDate <= openDate) {
      closeDate.setDate(closeDate.getDate() + 1);
    }

    const now = new Date();
    if (openDate < now && closeDate < now) {
      setError('Opening hours have already passed for today');
      return;
    }

    setSelectedDayHours({ 
      open: openDate, 
      close: closeDate,
      original: hoursString // For debugging
    });
  };

  const isTimeDisabled = (time) => {
    if (!selectedDayHours) return true;
    const timeTs = time.getTime();
    return timeTs < selectedDayHours.open.getTime() || 
           timeTs > selectedDayHours.close.getTime();
  };

  const isEndTimeDisabled = (time) => {
    if (!startTime) {
      if (!selectedDayHours) return true;
      const timeTs = time.getTime();
      return timeTs < selectedDayHours.open.getTime() || 
             timeTs > selectedDayHours.close.getTime();
    }
    
    const timeTs = time.getTime();
    return timeTs < startTime.getTime() || 
           timeTs > selectedDayHours.close.getTime();
  };

  useEffect(() => {
    if (selectedDayHours) {
      console.log('Opening hours:', {
        open: selectedDayHours.open.toLocaleTimeString(),
        close: selectedDayHours.close.toLocaleTimeString(),
        original: selectedDayHours.original
      });
    }
  }, [selectedDayHours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    const token = localStorage.getItem('jwtToken')
    console.log('Token retrieved:', token); // Debugging
  
    if (!token) {
      setError('Authentication required - please log in');
      return;
    }
  
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/visits`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json'
            }
          });          
  
      const text = await response.text();
      console.log('Response:', text);
  
      if (!response.ok) {
        throw new Error(text || 'Failed to schedule visit');
      }
  
      const data = JSON.parse(text);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setStartTime(null);
      setEndTime(null);
      if (onScheduleSuccess) onScheduleSuccess();
    } catch (err) {
      setError(err.message.includes('<!DOCTYPE html>') 
        ? 'Server error - please try again later' 
        : err.message
      );
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.card}>
        {!garden && (
          <div className={styles.errorMessage}>
            ❌ Garden information not available - cannot schedule visits
          </div>
        )}

        {garden && (
          <form onSubmit={handleSubmit} className={styles.schedulerForm}>
            <div className={styles.formGroup}>
              <label>Visit Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
                className={styles.dateInput}
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                  }
                }}
              />
            </div>

            {selectedDayHours ? (
              <div className={styles.timeRow}>
                <div className={styles.formGroup}>
                  <label>Start Time</label>
                  <DatePicker
                    selected={startTime}
                    onChange={(time) => {
                      const newStart = new Date(selectedDate);
                      newStart.setHours(time.getHours(), time.getMinutes());
                      setStartTime(newStart);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    minTime={selectedDayHours.open}
                    maxTime={selectedDayHours.close}
                    dateFormat="h:mm aa"
                    placeholderText="Select start time"
                    className={styles.timeInput}
                    filterTime={isTimeDisabled}
                    injectTimes={[selectedDayHours.open, selectedDayHours.close]}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>End Time</label>
                  <DatePicker
                    selected={endTime}
                    onChange={(time) => {
                      const newEnd = new Date(selectedDate);
                      newEnd.setHours(time.getHours(), time.getMinutes());
                      setEndTime(newEnd);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    minTime={selectedDayHours.open}
                    maxTime={selectedDayHours.close}
                    dateFormat="h:mm aa"
                    placeholderText="Select end time"
                    className={styles.timeInput}
                    filterTime={isEndTimeDisabled}
                    injectTimes={[startTime, selectedDayHours.close]}
                  />
                </div>
              </div>
            ) : selectedDate && (
              <div className={styles.errorMessage}>
                {error || 'No opening hours available for this day'}
              </div>
            )}

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>Visit scheduled successfully!</div>}

            <div className={styles.timezoneNote}>
              Times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone} time
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!startTime || !endTime}
            >
              Schedule Visit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VisitScheduler;