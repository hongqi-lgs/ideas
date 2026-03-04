/**
 * 在打赏按钮旁边添加 Ko-fi 按钮
 */
(function() {
  'use strict';
  
  function addKofiButton() {
    // 找到打赏容器（.post-reward 是整个打赏区域）
    var postReward = document.querySelector('.post-reward');
    if (!postReward) return;
    
    // 检查是否已经添加过
    if (postReward.querySelector('.kofi-inline-button')) return;
    
    // 找到原始的打赏按钮（.reward-button）
    var rewardButton = postReward.querySelector('.reward-button');
    if (!rewardButton) return;
    
    // 创建按钮容器（让两个按钮并排显示）
    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'reward-buttons-wrapper';
    
    // 将原始按钮包裹起来
    rewardButton.parentNode.insertBefore(buttonWrapper, rewardButton);
    buttonWrapper.appendChild(rewardButton);
    
    // 创建分隔符
    var separator = document.createElement('span');
    separator.className = 'reward-button-separator';
    separator.textContent = 'or';
    buttonWrapper.appendChild(separator);
    
    // 创建 Ko-fi 按钮
    var kofiBtn = document.createElement('a');
    kofiBtn.className = 'kofi-inline-button';
    kofiBtn.href = 'https://ko-fi.com/xiaosen';
    kofiBtn.target = '_blank';
    kofiBtn.rel = 'noopener noreferrer';
    
    var icon = document.createElement('i');
    icon.className = 'fas fa-coffee';
    kofiBtn.appendChild(icon);
    
    var span = document.createElement('span');
    span.textContent = ' Ko-fi';
    kofiBtn.appendChild(span);
    
    buttonWrapper.appendChild(kofiBtn);
  }
  
  // DOM 加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addKofiButton);
  } else {
    addKofiButton();
  }
  
  // Pjax 兼容
  document.addEventListener('pjax:complete', addKofiButton);
  
  // 延迟执行
  setTimeout(addKofiButton, 500);
})();
