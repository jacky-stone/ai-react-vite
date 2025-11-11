import { useState, useRef, useEffect } from 'react'
import './App.css'

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://ai-worker.YOUR_SUBDOMAIN.workers.dev'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是你的AI助手，有什么我可以帮助你的吗？' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // 调用AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // 添加AI回复，包含工具使用信息
      let replyContent = data.reply || '抱歉，我现在无法回答。'

      // 如果使用了工具，添加提示
      if (data.toolsUsed) {
        replyContent = replyContent
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyContent,
        toolsUsed: data.toolsUsed
      }])
    } catch (err) {
      console.error('Error calling AI API:', err)
      // 如果API调用失败，显示模拟回复
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `我收到了你的消息："${userMessage}"。\n\n由于后端API未配置，这是一个模拟回复。你可以配置 /api/chat 端点来接入真实的AI服务。`
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: '你好！我是你的AI助手，有什么我可以帮助你的吗？' }
    ])
  }

  return (
    <div className="app-container">
      <div className="background-animation"></div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <div className="header-title">
              <div className="ai-icon">🤖</div>
              <h1>AI Chat Assistant</h1>
            </div>
            <button className="clear-button" onClick={clearChat}>
              清空对话
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {message.toolsUsed && message.role === 'assistant' && (
                  <div className="tool-indicator">
                    🔧 使用了工具查询
                  </div>
                )}
                <div className="message-text">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            disabled={loading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
          >
            <span className="send-icon">➤</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
