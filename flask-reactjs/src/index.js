import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

// 字体图标
import './assets/icon-line/css/simple-line-icons.css'
import './assets/icon-material/material-icons.css'
// bootstrap-markdown 编辑器需要的样式
import './assets/bootstrap-markdown/css/bootstrap-markdown.min.css'
import './assets/bootstrap-markdown/css/custom.css'
import './assets/icon-awesome/css/font-awesome.min.css' // 编辑器上的按钮图标是使用 font-awesome 字体图标
// markdown 样式
import './assets/markdown-styles/github-markdown.css'
// 自定义 css 文件
import './assets/core.css'
import './assets/custom.css'


ReactDOM.render(
    <App />,
  document.getElementById('root')
);
