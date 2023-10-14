<script setup>
import { generateCalendarDates, months, days } from './utils/calendar';
const dates = generateCalendarDates();
</script>
<template>
  <main>
    <div class="wrapper">
      <div class="days-container">
        <h1 class="dates" v-for="day in days" :key="day">{{ day }}</h1>
      </div>
      <div class="days-container">
        <div class="dates" v-for="date in dates" :key="date.date">
          <h1 :class="{ notCurrentMonth: !date.currentMonth }">{{ date.date.date() }}</h1>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  width: 24rem;
  height: 24rem;
}
.days-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.dates {
  height: 3.5rem;
  display: grid;
  place-content: center;
}

.notCurrentMonth {
  color: grey;
}
</style>
