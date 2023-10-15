<script setup>
import { defineProps, ref, computed } from 'vue';
import EditSymbol from '~icons/material-symbols/edit';
import TrashSymbol from '~icons/material-symbols/delete-outline';
import { dateStringifier } from '../utils/functions';

const props = defineProps([
  'isEditing',
  'currentDate',
  'selectedDate',
  'eventInput',
  'selectedEvent',
]);

const emit = defineEmits([
  'update:isEditing',
  'update:eventInput',
  'update:selectedEvent',
  'update:selectedDate',
]);

const isEditing = computed({
  get() {
    return props.isEditing;
  },
  set(value) {
    emit('update:isEditing', value);
  },
});

const eventInput = computed({
  get() {
    return props.eventInput;
  },
  set(value) {
    emit('update:eventInput', value);
  },
});
const selectedEvent = computed({
  get() {
    return props.selectedEvent;
  },
  set(value) {
    emit('update:selectedEvent', value);
  },
});

const selectedDate = computed({
  get() {
    return props.selectedDate;
  },
  set(value) {
    emit('update:selectedDate', value);
  },
});

const currentDate = ref(props.currentDate);

const noEventText = 'Nothing scheduled for today';
const eventTags = ref(
  localStorage.getItem(currentDate.value.toDate().toDateString().tags) || 'Important',
);

const removeEvent = (date) => {
  localStorage.removeItem(dateStringifier(date));
  isEditing.value = false;
};

const deleteEventHandler = () => {
  removeEvent(selectedDate?.value ? selectedDate.value : currentDate.value);
  eventInput.value = '';
  selectedEvent.value = '';
};

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
          :maxlength="430"
        />
        <button class="event-button" @click="submitEventHandler">Confirm</button>
      </div>
    </div>
  </div>
</template>
