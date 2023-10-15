<script setup>
import { ref } from 'vue';
import EventContainer from './components/EventContainer.vue';
import CalendarContainer from './components/CalendarContainer.vue';
import dayjs from 'dayjs';
const selectedDate = ref();
const currentDate = dayjs();
const isEditing = ref(false);
const selectedEvent = ref(localStorage.getItem(currentDate.toDate().toDateString()) || '');
const eventInput = ref(localStorage.getItem(currentDate.toDate().toDateString()) || '');
</script>
<template>
  <main>
    <div class="wrapper">
      <CalendarContainer
        v-model:currentDate="currentDate"
        v-model:selectedDate="selectedDate"
        v-model:isEditing="isEditing"
        v-model:eventInput="eventInput"
        v-model:selectedEvent="selectedEvent"
      />
      <EventContainer
        v-model:currentDate="currentDate"
        v-model:selectedDate="selectedDate"
        v-model:isEditing="isEditing"
        v-model:eventInput="eventInput"
        v-model:selectedEvent="selectedEvent"
      />
    </div>
  </main>
</template>
