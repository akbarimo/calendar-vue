<script setup>
import { ref, computed } from 'vue';
import EditSymbol from '~icons/material-symbols/edit';
import TrashSymbol from '~icons/material-symbols/delete-outline';
import { dateStringifier, removeEvent } from '../utils/functions';

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

const noEventText = 'Nothing scheduled for today';
const eventTags = ref(
  localStorage.getItem(currentDate.value.toDate().toDateString().tags) || 'Important',
);

// Handler for deleting events from calendar
const deleteEventHandler = () => {
  removeEvent(selectedDate?.value ? selectedDate.value : currentDate.value);
  eventInput.value = '';
  selectedEvent.value = '';
  isEditing.value = false;
};

// Handler for adding events to the calendar
const submitEventHandler = () => {
  localStorage.setItem(
    dateStringifier(selectedDate?.value ? selectedDate.value : currentDate.value),
    eventInput.value,
  );
  selectedEvent.value = eventInput.value;
  isEditing.value = false;
};
</script>

<template>
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
      <p class="tags-text" v-if="selectedEvent">{{ eventTags }}</p>
    </div>
    <div class="event-text">
      <div class="event-text-heading">Schedule</div>
      <p class="event-details" v-if="selectedEvent && !isEditing">
        {{ selectedEvent }}
      </p>
      <p class="event-details" v-else-if="!isEditing">{{ noEventText }}</p>
    </div>
    <div v-if="isEditing" @keydown.esc="isEditing = !isEditing">
      <div class="event-input">
        <textarea
          class="event-textarea"
          v-model="eventInput"
          @keydown.enter="submitEventHandler"
          :placeholder="noEventText"
          :maxlength="430"
        />
        <button class="event-button" @click="submitEventHandler">Confirm</button>
      </div>
    </div>
  </div>
</template>
