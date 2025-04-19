import React from 'react'
import { Layout, ConfigProvider } from 'antd'
import HomePage from './components/HomePage'
import './styles.css'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1877f2', // Color azul de Facebook
          borderRadius: 6,
        },
      }}
    >
      <Layout className="layout">
        <HomePage />
      </Layout>
    </ConfigProvider>
  )
}

export default App
