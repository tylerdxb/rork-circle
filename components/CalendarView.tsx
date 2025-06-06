import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { Event } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    // Create array for days of week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Create array for calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      
      // Check if there are events on this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      const hasEvents = dayEvents.length > 0;
      
      calendarDays.push(
        <View 
          key={`day-${day}`} 
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
          ]}
        >
          <Text 
            style={[
              styles.dayText,
              isToday && styles.todayText,
            ]}
          >
            {day}
          </Text>
          
          {hasEvents && (
            <View style={styles.eventIndicator} />
          )}
        </View>
      );
    }
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
            <ChevronLeft size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
          
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <ChevronRight size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.daysOfWeek}>
          {daysOfWeek.map(day => (
            <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {calendarDays}
        </View>
      </View>
    );
  };
  
  return renderCalendar();
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  navButton: {
    padding: theme.spacing.xs,
  },
  monthText: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  dayOfWeekText: {
    ...theme.typography.bodySmall,
    width: 36,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  dayText: {
    ...theme.typography.bodySmall,
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.secondary,
  },
});