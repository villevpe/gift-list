<template>
    <div class="items-wrap">
        <div class="modal"
             v-on:click="onModalClick"
             v-if="modal">
            <div class="modal-inner"
                 v-on:click="onModalContentClick">
                <div class="close"
                     v-on:click="onCloseButtonClick">
                    x
                </div>
                <h1>{{modal === modals.RESERVE ? 'Reserve ' : 'Cancel reservation: '}} {{activeItem.title}}</h1>
                <div class="info">
                    <label for="booking">
                        <template v-if="modal === modals.RESERVE">
                            <span>Give a simple password for your reservation.</span>
                            <span>This can be used to cancel your reservation. It won't be visible for other users.</span>
                        </template>
                        <template v-if="modal === modals.UNRESERVE">
                            <span>Please type in your password to cancel the reservation</span>
                        </template>
                    </label>
                    <input id="booking"
                           type="text"
                           ref="bookingInput"
                           placeholder="Password"
                           maxlength="15"
                           v-on:keyup.enter="onConfirmClick"
                           v-model="token" />
                </div>
                <button type="button"
                        v-if="token.length > 1 && !reserveSuccess"
                        v-on:click="onConfirmClick">
                    {{modal === modals.RESERVE ? 'Confirm' : 'Confirm'}}
                </button>
                <div class="booking-confirmation"
                     v-if="reserveSuccess">
                     {{modal === modals.RESERVE ? 'Reservation succeeded' : 'Canceling succeeded'}}
                </div>
                <div class="booking-error"
                     v-if="reserveError">
                    <span>{{reserveError}}</span>
                </div>
            </div>
        </div>
        <div class="items">
            <item v-for="item in items"
                  :item="item"
                  :key="item.id"
                  v-on:reserve="onReserve"
                  v-on:unreserve="onUnreserve"></item>
        </div>
    </div>
</template>

<script src="./items.ts" lang="ts"></script>
<style src="./items.scss" lang="scss"></style>