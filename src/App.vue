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
              :maxlength="400"
            />
            <button class="event-button" @click="submitEventHandler">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
