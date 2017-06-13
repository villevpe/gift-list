<template>
  <div class="app"
       :class="{auth: authenticated}">
    <div class="app-container">
      <h1>{{appName}}</h1>
      <items v-if="authenticated"></items>
      <auth v-else
            v-on:login="onLogin"></auth>
    </div>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>
<style lang="scss">
@import '~styles/default.scss';
</style>

<style src="./app.scss" lang="scss" scoped></style>