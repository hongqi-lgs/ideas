/**
 * 订阅者管理脚本
 * 用法：
 *   node manage-subscribers.js add email@example.com "Name"
 *   node manage-subscribers.js remove email@example.com
 *   node manage-subscribers.js list
 */

const fs = require('fs');
const path = require('path');

const SUBSCRIBERS_FILE = path.join(__dirname, '../data/subscribers.json');

function loadSubscribers() {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
}

function saveSubscribers(subscribers) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

function addSubscriber(email, name) {
  const subscribers = loadSubscribers();
  
  // 检查是否已存在
  if (subscribers.some(s => s.email === email)) {
    console.log(`❌ Subscriber ${email} already exists`);
    return;
  }
  
  subscribers.push({
    email: email,
    name: name || email,
    subscribed_at: new Date().toISOString().split('T')[0]
  });
  
  saveSubscribers(subscribers);
  console.log(`✅ Added subscriber: ${email}`);
}

function removeSubscriber(email) {
  const subscribers = loadSubscribers();
  const filtered = subscribers.filter(s => s.email !== email);
  
  if (filtered.length === subscribers.length) {
    console.log(`❌ Subscriber ${email} not found`);
    return;
  }
  
  saveSubscribers(filtered);
  console.log(`✅ Removed subscriber: ${email}`);
}

function listSubscribers() {
  const subscribers = loadSubscribers();
  console.log(`\n📧 Total subscribers: ${subscribers.length}\n`);
  subscribers.forEach((s, i) => {
    console.log(`${i + 1}. ${s.email} (${s.name}) - Subscribed: ${s.subscribed_at}`);
  });
  console.log('');
}

// 主函数
const command = process.argv[2];
const email = process.argv[3];
const name = process.argv[4];

switch (command) {
  case 'add':
    if (!email) {
      console.error('Usage: node manage-subscribers.js add email@example.com "Name"');
      process.exit(1);
    }
    addSubscriber(email, name);
    break;
    
  case 'remove':
    if (!email) {
      console.error('Usage: node manage-subscribers.js remove email@example.com');
      process.exit(1);
    }
    removeSubscriber(email);
    break;
    
  case 'list':
    listSubscribers();
    break;
    
  default:
    console.log(`
订阅者管理工具

用法：
  node manage-subscribers.js add email@example.com "Name"     添加订阅者
  node manage-subscribers.js remove email@example.com          移除订阅者
  node manage-subscribers.js list                              列出所有订阅者
    `);
}
