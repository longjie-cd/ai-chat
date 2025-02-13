<script setup>

import {useChat} from "@/hooks/chat.js";

const {chat_list, stop_disabled, sendMessage, clearMessage, stopMessage} = useChat()
</script>

<template>
  <div style="padding: 40px">
    <t-chat
        ref="chat_Ref"
        layout="single"
        style="height: 600px"
        :clear-history="chat_list.length > 0 && !stop_disabled"
        @clear="clearMessage"
    >
      <!--    对话内容-->
      <template v-for="(item, index) in chat_list" :key="index">
        <t-chat-item
            :avatar="item.avatar"
            :name="item.name"
            :role="item.role"
            :datetime="item.datetime"
            :content="item.content"
            :text-loading="index === 0 && loading"
        >
        </t-chat-item>
      </template>
      <!--输入框-->
      <template #footer>
        <t-chat-input :stop-disabled="stop_disabled" @send="sendMessage" @stop="stopMessage"></t-chat-input>
      </template>
    </t-chat>
  </div>
</template>

<style scoped>

</style>
