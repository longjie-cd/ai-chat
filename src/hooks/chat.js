import {reactive, ref, toRefs} from "vue";

export function useChat() {
    const state = reactive({
        stop_disabled: false,//暂停按钮禁用状态
        chat_ref: ref(), //对话对象
        chat_list: message,// 对话内容
        eventSource: null,// sse连接
        url: "http://127.0.0.1:8000/api/ai/bailian/" // sse 请求地址
    });
    // 清空会话
    const clearMessage = function () {
        state.chat_list = [];
    };
    // 发送消息
    const sendMessage = async (meaasge) => {
        // 如果在数据返回中
        if (state.stop_disabled) {
            return;
        }
        // 如果消息问空
        if (!meaasge) return;
        // 显示问题
        state.chat_list.unshift({
            avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
            name: '自己',
            datetime: '今天16:38',
            content: meaasge,
            role: 'user',
        });
        // 显示AI回答占位
        state.chat_list.unshift({
            avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
            name: 'AI',
            datetime: '今天16:38',
            content: '',
            role: 'assistant',
        });
        // 显示加载状态
        state.loading = true;
        state.stop_disabled = true;
        // 获取聊天列表的最后一项
        const lastChatItem = state.chat_list[0];
        // 发送请求
        await sse(meaasge, {
            success: (data) => {
                state.loading = false;// 隐藏加载状态
                // 追加响应数据到聊天项内容中
                lastChatItem.content += data;
            }, fail: (data) => {
                console.log(data) // 异常
            }, complete: (data) => {
                state.stop_disabled = false;
                state.loading = false;
            }
        });
    }
    const sse = (meaasge, options) => {
        const {success, fail, complete} = options;
        state.eventSource = new EventSource(`${state.url}?prompt=${meaasge}`);
        state.eventSource.addEventListener('message', function (e) {
            const data = JSON.parse(e.data) //字符串转为json
            console.log(data)
            if (data.type === 'done') {
                state.eventSource.close(); // 如果接收到 [DONE]，说明消息处理完成，关闭连接
                complete?.(true);// 调用 complete 回调函数，传递 true 表示请求成功
            } else if (data.type === 'message') {
                success?.(data.data);
            }
        });
        state.eventSource.addEventListener('open', function (e) {
            console.log('Connection opened');
        });
        state.eventSource.addEventListener('error', function (e) {
            console.log('Error occurred');
        });
    }
    // 停止对话
    const stopMessage = () => {
        // 关闭加载状态
        state.loading = false;
        state.stop_disabled = false;
        state.eventSource.close();
    }
    return {
        ...toRefs(state), clearMessage, stopMessage, sendMessage
    };
}


// 默认初始对话
const message = [{
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TD&AI',
    datetime: '今天16:38',
    content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
    role: 'assistant',
}, {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: '今天16:38',
    content: '南极的自动提款机叫什么名字？',
    role: 'user',
}]
