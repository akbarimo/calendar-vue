<script setup>
import { ref, computed } from 'vue';
import LeftArrow from '~icons/ic/baseline-keyboard-arrow-left';
import LeftDoubleArrow from '~icons/ic/outline-keyboard-double-arrow-left';
import RightArrow from '~icons/ic/baseline-keyboard-arrow-right';
import RightDoubleArrow from '~icons/ic/outline-keyboard-double-arrow-right';
import { generateCalendarDates, months, days } from '../utils/calendar';
import { retrieveEvent } from '../utils/functions';
const dates = computed(() => generateCalendarDates(today.value.month(), today.value.year()));

// Define all incoming props
const props = defineProps([
  'isEditing',
  'currentDate',
  'selectedDate',
  'eventInput',
  'selectedEvent',
]);

// Define all emits for props
const emit = defineEmits([
  'update:isEditing',
  'update:eventInput',
  'update:selectedEvent',
  'update:selectedDate',
]);

// Localize isEditing prop with getter/setter
const isEditing = computed({
  get() {
    return props.isEditing;
  },
  set(value) {
    emit('update:isEditing', value);
  },
});

// Localize eventInput prop with getter/setter
const eventInput = computed({
  get() {
    return props.eventInput;
  },
  set(value) {
    emit('update:eventInput', value);
  },
});

// Localize selectedEvent prop with getter/setter
const selectedEvent = computed({
  get() {
    return props.selectedEvent;
  },
  set(value) {
    emit('update:selectedEvent', value);
  },
});

// Localize selectedDate prop with getter/setter
const selectedDate = computed({
  get() {
    return props.selectedDate;
  },
  set(value) {
    emit('update:selectedDate', value);
  },
});

// Localize currentDate
const currentDate = ref(props.currentDate);

// Set today's date once
const today = ref(currentDate);

// Click Handler for clicking on "Today"
const todayClickHandler = () => {
  const event = retrieveEvent(currentDate);
  isEditing.value = false;
  today.value = currentDate;
  selectedEvent.value = event;
  eventInput.value = event;
};

// Click Handler for selecting dates/cells within calendar
const dateSelectHandler = (date) => {
  const event = retrieveEvent(date);
  isEditing.value = false;
  eventInput.value = event;
  selectedEvent.value = event;
  selectedDate.value = date;
};
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar-heading">
      <h2 class="month-year">{{ months[today.month()] }}, {{ today.year() }}</h2>
      <div class="month-changer">
        <LeftDoubleArrow class="arrows pointer" @click="today = today.year(today.year() - 1)" />
        <LeftArrow class="arrows pointer" @click="today = today.month(today.month() - 1)" />
        <h2 class="pointer" @click="todayClickHandler">Today</h2>
        <RightArrow class="arrows pointer" @click="today = today.month(today.month() + 1)" />
        <RightDoubleArrow class="arrows pointer" @click="today = today.year(today.year() + 1)" />
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
          @click="() => dateSelectHandler(date)"
        >
          {{ date.date() }}
        </h1>
      </div>
    </div>
  </div>
</template>
