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
const today = ref(currentDate);
const selectedDate = ref();
const selectedEvent = ref(localStorage.getItem(currentDate.toDate().toDateString()));
const eventInput = ref(localStorage.getItem(currentDate.toDate().toDateString()));
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
};

const todayClickHandler = () => {
  const event = retrieveEvent(currentDate);
  isEditing.value = false;
  today.value = currentDate;
  selectedDate.value = currentDate;
  selectedEvent.value = event;
  eventInput.value = event;
};

const deleteEventHandler = () => {
  if (selectedDate?.value) {
    removeEvent(selectedDate.value);
  } else {
    removeEvent(currentDate);
  }
  eventInput.value = '';
  selectedEvent.value = '';
};

const submitEventHandler = (e) => {
  e.preventDefault();
  if (selectedDate?.value) {
    localStorage.setItem(dateStringifier(selectedDate.value), eventInput.value);
  } else {
    localStorage.setItem(dateStringifier(currentDate), eventInput.value);
  }
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
          <h3 class="event-title" v-if="selectedDate">
            {{ dateStringifier(selectedDate) }} Information
          </h3>
          <h3 class="event-title" v-else>{{ currentDate.toDate().toDateString() }} Information</h3>
          <div class="toolbar">
            <EditSymbol class="edit-symbol pointer" @click="isEditing = !isEditing" />
            <TrashSymbol class="delete-symbol pointer" @click="deleteEventHandler" />
          </div>
        </div>
        <p v-if="selectedEvent">{{ selectedEvent }}</p>
        <p v-else>No events today</p>
        <div v-if="isEditing">
          <form>
            <input v-model="eventInput" placeholder="Edit Event" />
            <button @keydown.esc="isEditing = !isEditing" @click="submitEventHandler">Save</button>
          </form>
        </div>
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
  width: 28rem;
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
  width: 28rem;
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
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
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
  padding-left: 1rem;
  height: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
