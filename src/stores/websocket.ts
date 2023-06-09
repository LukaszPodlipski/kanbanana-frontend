import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebSocket } from '@/composables/useWebsockets.js'
import { iTask } from '@/types/taskTypes'
import { iColumn } from '@/types/projectTypes'

import stores from '@/stores/index.ts'

type FunctionDictionary = {
  [key: string]: {
    [key: string]: (data: any) => void
  }
}

export const useWebsocketStore = defineStore('websocket', () => {
  const storesList = {
    tasks: stores.useTasksStore(),
    columns: stores.useColumnsStore(),
  }

  const functionDictionary: FunctionDictionary = {
    TasksIndexChannel: {
      create: (data: iTask) => {
        storesList.tasks.WSCreatedItemHandler(data)
      },
      update: (data: iTask) => {
        storesList.tasks.WSUpdatedItemHandler(data)
      },
      delete: (data: iTask) => {
        storesList.tasks.WSDeletedItemHandler(data)
      },
    },
    ColumnsIndexChannel: {
      create: (data: iColumn) => {
        storesList.columns.WSCreatedItemHandler(data)
      },
      update: (data: iColumn) => {
        storesList.columns.WSUpdatedItemHandler(data)
      },
      delete: (data: iColumn) => {
        storesList.columns.WSDeletedItemHandler(data)
      }
    },
  }

  const websocket = useWebSocket()
  const socket = ref<any>(null)

  const connectWS = () => {
    socket.value = websocket.connect()
  }

  const disconnectWS = () => {
    websocket.disconnect()
    socket.value = null
  }

  const joinChannel = (channel: string, params: any) => {
    websocket.joinChannel(channel, params)
  }

  const leaveChannel = (channel: string) => {
    websocket.leaveChannel(channel)
  }

  const handleMessage = (messageEvent: any) => {
    try {
      const { identifier, message } = JSON.parse(messageEvent.data)
      const { channel } = identifier || {}
      const { actionType } = message || {}

      if (
        channel &&
        actionType &&
        functionDictionary[channel] &&
        functionDictionary[channel][actionType]
      ) {
        const selectedFunction = functionDictionary[channel][actionType]
        selectedFunction(message.data)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    socket,
    connectWS,
    disconnectWS,
    joinChannel,
    leaveChannel,
    handleMessage,
    storesList,
  }
})
