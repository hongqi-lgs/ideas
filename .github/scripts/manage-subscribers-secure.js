/**
 * 安全的订阅者管理脚本
 * 使用 GitHub Secrets 存储订阅者数据（Base64编码）
 * 
 * 使用方法：
 *   # 从 Buttondown 同步到 Secret
 *   node manage-subscribers-secure.js sync
 *   
 *   # 列出订阅者（仅显示数量和域名）
 *   node manage-subscribers-secure.js list
 */

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPOSITORY || 'hongqi-lgs/ideas';

async function fetchButtondownSubscribers() {
  console.log('🔄 Fetching subscribers from Buttondown...');
  
  const response = await fetch('https://api.buttondown.email/v1/subscribers', {
    headers: {
      'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Buttondown API error: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  const subscribers = Array.isArray(data) ? data : (data.results || []);
  console.log(`✅ Found ${subscribers.length} subscribers`);
  
  return subscribers.map(s => {
    let subscribedDate = new Date().toISOString().split('T')[0];
    if (s.creation_date) {
      subscribedDate = s.creation_date.split('T')[0];
    } else if (s.created) {
      subscribedDate = s.created.split('T')[0];
    }
    
    let name = s.email ? s.email.split('@')[0] : 'Unknown';
    if (s.name) name = s.name;
    else if (s.metadata?.name) name = s.metadata.name;
    
    return {
      email: s.email,
      name: name,
      subscribed_at: subscribedDate,
      source: 'buttondown'
    };
  });
}

async function updateGitHubSecret(secretName, secretValue) {
  const [owner, repo] = GITHUB_REPO.split('/');
  
  // 1. 获取仓库公钥
  const pubKeyResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json'
      }
    }
  );
  
  if (!pubKeyResponse.ok) {
    throw new Error(`Failed to get public key: ${pubKeyResponse.status}`);
  }
  
  const { key, key_id } = await pubKeyResponse.json();
  
  // 2. 加密 secret（使用 libsodium，这里简化为 Base64）
  const encryptedValue = Buffer.from(secretValue).toString('base64');
  
  // 3. 更新 secret
  const updateResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        encrypted_value: encryptedValue,
        key_id: key_id
      })
    }
  );
  
  if (!updateResponse.ok) {
    const error = await updateResponse.text();
    throw new Error(`Failed to update secret: ${updateResponse.status} ${error}`);
  }
  
  console.log(`✅ Secret ${secretName} updated successfully`);
}

async function syncToSecret() {
  console.log('🚀 Syncing subscribers to GitHub Secret...\n');
  
  if (!BUTTONDOWN_API_KEY) {
    throw new Error('BUTTONDOWN_API_KEY not found');
  }
  
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not found');
  }
  
  const subscribers = await fetchButtondownSubscribers();
  const jsonData = JSON.stringify(subscribers, null, 2);
  
  // 注意：GitHub API 要求使用 libsodium 加密
  // 这里简化为提示用户手动操作
  console.log('\n⚠️  GitHub API 加密需要 libsodium 库');
  console.log('建议使用以下方法之一：\n');
  console.log('方法 1: 使用 gh CLI (推荐)');
  console.log('-------');
  console.log(`echo '${jsonData}' | gh secret set SUBSCRIBERS_DATA --repo ${GITHUB_REPO}\n`);
  console.log('方法 2: 手动复制到 GitHub Secrets');
  console.log('-------');
  console.log(`1. 访问: https://github.com/${GITHUB_REPO}/settings/secrets/actions`);
  console.log(`2. 创建/更新 Secret: SUBSCRIBERS_DATA`);
  console.log(`3. 粘贴以下内容:\n`);
  console.log(jsonData);
}

async function listSubscribers() {
  const subscribers = await fetchButtondownSubscribers();
  console.log(`\n📧 Total subscribers: ${subscribers.length}\n`);
  
  // 只显示域名统计，不泄露完整邮箱
  const domains = {};
  subscribers.forEach(s => {
    const domain = s.email.split('@')[1] || 'unknown';
    domains[domain] = (domains[domain] || 0) + 1;
  });
  
  console.log('Domain distribution:');
  Object.entries(domains).forEach(([domain, count]) => {
    console.log(`  ${domain}: ${count}`);
  });
  console.log('');
}

const command = process.argv[2];

(async () => {
  try {
    switch (command) {
      case 'sync':
        await syncToSecret();
        break;
      case 'list':
        await listSubscribers();
        break;
      default:
        console.log(`
安全订阅者管理工具

用法：
  node manage-subscribers-secure.js sync    同步订阅者到 GitHub Secret
  node manage-subscribers-secure.js list    列出订阅者统计（不显示完整邮箱）
        `);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
