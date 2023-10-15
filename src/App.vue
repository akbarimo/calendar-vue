<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import LeftArrow from '~icons/ic/baseline-keyboard-arrow-left';
import LeftDoubleArrow from '~icons/ic/outline-keyboard-double-arrow-left';
import RightArrow from '~icons/ic/baseline-keyboard-arrow-right';
import RightDoubleArrow from '~icons/ic/outline-keyboard-double-arrow-right';
import EditSymbol from '~icons/material-symbols/edit';
import TrashSymbol from '~icons/material-symbols/delete-outline';
import { generateCalendarDates, months, days } from './utils/calendar';
const currentDate = dayjs();
const noEventText = 'Nothing scheduled for today';
const today = ref(currentDate);
const selectedDate = ref();
const selectedEvent = ref(localStorage.getItem(currentDate.toDate().toDateString()) || '');
const eventInput = ref(localStorage.getItem(currentDate.toDate().toDateString()) || '');
const eventTags = ref(
  localStorage.getItem(currentDate.toDate().toDateString().tags) || 'Important',
);
const dates = computed(() => generateCalendarDates(today.value.month(), today.value.year()));
const isEditing = ref(false);

const dateStringifier = (date) => {
  return date.toDate().toDateString();
};

const retrieveEvent = (date) => {
  return localStorage.getItem(dateStringifier(date));
};

const removeEvent = (date) => {
  localStorage.removeItem(dateStringifier(date));
  isEditing.value = false;
};

const todayClickHandler = () => {
  const event = retrieveEvent(currentDate);
  isEditing.value = false;
  today.value = currentDate;
  selectedEvent.value = event;
  eventInput.value = event;
};

const deleteEventHandler = () => {
  removeEvent(selectedDate?.value ? selectedDate.value : currentDate);
  eventInput.value = '';
  selectedEvent.value = '';
};

const submitEventHandler = (e) => {
  e.preventDefault();
  localStorage.setItem(
    dateStringifier(selectedDate?.value ? selectedDate.value : currentDate),
    eventInput.value,
  );
  selectedEvent.value = eventInput.value;
  isEditing.value = false;
};

const dateSelecter = (date) => {
  const event = retrieveEvent(date);
  isEditing.value = false;
  eventInput.value = event;
  selectedEvent.value = event;
  selectedDate.value = date;
};
</script>
<template>
  <main>
    <div class="wrapper">
      <div class="calendar-wrapper">
        <div class="calendar-heading">
          <h2 class="month-year">{{ months[today.month()] }}, {{ today.year() }}</h2>
          <div class="month-changer">
            <LeftDoubleArrow class="arrows pointer" @click="today = today.year(today.year() - 1)" />
            <LeftArrow class="arrows pointer" @click="today = today.month(today.month() - 1)" />
            <h2 class="pointer" @click="todayClickHandler">Today</h2>
            <RightArrow class="arrows pointer" @click="today = today.month(today.month() + 1)" />
            <RightDoubleArrow
              class="arrows pointer"
              @click="today = today.year(today.year() + 1)"
            />
          </div>
        </div>
        <div class="days-container days-of-week">
          <h1 class="dates" v-for="day in days" :key="day">{{ day }}</h1>
        </div>
        <div class="days-container">
          <div class="dates" v-for="{ date, today, currentMonth } in dates" :key="date">
            <h1
              class="date-cell"
              :class="{
                notCurrentMonth: !currentMonth,
                isToday: today,
                selected: selectedDate?.isSame(date, 'date'),
                event: retrieveEvent(date),
              }"
              @click="() => dateSelecter(date)"
            >
              {{ date.date() }}
            </h1>
          </div>
        </div>
      </div>
      <div class="event-container">
        <div class="event-heading">
          <h3 class="event-title" v-if="selectedDate">{{ dateStringifier(selectedDate) }}</h3>
          <h3 class="event-title" v-else>{{ dateStringifier(currentDate) }}</h3>
          <div class="toolbar">
            <EditSymbol class="edit-symbol pointer" @click="isEditing = !isEditing" />
            <TrashSymbol class="delete-symbol pointer" @click="deleteEventHandler" />
          </div>
        </div>
        <div class="tags">
          <div class="tags-title">Tags:</div>
          <p class="tags-text">{{ eventTags }}</p>
        </div>
        <div class="event-text">
          <div class="event-text-heading">Schedule</div>
          <p class="event-details" v-if="selectedEvent && !isEditing">{{ selectedEvent }}</p>
          <p class="event-details" v-else-if="!isEditing">{{ noEventText }}</p>
        </div>
        <div v-if="isEditing" @keydown.esc="isEditing = !isEditing">
          <div class="event-input">
            <textarea
              class="event-textarea"
              v-model="eventInput"
              @keydown.enter="submitEventHandler"
              :placeholder="noEventText"
            />
            <button class="event-button" @click="submitEventHandler">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.event-text {
  margin-top: 0.25em;
}

.event-text-heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #999999;
  display: inline;
}

.event-details {
  font-size: 1rem;
  color: #555;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
}
.tags {
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
}

.tags-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-right: 0.5rem;
}

.tags-text {
  display: inline-block;
  background-color: #e75959;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
}
.event-details {
  word-wrap: break-word;
}
.event-textarea {
  width: 93%;
  height: 10rem;
  min-height: 5rem;
  max-height: 11rem;
  padding: 10px;
  border: 0.15rem solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: none;
}
.event-button {
  margin-top: 0.8rem;
  padding: 0.5rem 1.25rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  font-size: 1rem;
  cursor: pointer;
}
.event-button:hover {
  background-color: #0056b3;
}
.event-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
}
.wrapper {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
}
.calendar-wrapper {
  width: 32rem;
  height: 28rem;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
.event {
  position: relative;
}
.event::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #87ceeb;
  border-radius: 50%;
  position: absolute;
  top: 0.1rem;
  right: 0.95rem;
}
.days-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.event-container {
  width: 20rem;
  height: 28rem;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.dates {
  height: 3.5rem;
  display: grid;
  place-content: center;
  font-size: medium;
  border-top: 0.5px solid #969696;
}
.notCurrentMonth {
  color: #8c8c8c;
}
.isToday {
  background-color: #ef4b4b;
  color: white;
}
.selected {
  background-color: #5c5853;
  color: white;
}
.days-of-week {
  font-weight: 500;
}
.date-cell {
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  /* box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); */
}
.date-cell:hover {
  background-color: #8f8980;
  color: white;
}
.month-changer {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}
.calendar-heading {
  padding: 0.35rem 2rem 0.35rem 2rem;
  height: 2rem;
  display: flex;
  justify-content: space-between;
}
.event-heading {
  padding: 0.35rem 0rem 0.35rem 2rem;
  height: 2rem;
  display: flex;
  justify-content: space-between;
}
.event-title {
  height: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: black;
}
.toolbar {
  height: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.edit-symbol {
  color: black;
}
.delete-symbol {
  color: red;
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
  display: flex;
  align-items: center;
}
</style>
