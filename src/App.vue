<script setup>
import { reactive } from 'vue';
import dayjs from 'dayjs';
import LeftArrow from '~icons/ic/baseline-keyboard-arrow-left';
import RightArrow from '~icons/ic/baseline-keyboard-arrow-right';
import { generateCalendarDates, months, days } from './utils/calendar';
const currentDate = dayjs();
const dates = generateCalendarDates();
const today = reactive(currentDate);
</script>
<template>
  <main>
    <div class="wrapper">
      <div class="calendar-wrapper">
        <div class="calendar-heading">
          <h2 class="month-year">{{ months[today.month()] }}, {{ today.year() }}</h2>
          <div class="month-changer">
            <LeftArrow class="arrows pointer" />
            <h2 class="pointer">Today</h2>
            <RightArrow class="arrows pointer" />
          </div>
        </div>
        <div class="days-container days-of-week">
          <h1 class="dates" v-for="day in days" :key="day">{{ day }}</h1>
        </div>
        <div class="days-container">
          <div class="dates" v-for="date in dates" :key="date.date">
            <h1
              class="date-cell"
              :class="{ notCurrentMonth: !date.currentMonth, isToday: date.today }"
            >
              {{ date.date.date() }}
            </h1>
          </div>
        </div>
      </div>
      <div class="event-container">
        <h3>Schedule for Fri Oct 13 2023</h3>
        <p>No meetings for today</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
  align-items: center;
}
.calendar-wrapper {
  width: 24rem;
  height: 24rem;
}
.days-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.event-container {
  width: 24rem;
  height: 24rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.dates {
  height: 3.5rem;
  display: grid;
  place-content: center;
  font-size: medium;
}

.notCurrentMonth {
  color: #8c8c8c;
}

.isToday {
  background-color: #ff6961;
  color: white;
}

.days-of-week {
  color: #6b7280;
}

.date-cell {
  height: 2.5rem;
  width: 2.5rem;
  display: grid;
  place-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.date-cell:hover {
  background-color: black;
  color: white;
}
.month-changer {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.calendar-heading {
  display: flex;
  justify-content: space-between;
}

.pointer {
  cursor: pointer;
}

.arrows {
  width: 1.25rem;
  height: 1.25rem;
}

.month-year {
  font-weight: 600;
}
</style>
