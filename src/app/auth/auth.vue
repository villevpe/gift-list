<template>
    <div class="container">
        <img class="background-image"
             src="../assets/olive.png"
             alt="background" />
        <div class="auth"
             v-bind:class="{ invalid: error }">
            <div class="auth-container">
                <input type="text"
                       v-model="code"
                       v-on:keyup.enter="onContinueClick"
                       v-on:keyup="onInputChange"
                       v-on:change="onInputChange"
                       v-bind:class="{ active: code.length > 0 }"
                       name="auth-input"
                       class="auth-input" />
                <label for="auth-input"
                       class="auth-placeholder-text"
                       v-on:click="onLabelClick">
                    {{error ? 'Wrong password' : 'Enter a password'}}
                </label>
            </div>
            <div class="auth-submit"
                 v-if="code.length > 0 && !error">
                <button type="button"
                        v-on:click="onContinueClick">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./auth.ts"></script>
<style src="./auth.scss" lang="scss" scoped></style>
