<template>
    <div class="item" v-if="item">
        <div class="left">
            <div class="image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
        </div>
        <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="description">{{ item.description }}</div>
            <a class="link" :href="item.url" target="_blank"> {{ item.url }} </a>
            <div class="actions">
                <button type="button" class="action" v-bind:class="{reserved:item.reserved}" v-on:click="onReserveButtonClick">
                    {{item.reserved ? 'Reserved' : 'Reserve'}}
                </button>
                <button type="button" class="action" v-if="item.reserved" v-on:click="onUnreserveButtonClick">
                    Cancel reservation
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./item"></script>
<style lang="scss" src="./item.scss"></style>